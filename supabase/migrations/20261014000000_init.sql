-- AlgoStudio backend: Postgres schema, row-level security, money views, storage and scheduled sweep.
-- Apply with: supabase db push

create extension if not exists pg_cron;

-- ---------- Creators (one row per auth user)
create table public.creators (
  id uuid primary key references auth.users on delete cascade,
  data jsonb not null default '{}',          -- Creator from src/api/types.ts + `deleted`
  last_category text not null default 'props',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.creators enable row level security;
create policy own on public.creators for all using (id = auth.uid()) with check (id = auth.uid());

create function public.on_signup() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.creators (id, data) values (new.id, jsonb_build_object('email', new.email, 'name', '', 'handle', '', 'deletion', null, 'createdAt', now()));
  return new;
end $$;
create trigger on_signup after insert on auth.users for each row execute function public.on_signup();

-- ---------- Deal documents
-- One table per entity in the Account type. `data` holds the exact TS object, so the
-- client and server share one shape. Columns used for reporting are generated from it.
do $$ declare t text; begin
  foreach t in array array['deals','terms_versions','links','answers','submissions','verifications','payments','events','templates','reminders'] loop
    execute format($f$
      create table public.%1$I (
        user_id uuid not null default auth.uid() references auth.users on delete cascade,
        key text not null,
        deal_id text,
        data jsonb not null,
        updated_at timestamptz not null default now(),
        primary key (user_id, key)
      );
      create index on public.%1$I (user_id, deal_id);
      alter table public.%1$I enable row level security;
      create policy own on public.%1$I for all using (user_id = auth.uid()) with check (user_id = auth.uid());
    $f$, t);
  end loop;
end $$;

create unique index links_token on public.links (key);  -- tokens are global; brands look them up

alter table public.deals
  add column brand text generated always as (data->>'brand') stored,
  add column stage text generated always as (data->>'stage') stored,
  add column amount numeric generated always as ((data->>'n')::numeric) stored,
  add column due_iso text generated always as (data->>'dueISO') stored,
  add column paid_at text generated always as (data->>'paidAt') stored;

alter table public.payments
  add column amount numeric generated always as ((data->>'amount')::numeric) stored,
  add column date text generated always as (data->>'date') stored;

-- ---------- Expenses
create table public.categories (
  id text primary key,
  label text not null,
  color text not null,
  sort int not null
);
alter table public.categories enable row level security;
create policy read_all on public.categories for select using (true);
insert into public.categories values
  ('props', 'Props and products', '#2E2E33', 1),
  ('tools', 'Editing tools and apps', '#55555C', 2),
  ('shipping', 'Shipping', '#7A7A82', 3),
  ('travel', 'Travel', '#9C9CA4', 4),
  ('helpers', 'Helpers and freelancers', '#B9BAC0', 5),
  ('equipment', 'Equipment', '#D2D3D7', 6),
  ('other', 'Other', '#E6E7E9', 7);

create table public.expenses (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  id text not null,
  date date not null,
  amount numeric(12,2) not null check (amount > 0),
  category text not null references public.categories,
  note text not null default '',
  deal_id text,                       -- deals.key, optional
  receipt text,                       -- path in the `receipts` bucket
  tax_deductible boolean not null default true,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,             -- soft delete so Undo works; purged after 30 days
  primary key (user_id, id)
);
create index on public.expenses (user_id, date desc) where deleted_at is null;
alter table public.expenses enable row level security;
create policy own on public.expenses for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- Money views (same numbers on every screen)
create view public.money_by_month with (security_invoker = true) as
with r as (select user_id, left(date, 7) as month, sum(amount) as amt from public.payments group by 1, 2),
     s as (select user_id, to_char(date, 'YYYY-MM') as month, sum(amount) as amt from public.expenses where deleted_at is null group by 1, 2)
select coalesce(r.user_id, s.user_id) as user_id,
       coalesce(r.month, s.month) as month,
       coalesce(r.amt, 0) as received,
       coalesce(s.amt, 0) as spent,
       coalesce(r.amt, 0) - coalesce(s.amt, 0) as profit
from r full join s on r.user_id = s.user_id and r.month = s.month;

create view public.spent_by_category with (security_invoker = true) as
select user_id, to_char(date, 'YYYY-MM') as month, category, sum(amount) as amount
from public.expenses where deleted_at is null group by 1, 2, 3;

create view public.deal_profit with (security_invoker = true) as
select d.user_id, d.key as deal_id, d.brand, d.amount,
       coalesce(sum(e.amount), 0) as spent,
       d.amount - coalesce(sum(e.amount), 0) as profit
from public.deals d
left join public.expenses e on e.user_id = d.user_id and e.deal_id = d.key and e.deleted_at is null
group by d.user_id, d.key, d.brand, d.amount;

-- ---------- Brand verification codes (service role only: RLS on, no policies)
create table public.brand_codes (
  user_id uuid not null references auth.users on delete cascade,
  deal_id text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  tries int not null default 0,
  primary key (user_id, deal_id)
);
alter table public.brand_codes enable row level security;

-- ---------- Receipts bucket: each user writes only under their own folder
insert into storage.buckets (id, name, public) values ('receipts', 'receipts', false) on conflict do nothing;
create policy receipts_own on storage.objects for all
  using (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------- Hourly sweep
create function public.sweep() returns void language plpgsql security definer set search_path = public as $$
begin
  -- Terms links expire 7 days after sending; the deal moves to "Link expired"
  with x as (
    update public.links set data = jsonb_set(data, '{state}', '"expired"'), updated_at = now()
    where data->>'kind' = 'd' and data->>'state' = 'active' and (data->>'expiresAt')::timestamptz < now()
    returning user_id, deal_id, data
  )
  update public.deals d
     set data = d.data || jsonb_build_object('stage', 'expired', 'expiredAt', x.data->>'expiresAt'), updated_at = now()
    from x
   where d.user_id = x.user_id and d.key = x.deal_id and d.data->>'stage' = 'sent'
     and coalesce((d.data->>'version')::int, 1) = (x.data->>'version')::int;

  delete from public.expenses where deleted_at < now() - interval '30 days';
  delete from public.brand_codes where expires_at < now();

  -- Accounts whose 30-day deletion window has passed
  delete from auth.users u using public.creators c
   where c.id = u.id and (c.data->'deletion'->>'scheduledFor')::timestamptz < now();
end $$;

select cron.schedule('algostudio-sweep', '0 * * * *', 'select public.sweep()');
