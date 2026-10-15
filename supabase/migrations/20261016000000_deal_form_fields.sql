-- AlgoStudio: the Create Deal form's extra terms.
--
--   deal_terms: first_draft_date, final_delivery_date, payment_structure, advance_percent
--   deals:      source_message (the brand message the creator pasted; creator-only, read by slice 5's parser)
--
-- "Paid within N days of going live / invoice" needs no new column: it is payment_trigger
-- ('Days after posting' / 'On approval') + payment_due_days, which update_stage and set_posting_date
-- already use to work out the due date. The functions below accept a payment_basis key
-- ('going_live' | 'invoice') and set payment_trigger themselves, so that mapping lives in one place.
--
-- Everything runs in ONE transaction: if any statement fails (for example after the drop of the old
-- create_deal), the whole migration rolls back and nothing is half applied.
-- Existing deals keep NULL in the new columns (shown as "not set").
--
-- TODO (slice 6): "Full advance" has no payment due date until it is marked paid. Add "due N days after
--   confirmation" so an unpaid advance can become overdue.
-- TODO (slice 6): "Advance + balance": N days applies to the balance only. The advance's own timing
--   (when it is due) is not modelled yet.

begin;

-- ---------------------------------------------------------------- columns
alter table public.deal_terms
  add column first_draft_date    date,
  add column final_delivery_date date,
  add column payment_structure   text,
  add column advance_percent     int;

alter table public.deal_terms
  add constraint deal_terms_dates_order check (
    first_draft_date is null or final_delivery_date is null or final_delivery_date >= first_draft_date),
  add constraint deal_terms_payment_structure check (
    payment_structure is null or payment_structure in ('full_after_posting', 'advance_balance', 'full_advance')),
  -- A split percent only makes sense for "Advance + balance", and must leave something for the balance.
  add constraint deal_terms_advance_percent check (
    advance_percent is null or (payment_structure = 'advance_balance' and advance_percent between 1 and 99));

-- The form's default is 2 revisions. Existing rows keep the value they have.
alter table public.deal_terms alter column revisions_included set default 2;

alter table public.deals
  add column source_message text
    check (source_message is null or char_length(source_message) <= 10000);

-- ---------------------------------------------------------------- lock trigger
-- Once terms leave 'draft' their content can't change. The ONLY difference from the slice 2 version is that the
-- four new columns are added to the row comparison (otherwise they would stay editable after the terms are sent).
-- The identity check and the status rules are unchanged.
create or replace function public.deal_terms_lock() returns trigger
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
         new.revisions_included, new.payment_due_days, new.payment_trigger, new.whitelisting, new.notes,
         new.first_draft_date, new.final_delivery_date, new.payment_structure, new.advance_percent)
     is distinct from
     row(old.deliverables, old.amount_paise, old.currency, old.dates, old.usage_rights, old.exclusivity,
         old.revisions_included, old.payment_due_days, old.payment_trigger, old.whitelisting, old.notes,
         old.first_draft_date, old.final_delivery_date, old.payment_structure, old.advance_percent) then
    raise exception 'These terms are locked. Create a new version instead.' using errcode = '55000';
  end if;

  -- Status only moves forward.
  if new.status <> old.status and (old.status, new.status) not in
     (('draft','sent'), ('sent','confirmed'), ('sent','superseded'), ('confirmed','superseded')) then
    raise exception 'Terms cannot move from % to %', old.status, new.status using errcode = '55000';
  end if;
  return new;
end $$;

-- ---------------------------------------------------------------- create_deal (new optional argument)
-- p_terms keys: deliverables_text, amount_paise, usage_rights, exclusivity, revisions_included,
--   payment_due_days, payment_basis ('going_live' | 'invoice'), payment_trigger (older clients), fixed_date,
--   payment_structure, advance_percent, first_draft_date, final_delivery_date, whitelisting, notes
drop function public.create_deal(text, text, text, text, text, jsonb);

