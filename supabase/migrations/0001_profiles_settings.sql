-- AlgoStudio slice 1: creator profiles + settings.
-- Run once in the Supabase SQL Editor (see README). Safe to review top to bottom.

-- ---------------------------------------------------------------- tables

-- One row per creator. id is the Supabase Auth user id.
create table public.profiles (
  id                     uuid primary key references auth.users(id) on delete cascade,
  name                   text not null default '' check (char_length(name) <= 100),
  handle                 text not null default '' check (handle ~ '^[A-Za-z0-9._]{0,30}$'),
  payment_link           text check (payment_link is null or char_length(payment_link) <= 500),
  deletion_requested_at  timestamptz,
  deletion_scheduled_for timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  check ((deletion_requested_at is null) = (deletion_scheduled_for is null))
);

-- One row per creator.
create table public.settings (
  creator_id      uuid primary key references public.profiles(id) on delete cascade,
  default_trigger text not null default 'On approval'
    check (default_trigger in ('On approval', 'On posting', 'Days after posting', 'Fixed date')),
  notify_answers  boolean not null default true,
  notify_expiring boolean not null default true,
  notify_due_soon boolean not null default true,
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------- triggers

create function public.touch_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger settings_touch before update on public.settings
  for each row execute function public.touch_updated_at();

-- Create the profile + settings rows the first time someone signs in.
create function public.handle_new_user() returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.settings (creator_id) values (new.id);
  return new;
end $$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill anyone who signed in before this migration ran.
insert into public.profiles (id) select id from auth.users on conflict do nothing;
insert into public.settings (creator_id) select id from public.profiles on conflict do nothing;

-- ---------------------------------------------------------------- privileges
-- Lock the tables down first, then grant back only what the app needs.
-- Deletion columns are deliberately NOT updatable: they change only through the RPCs below.

revoke all on public.profiles from anon, authenticated;
revoke all on public.settings from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (name, handle, payment_link) on public.profiles to authenticated;

grant select on public.settings to authenticated;
grant update (default_trigger, notify_answers, notify_expiring, notify_due_soon)
  on public.settings to authenticated;

-- ---------------------------------------------------------------- row level security

alter table public.profiles enable row level security;
alter table public.settings enable row level security;

create policy "profiles: read own" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()));

create policy "profiles: update own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "settings: read own" on public.settings
  for select to authenticated
  using (creator_id = (select auth.uid()));

create policy "settings: update own" on public.settings
  for update to authenticated
  using (creator_id = (select auth.uid()))
  with check (creator_id = (select auth.uid()));

-- No insert policy (the trigger creates rows) and no delete policy (deletion is scheduled, not immediate).

-- ---------------------------------------------------------------- account deletion RPCs
-- security definer so they can write the locked-down columns; both are scoped to auth.uid().

-- Scheduling requires the session to have been created by an email code in the last 5 minutes
-- (checked against the "amr" claim in the JWT), so a stolen idle session cannot delete the account.
create function public.schedule_deletion() returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;

  if not exists (
    select 1
    from jsonb_array_elements(coalesce(auth.jwt() -> 'amr', '[]'::jsonb)) as a
    where a ->> 'method' in ('otp', 'magiclink')
      and (a ->> 'timestamp')::bigint > extract(epoch from now())::bigint - 300
  ) then
    raise exception 'Confirm with a fresh email code first' using errcode = '42501';
  end if;

  update public.profiles
     set deletion_requested_at  = now(),
         deletion_scheduled_for = now() + interval '30 days'
   where id = uid
     and deletion_requested_at is null;
end $$;

create function public.cancel_deletion() returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;

  update public.profiles
     set deletion_requested_at  = null,
         deletion_scheduled_for = null
   where id = uid;
end $$;

revoke execute on function public.schedule_deletion() from public, anon;
revoke execute on function public.cancel_deletion()   from public, anon;
grant  execute on function public.schedule_deletion() to authenticated;
grant  execute on function public.cancel_deletion()   to authenticated;
