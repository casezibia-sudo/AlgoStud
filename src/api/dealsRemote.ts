// Supabase side of slice 2: loads deals, terms, events and templates, and converts between
// the database shape (paise, nine stages, one row per terms version) and the UI shape in types.ts
// (rupees, Deal/Template/TermsVersion/DealEvent). Every write is an RPC; nothing here writes tables directly.
import { sb } from './supabase';
import { localApi, itemNames } from './local';
import type { Account, Deal, DealDraft, DealEvent, DbStage, Stage, Template, TermsVersion, Tone, Trigger } from './types';
import { fmtDate } from '@/lib/format';

interface DealRow {
  id: string; brand_name: string; brand_email: string | null; brand_contact: string | null; source: string | null;
  title: string; stage: DbStage; current_version: number; payment_due_date: string | null; posted_at: string | null;
  paid_at: string | null; archived_at: string | null; created_at: string;
}
interface TermsRow {
  deal_id: string; version: number; status: string; deliverables: { text?: string }; amount_paise: number;
  dates: { fixed_date?: string }; usage_rights: string | null; revisions_included: number; payment_due_days: number | null;
  payment_trigger: Trigger | null; notes: string | null; sent_at: string | null; confirmed_at: string | null; created_at: string;
}
interface EventRow { id: string; deal_id: string; actor_type: DealEvent['actor']; type: string; payload: Record<string, any>; created_at: string }
interface TemplateRow { id: string; name: string; terms: Record<string, any> }

export interface DealData { deals: Deal[]; termsVersions: TermsVersion[]; events: DealEvent[]; templates: Template[] }

// ---------- rupees <-> paise, display text <-> columns
export const toPaise = (rupees: number) => Math.round((Number(rupees) || 0) * 100);
export const toRupees = (paise: number) => Number(paise || 0) / 100;

const UI_STAGE: Record<DbStage, Stage> = {
  draft: 'draft', sent: 'sent', confirmed: 'confirmed', in_progress: 'wip', submitted: 'submitted',
  approved: 'approved', invoiced: 'due', paid: 'paid', cancelled: 'cancelled',
};

/** "15 days", "30 days after posting", "On approval + 15 days" -> 15 / 30 / 15. */
const parseDays = (s?: string | null) => { const m = String(s ?? '').match(/\d+/); return m ? +m[0] : null; };