create function public.create_deal(
  p_brand_name text, p_brand_email text, p_brand_contact text, p_source text, p_title text, p_terms jsonb,
  p_source_message text default null
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  did uuid;
  trig text := case nullif(p_terms ->> 'payment_basis', '')
                 when 'going_live' then 'Days after posting'
                 when 'invoice'    then 'On approval'
                 else nullif(p_terms ->> 'payment_trigger', '') end;
  fixed date := case when trig = 'Fixed date' then nullif(p_terms ->> 'fixed_date', '')::date end;
  structure text := nullif(p_terms ->> 'payment_structure', '');
begin
  if uid is null then raise exception 'Not signed in' using errcode = '28000'; end if;

  insert into public.deals (creator_id, brand_name, brand_email, brand_contact, source, title, payment_due_date, source_message)
  values (uid, coalesce(p_brand_name, ''), nullif(p_brand_email, ''), nullif(p_brand_contact, ''),
          nullif(p_source, ''), coalesce(p_title, ''), fixed, nullif(p_source_message, ''))
  returning id into did;

  insert into public.deal_terms (deal_id, version, deliverables, amount_paise, dates, usage_rights, exclusivity,
                                 revisions_included, payment_due_days, payment_trigger, whitelisting, notes,
                                 first_draft_date, final_delivery_date, payment_structure, advance_percent)
  values (did, 1,
          jsonb_build_object('text', coalesce(p_terms ->> 'deliverables_text', ''), 'items', '[]'::jsonb),
          coalesce(nullif(p_terms ->> 'amount_paise', '')::bigint, 0),
          case when fixed is not null then jsonb_build_object('fixed_date', fixed) else '{}'::jsonb end,
          nullif(p_terms ->> 'usage_rights', ''), nullif(p_terms ->> 'exclusivity', ''),
          coalesce(nullif(p_terms ->> 'revisions_included', '')::int, 2),
          nullif(p_terms ->> 'payment_due_days', '')::int, trig,
          nullif(p_terms ->> 'whitelisting', ''), nullif(p_terms ->> 'notes', ''),
          nullif(p_terms ->> 'first_draft_date', '')::date, nullif(p_terms ->> 'final_delivery_date', '')::date,
          structure,
          case when structure = 'advance_balance' then nullif(p_terms ->> 'advance_percent', '')::int end);

  perform public._log(did, 'creator', 'deal_created', 'Draft created');
  return did;
end $$;

revoke execute on function public.create_deal(text, text, text, text, text, jsonb, text) from public, anon;
grant  execute on function public.create_deal(text, text, text, text, text, jsonb, text) to authenticated;

-- ---------------------------------------------------------------- update_draft_terms (same signature)
create or replace function public.update_draft_terms(
  p_deal_id uuid, p_brand_name text, p_brand_email text, p_brand_contact text, p_source text, p_terms jsonb
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  d public.deals := public._own_deal(p_deal_id);
  t public.deal_terms := public._cur_terms(d);
  trig text := case nullif(p_terms ->> 'payment_basis', '')
                 when 'going_live' then 'Days after posting'
                 when 'invoice'    then 'On approval'
                 else nullif(p_terms ->> 'payment_trigger', '') end;
  fixed date := case when trig = 'Fixed date' then nullif(p_terms ->> 'fixed_date', '')::date end;
  structure text := nullif(p_terms ->> 'payment_structure', '');
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
         amount_paise = coalesce(nullif(p_terms ->> 'amount_paise', '')::bigint, 0),
         dates = case when fixed is not null then jsonb_build_object('fixed_date', fixed) else '{}'::jsonb end,
         usage_rights = nullif(p_terms ->> 'usage_rights', ''),
         exclusivity = nullif(p_terms ->> 'exclusivity', ''),
         revisions_included = coalesce(nullif(p_terms ->> 'revisions_included', '')::int, 2),
         payment_due_days = nullif(p_terms ->> 'payment_due_days', '')::int,
         payment_trigger = trig,
         whitelisting = nullif(p_terms ->> 'whitelisting', ''),
         notes = nullif(p_terms ->> 'notes', ''),
         first_draft_date = nullif(p_terms ->> 'first_draft_date', '')::date,
         final_delivery_date = nullif(p_terms ->> 'final_delivery_date', '')::date,
         payment_structure = structure,
         advance_percent = case when structure = 'advance_balance' then nullif(p_terms ->> 'advance_percent', '')::int end
   where id = t.id;

  perform public._log(d.id, 'creator', 'draft_updated', 'Draft updated', 'Terms v' || t.version, 'neutral');
end $$;

-- ---------------------------------------------------------------- revise_terms: new versions carry the new columns
create or replace function public.revise_terms(p_deal_id uuid) returns int
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
                                 exclusivity, revisions_included, payment_due_days, payment_trigger, whitelisting, notes,
                                 first_draft_date, final_delivery_date, payment_structure, advance_percent)
  values (d.id, nv, t.deliverables, t.amount_paise, t.currency, t.dates, t.usage_rights, t.exclusivity,
          t.revisions_included, t.payment_due_days, t.payment_trigger, t.whitelisting, t.notes,
          t.first_draft_date, t.final_delivery_date, t.payment_structure, t.advance_percent);

  update public.deals set current_version = nv, stage = 'draft' where id = d.id;

  perform public._log(d.id, 'creator', 'terms_revised', 'New version v' || nv || ' started',
                      'Replaces v' || t.version, 'info', jsonb_build_object('from_version', t.version, 'version', nv));
  return nv;
end $$;

-- ---------------------------------------------------------------- duplicate_deal (does not copy the pasted message)
create or replace function public.duplicate_deal(p_deal_id uuid) returns uuid
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
                                 exclusivity, revisions_included, payment_due_days, payment_trigger, whitelisting, notes,
                                 first_draft_date, final_delivery_date, payment_structure, advance_percent)
  values (nid, 1, t.deliverables, t.amount_paise, t.currency, t.dates, t.usage_rights, t.exclusivity,
          t.revisions_included, t.payment_due_days, t.payment_trigger, t.whitelisting, t.notes,
          t.first_draft_date, t.final_delivery_date, t.payment_structure, t.advance_percent);

  perform public._log(nid, 'creator', 'deal_created', 'Draft created', 'Copied from ' || d.brand_name || ' (' || d.title || ')');
  perform public._log(d.id, 'creator', 'deal_duplicated', 'Deal duplicated', null, 'neutral', jsonb_build_object('new_deal_id', nid));
  return nid;
