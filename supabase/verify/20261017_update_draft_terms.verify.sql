-- Verification for 20261017000000_update_draft_terms_keep_absent.sql.
-- Run AFTER applying the migration (Supabase SQL editor). It creates test rows and ROLLS BACK, so nothing is left
-- behind. The first failed check raises an exception with a FAIL message and stops; on success the last result row
-- reads ALL CHECKS PASSED.
--
-- Which user it acts as: the first row in public.profiles (sign up once in the app first). It sets
-- request.jwt.claims with that user's id as "sub" and then "set local role authenticated", so auth.uid() returns
-- that user, exactly as for a real signed-in call. The "someone else's deal" check uses a random uuid as "sub".

begin;

-- helpers live in pg_temp and vanish with the rollback
create function pg_temp.as_user(p_sub uuid) returns void language plpgsql as $f$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', p_sub, 'role', 'authenticated')::text, true);
  set local role authenticated;
end $f$;

create function pg_temp.mk(p_sub uuid, p_terms jsonb) returns uuid language plpgsql as $f$
declare did uuid;
begin
  perform pg_temp.as_user(p_sub);
  did := public.create_deal('Verify Brand', 'v@example.com', 'Contact', 'Manual', '1 Reel, 2 Stories', p_terms);
  reset role;
  return did;
end $f$;

create function pg_temp.upd(p_sub uuid, p_did uuid, p_terms jsonb) returns void language plpgsql as $f$
begin
  perform pg_temp.as_user(p_sub);
  perform public.update_draft_terms(p_did, 'Verify Brand', 'v@example.com', 'Contact', 'Manual', p_terms);
  reset role;
end $f$;

create function pg_temp.snap(p_did uuid) returns jsonb language sql as $f$
  select to_jsonb(x) from public.deal_terms x where x.deal_id = p_did and x.version = 1
$f$;

do $$
declare
  uid uuid; stranger uuid := gen_random_uuid();
  did uuid; did2 uuid; b jsonb; a jsonb; c jsonb; n int; ok boolean; col text;
  base jsonb := jsonb_build_object(
    'deliverables_text', '1 Reel, 2 Stories', 'amount_paise', 2500000, 'revisions_included', 3,
    'usage_rights', '90 days', 'exclusivity', '30 days', 'whitelisting', 'Paid ads 14 days', 'notes', 'Keep it casual',
    'payment_basis', 'going_live', 'payment_due_days', 15, 'payment_structure', 'advance_balance', 'advance_percent', 50,
    'first_draft_date', '2026-11-20', 'final_delivery_date', '2026-11-25');
  -- one key sent per case; every other column must stay as it was. exp = expected value of col afterwards
  cases jsonb := $j$[
    {"key":"deliverables_text","val":"New text","col":"deliverables","exp":{"text":"New text","items":[]}},
    {"key":"amount_paise","val":1000000,"col":"amount_paise","exp":1000000},
    {"key":"revisions_included","val":5,"col":"revisions_included","exp":5},
    {"key":"usage_rights","val":"60 days","col":"usage_rights","exp":"60 days"},
    {"key":"exclusivity","val":"60 days","col":"exclusivity","exp":"60 days"},
    {"key":"whitelisting","val":"None","col":"whitelisting","exp":"None"},
    {"key":"notes","val":"Changed","col":"notes","exp":"Changed"},
    {"key":"payment_due_days","val":30,"col":"payment_due_days","exp":30},
    {"key":"payment_basis","val":"invoice","col":"payment_trigger","exp":"On approval"},
    {"key":"first_draft_date","val":"2026-11-22","col":"first_draft_date","exp":"2026-11-22"},
    {"key":"final_delivery_date","val":"2026-11-28","col":"final_delivery_date","exp":"2026-11-28"},
    {"key":"advance_percent","val":60,"col":"advance_percent","exp":60},

    {"key":"usage_rights","val":null,"col":"usage_rights","exp":null},
    {"key":"exclusivity","val":null,"col":"exclusivity","exp":null},
    {"key":"whitelisting","val":null,"col":"whitelisting","exp":null},
    {"key":"notes","val":null,"col":"notes","exp":null},
    {"key":"payment_due_days","val":null,"col":"payment_due_days","exp":null},
    {"key":"first_draft_date","val":null,"col":"first_draft_date","exp":null},
    {"key":"final_delivery_date","val":null,"col":"final_delivery_date","exp":null},
    {"key":"advance_percent","val":null,"col":"advance_percent","exp":null},
    {"key":"payment_trigger","val":null,"col":"payment_trigger","exp":null},
    {"key":"amount_paise","val":null,"col":"amount_paise","exp":0},
    {"key":"revisions_included","val":null,"col":"revisions_included","exp":2},

    {"key":"usage_rights","val":"","col":"usage_rights","exp":null},
    {"key":"exclusivity","val":"","col":"exclusivity","exp":null},
    {"key":"whitelisting","val":"","col":"whitelisting","exp":null},
    {"key":"notes","val":"","col":"notes","exp":null},
    {"key":"payment_due_days","val":"","col":"payment_due_days","exp":null},
    {"key":"first_draft_date","val":"","col":"first_draft_date","exp":null},
    {"key":"final_delivery_date","val":"","col":"final_delivery_date","exp":null},
    {"key":"advance_percent","val":"","col":"advance_percent","exp":null},
    {"key":"amount_paise","val":"","col":"amount_paise","exp":0},
    {"key":"revisions_included","val":"","col":"revisions_included","exp":2},
    {"key":"deliverables_text","val":"","col":"deliverables","exp":{"text":"","items":[]}}
  ]$j$::jsonb;
  cs jsonb;
