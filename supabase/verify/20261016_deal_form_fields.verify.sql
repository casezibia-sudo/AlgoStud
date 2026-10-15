-- Verification for 20261016000000_deal_form_fields.sql.
-- Run this AFTER applying the migration (Supabase SQL editor, or psql). It creates a few test rows and then
-- ROLLS BACK, so nothing is left behind. Results appear as "PASS" notices in the Messages panel; the first
-- failed check raises an exception with a FAIL message and stops.
--
-- Needs at least one row in public.profiles (sign up once in the app first). It acts as that user.

begin;

do $$
declare
  uid uuid; did uuid; did2 uuid; did3 uuid; did4 uuid; did5 uuid; did6 uuid; did7 uuid;
  tid uuid; tpl_id uuid; tpl_id2 uuid; nv int; n int; col text; ok boolean;
  v_terms jsonb := jsonb_build_object(
    'deliverables_text', '1 Reel, 2 Stories', 'amount_paise', 2500000, 'revisions_included', 2,
    'payment_basis', 'going_live', 'payment_due_days', 15, 'payment_structure', 'advance_balance', 'advance_percent', 50,
    'first_draft_date', '2026-11-20', 'final_delivery_date', '2026-11-25', 'usage_rights', '90 days');
begin
  -- ------------------------------------------------------------ 1. the schema changes are there
  select count(*) into n from information_schema.columns
   where table_schema = 'public'
     and ((table_name = 'deal_terms' and column_name in ('first_draft_date','final_delivery_date','payment_structure','advance_percent'))
       or (table_name = 'deals' and column_name = 'source_message'));
  if n <> 5 then raise exception 'FAIL 1: expected the 5 new columns, found %', n; end if;
  raise notice 'PASS 1: the 5 new columns exist';

  select count(*) into n from information_schema.columns
   where table_schema = 'public' and table_name = 'deal_terms' and column_name = 'revisions_included' and column_default = '2';
  if n <> 1 then raise exception 'FAIL 1b: deal_terms.revisions_included does not default to 2'; end if;
  raise notice 'PASS 1b: revisions_included defaults to 2';

  select count(*) into n from pg_proc
   where proname = 'create_deal' and pronamespace = 'public'::regnamespace
     and pg_get_function_identity_arguments(oid) like '%p_source_message text';
  if n <> 1 then raise exception 'FAIL 1c: create_deal should exist once, with the p_source_message argument'; end if;
  select count(*) into n from pg_proc where proname = 'create_deal' and pronamespace = 'public'::regnamespace;
  if n <> 1 then raise exception 'FAIL 1d: an old create_deal overload is still there (% versions)', n; end if;
  raise notice 'PASS 1c: only the new create_deal exists';

  -- ------------------------------------------------------------ 2. create_deal works as a logged-in user
  select id into uid from public.profiles limit 1;
  if uid is null then raise exception 'SETUP: no row in public.profiles. Sign up once in the app, then re-run.'; end if;
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true);
  set local role authenticated;

  did := public.create_deal('Verify Brand', null, 'Verify Contact', 'Pasted message', '1 Reel, 2 Stories', v_terms, 'Hi! We can pay ₹25,000');

  select count(*) into n from public.deals
   where id = did and creator_id = uid and stage = 'draft' and brand_name = 'Verify Brand'
     and source = 'Pasted message' and source_message like 'Hi!%';
  if n <> 1 then raise exception 'FAIL 2a: the deal row is not what create_deal should have written'; end if;

  select count(*) into n from public.deal_terms
   where deal_id = did and version = 1 and status = 'draft' and amount_paise = 2500000 and revisions_included = 2
     and payment_trigger = 'Days after posting' and payment_due_days = 15
     and payment_structure = 'advance_balance' and advance_percent = 50
     and first_draft_date = '2026-11-20' and final_delivery_date = '2026-11-25' and usage_rights = '90 days';
  if n <> 1 then raise exception 'FAIL 2b: the terms row is not what create_deal should have written'; end if;

  select count(*) into n from public.events where deal_id = did and type = 'deal_created' and actor_type = 'creator';
  if n <> 1 then raise exception 'FAIL 2c: expected exactly one "Draft created" event, found %', n; end if;
  raise notice 'PASS 2: create_deal works as an authenticated user and logs its event';

  -- "of invoice" maps to On approval; "Full advance" ignores any percent
  did2 := public.create_deal('Verify Two', null, null, null, '', jsonb_build_object('payment_basis', 'invoice', 'payment_due_days', 7,
            'payment_structure', 'full_advance', 'advance_percent', 40));
  select count(*) into n from public.deal_terms
   where deal_id = did2 and payment_trigger = 'On approval' and payment_due_days = 7
     and payment_structure = 'full_advance' and advance_percent is null and revisions_included = 2;
  if n <> 1 then raise exception 'FAIL 2d: payment_basis / full_advance / default revisions mapping is wrong'; end if;
  raise notice 'PASS 2d: invoice basis, full advance and the default of 2 revisions behave';

  -- a final delivery date before the first draft date is rejected
  ok := false;
  begin
    perform public.create_deal('Bad Dates', null, null, null, '', jsonb_build_object('first_draft_date', '2026-11-25', 'final_delivery_date', '2026-11-20'));
  exception when check_violation then ok := true; end;
  if not ok then raise exception 'FAIL 2e: dates out of order were accepted'; end if;
  raise notice 'PASS 2e: final delivery before first draft is rejected';

  -- not signed in / anonymous cannot call it
  reset role;
  set local role anon;
  ok := false;
  begin
    perform public.create_deal('Anon', null, null, null, '', '{}'::jsonb);
  exception when insufficient_privilege then ok := true; end;
  if not ok then raise exception 'FAIL 2f: the anon role could call create_deal'; end if;
  reset role;
  raise notice 'PASS 2f: anon cannot call create_deal';

  -- ------------------------------------------------------------ 3. the new columns are locked once terms are SENT
  select id into tid from public.deal_terms where deal_id = did and version = 1;
  update public.deal_terms set status = 'sent', sent_at = now() where id = tid;   -- draft -> sent is still allowed
  raise notice 'PASS 3a: status can still move draft -> sent';

  foreach col in array array['first_draft_date', 'final_delivery_date', 'payment_structure', 'advance_percent'] loop
    ok := false;
    begin
      execute format('update public.deal_terms set %I = %s where id = $1', col,
        case col when 'first_draft_date' then '''2026-11-21''::date'
                 when 'final_delivery_date' then '''2026-11-30''::date'
                 when 'payment_structure' then '''full_advance'''
                 else '60' end) using tid;
    exception when others then ok := (sqlerrm like '%locked%'); end;
    if not ok then raise exception 'FAIL 3b: % could be changed on SENT terms (expected a "locked" error)', col; end if;
  end loop;
  raise notice 'PASS 3b: all four new columns are locked on sent terms ("These terms are locked")';

  -- a split percent on a non-split structure is rejected by the table itself (use a draft)
  select id into tid from public.deal_terms where deal_id = did2 and version = 1;
  ok := false;
  begin
    update public.deal_terms set advance_percent = 50 where id = tid;
  exception when check_violation then ok := true; end;
  if not ok then raise exception 'FAIL 3c: advance_percent was accepted on a Full advance deal'; end if;
  raise notice 'PASS 3c: advance_percent is only allowed with "Advance + balance"';

  -- ------------------------------------------------------------ 4. every rewritten function runs once
  -- plpgsql only resolves column names when a function first executes, so each one is called here for real,
  -- as the signed-in user. Assertions run after "reset role" (the tables are read-only for authenticated).

  -- 4a. empty strings in numeric / date keys become NULL (or the default), not an error
  set local role authenticated;
  did4 := public.create_deal('Verify Empty', null, null, null, '', jsonb_build_object(
            'amount_paise', '', 'payment_due_days', '', 'revisions_included', '', 'advance_percent', '',
            'payment_structure', 'advance_balance', 'first_draft_date', '', 'final_delivery_date', ''));
  reset role;
  select count(*) into n from public.deal_terms
   where deal_id = did4 and amount_paise = 0 and payment_due_days is null and revisions_included = 2
     and advance_percent is null and first_draft_date is null and final_delivery_date is null
     and payment_structure = 'advance_balance';
  if n <> 1 then raise exception 'FAIL 4a: create_deal did not turn empty strings into NULL / defaults'; end if;
  raise notice 'PASS 4a: create_deal accepts empty strings in numeric and date keys';

  -- 4b. update_draft_terms on a draft saves the new fields (did2 is still a draft here)
  set local role authenticated;
  perform public.update_draft_terms(did2, 'Verify Two', 'two@example.com', 'Contact Two', 'Edited', jsonb_build_object(
            'deliverables_text', '1 Reel', 'amount_paise', 1000000, 'revisions_included', 3,
            'payment_basis', 'going_live', 'payment_due_days', 30, 'payment_structure', 'advance_balance',
            'advance_percent', 30, 'first_draft_date', '2026-12-01', 'final_delivery_date', '2026-12-10',
            'usage_rights', '60 days'));
  reset role;
  select count(*) into n from public.deal_terms
   where deal_id = did2 and version = 1 and status = 'draft' and amount_paise = 1000000 and revisions_included = 3
     and payment_trigger = 'Days after posting' and payment_due_days = 30
     and payment_structure = 'advance_balance' and advance_percent = 30
     and first_draft_date = '2026-12-01' and final_delivery_date = '2026-12-10' and usage_rights = '60 days';
  if n <> 1 then raise exception 'FAIL 4b: update_draft_terms did not save the new fields'; end if;
  select count(*) into n from public.deals where id = did2 and brand_email = 'two@example.com' and title = '1 Reel';
  if n <> 1 then raise exception 'FAIL 4b: update_draft_terms did not update the deal row'; end if;
  raise notice 'PASS 4b: update_draft_terms saves the new fields on a draft';

  -- 4b2. and with empty strings it clears them instead of failing
  set local role authenticated;
  perform public.update_draft_terms(did2, 'Verify Two', 'two@example.com', null, null, jsonb_build_object(
            'amount_paise', '', 'payment_due_days', '', 'revisions_included', '', 'payment_structure', 'advance_balance',
            'advance_percent', '', 'first_draft_date', '', 'final_delivery_date', ''));
  reset role;
  select count(*) into n from public.deal_terms
   where deal_id = did2 and amount_paise = 0 and payment_due_days is null and revisions_included = 2
     and advance_percent is null and first_draft_date is null and final_delivery_date is null;
  if n <> 1 then raise exception 'FAIL 4b2: update_draft_terms did not turn empty strings into NULL / defaults'; end if;
  raise notice 'PASS 4b2: update_draft_terms accepts empty strings';

  -- 4c. revise_terms on sent terms (a complete deal is created and sent through the real send_terms)
  set local role authenticated;
  did3 := public.create_deal('Verify Three', 'three@example.com', 'Contact Three', 'Pasted message', '2 Reels',
            jsonb_build_object('deliverables_text', '2 Reels', 'amount_paise', 5000000, 'revisions_included', 3,
              'payment_basis', 'going_live', 'payment_due_days', 15, 'payment_structure', 'advance_balance',
              'advance_percent', 40, 'first_draft_date', '2026-12-05', 'final_delivery_date', '2026-12-15',
              'usage_rights', '90 days'),
            'Pasted text for deal three');
  perform public.send_terms(did3, 'whatsapp');
  nv := public.revise_terms(did3);
  reset role;
  if nv <> 2 then raise exception 'FAIL 4c: revise_terms returned version %, expected 2', nv; end if;
  select count(*) into n from public.deal_terms where deal_id = did3 and version = 1 and status = 'superseded';
  if n <> 1 then raise exception 'FAIL 4c: v1 was not superseded'; end if;
  select count(*) into n from public.deal_terms
   where deal_id = did3 and version = 2 and status = 'draft' and amount_paise = 5000000 and revisions_included = 3
     and payment_trigger = 'Days after posting' and payment_due_days = 15 and usage_rights = '90 days'
     and payment_structure = 'advance_balance' and advance_percent = 40
     and first_draft_date = '2026-12-05' and final_delivery_date = '2026-12-15';
  if n <> 1 then raise exception 'FAIL 4c: v2 does not carry all the fields from v1'; end if;
  select count(*) into n from public.deals where id = did3 and current_version = 2 and stage = 'draft';
  if n <> 1 then raise exception 'FAIL 4c: the deal should now point at v2 and be back in draft'; end if;
  raise notice 'PASS 4c: revise_terms creates v2 with every new field copied and supersedes v1';

  -- 4d. duplicate_deal copies the terms (v2 of did3), but NOT the pasted message
  set local role authenticated;
  did5 := public.duplicate_deal(did3);
  reset role;
  select count(*) into n from public.deal_terms
   where deal_id = did5 and version = 1 and amount_paise = 5000000 and revisions_included = 3
     and payment_structure = 'advance_balance' and advance_percent = 40
     and first_draft_date = '2026-12-05' and final_delivery_date = '2026-12-15';
  if n <> 1 then raise exception 'FAIL 4d: duplicate_deal did not copy the new fields'; end if;
  select count(*) into n from public.deals where id = did5 and source_message is null;
  if n <> 1 then raise exception 'FAIL 4d: duplicate_deal copied the pasted source_message'; end if;
  select count(*) into n from public.deals where id = did3 and source_message = 'Pasted text for deal three';
  if n <> 1 then raise exception 'FAIL 4d: the original deal lost its source_message'; end if;
  raise notice 'PASS 4d: duplicate_deal copies the new fields and leaves source_message behind';

  -- 4e. create_template_from_deal and create_deal_from_template carry the payment terms through
  set local role authenticated;
  tpl_id := public.create_template_from_deal(did3, 'Verify template');
  did6 := public.create_deal_from_template(tpl_id, 'Verify From Template', null);
  reset role;
  select count(*) into n from public.templates
   where id = tpl_id and terms ->> 'payment_structure' = 'advance_balance' and (terms ->> 'advance_percent')::int = 40
     and (terms ->> 'payment_due_days')::int = 15 and (terms ->> 'revisions_included')::int = 3
     and (terms ->> 'used')::int = 1;
  if n <> 1 then raise exception 'FAIL 4e: the template did not store the payment terms (or "used" was not bumped)'; end if;
  select count(*) into n from public.deal_terms
   where deal_id = did6 and version = 1 and payment_structure = 'advance_balance' and advance_percent = 40
     and payment_due_days = 15 and revisions_included = 3 and usage_rights = '90 days';
  if n <> 1 then raise exception 'FAIL 4e: create_deal_from_template did not carry the payment terms through'; end if;
  raise notice 'PASS 4e: templates carry payment_structure and advance_percent both ways';

  -- 4f. a template whose numeric keys are empty strings still creates a deal
  insert into public.templates (creator_id, name, terms)
  values (uid, 'Verify empty template', jsonb_build_object('payment_structure', 'advance_balance',
            'revisions_included', '', 'payment_due_days', '', 'advance_percent', '', 'used', ''))
  returning id into tpl_id2;
  set local role authenticated;
  did7 := public.create_deal_from_template(tpl_id2, 'Verify Empty Template', null);
  reset role;
  select count(*) into n from public.deal_terms
   where deal_id = did7 and revisions_included = 2 and payment_due_days is null and advance_percent is null;
  if n <> 1 then raise exception 'FAIL 4f: create_deal_from_template did not turn empty strings into NULL / defaults'; end if;
  raise notice 'PASS 4f: create_deal_from_template accepts empty strings';

  raise notice 'ALL CHECKS PASSED (rolling back the test rows now)';
end $$;

-- A visible result row (the SQL Editor may not show notices). If any check fails, the block above raises and
-- this line is never reached: you see the FAIL message instead.
select 'ALL CHECKS PASSED' as result;

rollback;
