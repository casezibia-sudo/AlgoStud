// Supabase implementation of the API.
// Slice 2: deals, versioned terms, events and templates are real tables written only through SQL
// functions (see dealsRemote.ts). Everything else (links, answers, submissions, payments, reminders)
// still reuses the logic in local.ts on an in-memory copy of the account, and the changed rows are
// diffed and written to the document tables. Brand-side calls go to the `brand` edge function.
import { localApi, localInternals } from './local';
import { sb, remoteEnabled } from './supabase';
import { applyDealData, headerArgs, loadDealData, rpc, templateTerms, termsArgs } from './dealsRemote';
import { isUnbuilt, LATER, warnOnce } from './safe';
import type { Account, Answer, AnswerInput, BrandLinkView, Creator, DbStage, Deal, DealDraft, Submission, Template, WorkAnswerInput } from './types';

type Doc = Record<string, unknown> & { dealId?: string };
const TABLES: { field: keyof Account; table: string; key: (x: any) => string }[] = [
  { field: 'links', table: 'links', key: x => x.token },
  { field: 'answers', table: 'answers', key: x => `${x.token}:${x.item || ''}` },
  { field: 'submissions', table: 'submissions', key: x => x.id },
  { field: 'verifications', table: 'verifications', key: x => `${x.dealId}:${x.device}:${x.at}` },
  { field: 'payments', table: 'payments', key: x => x.id },
  { field: 'reminders', table: 'reminders', key: x => `${x.dealId}:${x.at}` },
];
// Tables for features not built yet are skipped entirely (see safe.ts), so only LIVE ones are read or written.
const LIVE = TABLES.filter(t => !isUnbuilt(t.table));
// Only say so when Supabase is actually in use; the local demo has no such tables to skip.
if (remoteEnabled) TABLES.filter(t => isUnbuilt(t.table)).forEach(t => warnOnce(t.table));
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

let session: { email: string; at: string; userId: string } | null = null;
let synced: Account | null = null;
let queue: Promise<unknown> = Promise.resolve();

async function loadAccount(userId: string, email: string): Promise<Account> {
  // The creator comes from profiles + settings (the old `creators` table is gone). A failure here is a real error.
  const [p, s, ...docs] = await Promise.all([
    sb.from('profiles').select('name, handle, payment_link, deletion_requested_at, deletion_scheduled_for, created_at').eq('id', userId).single(),
    sb.from('settings').select('default_trigger, notify_answers, notify_expiring, notify_due_soon').eq('creator_id', userId).single(),
    ...LIVE.map(t => sb.from(t.table).select('data').eq('user_id', userId)),
  ]);
  if (p.error || !p.data) throw new Error(p.error?.message || 'Profile not found');
  if (s.error || !s.data) throw new Error(s.error?.message || 'Settings not found');
  const creator: Creator = {
    email, name: p.data.name, handle: p.data.handle, paymentLink: p.data.payment_link ?? undefined,
    defaultTrigger: s.data.default_trigger,
    deletion: p.data.deletion_scheduled_for && p.data.deletion_requested_at ? { requestedAt: p.data.deletion_requested_at, scheduledFor: p.data.deletion_scheduled_for } : null,
    createdAt: p.data.created_at,
    prefs: { answers: s.data.notify_answers, expiring: s.data.notify_expiring, dueSoon: s.data.notify_due_soon },
  };
  const a = { creator, deals: [], termsVersions: [], events: [], templates: [], submissions: [], links: [], verifications: [], answers: [], payments: [], reminders: [] } as Account;
  LIVE.forEach((t, i) => { (a as any)[t.field] = (docs[i].data || []).map(r => r.data); });
  // deals, deal_terms, events and templates: any error is thrown, never swallowed.
  applyDealData(a, await loadDealData(a.payments));
  return a;
}

async function push(prev: Account | null, next: Account) {
  const userId = session!.userId;
  const jobs: PromiseLike<unknown>[] = [];
  for (const t of LIVE) {
    const before = new Map(((prev?.[t.field] as Doc[]) || []).map(x => [t.key(x), JSON.stringify(x)]));
    const up: Doc[] = [], seen = new Set<string>();
    for (const x of (next[t.field] as Doc[]) || []) { const k = t.key(x); seen.add(k); if (before.get(k) !== JSON.stringify(x)) up.push(x); }
    const gone = [...before.keys()].filter(k => !seen.has(k));
    if (up.length) jobs.push(sb.from(t.table).upsert(up.map(x => ({ user_id: userId, key: t.key(x), deal_id: x.dealId ?? (t.field === 'deals' ? x.id : null), data: x, updated_at: new Date().toISOString() }))));
    if (gone.length) jobs.push(sb.from(t.table).delete().eq('user_id', userId).in('key', gone));
  }
  const res = await Promise.all(jobs);
  const err = res.find((r: any) => r?.error) as { error: Error } | undefined;
  if (err) throw err.error;
}