end $$;

-- ---------------------------------------------------------------- templates carry the payment terms too
-- templates.terms is free-form jsonb, so no schema change: the new keys are payment_structure, advance_percent and
-- payment_due_days (alongside the existing payment_trigger).
create or replace function public.create_template_from_deal(p_deal_id uuid, p_name text) returns uuid
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
          jsonb_strip_nulls(jsonb_build_object(
            'deliverables_text', t.deliverables ->> 'text', 'usage_rights', t.usage_rights,
            'payment_trigger', t.payment_trigger, 'payment_due_days', t.payment_due_days,
            'payment_structure', t.payment_structure, 'advance_percent', t.advance_percent,
            'revisions_included', t.revisions_included, 'used', 0)))
  returning id into nid;
  perform public._log(d.id, 'creator', 'template_created', 'Saved as a template', btrim(p_name));
  return nid;
end $$;

create or replace function public.create_deal_from_template(
  p_template_id uuid, p_brand_name text default '', p_brand_email text default null
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  tpl public.templates;
  did uuid;
  structure text;
begin
  if auth.uid() is null then raise exception 'Not signed in' using errcode = '28000'; end if;
  select * into tpl from public.templates where id = p_template_id and creator_id = auth.uid();
  if not found then raise exception 'Template not found' using errcode = 'P0002'; end if;
  structure := nullif(tpl.terms ->> 'payment_structure', '');

  insert into public.deals (creator_id, brand_name, brand_email, title)
  values (auth.uid(), coalesce(p_brand_name, ''), nullif(p_brand_email, ''), coalesce(tpl.terms ->> 'deliverables_text', ''))
  returning id into did;

  insert into public.deal_terms (deal_id, version, deliverables, usage_rights, revisions_included, payment_trigger,
                                 payment_due_days, payment_structure, advance_percent)
  values (did, 1,
          jsonb_build_object('text', coalesce(tpl.terms ->> 'deliverables_text', ''), 'items', '[]'::jsonb),
          nullif(tpl.terms ->> 'usage_rights', ''),
          coalesce(nullif(tpl.terms ->> 'revisions_included', '')::int, 2),
          nullif(tpl.terms ->> 'payment_trigger', ''),
          nullif(tpl.terms ->> 'payment_due_days', '')::int,
          structure,
          case when structure = 'advance_balance' then nullif(tpl.terms ->> 'advance_percent', '')::int end);

  update public.templates
     set terms = jsonb_set(terms, '{used}', to_jsonb(coalesce(nullif(terms ->> 'used', '')::int, 0) + 1))
   where id = tpl.id;

  perform public._log(did, 'creator', 'deal_created', 'Draft created', 'From template “' || tpl.name || '”');
  return did;
end $$;

commit;