/** "15 Nov 2026" or "2026-11-15" -> "2026-11-15" (local date, never shifted by time zone). */
function parseDate(s?: string | null): string | null {
  const t = String(s ?? '').trim();
  if (!t) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  const d = new Date(t);
  if (isNaN(+d)) throw new Error('Enter the due date like 15 Nov 2026.');
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** The p_terms object the SQL functions expect. */
export function termsArgs(f: Partial<DealDraft>) {
  const fixed = f.trigger === 'Fixed date';
  return {
    deliverables_text: f.del ?? '',
    amount_paise: toPaise(f.n ?? 0),
    usage_rights: f.usage ?? '',
    revisions_included: parseDays(f.rev) ?? 1,
    payment_trigger: f.trigger ?? null,
    payment_due_days: fixed ? null : parseDays(f.due),
    fixed_date: fixed ? parseDate(f.due) : null,
    notes: f.notes ?? '',
  };
}
export const headerArgs = (f: Partial<DealDraft>) => ({
  p_brand_name: f.brand ?? '', p_brand_email: f.email ?? '', p_brand_contact: f.contact ?? '', p_source: f.src ?? '',
});

/** What the form shows for "payment due" is computed here from columns; the display string is never stored. */
function dueText(t: Pick<TermsRow, 'payment_trigger' | 'payment_due_days' | 'dates'>): string | null {
  if (t.payment_trigger === 'Fixed date') return t.dates?.fixed_date ? fmtDate(t.dates.fixed_date) : null;
  return t.payment_due_days == null ? null : `${t.payment_due_days} days`;
}

function toDeal(r: DealRow, t: TermsRow, received: number): Deal {
  const del = t.deliverables?.text || '';
  const d: Deal = {
    id: r.id, brand: r.brand_name, contact: r.brand_contact || '', email: r.brand_email || '', del,
    first: itemNames({ del })[0] || '', n: toRupees(t.amount_paise),
    stage: r.archived_at ? 'archived' : UI_STAGE[r.stage], dbStage: r.stage,
    due: dueText(t), trigger: t.payment_trigger || 'On approval', usage: t.usage_rights || null,
    rev: `${t.revisions_included} included`, src: r.source || 'Manual', version: r.current_version,
    notes: t.notes || undefined, openedAt: null,
    sentAt: t.sent_at || undefined, confirmedAt: t.confirmed_at || undefined,
    confirmedVersion: t.confirmed_at ? t.version : undefined,
    dueISO: r.payment_due_date || undefined, postedAt: r.posted_at || undefined, paidAt: r.paid_at || undefined,
    archivedAt: r.archived_at || undefined, createdAt: r.created_at || undefined, received: received || undefined,
  };
  if (r.stage === 'draft') d.missing = localApi.deals.missing(d);
  return d;
}

const toEvent = (e: EventRow): DealEvent => ({
  id: e.id, dealId: e.deal_id, actor: e.actor_type, tone: (e.payload.tone as Tone) || 'neutral',
  title: e.payload.title || e.type, detail: e.payload.detail || undefined, icon: e.payload.icon || undefined, at: e.created_at,
});

const usageLabel = (full: string) => { const m = full.match(/\d+ days/); return m ? m[0] + ' usage' : 'Usage not set'; };
const toTemplate = (r: TemplateRow): Template => ({
  id: r.id, name: r.name, del: r.terms.deliverables_text || '', usage: usageLabel(r.terms.usage_rights || ''),
  usageFull: r.terms.usage_rights || '', trigger: r.terms.payment_trigger || 'On approval',
  rev: `${r.terms.revisions_included ?? 1} included`, used: Number(r.terms.used || 0),
});
export const templateTerms = (t: Pick<Template, 'del' | 'usageFull' | 'trigger' | 'rev'>) => ({
  deliverables_text: t.del, usage_rights: t.usageFull, payment_trigger: t.trigger, revisions_included: parseDays(t.rev) ?? 1,
});

const need = <T,>(r: { data: T | null; error: { message: string } | null }): T => {
  if (r.error) throw new Error(r.error.message);
  return r.data as T;
};

export async function loadDealData(payments: Account['payments'] = []): Promise<DealData> {
  const [deals, terms, events, templates] = await Promise.all([
    sb.from('deals').select('*').is('deleted_at', null).order('created_at', { ascending: false }),
    sb.from('deal_terms').select('*').order('version', { ascending: false }),
    sb.from('events').select('*').order('created_at', { ascending: false }),
    sb.from('templates').select('id, name, terms').order('created_at', { ascending: false }),
  ]);
  const dealRows = need<DealRow[]>(deals) || [];
  const termRows = need<TermsRow[]>(terms) || [];
  const byDeal = new Map<string, TermsRow[]>();
  termRows.forEach(t => byDeal.set(t.deal_id, [...(byDeal.get(t.deal_id) || []), t]));
  const liveIds = new Set(dealRows.map(r => r.id));
  const got = (id: string) => payments.filter(p => p.dealId === id).reduce((s, p) => s + p.amount, 0);

  const out: DealData = { deals: [], termsVersions: [], events: [], templates: [] };
  for (const r of dealRows) {
    const list = byDeal.get(r.id) || [];
    const cur = list.find(t => t.version === r.current_version);
    if (!cur) continue;
    const d = toDeal(r, cur, got(r.id));
    out.deals.push(d);
    // Earlier versions only; the current one is the deal itself.
    for (const t of list) {
      if (t.version >= r.current_version) continue;
      out.termsVersions.push({
        dealId: r.id, n: t.version, at: t.sent_at || t.created_at,
        status: t.confirmed_at ? 'confirmed' : t.status === 'superseded' ? 'replaced' : t.status,
        terms: { brand: r.brand_name, contact: r.brand_contact || '', del: t.deliverables?.text || '', n: toRupees(t.amount_paise), due: dueText(t), trigger: t.payment_trigger || 'On approval', usage: t.usage_rights || null, rev: `${t.revisions_included} included` },
      });
    }
  }
  out.events = (need<EventRow[]>(events) || []).filter(e => liveIds.has(e.deal_id)).map(toEvent);
  out.templates = (need<TemplateRow[]>(templates) || []).map(toTemplate);
  return out;
}

/** Copies loaded database data into the in-memory account. Everything else in the account is left alone. */
export function applyDealData(a: Account, data: DealData) {
  a.deals = data.deals.map(d => {
    const rem = a.reminders.filter(r => r.dealId === d.id).sort((x, y) => y.at.localeCompare(x.at));
    const paid = a.payments.filter(p => p.dealId === d.id);
    return { ...d, received: d.dbStage === 'paid' ? d.n : paid.reduce((s, p) => s + p.amount, 0) || undefined, ref: paid[paid.length - 1]?.ref || undefined,
      reminders: rem.length || undefined, lastReminderAt: rem[0]?.at, lastReminderChannel: rem[0]?.channel };
  });
  a.termsVersions = data.termsVersions;
  a.events = data.events;
  a.templates = data.templates;
}

/** Calls a SQL function and throws its message (RLS and the transition rules report errors this way). */
export async function rpc<T = unknown>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
  const { data, error } = await sb.rpc(fn, args);
  if (error) throw new Error(error.message);
  return data as T;
}
