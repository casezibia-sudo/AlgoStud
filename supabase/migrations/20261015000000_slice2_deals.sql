-- AlgoStudio slice 2: deals, versioned terms, audit events, templates.
-- Paste into the Supabase SQL Editor and run once. Requires slice 1 (profiles + touch_updated_at).
-- Creators can only READ these tables. Every change goes through the functions at the bottom.

-- ---------------------------------------------------------------- safety guards
-- The older document-style schema (20261014000000_init.sql) also made public.deals / events / templates.
-- This migration does not drop anything. If those old tables are still there, stop here.
do $$
begin
  if exists (select 1 from information_schema.columns
              where table_schema = 'public' and table_name = 'deals' and column_name = 'data')
     or exists (select 1 from information_schema.columns
              where table_schema = 'public' and table_name = 'events' and column_name = 'data')
     or exists (select 1 from information_schema.columns
              where table_schema = 'public' and table_name = 'templates' and column_name = 'data') then
    raise exception 'Old document-style deals/events/templates tables exist. Decide what to do with them before running slice 2 (nothing was changed).';
  end if;
  if to_regprocedure('public.touch_updated_at()') is null then
    raise exception 'Run the slice 1 migration first (public.touch_updated_at is missing).';
  end if;
end $$;

-- ---------------------------------------------------------------- tables