function onChange(a: Account | null) {
  if (!session || !a) return;
  const prev = synced, next = clone(a);
  synced = next;
  queue = queue.then(() => push(prev, next)).catch(async e => {
    console.error('[sync] write failed, reloading from server', e);
    await hydrate();
  });
}

async function hydrate() {
  const { data } = await sb.auth.getSession();
  const u = data.session?.user;
  if (!u?.email) { session = null; synced = null; localInternals.hydrate('', null); return; }
  session = { email: u.email, at: new Date().toISOString(), userId: u.id };
  const a = await loadAccount(u.id, u.email);
  synced = clone(a);
  localInternals.hydrate(u.email, a);
}

// ---------- Brand links
const device = () => {
  let id = localStorage.getItem('as.device');
  if (!id) { id = Math.random().toString(36).slice(2); localStorage.setItem('as.device', id); }
  return id;
};
type RemoteView = BrandLinkView & { subs: Record<string, Submission[]> };
const views = new Map<string, RemoteView | null>();
const inflight = new Set<string>();
const call = async <T,>(action: string, body: Record<string, unknown>): Promise<T> => {
  const { data, error } = await sb.functions.invoke('brand', { body: { action, device: device(), ...body } });
  if (error) throw error;
  return data as T;
};
async function refresh(token: string) {
  inflight.add(token);
  try { views.set(token, (await call<{ view: RemoteView | null }>('get', { token })).view); }
  finally { inflight.delete(token); localInternals.notify(); }
}

/** Re-reads deals, terms, events and templates after a change, so every screen shows what the database holds. */
async function refreshDeals() {
  if (!session) return;
  const data = await loadDealData(localApi.snapshot().account?.payments);
  localInternals.patch(a => applyDealData(a, data));
}
/** Runs a database write, then refreshes. Errors surface to the caller as Error(message). */
async function write<T>(fn: () => Promise<T>): Promise<T> {
  try { return await fn(); } finally { await refreshDeals(); }
}
const dealOf = (id: string): Deal => {
  const d = localApi.snapshot().account?.deals.find(x => x.id === id);
  if (!d) throw new Error('Not found');
  return d;
};
/** The form fields for a deal, as the UI shows them. */
const draftOf = (d: Deal): DealDraft => ({
  brand: d.brand, contact: d.contact, email: d.email, del: d.del, n: d.n, due: d.due, trigger: d.trigger,
  usage: d.usage, rev: d.rev, notes: d.notes, src: d.src,
  // update_draft_terms overwrites these, so they must travel with every save or an edit would clear them.
  firstDraftDate: d.firstDraftDate, finalDeliveryDate: d.finalDeliveryDate,
  paymentStructure: d.paymentStructure, advancePercent: d.advancePercent,
});
const saveDraft = (id: string, f: DealDraft) =>
  rpc('update_draft_terms', { p_deal_id: id, ...headerArgs(f), p_terms: termsArgs(f) });

