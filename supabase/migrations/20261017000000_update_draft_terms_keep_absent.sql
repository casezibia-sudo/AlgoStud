-- update_draft_terms: a key missing from p_terms keeps the stored value; a key present with null (or '' for
-- date/number fields) clears it; a key present with a value sets it. Same signature, so grants are untouched.
-- Rules that stay: owner check, draft only, one draft_updated event, security definer, search_path ''.
--   * NOT NULL columns cannot be cleared: amount_paise -> 0, revisions_included -> 2, deliverables text -> ''.
--   * advance_percent is only kept while the resulting structure is 'advance_balance', otherwise NULL.
--   * payment_trigger is NOT tied to payment_structure (slice 6 will model full-advance timing).
--   * A null p_terms is treated as {} (keep everything).
begin;

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
  k jsonb := coalesce(p_terms, '{}'::jsonb);
  trig text := case
    when (k ? 'payment_basis') or (k ? 'payment_trigger') then
      case nullif(k ->> 'payment_basis', '')
        when 'going_live' then 'Days after posting'
        when 'invoice'    then 'On approval'
        else nullif(k ->> 'payment_trigger', '') end
    else t.payment_trigger end;
  fixed date := case when trig = 'Fixed date' then
      case when k ? 'fixed_date' then nullif(k ->> 'fixed_date', '')::date
           else (t.dates ->> 'fixed_date')::date end end;
  structure text := case when k ? 'payment_structure' then nullif(k ->> 'payment_structure', '')
                         else t.payment_structure end;
begin
  if t.status <> 'draft' then
    raise exception 'Only a draft can be edited. Create a new version first.' using errcode = '55000';
  end if;

  update public.deals
     set brand_name = coalesce(p_brand_name, ''), brand_email = nullif(p_brand_email, ''),
         brand_contact = nullif(p_brand_contact, ''), source = nullif(p_source, ''),
         title = coalesce(nullif(k ->> 'deliverables_text', ''), title),
         payment_due_date = fixed
   where id = d.id;

  update public.deal_terms
     set deliverables = case when k ? 'deliverables_text'
           then jsonb_build_object('text', coalesce(k ->> 'deliverables_text', ''), 'items', '[]'::jsonb)
           else deliverables end,
         amount_paise = case when k ? 'amount_paise'
           then coalesce(nullif(k ->> 'amount_paise', '')::bigint, 0) else amount_paise end,
         dates = case when fixed is not null then jsonb_build_object('fixed_date', fixed) else '{}'::jsonb end,
         usage_rights = case when k ? 'usage_rights' then nullif(k ->> 'usage_rights', '') else usage_rights end,
         exclusivity = case when k ? 'exclusivity' then nullif(k ->> 'exclusivity', '') else exclusivity end,
         revisions_included = case when k ? 'revisions_included'
           then coalesce(nullif(k ->> 'revisions_included', '')::int, 2) else revisions_included end,
         payment_due_days = case when k ? 'payment_due_days'
           then nullif(k ->> 'payment_due_days', '')::int else payment_due_days end,
         payment_trigger = trig,
         whitelisting = case when k ? 'whitelisting' then nullif(k ->> 'whitelisting', '') else whitelisting end,
         notes = case when k ? 'notes' then nullif(k ->> 'notes', '') else notes end,
         first_draft_date = case when k ? 'first_draft_date'
           then nullif(k ->> 'first_draft_date', '')::date else first_draft_date end,
         final_delivery_date = case when k ? 'final_delivery_date'
           then nullif(k ->> 'final_delivery_date', '')::date else final_delivery_date end,
         payment_structure = structure,
         advance_percent = case when structure = 'advance_balance' then
           case when k ? 'advance_percent' then nullif(k ->> 'advance_percent', '')::int
                else advance_percent end end
   where id = t.id;

  perform public._log(d.id, 'creator', 'draft_updated', 'Draft updated', 'Terms v' || t.version, 'neutral');
end $$;

notify pgrst, 'reload schema';

commit;