create table public.deals (
  id               uuid primary key default gen_random_uuid(),
  creator_id       uuid not null references public.profiles(id) on delete cascade,
  brand_name       text not null default '' check (char_length(brand_name) <= 200),
  brand_email      text check (brand_email is null or char_length(brand_email) <= 320),
  brand_contact    text check (brand_contact is null or char_length(brand_contact) <= 200),
  source           text check (source is null or char_length(source) <= 100),
  title            text not null default '' check (char_length(title) <= 300),
  stage            text not null default 'draft'
    check (stage in ('draft','sent','confirmed','in_progress','submitted','approved','invoiced','paid','cancelled')),
  current_version  int  not null default 1 check (current_version >= 1),
  -- Single source of truth for "due" and "overdue". Overdue = stage 'invoiced' and this date has passed.
  payment_due_date date,
  posted_at        date,
  paid_at          date,
  archived_at      timestamptz,
  deleted_at       timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index deals_creator_idx on public.deals (creator_id, updated_at desc) where deleted_at is null;

create table public.deal_terms (
  id                 uuid primary key default gen_random_uuid(),
  deal_id            uuid not null references public.deals(id) on delete cascade,
  version            int  not null check (version >= 1),
  status             text not null default 'draft' check (status in ('draft','sent','confirmed','superseded')),
  -- {"text": "1 Reel, 2 Stories", "items": []}. Items stay empty until slice 4 (item states change after lock).
  deliverables       jsonb not null default '{"text":"","items":[]}'::jsonb
    check (jsonb_typeof(deliverables) = 'object'
           and jsonb_typeof(deliverables -> 'text') = 'string'
           and deliverables -> 'items' = '[]'::jsonb),
  amount_paise       bigint not null default 0 check (amount_paise >= 0),
  currency           text not null default 'INR',
  -- {"fixed_date": "2026-11-15"} only when payment_trigger is 'Fixed date'. deals.payment_due_date mirrors it.
  dates              jsonb not null default '{}'::jsonb check (jsonb_typeof(dates) = 'object'),
  usage_rights       text,
  exclusivity        text,
  revisions_included int  not null default 1 check (revisions_included >= 0),
  payment_due_days   int  check (payment_due_days is null or payment_due_days >= 0),
  payment_trigger    text check (payment_trigger is null
                       or payment_trigger in ('On approval','On posting','Days after posting','Fixed date')),
  whitelisting       text,
  notes              text,
  sent_at            timestamptz,
  confirmed_at       timestamptz,
  created_at         timestamptz not null default now(),
  unique (deal_id, version)
);

create table public.events (
  id         uuid primary key default gen_random_uuid(),
  deal_id    uuid not null references public.deals(id) on delete cascade,
  actor_type text not null check (actor_type in ('creator','brand','system')),
  actor_id   uuid,
  type       text not null,
  -- title / detail / tone / icon are what the UI shows; anything else (from, to, source) is for the record.
  payload    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index events_deal_idx on public.events (deal_id, created_at desc);

create table public.templates (
  id         uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 100),
  -- {deliverables_text, usage_rights, payment_trigger, revisions_included, used}
  terms      jsonb not null default '{}'::jsonb check (jsonb_typeof(terms) = 'object'),
  created_at timestamptz not null default now()
);
create index templates_creator_idx on public.templates (creator_id, created_at desc);

create trigger deals_touch before update on public.deals
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------- rules enforced by triggers

-- Rule 1: once terms leave 'draft', the content can't change. Only status and the two timestamps may.
create function public.deal_terms_lock() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id or new.deal_id is distinct from old.deal_id
     or new.version is distinct from old.version or new.created_at is distinct from old.created_at then
    raise exception 'deal_terms identity columns cannot change' using errcode = '55000';
  end if;

  if old.status <> 'draft' and
     row(new.deliverables, new.amount_paise, new.currency, new.dates, new.usage_rights, new.exclusivity,
         new.revisions_included, new.payment_due_days, new.payment_trigger, new.whitelisting, new.notes)
     is distinct from
     row(old.deliverables, old.amount_paise, old.currency, old.dates, old.usage_rights, old.exclusivity,
         old.revisions_included, old.payment_due_days, old.payment_trigger, old.whitelisting, old.notes) then
    raise exception 'These terms are locked. Create a new version instead.' using errcode = '55000';
  end if;

  -- Status only moves forward.
  if new.status <> old.status and (old.status, new.status) not in
     (('draft','sent'), ('sent','confirmed'), ('sent','superseded'), ('confirmed','superseded')) then
    raise exception 'Terms cannot move from % to %', old.status, new.status using errcode = '55000';
  end if;
  return new;
end $$;

create trigger deal_terms_lock before update on public.deal_terms
  for each row execute function public.deal_terms_lock();

-- Rule 2: events are append-only.
create function public.events_block_update() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'events is append-only' using errcode = '55000';
end $$;

-- Deleting is blocked too, with one exception: when Postgres cascades a delete from a parent row
-- (a profile being removed at the end of the 30 day account deletion window) the trigger depth is above 1.
-- A direct DELETE, or one from inside a function, runs at depth 1 and is rejected.
create function public.events_block_delete() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if pg_trigger_depth() > 1 then
    return old;
  end if;
  raise exception 'events is append-only' using errcode = '55000';
end $$;

create function public.events_block_truncate() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'events is append-only' using errcode = '55000';
end $$;

create trigger events_no_update before update on public.events
  for each row execute function public.events_block_update();
create trigger events_no_delete before delete on public.events
  for each row execute function public.events_block_delete();
create trigger events_no_truncate before truncate on public.events
  for each statement execute function public.events_block_truncate();

-- ---------------------------------------------------------------- privileges and row level security
-- Read only. No insert / update / delete for anyone but the functions below (which run as the owner).

revoke all on public.deals      from anon, authenticated;
revoke all on public.deal_terms from anon, authenticated;
revoke all on public.events     from anon, authenticated;
revoke all on public.templates  from anon, authenticated;

grant select on public.deals      to authenticated;
grant select on public.deal_terms to authenticated;
grant select on public.events     to authenticated;
grant select on public.templates  to authenticated;

alter table public.deals      enable row level security;
alter table public.deal_terms enable row level security;
alter table public.events     enable row level security;
alter table public.templates  enable row level security;

create policy "deals: read own" on public.deals
  for select to authenticated
  using (creator_id = (select auth.uid()) and deleted_at is null);

create policy "deal_terms: read own" on public.deal_terms
  for select to authenticated
  using (deal_id in (select id from public.deals where creator_id = (select auth.uid()) and deleted_at is null));

create policy "events: read own" on public.events
  for select to authenticated
  using (deal_id in (select id from public.deals where creator_id = (select auth.uid()) and deleted_at is null));

create policy "templates: read own" on public.templates
  for select to authenticated
  using (creator_id = (select auth.uid()));

-- ---------------------------------------------------------------- internal helpers (not callable from the app)

create function public._stage_allowed(f text, t text) returns boolean
language sql
immutable
set search_path = ''
as $$
  select case
    when f = t then false
    when t = 'cancelled' then f not in ('paid', 'cancelled')
    else (f, t) in (
      ('draft','sent'), ('sent','confirmed'), ('confirmed','in_progress'), ('in_progress','submitted'),
      ('submitted','in_progress'), ('submitted','approved'), ('approved','invoiced'),
      ('approved','paid'), ('invoiced','paid'))
  end
$$;

-- The caller's own, not-deleted deal, locked for the rest of the transaction.
create function public._own_deal(p_id uuid) returns public.deals
language plpgsql
security definer
set search_path = ''
as $$
declare
  d public.deals;
begin
  if auth.uid() is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  select * into d from public.deals
   where id = p_id and creator_id = auth.uid() and deleted_at is null
   for update;
  if not found then
    raise exception 'Deal not found' using errcode = 'P0002';
  end if;
  return d;
end $$;

-- The current version's terms row, locked.
create function public._cur_terms(p_deal public.deals) returns public.deal_terms
language plpgsql
security definer
set search_path = ''
as $$
declare
  t public.deal_terms;
begin
  select * into t from public.deal_terms
   where deal_id = p_deal.id and version = p_deal.current_version
   for update;
  if not found then
    raise exception 'Terms version % missing', p_deal.current_version;
  end if;
  return t;
end $$;

create function public._log(
  p_deal uuid, p_actor text, p_type text, p_title text,
  p_detail text default null, p_tone text default 'neutral', p_extra jsonb default '{}'::jsonb
) returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.events (deal_id, actor_type, actor_id, type, payload)
  values (
    p_deal, p_actor, case when p_actor = 'creator' then auth.uid() end, p_type,
    jsonb_strip_nulls(jsonb_build_object('title', p_title, 'detail', p_detail, 'tone', p_tone))
      || coalesce(p_extra, '{}'::jsonb)
  );
end $$;

revoke execute on function public._stage_allowed(text, text) from public, anon, authenticated;
revoke execute on function public._own_deal(uuid)            from public, anon, authenticated;
revoke execute on function public._cur_terms(public.deals)   from public, anon, authenticated;
revoke execute on function public._log(uuid, text, text, text, text, text, jsonb) from public, anon, authenticated;

-- ---------------------------------------------------------------- functions the app calls
-- p_terms keys: deliverables_text, amount_paise, usage_rights, exclusivity, revisions_included,
--               payment_due_days, payment_trigger, fixed_date (yyyy-mm-dd), whitelisting, notes

create function public.create_deal(
  p_brand_name text, p_brand_email text, p_brand_contact text, p_source text, p_title text, p_terms jsonb
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  did uuid;
  trig text := nullif(p_terms ->> 'payment_trigger', '');
  fixed date := case when nullif(p_terms ->> 'payment_trigger', '') = 'Fixed date'
                     then nullif(p_terms ->> 'fixed_date', '')::date end;
begin
  if uid is null then raise exception 'Not signed in' using errcode = '28000'; end if;

  insert into public.deals (creator_id, brand_name, brand_email, brand_contact, source, title, payment_due_date)
  values (uid, coalesce(p_brand_name, ''), nullif(p_brand_email, ''), nullif(p_brand_contact, ''),
          nullif(p_source, ''), coalesce(p_title, ''), fixed)
  returning id into did;

  insert into public.deal_terms (deal_id, version, deliverables, amount_paise, dates, usage_rights, exclusivity,
                                 revisions_included, payment_due_days, payment_trigger, whitelisting, notes)
  values (did, 1,
          jsonb_build_object('text', coalesce(p_terms ->> 'deliverables_text', ''), 'items', '[]'::jsonb),
          coalesce((p_terms ->> 'amount_paise')::bigint, 0),
          case when fixed is not null then jsonb_build_object('fixed_date', fixed) else '{}'::jsonb end,
          nullif(p_terms ->> 'usage_rights', ''), nullif(p_terms ->> 'exclusivity', ''),
          coalesce((p_terms ->> 'revisions_included')::int, 1),
          (p_terms ->> 'payment_due_days')::int, trig,
          nullif(p_terms ->> 'whitelisting', ''), nullif(p_terms ->> 'notes', ''));

  perform public._log(did, 'creator', 'deal_created', 'Draft created');
  return did;
end $$;

create function public.update_draft_terms(
  p_deal_id uuid, p_brand_name text, p_brand_email text, p_brand_contact text, p_source text, p_terms jsonb
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  d public.deals := public._own_deal(p_deal_id);
  t public.deal_terms := public._cur_terms(d);
  trig text := nullif(p_terms ->> 'payment_trigger', '');
  fixed date := case when nullif(p_terms ->> 'payment_trigger', '') = 'Fixed date'
                     then nullif(p_terms ->> 'fixed_date', '')::date end;
begin
  if t.status <> 'draft' then
    raise exception 'Only a draft can be edited. Create a new version first.' using errcode = '55000';
  end if;

  update public.deals
     set brand_name = coalesce(p_brand_name, ''), brand_email = nullif(p_brand_email, ''),
         brand_contact = nullif(p_brand_contact, ''), source = nullif(p_source, ''),
         title = coalesce(nullif(p_terms ->> 'deliverables_text', ''), title),
         payment_due_date = fixed
   where id = d.id;

  update public.deal_terms
     set deliverables = jsonb_build_object('text', coalesce(p_terms ->> 'deliverables_text', ''), 'items', '[]'::jsonb),
         amount_paise = coalesce((p_terms ->> 'amount_paise')::bigint, 0),
         dates = case when fixed is not null then jsonb_build_object('fixed_date', fixed) else '{}'::jsonb end,
         usage_rights = nullif(p_terms ->> 'usage_rights', ''),
         exclusivity = nullif(p_terms ->> 'exclusivity', ''),
         revisions_included = coalesce((p_terms ->> 'revisions_included')::int, 1),
         payment_due_days = (p_terms ->> 'payment_due_days')::int,
         payment_trigger = trig,
         whitelisting = nullif(p_terms ->> 'whitelisting', ''),
         notes = nullif(p_terms ->> 'notes', '')
   where id = t.id;

  perform public._log(d.id, 'creator', 'draft_updated', 'Draft updated', 'Terms v' || t.version, 'neutral');
end $$;

create function public.send_terms(p_deal_id uuid, p_channel text default null) returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  d public.deals := public._own_deal(p_deal_id);
  t public.deal_terms := public._cur_terms(d);
begin
  if d.stage <> 'draft' or t.status <> 'draft' then
    raise exception 'Only a draft can be sent' using errcode = '55000';
  end if;

  if btrim(d.brand_name) = '' or coalesce(btrim(d.brand_email), '') = ''
     or btrim(t.deliverables ->> 'text') = '' or t.amount_paise <= 0
     or t.usage_rights is null or t.payment_trigger is null
     or (t.payment_trigger = 'Fixed date' and t.dates ->> 'fixed_date' is null)
     or (t.payment_trigger <> 'Fixed date' and t.payment_due_days is null) then
    raise exception 'Add the brand, contact email, deliverables, amount, payment due and usage rights before sending.'
      using errcode = '22023';
  end if;

  update public.deal_terms set status = 'sent', sent_at = now() where id = t.id;
  update public.deals set stage = 'sent' where id = d.id;

  perform public._log(d.id, 'creator', 'terms_sent', 'Terms v' || t.version || ' sent',
                      nullif(p_channel, ''), 'info',
                      jsonb_build_object('version', t.version, 'channel', p_channel));
  return t.version;
end $$;

-- Terms were sent or confirmed and need to change: new draft version N+1, old one superseded, stage back to draft.
-- Only allowed before work starts (stage sent or confirmed).
create function public.revise_terms(p_deal_id uuid) returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  d public.deals := public._own_deal(p_deal_id);
  t public.deal_terms := public._cur_terms(d);
  nv int;
begin
  if t.status not in ('sent', 'confirmed') or d.stage not in ('sent', 'confirmed') then
    raise exception 'Terms can only be revised while the deal is sent or confirmed, before work starts.'
      using errcode = '55000';
  end if;
  nv := t.version + 1;

  update public.deal_terms set status = 'superseded' where id = t.id;

  insert into public.deal_terms (deal_id, version, deliverables, amount_paise, currency, dates, usage_rights,
                                 exclusivity, revisions_included, payment_due_days, payment_trigger, whitelisting, notes)
  values (d.id, nv, t.deliverables, t.amount_paise, t.currency, t.dates, t.usage_rights, t.exclusivity,
          t.revisions_included, t.payment_due_days, t.payment_trigger, t.whitelisting, t.notes);

  update public.deals set current_version = nv, stage = 'draft' where id = d.id;

  perform public._log(d.id, 'creator', 'terms_revised', 'New version v' || nv || ' started',
                      'Replaces v' || t.version, 'info', jsonb_build_object('from_version', t.version, 'version', nv));
  return nv;
end $$;

create function public.update_stage(p_deal_id uuid, p_to text, p_paid_at date default null) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  d public.deals := public._own_deal(p_deal_id);
  t public.deal_terms := public._cur_terms(d);
  due date := d.payment_due_date;
  title text;
  tone text := 'info';
begin
  if p_to = 'sent' then
    raise exception 'Use send_terms to send a draft' using errcode = '55000';
  end if;
  if not public._stage_allowed(d.stage, p_to) then
    raise exception 'A deal cannot move from % to %', d.stage, p_to using errcode = '55000';
  end if;

  if d.stage = 'sent' and p_to = 'confirmed' then
    update public.deal_terms set status = 'confirmed', confirmed_at = now() where id = t.id;
    title := 'Terms v' || t.version || ' confirmed';
    tone := 'positive';
  elsif p_to = 'in_progress' then
    title := case when d.stage = 'submitted' then 'Revision requested' else 'Work started' end;
    tone := case when d.stage = 'submitted' then 'warning' else 'info' end;
  elsif p_to = 'submitted' then
    title := 'Work submitted';
  elsif p_to = 'approved' then
    title := 'Work approved';
    tone := 'positive';
  elsif p_to = 'invoiced' then
    if due is null then
      if t.payment_trigger = 'On approval' then
        due := current_date + coalesce(t.payment_due_days, 0);
      else
        raise exception 'Add the posting date first, so the payment due date is known.' using errcode = '22023';
      end if;
    end if;
    update public.deals set payment_due_date = due where id = d.id;
    title := 'Payment due ' || to_char(due, 'DD Mon YYYY');
  elsif p_to = 'paid' then
    update public.deals set paid_at = coalesce(p_paid_at, current_date) where id = d.id;
    title := 'Marked as paid';
    tone := 'positive';
  elsif p_to = 'cancelled' then
    title := 'Deal cancelled';
  end if;

  update public.deals set stage = p_to where id = d.id;

  perform public._log(d.id, 'creator', 'stage_changed', title, null, tone,
                      jsonb_build_object('from', d.stage, 'to', p_to, 'source', 'creator_manual'));
end $$;

create function public.set_posting_date(p_deal_id uuid, p_date date) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  d public.deals := public._own_deal(p_deal_id);
  t public.deal_terms := public._cur_terms(d);
  due date := d.payment_due_date;
begin
  if d.stage not in ('in_progress', 'submitted', 'approved', 'invoiced') then
    raise exception 'The posting date can be added once work has started.' using errcode = '55000';
  end if;
  if t.payment_trigger = 'On posting' then
    due := p_date;
  elsif t.payment_trigger = 'Days after posting' then
    due := p_date + coalesce(t.payment_due_days, 30);
  end if;
  update public.deals set posted_at = p_date, payment_due_date = due where id = d.id;

  perform public._log(d.id, 'creator', 'posting_date_added', 'Posting date added',
                      'Posted ' || to_char(p_date, 'DD Mon YYYY')
                        || case when due is distinct from d.payment_due_date
                                then ' · payment due ' || to_char(due, 'DD Mon YYYY') else '' end,
                      'info', jsonb_build_object('posted_at', p_date));
end $$;

create function public.duplicate_deal(p_deal_id uuid) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  d public.deals := public._own_deal(p_deal_id);
  t public.deal_terms := public._cur_terms(d);
  nid uuid;
begin
  insert into public.deals (creator_id, brand_name, brand_email, brand_contact, source, title, payment_due_date)
  values (d.creator_id, d.brand_name, d.brand_email, d.brand_contact, d.source, d.title,
          case when t.payment_trigger = 'Fixed date' then (t.dates ->> 'fixed_date')::date end)
  returning id into nid;

  insert into public.deal_terms (deal_id, version, deliverables, amount_paise, currency, dates, usage_rights,
                                 exclusivity, revisions_included, payment_due_days, payment_trigger, whitelisting, notes)
  values (nid, 1, t.deliverables, t.amount_paise, t.currency, t.dates, t.usage_rights, t.exclusivity,
          t.revisions_included, t.payment_due_days, t.payment_trigger, t.whitelisting, t.notes);

  perform public._log(nid, 'creator', 'deal_created', 'Draft created', 'Copied from ' || d.brand_name || ' (' || d.title || ')');
  perform public._log(d.id, 'creator', 'deal_duplicated', 'Deal duplicated', null, 'neutral', jsonb_build_object('new_deal_id', nid));
  return nid;
end $$;

create function public.delete_deal(p_deal_id uuid) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  d public.deals := public._own_deal(p_deal_id);
begin
  if d.stage not in ('draft', 'cancelled') then
    raise exception 'Only a draft or a cancelled deal can be deleted. Cancel it first.' using errcode = '55000';
  end if;
  update public.deals set deleted_at = now() where id = d.id;
  perform public._log(d.id, 'creator', 'deal_deleted', 'Deal deleted', null, 'neutral', jsonb_build_object('stage', d.stage));
end $$;

create function public.archive_deal(p_deal_id uuid) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  d public.deals := public._own_deal(p_deal_id);
begin
  if d.stage not in ('paid', 'cancelled') then
    raise exception 'Only a paid or cancelled deal can be archived.' using errcode = '55000';
  end if;
  if d.archived_at is not null then return; end if;
  update public.deals set archived_at = now() where id = d.id;
  perform public._log(d.id, 'creator', 'deal_archived', 'Deal archived');
end $$;

create function public.unarchive_deal(p_deal_id uuid) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  d public.deals := public._own_deal(p_deal_id);
begin
  if d.archived_at is null then return; end if;
  update public.deals set archived_at = null where id = d.id;
  perform public._log(d.id, 'creator', 'deal_unarchived', 'Deal restored from archive');
end $$;

-- Templates
create function public.create_template(p_name text, p_terms jsonb) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  nid uuid;
begin
  if auth.uid() is null then raise exception 'Not signed in' using errcode = '28000'; end if;
  insert into public.templates (creator_id, name, terms)
  values (auth.uid(), btrim(p_name), coalesce(p_terms, '{}'::jsonb) || '{"used":0}'::jsonb)
  returning id into nid;
  return nid;
end $$;

create function public.update_template(p_id uuid, p_name text, p_terms jsonb) returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Not signed in' using errcode = '28000'; end if;
  update public.templates
     set name = btrim(p_name),
         terms = coalesce(p_terms, '{}'::jsonb) || jsonb_build_object('used', coalesce(terms -> 'used', '0'::jsonb))
   where id = p_id and creator_id = auth.uid();
  if not found then raise exception 'Template not found' using errcode = 'P0002'; end if;
end $$;

create function public.delete_template(p_id uuid) returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Not signed in' using errcode = '28000'; end if;
  delete from public.templates where id = p_id and creator_id = auth.uid();
  if not found then raise exception 'Template not found' using errcode = 'P0002'; end if;
end $$;

create function public.use_template(p_id uuid) returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Not signed in' using errcode = '28000'; end if;
  update public.templates
     set terms = jsonb_set(terms, '{used}', to_jsonb(coalesce((terms ->> 'used')::int, 0) + 1))
   where id = p_id and creator_id = auth.uid();
end $$;

create function public.create_template_from_deal(p_deal_id uuid, p_name text) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  d public.deals := public._own_deal(p_deal_id);
  t public.deal_terms := public._cur_terms(d);
  nid uuid;
begin
  insert into public.templates (creator_id, name, terms)
  values (d.creator_id, btrim(coalesce(nullif(p_name, ''), d.brand_name || ' terms')),
          jsonb_build_object('deliverables_text', t.deliverables ->> 'text', 'usage_rights', t.usage_rights,
                             'payment_trigger', t.payment_trigger, 'revisions_included', t.revisions_included,
                             'used', 0))
  returning id into nid;
  perform public._log(d.id, 'creator', 'template_created', 'Saved as a template', btrim(p_name));
  return nid;
end $$;

create function public.create_deal_from_template(
  p_template_id uuid, p_brand_name text default '', p_brand_email text default null
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  tpl public.templates;
  did uuid;
begin
  if auth.uid() is null then raise exception 'Not signed in' using errcode = '28000'; end if;
  select * into tpl from public.templates where id = p_template_id and creator_id = auth.uid();
  if not found then raise exception 'Template not found' using errcode = 'P0002'; end if;

  insert into public.deals (creator_id, brand_name, brand_email, title)
  values (auth.uid(), coalesce(p_brand_name, ''), nullif(p_brand_email, ''), coalesce(tpl.terms ->> 'deliverables_text', ''))
  returning id into did;

  insert into public.deal_terms (deal_id, version, deliverables, usage_rights, revisions_included, payment_trigger)
  values (did, 1,
          jsonb_build_object('text', coalesce(tpl.terms ->> 'deliverables_text', ''), 'items', '[]'::jsonb),
          nullif(tpl.terms ->> 'usage_rights', ''),
          coalesce((tpl.terms ->> 'revisions_included')::int, 1),
          nullif(tpl.terms ->> 'payment_trigger', ''));

  update public.templates
     set terms = jsonb_set(terms, '{used}', to_jsonb(coalesce((terms ->> 'used')::int, 0) + 1))
   where id = tpl.id;

  perform public._log(did, 'creator', 'deal_created', 'Draft created', 'From template “' || tpl.name || '”');
  return did;
end $$;

-- Only signed-in creators can call the public functions.
do $$
declare
  f text;
begin
  foreach f in array array[
    'create_deal(text,text,text,text,text,jsonb)',
    'update_draft_terms(uuid,text,text,text,text,jsonb)',
    'send_terms(uuid,text)',
    'revise_terms(uuid)',
    'update_stage(uuid,text,date)',
    'set_posting_date(uuid,date)',
    'duplicate_deal(uuid)',
    'delete_deal(uuid)',
    'archive_deal(uuid)',
    'unarchive_deal(uuid)',
    'create_template(text,jsonb)',
    'update_template(uuid,text,jsonb)',
    'delete_template(uuid)',
    'use_template(uuid)',
    'create_template_from_deal(uuid,text)',
    'create_deal_from_template(uuid,text,text)'
  ] loop
    execute format('revoke execute on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
end $$;