begin
  select id into uid from public.profiles limit 1;
  if uid is null then raise exception 'SETUP: no row in public.profiles. Sign up once in the app, then re-run.'; end if;

  -- 0. one function, signed-in only, still security definer with a fixed search_path
  select count(*) into n from pg_proc where proname = 'update_draft_terms' and pronamespace = 'public'::regnamespace;
  if n <> 1 then raise exception 'FAIL 0a: expected exactly one update_draft_terms, found %', n; end if;
  select count(*) into n from pg_proc p
   where p.proname = 'update_draft_terms' and p.pronamespace = 'public'::regnamespace and p.prosecdef
     and exists (select 1 from unnest(p.proconfig) s where s like 'search_path=%')
     and has_function_privilege('authenticated', p.oid, 'execute')
     and not has_function_privilege('anon', p.oid, 'execute');
  if n <> 1 then raise exception 'FAIL 0b: security definer / search_path / grants changed'; end if;
  raise notice 'PASS 0: one function, security definer, search_path set, authenticated only';

  -- 1. an empty p_terms, and a null one, keep EVERY column
  did := pg_temp.mk(uid, base);
  b := pg_temp.snap(did);
  perform pg_temp.upd(uid, did, '{}'::jsonb);
  if pg_temp.snap(did) <> b then raise exception 'FAIL 1a: {} changed a column: % vs %', b, pg_temp.snap(did); end if;
  perform pg_temp.upd(uid, did, null);
  if pg_temp.snap(did) <> b then raise exception 'FAIL 1b: null p_terms changed a column'; end if;
  select count(*) into n from public.deals where id = did and title = '1 Reel, 2 Stories';
  if n <> 1 then raise exception 'FAIL 1c: title changed when deliverables_text was absent'; end if;
  raise notice 'PASS 1: absent keys keep every column ({} and null)';

  -- 2/3/4. one key at a time: set, null, ''
  for cs in select value from jsonb_array_elements(cases) loop
    did := pg_temp.mk(uid, base);
    b := pg_temp.snap(did);
    perform pg_temp.upd(uid, did, jsonb_build_object(cs ->> 'key', cs -> 'val'));
    a := pg_temp.snap(did);
    col := cs ->> 'col';
    if (a - col) <> (b - col) then
      raise exception 'FAIL 2: sending only % changed other columns', cs ->> 'key'; end if;
    if (a -> col) is distinct from (cs -> 'exp') then
      raise exception 'FAIL 2: key % val % gave % = %, expected %', cs ->> 'key', cs -> 'val', col, a -> col, cs -> 'exp'; end if;
  end loop;
  raise notice 'PASS 2-4: new value updates, null clears, empty string clears, and nothing else moves (% cases)', jsonb_array_length(cases);

  -- 5. payment structure and advance percent
  did := pg_temp.mk(uid, base);
  perform pg_temp.upd(uid, did, '{"payment_structure":"full_advance"}');
  c := pg_temp.snap(did);
  if c ->> 'payment_structure' <> 'full_advance' or c -> 'advance_percent' <> 'null'::jsonb then
    raise exception 'FAIL 5a: full_advance should clear the percent, got %', c; end if;
  if c ->> 'payment_trigger' <> 'Days after posting' then
    raise exception 'FAIL 5a2: the trigger must stay decoupled from the structure, got %', c ->> 'payment_trigger'; end if;
  perform pg_temp.upd(uid, did, '{"payment_structure":"advance_balance"}');
  if pg_temp.snap(did) -> 'advance_percent' <> 'null'::jsonb then
    raise exception 'FAIL 5b: the old percent came back after a structure round trip'; end if;
  perform pg_temp.upd(uid, did, '{"payment_structure":"advance_balance","advance_percent":40}');
  if (pg_temp.snap(did) ->> 'advance_percent')::int <> 40 then raise exception 'FAIL 5c: percent 40 not saved'; end if;
  perform pg_temp.upd(uid, did, '{"payment_structure":null}');
  c := pg_temp.snap(did);
  if c -> 'payment_structure' <> 'null'::jsonb or c -> 'advance_percent' <> 'null'::jsonb then
    raise exception 'FAIL 5d: null structure should clear structure and percent'; end if;
  raise notice 'PASS 5: percent follows the structure (no constraint error), trigger stays decoupled';

  -- 6. Fixed date: date kept when absent, dropped when the trigger changes
  did := pg_temp.mk(uid, base);
  perform pg_temp.upd(uid, did, '{"payment_trigger":"Fixed date","fixed_date":"2026-12-01"}');
  c := pg_temp.snap(did);
  select count(*) into n from public.deals where id = did and payment_due_date = '2026-12-01';
  if c -> 'dates' <> '{"fixed_date":"2026-12-01"}'::jsonb or c ->> 'payment_trigger' <> 'Fixed date' or n <> 1 then
    raise exception 'FAIL 6a: fixed date not saved'; end if;
  perform pg_temp.upd(uid, did, '{"notes":"x"}');
  select count(*) into n from public.deals where id = did and payment_due_date = '2026-12-01';
  if pg_temp.snap(did) -> 'dates' <> '{"fixed_date":"2026-12-01"}'::jsonb or n <> 1 then
    raise exception 'FAIL 6b: fixed date lost when its keys were absent'; end if;
  perform pg_temp.upd(uid, did, '{"payment_basis":"invoice"}');
  select count(*) into n from public.deals where id = did and payment_due_date is null;
  if pg_temp.snap(did) -> 'dates' <> '{}'::jsonb or n <> 1 then
    raise exception 'FAIL 6c: fixed date should clear when the trigger changes'; end if;
  raise notice 'PASS 6: fixed date handling';

  -- 7. dates out of order are still rejected by the table
  did := pg_temp.mk(uid, base);
  ok := false;
  begin perform pg_temp.upd(uid, did, '{"final_delivery_date":"2026-11-10"}');
  exception when check_violation then ok := true; end;
  if not ok then raise exception 'FAIL 7: final delivery before the stored first draft was accepted'; end if;
  raise notice 'PASS 7: a single out-of-order date is rejected';

  -- 8. exactly one draft_updated event per save
  did := pg_temp.mk(uid, base);
  perform pg_temp.upd(uid, did, '{}'); perform pg_temp.upd(uid, did, '{"notes":"x"}');
  select count(*) into n from public.events where deal_id = did and type = 'draft_updated';
  if n <> 2 then raise exception 'FAIL 8: expected 2 draft_updated events, found %', n; end if;

  -- 9. refused: not a draft, and someone else's deal (neither writes data or an event)
  did2 := pg_temp.mk(uid, base);
  perform pg_temp.as_user(uid); perform public.send_terms(did2, 'whatsapp'); reset role;
  ok := false;
  begin perform pg_temp.upd(uid, did2, '{"notes":"x"}');
  exception when others then ok := (sqlstate = '55000' and sqlerrm like 'Only a draft can be edited%'); end;
  if not ok then raise exception 'FAIL 9a: a sent deal was not refused with the draft message'; end if;
  ok := false;
  begin perform pg_temp.upd(stranger, did, '{"notes":"hacked"}');
  exception when others then ok := (sqlstate = 'P0002' and sqlerrm = 'Deal not found'); end;
  if not ok then raise exception 'FAIL 9b: another user could touch the deal'; end if;
  select count(*) into n from public.deal_terms where deal_id = did and version = 1 and notes = 'x';
  if n <> 1 then raise exception 'FAIL 9c: the refused update changed the data'; end if;
  select count(*) into n from public.events where deal_id = did and type = 'draft_updated';
  if n <> 2 then raise exception 'FAIL 9d: a refused save wrote an event'; end if;
  select count(*) into n from public.events where deal_id = did2 and type = 'draft_updated';
  if n <> 0 then raise exception 'FAIL 9e: the refused save on the sent deal wrote an event'; end if;
  raise notice 'PASS 8-9: one event per save; sent deals and other users are refused';

  raise notice 'ALL CHECKS PASSED (rolling back the test rows now)';
end $$;

-- A visible result row (the SQL Editor may not show notices). If any check fails, the block above raises and
-- this line is never reached: you see the FAIL message instead.
select 'ALL CHECKS PASSED' as result;

rollback;