export const remoteApi = {
  ...localApi,

  deals: {
    ...localApi.deals,
    async create(draft: DealDraft) {
      return write(() => rpc<string>('create_deal', { ...headerArgs(draft), p_title: draft.del, p_terms: termsArgs(draft), p_source_message: draft.message?.trim() || null }));
    },
    async update(id: string, fields: Partial<DealDraft>) {
      const d = dealOf(id);
      if (d.dbStage !== 'draft') throw new Error('Only drafts can be edited directly. Send a new version instead.');
      await write(() => saveDraft(id, { ...draftOf(d), ...fields }));
    },
    /** Soft delete: the row stays, with its audit history. */
    async remove(id: string) { await write(() => rpc('delete_deal', { p_deal_id: id })); },
    async cancel(id: string) { await write(() => rpc('update_stage', { p_deal_id: id, p_to: 'cancelled' })); },
    /** Locks the draft terms and moves the deal to Sent. No brand link exists yet. */
    async sendLink(dealId: string, channel: string, _opts: { replaces?: number; token?: string } = {}) {
      await write(() => rpc('send_terms', { p_deal_id: dealId, p_channel: channel }));
      return '';
    },
    /** Sent or confirmed terms are locked: start version N+1 as a draft, fill it in, then send it. */
    async sendNewVersion(dealId: string, fields: Partial<DealDraft>, channel: string, _token?: string) {
      const d = dealOf(dealId);
      await write(async () => {
        if (d.dbStage !== 'draft') await rpc('revise_terms', { p_deal_id: dealId });
        await saveDraft(dealId, { ...draftOf(d), ...fields });
        await rpc('send_terms', { p_deal_id: dealId, p_channel: channel });
      });
      return '';
    },
    async addPosting(id: string, date: string) { await write(() => rpc('set_posting_date', { p_deal_id: id, p_date: date })); },

    // Creator-only tools that exist only in Supabase mode (check isRemote before calling).
    async setStage(id: string, to: DbStage, paidAt?: string) { await write(() => rpc('update_stage', { p_deal_id: id, p_to: to, p_paid_at: paidAt ?? null })); },
    async archive(id: string) { await write(() => rpc('archive_deal', { p_deal_id: id })); },
    async unarchive(id: string) { await write(() => rpc('unarchive_deal', { p_deal_id: id })); },
    async duplicate(id: string) { return write(() => rpc<string>('duplicate_deal', { p_deal_id: id })); },
    async saveAsTemplate(id: string, name: string) { return write(() => rpc<string>('create_template_from_deal', { p_deal_id: id, p_name: name })); },
  },

  templates: {
    async add(t: Omit<Template, 'id' | 'used'>) { await write(() => rpc('create_template', { p_name: t.name, p_terms: templateTerms(t) })); },
    async update(id: string, p: Partial<Template>) {
      const t = localApi.snapshot().account?.templates.find(x => x.id === id);
      if (!t) throw new Error('Not found');
      const m = { ...t, ...p };
      await write(() => rpc('update_template', { p_id: id, p_name: m.name, p_terms: templateTerms(m) }));
    },
    async remove(id: string) { await write(() => rpc('delete_template', { p_id: id })); },
    async use(id: string) { await write(() => rpc('use_template', { p_id: id })); },
    /** New draft deal with the template's terms. Returns the deal id. */
    async createDeal(id: string) { return write(() => rpc<string>('create_deal_from_template', { p_template_id: id })); },
  },

  work: {
    ...localApi.work,
    async submit(_dealId: string, _item: string, _sub: { link: string; note?: string }): Promise<string> {
      throw new Error('Deliverable tracking arrives in a later update. Mark the deal as submitted instead.');
    },
  },

  payments: {
    ...localApi.payments,
    /** There is no payments table yet, so the only thing recorded is the deal moving to Paid (full amount only). */
    async markPaid(id: string, p: { amount: number; date: string; ref: string }) {
      const d = dealOf(id);
      if (p.amount < d.n) throw new Error(LATER('Recording part payments'));
      await write(() => rpc('update_stage', { p_deal_id: id, p_to: 'paid', p_paid_at: p.date }));
    },
    async logReminder(_id: string, _channel: string, _kind: 'payment' | 'approval' | 'terms', _text?: string) {
      throw new Error(LATER('Logging reminders'));
    },
  },

  auth: {
    session: () => (session ? { email: session.email, at: session.at } : null),
    isKnown: (_email: string) => true,
    /** Supabase emails a 6-digit code (set the Magic Link template to show {{ .Token }}). */
    async requestCode(email: string) {
      const { error } = await sb.auth.signInWithOtp({ email: email.trim().toLowerCase(), options: { shouldCreateUser: true } });
      if (error) throw error;
      return { demoCode: '' };
    },
    async verifyCode(email: string, code: string) {
      const { error } = await sb.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code.trim(), type: 'email' });
      return error ? { ok: false as const, error: 'That code doesn\'t match or has expired.' } : { ok: true as const };
    },
    async signIn(_email: string, profile?: Partial<Creator>) {
      await hydrate();
      if (profile) await localApi.creator.update(profile);
    },
    async signOut() { await sb.auth.signOut(); session = null; synced = null; localInternals.hydrate('', null); },
  },

  brand: {
    ...localApi.brand,
    /** undefined while loading, null if the link doesn't exist. */
    get(token: string): BrandLinkView | null | undefined {
      if (!views.has(token) && !inflight.has(token)) void refresh(token);
      return views.get(token);
    },
    open(token: string) { void call('open', { token }).then(() => refresh(token)); },
    async requestCode(token: string) { const r = await call<{ demoCode: string }>('requestCode', { token }); void refresh(token); return r; },
    async verify(token: string, code: string) {
      const r = await call<{ ok: true } | { ok: false; error: string }>('verify', { token, code });
      await refresh(token); return r;
    },
    async answer(token: string, answer: AnswerInput): Promise<Answer | null> {
      const r = await call<{ answer: Answer | null }>('answer', { token, answer }); await refresh(token); return r.answer;
    },
    async answerWork(token: string, item: string, answer: WorkAnswerInput): Promise<Answer | null> {
      const r = await call<{ answer: Answer | null }>('answerWork', { token, item, answer }); await refresh(token); return r.answer;
    },
    subs: (token: string, item: string): Submission[] => views.get(token)?.subs[item] || [],
  },

  /** Loads the demo deals into the signed-in account and saves them to Supabase. */
  reset() {
    if (!session) return;
    const prev = synced;
    const a = localInternals.seedAccount(session.email, synced?.creator || {});
    localInternals.hydrate(session.email, a);
    synced = prev;
    onChange(a);
  },
};

export function startRemote() {
  localInternals.remoteMode();
  localInternals.onEmit(onChange);
  void hydrate();
  sb.auth.onAuthStateChange(ev => { if (ev === 'SIGNED_IN' || ev === 'SIGNED_OUT') void hydrate(); });
}
