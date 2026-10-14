// Local implementation of the AlgoStudio API. Persists to localStorage.
// Every method mirrors a backend endpoint (see README → "Swapping in the backend").
import { SEED } from './seed';
import type {
  Account, Answer, AnswerInput, BrandLinkView, Creator, Deal, DealDraft, DealEvent, Item, Link, Prefs,
  Stage, Submission, Template, TermsVersion, WorkAnswerInput,
} from './types';
import { DAY, fmtDate, mask, firstName, inr } from '@/lib/format';

const KEY = 'algostudio.vite.v1';
const SCHEMA = 1;
const MIN = 6e4;
const CODE_TTL = 10 * MIN;
const CODE_TRIES = 3;

interface Store { schema: number; session: { email: string; at: string } | null; accounts: Record<string, Account> }
interface PendingCode { code: string; expires: number; tries: number }

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
const norm = (e: string) => String(e || '').trim().toLowerCase();
const uid = (p: string) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const iso = (ms = 0) => new Date(Date.now() + ms).toISOString();

// Opaque link token: 128 random bits, base64url. Carries no deal id or version.
export const tok = () => {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const sixDigits = () => String(Math.floor(100000 + Math.random() * 900000));

const FMT: Record<string, string> = { Reel: 'Reel, 30–60 seconds', Story: 'Story, up to 15 seconds', Post: 'Feed post', Video: 'Video' };
export const itemNames = (d: Pick<Deal, 'del'>) => {
  const out: string[] = [];
  String(d.del || '').split(/,\s*/).forEach(p => {
    const m = p.match(/(\d+)\s*x?\s*(\w+)/i);
    if (!m) return;
    const t = m[2].replace(/ies$/, 'y').replace(/s$/, '');
    const T = t[0].toUpperCase() + t.slice(1);
    for (let i = 1; i <= +m[1]; i++) out.push(T + ' ' + i);
  });
  return out;
};
const mkItems = (d: Deal, due?: string | null) => {
  const o: Record<string, Item> = {};
  itemNames(d).forEach(n => { o[n] = { state: 'todo', v: 0, due: due || null, platform: 'Instagram', format: FMT[n.split(' ')[0]] || n.split(' ')[0] }; });
  return o;
};
const WORK: Stage[] = ['confirmed', 'wip', 'submitted', 'revision', 'approved'];

const newAccount = (email: string, p: Partial<Creator> = {}): Account => ({
  creator: { ...p, email, name: p.name || '', handle: p.handle || '', deletion: null, createdAt: iso() },
  deals: [], termsVersions: [], submissions: [], links: [], verifications: [], answers: [], payments: [], events: [], templates: [], reminders: [],
});

const ev = (a: Account, dealId: string, e: Partial<DealEvent> & { title: string }) =>
  a.events.unshift({ id: uid('e'), dealId, actor: 'creator', tone: 'info', at: iso(), ...e });

// ---------- Seed: every seeded deal gets real links, answers, submissions and events
function seedDeal(a: Account, d: Deal, now: number) {
  const at = (ms: number) => new Date(now - ms).toISOString();
  const day = (ms: number) => new Date(now + ms).toISOString().slice(0, 10);
  const E = (actor: DealEvent['actor'], tone: DealEvent['tone'], title: string, detail: string | undefined, ms: number, icon?: string) =>
    a.events.push({ id: uid('e'), dealId: d.id, actor, tone, title, detail, icon, at: at(ms) });
  const s = d.stage, v = d.version || 1, em = mask(d.email), fn = firstName(d.contact);
  if (s === 'draft') return;
  const sentMs = ({ expired: 13 * DAY, declined: 10 * DAY, cancelled: 20 * DAY, sent: 2 * DAY } as Record<string, number>)[s] || 14 * DAY;
  const link: Link = { token: tok(), dealId: d.id, kind: 'd', version: v, channel: d.src, createdAt: at(sentMs), expiresAt: new Date(now - sentMs + 7 * DAY).toISOString(), firstOpenedAt: null, state: 'active' };
  if (v > 1) {
    const old: Link = { ...link, token: tok(), version: v - 1, createdAt: at(sentMs + 2 * DAY), expiresAt: new Date(now - sentMs + 5 * DAY).toISOString(), state: 'replaced' };
    a.links.push(old);
    a.termsVersions.push({ dealId: d.id, n: v - 1, terms: { brand: d.brand, contact: d.contact, del: d.del, n: d.n - 3000, due: d.due, trigger: d.trigger, usage: d.usage, rev: d.rev }, status: 'replaced', at: at(sentMs) });
    E('creator', 'info', `Terms v${v - 1} sent`, `${d.src} · link expires ${fmtDate(old.expiresAt!)}`, sentMs + 2 * DAY);
  }
  E('creator', 'info', `Terms v${v} sent`, `${d.src} · link expires ${fmtDate(link.expiresAt!)}${v > 1 ? ` · replaces v${v - 1}` : ''}`, sentMs);
  d.sentAt = link.createdAt; d.expiresAt = link.expiresAt!;
  const opened = (ms: number) => { link.firstOpenedAt = at(ms); E('system', 'neutral', 'Link opened', `Terms v${v} · ${fn}`, ms, 'eye'); };
  const verified = (ms: number) => { E('system', 'neutral', 'Code sent to ' + em, undefined, ms + 5 * MIN, 'mail'); E('brand', 'neutral', 'Code verified', 'This device can answer for 30 days', ms + 2 * MIN, 'shield-check'); };
  if (s === 'sent') { opened(10 * MIN); d.openedAt = link.firstOpenedAt; }
  if (s === 'expired') { link.state = 'expired'; d.expiredAt = link.expiresAt!; E('system', 'critical', 'Link expired', `Terms v${v} · ${d.brand} didn't answer`, now - Date.parse(link.expiresAt!)); }
  if (s === 'cancelled') { opened(19 * DAY); link.state = 'cancelled'; d.cancelledAt = at(16 * DAY); E('creator', 'neutral', 'Deal cancelled', d.brand + ' was told', 16 * DAY, 'x'); }
  if (s === 'declined') { opened(9 * DAY); verified(8 * DAY); link.state = 'answered'; a.answers.push({ token: link.token, type: 'decline', reason: d.reason, at: at(8 * DAY) }); d.declinedAt = at(8 * DAY); E('brand', 'neutral', 'Declined by ' + d.contact, 'Reason: ' + d.reason, 8 * DAY, 'ban'); }
  a.links.push(link);
  if (!['confirmed', 'wip', 'submitted', 'revision', 'approved', 'due', 'overdue', 'paid', 'archived'].includes(s)) return;
  opened(13 * DAY); verified(12 * DAY); link.state = 'answered';
  a.answers.push({ token: link.token, type: 'confirm', name: d.contact, at: at(12 * DAY) });
  Object.assign(d, { confirmedAt: at(12 * DAY), confirmedBy: d.contact, confirmedVersion: v });
  E('brand', 'positive', `Terms v${v} confirmed by ${d.contact}`, 'Verified by code sent to ' + em, 12 * DAY);
  const dueBy = ({ confirmed: 8 * DAY, wip: 4 * DAY, revision: 2 * DAY } as Record<string, number>)[s];
  d.items = mkItems(d, dueBy ? day(dueBy) : day(-5 * DAY));
  if (s === 'confirmed') d.stage = 'wip';
  if (s === 'confirmed' || s === 'wip') return;
  const names = Object.keys(d.items);
  const sub = (n: string, ms: number, state: Submission['state'], extra: Partial<Submission> = {}) => {
    const x: Submission = { id: uid('s'), dealId: d.id, item: n, v: 1, link: 'https://drive.google.com/file/d/' + tok().slice(0, 12) + '/view', caption: '', note: '', at: at(ms), state, ...extra };
    a.submissions.push(x); E('creator', 'info', `${n} v1 sent for approval`, x.link, ms); return x;
  };
  if (s === 'submitted') {
    names.forEach(n => { sub(n, 3 * DAY, 'sent'); d.items![n] = { ...d.items![n], state: 'submitted', v: 1, sentAt: at(3 * DAY) }; });
    d.submittedAt = at(3 * DAY);
    a.links.push({ token: tok(), dealId: d.id, kind: 'a', version: 1, items: names, createdAt: at(3 * DAY), expiresAt: null, firstOpenedAt: null, state: 'active' });
    return;
  }
  const alink: Link = { token: tok(), dealId: d.id, kind: 'a', version: 1, items: names, createdAt: at(6 * DAY), expiresAt: null, firstOpenedAt: at(5 * DAY + MIN * 30), state: 'answered' };
  a.links.push(alink);
  E('system', 'neutral', 'Approval link opened', names.join(', ') + ' · ' + fn, 5 * DAY + MIN * 30, 'eye');
  names.forEach((n, i) => {
    const rev = s === 'revision' && n === d.first;
    sub(n, 6 * DAY, rev ? 'revision' : 'approved', rev ? { feedback: d.notes } : { approvedBy: d.contact, approvedAt: at(5 * DAY - i * MIN) });
    if (rev) {
      d.items![n] = { ...d.items![n], state: 'revision', v: 1, revs: 1, feedback: { note: d.notes || '', at: at(DAY), by: d.contact, v: 1 } };
      a.answers.push({ token: alink.token, item: n, type: 'revision', note: d.notes || '', at: at(DAY) });
      E('brand', 'warning', `Revision requested on ${n} v1`, `“${d.notes}”`, DAY);
    } else {
      d.items![n] = { ...d.items![n], state: 'approved', v: 1, by: d.contact, at: at(5 * DAY - i * MIN) };
      a.answers.push({ token: alink.token, item: n, type: 'approve', name: d.contact, at: at(5 * DAY - i * MIN) });
      E('brand', 'positive', `${n} v1 approved by ${d.contact}`, 'Verified by code sent to ' + em, 5 * DAY - i * MIN);
    }
  });
  if (s === 'revision') return;
  Object.assign(d, { approvedAt: at(5 * DAY), approvedBy: d.contact });
  if (s === 'due') { d.dueISO = day(3 * DAY); d.due = fmtDate(d.dueISO); }
  if (s === 'overdue') {
    d.dueISO = day(-5 * DAY); d.due = fmtDate(d.dueISO); d.stage = 'due';
    const txt = `Hi ${fn}, a reminder that ${inr(d.n)} for ${d.del} was due on ${d.due}. You can pay here: upi://pay?pa=ananya@okhdfc. Thanks, Ananya`;
    Object.assign(d, { lastReminderAt: at(2 * DAY), lastReminderChannel: 'WhatsApp', reminders: 1 });
    a.reminders.push({ dealId: d.id, kind: 'payment', channel: 'WhatsApp', text: txt, at: at(2 * DAY) });
    E('creator', 'info', 'Payment reminder sent', `WhatsApp · “${txt}”`, 2 * DAY);
  }
  if (s === 'paid' || s === 'archived') {
    const pm = s === 'paid' ? 4 * DAY : 31 * DAY;
    d.dueISO = day(-pm); d.due = fmtDate(d.dueISO);
    const date = day(-pm);
    a.payments.push({ id: uid('p'), dealId: d.id, amount: d.n, date, ref: d.ref || '', at: at(pm) });
    d.paidAt = date; d.received = d.n;
    E('creator', 'positive', `Marked ${inr(d.n)} as paid`, `Received ${fmtDate(date)}${d.ref ? ' · ref ' + d.ref : ''}`, pm);
    if (s === 'archived') { d.archivedAt = at(22 * DAY); E('creator', 'neutral', 'Deal archived', undefined, 22 * DAY, 'archive'); }
  }
}

function seedState(): Store {
  const e = norm(SEED.creator.email);
  const a = newAccount(e, SEED.creator);
  a.deals = clone(SEED.deals).map(d => ({ ...d, seed: true }));
  a.templates = clone(SEED.templates);
  const now = Date.now();
  a.deals.forEach(d => seedDeal(a, d, now));
  a.events.sort((x, y) => y.at.localeCompare(x.at));
  return { schema: SCHEMA, session: null, accounts: { [e]: a } };
}

const device = () => {
  let id = localStorage.getItem('as.device');
  if (!id) { id = Math.random().toString(36).slice(2); localStorage.setItem('as.device', id); }
  return id;
};

// Stage from deliverables (Deliverables spec §1)
const recalc = (d: Deal) => {
  if (!WORK.includes(d.stage) || !d.items) return;
  const it = d.items, ns = Object.keys(it);
  const by = (st: Item['state']) => ns.filter(n => it[n].state === st);
  const byDue = (l: string[]) => [...l].sort((x, y) => String(it[x].due || '9').localeCompare(String(it[y].due || '9')));
  if (by('revision').length) { d.stage = 'revision'; d.first = by('revision')[0]; return; }
  if (by('todo').length) { d.stage = 'wip'; d.first = byDue(by('todo'))[0]; return; }
  if (by('submitted').length) { d.stage = 'submitted'; d.first = by('submitted')[0]; return; }
  d.stage = 'approved';
  const last = ns.map(n => it[n]).sort((x, y) => String(y.at).localeCompare(String(x.at)))[0];
  d.approvedAt = last?.at || iso(); d.approvedBy = last?.by;
  if (!d.dueISO && d.trigger === 'On approval') {
    const m = String(d.due || '').match(/(\d+) days/);
    d.dueISO = new Date(Date.parse(d.approvedAt) + (m ? +m[1] : 0) * DAY).toISOString().slice(0, 10);
    d.due = fmtDate(d.dueISO);
  }
  if (d.dueISO && d.trigger !== 'Days after posting' && d.trigger !== 'On posting') d.stage = 'due';
};

// ---------- State
let state: Store = load();
const codes = new Map<string, PendingCode>();
const listeners = new Set<() => void>();
let snap: { v: number; account: Account | null; session: Store['session'] } = { v: 0, account: acct(), session: state.session };

function load(): Store {
  try {
    const old = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (old && old.schema === SCHEMA && old.accounts) return old;
  } catch { /* fall through to seed */ }
  return seedState();
}
function acct(): Account | null { return (state?.session && state.accounts[state.session.email]) || null; }
let persistLocal = true;
const emitHooks = new Set<(a: Account | null) => void>();
function notify() { snap = { v: snap.v + 1, account: acct(), session: state.session }; listeners.forEach(l => l()); }
function emit() {
  if (persistLocal) try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota */ }
  notify();
  const a = acct(); emitHooks.forEach(h => h(a));
}

/** Used by remote.ts: the same mutation logic runs here, then changes are synced to Supabase. */
export const localInternals = {
  remoteMode() { persistLocal = false; state = { schema: SCHEMA, session: null, accounts: {} }; notify(); },
  hydrate(email: string, a: Account | null) { state = { schema: SCHEMA, session: a ? { email, at: iso() } : null, accounts: a ? { [email]: a } : {} }; notify(); },
  notify,
  onEmit(fn: (a: Account | null) => void) { emitHooks.add(fn); },
  seedAccount(email: string, creator: Partial<Creator>): Account {
    const a = Object.values(seedState().accounts)[0];
    a.creator = { ...a.creator, ...creator, email };
    return a;
  },
};
addEventListener('storage', e => { if (persistLocal && e.key === KEY) { state = load(); snap = { v: snap.v + 1, account: acct(), session: state.session }; listeners.forEach(l => l()); } });

const must = () => { const a = acct(); if (!a) throw new Error('Signed out'); return a; };
const dealOf = (a: Account, id: string) => { const d = a.deals.find(x => x.id === id); if (!d) throw new Error('Not found'); return d; };
const findTok = (token: string) => {
  for (const k in state.accounts) { const a = state.accounts[k]; const l = a.links.find(x => x.token === token); if (l) return { a, l }; }
  return null;
};
const expireSweep = (a: Account) => {
  const now = Date.now(); let ch = false;
  a.links.forEach(l => {
    if (l.kind === 'd' && l.state === 'active' && l.expiresAt && Date.parse(l.expiresAt) < now) {
      l.state = 'expired'; ch = true;
      const d = a.deals.find(x => x.id === l.dealId);
      if (d && d.stage === 'sent' && (d.version || 1) === l.version) { d.stage = 'expired'; d.expiredAt = l.expiresAt; }
      ev(a, l.dealId, { actor: 'system', tone: 'critical', title: 'Link expired', detail: `Terms v${l.version}${d ? ` · ${d.brand} didn't answer` : ''}`, at: l.expiresAt });
    }
  });
  return ch;
};
const checkCode = (key: string, code: string) => {
  const p = codes.get(key);
  if (!p) return { ok: false as const, error: 'Ask for a new code.' };
  if (Date.now() > p.expires) { codes.delete(key); return { ok: false as const, error: 'This code has expired. Ask for a new one.' }; }
  if (p.code !== code.trim()) {
    p.tries++;
    if (p.tries >= CODE_TRIES) { codes.delete(key); return { ok: false as const, error: 'Too many tries. Ask for a new code.' }; }
    return { ok: false as const, error: `That code doesn't match. ${CODE_TRIES - p.tries} ${CODE_TRIES - p.tries === 1 ? 'try' : 'tries'} left.` };
  }
  codes.delete(key);
  return { ok: true as const };
};

const DEFAULT_PREFS: Prefs = { dueSoon: true, expiring: true, answers: true };

// ---------- Public API
export const localApi = {
  subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
  snapshot: () => snap,

  auth: {
    session: () => state.session,
    isKnown: (email: string) => !!state.accounts[norm(email)],
    /** Mock: returns the code so the UI can show it. A real backend emails it. */
    async requestCode(email: string) { const c = sixDigits(); codes.set('login:' + norm(email), { code: c, expires: Date.now() + CODE_TTL, tries: 0 }); return { demoCode: c }; },
    async verifyCode(email: string, code: string) { return checkCode('login:' + norm(email), code); },
    async signIn(email: string, profile?: Partial<Creator>) {
      const e = norm(email);
      if (!state.accounts[e]) state.accounts[e] = newAccount(e, profile);
      else if (profile) Object.assign(state.accounts[e].creator, profile);
      state.session = { email: e, at: iso() }; emit();
    },
    async signOut() { state.session = null; emit(); },
  },

  creator: {
    async update(p: Partial<Creator>) { Object.assign(must().creator, p); emit(); },
    prefs: (): Prefs => ({ ...DEFAULT_PREFS, ...(acct()?.creator.prefs || {}) }),
    async setPref(k: keyof Prefs, val: boolean) { const a = must(); a.creator.prefs = { ...DEFAULT_PREFS, ...a.creator.prefs, [k]: val }; emit(); },
    async scheduleDeletion() { must().creator.deletion = { requestedAt: iso(), scheduledFor: iso(30 * DAY) }; emit(); },
    async cancelDeletion() { must().creator.deletion = null; emit(); },
  },

  deals: {
    sweep() { const a = acct(); if (a && expireSweep(a)) emit(); },
    eventsFor: (id: string) => (acct()?.events || []).filter(e => e.dealId === id),
    versionsFor: (id: string): TermsVersion[] => (acct()?.termsVersions || []).filter(x => x.dealId === id).sort((a, b) => b.n - a.n),
    subsFor: (id: string, item?: string) => (acct()?.submissions || []).filter(x => x.dealId === id && (!item || x.item === item)).sort((a, b) => b.v - a.v),
    paymentsFor: (id: string) => (acct()?.payments || []).filter(p => p.dealId === id),
    items: (d: Deal) => d.items || mkItems(d),
    activeLink(dealId: string, kind: 'd' | 'a' = 'd') {
      return (acct()?.links || []).filter(l => l.dealId === dealId && l.kind === kind).sort((x, y) => y.createdAt.localeCompare(x.createdAt))[0] || null;
    },
    linkUrl: (token: string) => { const f = findTok(token); return `${location.origin}/${f ? f.l.kind : 'd'}/${token}`; },

    /** Server decides what's missing before a deal can be sent. */
    missing(d: Partial<DealDraft>) {
      const m: string[] = [];
      if (!d.brand) m.push('brand');
      if (!d.email) m.push('brand contact email');
      if (!d.del) m.push('deliverables');
      if (!d.n) m.push('amount');
      if (!d.due) m.push('payment due date');
      if (!d.usage) m.push('usage rights');
      return m;
    },
    async create(draft: DealDraft) {
      const a = must();
      const d: Deal = { id: uid('d'), stage: 'draft', first: itemNames(draft)[0] || '', src: draft.src || 'Manual', ...draft };
      d.missing = localApi.deals.missing(d);
      a.deals.unshift(d);
      ev(a, d.id, { title: 'Draft created', tone: 'neutral' });
      emit(); return d.id;
    },
    async update(id: string, fields: Partial<DealDraft>) {
      const d = dealOf(must(), id);
      if (d.stage !== 'draft') throw new Error('Only drafts can be edited directly. Send a new version instead.');
      Object.assign(d, fields); d.missing = localApi.deals.missing(d); d.first = itemNames(d)[0] || d.first; emit();
    },
    async remove(id: string) {
      const a = must(); const d = dealOf(a, id);
      if (d.stage !== 'draft') throw new Error('Only never-sent drafts can be deleted.');
      a.deals = a.deals.filter(x => x.id !== id); a.events = a.events.filter(e => e.dealId !== id); emit();
    },
    /** Idempotent on retries: if an active link exists for this version, it is reused. */
    /** Reserve a token before the share sheet opens, so the WhatsApp/email message can include the real URL. */
    prepareToken: () => tok(),
    async sendLink(dealId: string, channel: string, opts: { replaces?: number; token?: string } = {}) {
      const a = must(); const d = dealOf(a, dealId);
      const miss = localApi.deals.missing(d);
      if (miss.length) throw new Error('Add ' + miss.join(', ') + ' to send.');
      const ver = d.version || 1;
      const prev = a.links.filter(l => l.dealId === dealId && l.kind === 'd' && l.state === 'active');
      if (opts.token) { const same = a.links.find(l => l.token === opts.token); if (same) return same.token; }
      prev.forEach(l => (l.state = 'replaced'));
      const token = opts.token || tok(); const now = Date.now();
      a.links.push({ token, dealId, kind: 'd', version: ver, channel, createdAt: iso(), expiresAt: new Date(now + 7 * DAY).toISOString(), firstOpenedAt: null, state: 'active' });
      Object.assign(d, { stage: 'sent', missing: undefined, sentAt: iso(), expiresAt: new Date(now + 7 * DAY).toISOString(), openedAt: null, channel, changes: undefined });
      ev(a, dealId, { title: `Terms v${ver} sent`, detail: `${channel} · link expires ${fmtDate(now + 7 * DAY)}${opts.replaces ? ' · replaces v' + opts.replaces : ''}` });
      emit(); return token;
    },
    async sendNewVersion(dealId: string, fields: Partial<DealDraft>, channel: string, token?: string) {
      const a = must(); const d = dealOf(a, dealId);
      const work = ['confirmed', 'wip', 'submitted', 'revision', 'approved', 'due', 'overdue'].includes(d.stage);
      const prevV = d.version || 1;
      a.termsVersions.push({ dealId, n: prevV, terms: { brand: d.brand, contact: d.contact, del: d.del, n: d.n, due: d.due, trigger: d.trigger, usage: d.usage, rev: d.rev }, status: work ? 'confirmed' : d.stage === 'declined' ? 'declined' : d.stage === 'changes' ? 'changes requested' : 'replaced', at: iso() });
      const keep = d.stage;
      Object.assign(d, fields, { version: prevV + 1 });
      if (work) { d.pendingVersion = d.version; d.agreedVersion = prevV; }
      const t = await localApi.deals.sendLink(dealId, channel, { replaces: prevV, token });
      if (work) { d.stage = keep; emit(); }
      return t;
    },
    async cancel(id: string) {
      const a = must(); const d = dealOf(a, id);
      a.links.forEach(l => { if (l.dealId === id && l.state === 'active') l.state = 'cancelled'; });
      d.stage = 'cancelled'; d.cancelledAt = iso();
      ev(a, id, { tone: 'neutral', icon: 'x', title: 'Deal cancelled', detail: d.brand + ' was told' }); emit();
    },
    async addPosting(id: string, date: string) {
      const a = must(); const d = dealOf(a, id);
      const byPost = d.trigger === 'Days after posting' || d.trigger === 'On posting';
      const usageDays = (String(d.usage || '').match(/(\d+) days/) || [])[1];
      d.postedAt = date;
      if (usageDays) d.usageEnds = new Date(Date.parse(date) + +usageDays * DAY).toISOString().slice(0, 10);
      if (byPost) {
        const days = d.trigger === 'On posting' ? 0 : parseInt(String(d.due)) || 30;
        d.dueISO = new Date(Date.parse(date) + days * DAY).toISOString().slice(0, 10); d.due = fmtDate(d.dueISO);
        if (d.stage === 'approved') d.stage = 'due';
      }
      ev(a, id, { title: 'Posting date added', detail: `Posted ${fmtDate(date)}${byPost ? ' · payment due ' + d.due : ''}${d.usageEnds ? ' · usage ends ' + fmtDate(d.usageEnds) : ''}` });
      emit();
    },
  },

  work: {
    async submit(dealId: string, item: string, sub: { link: string; note?: string }) {
      const a = must(); const d = dealOf(a, dealId);
      if (!d.items) d.items = mkItems(d);
      const it = d.items[item];
      if (!it || it.state === 'approved') throw new Error('This item is already approved.');
      const prev = a.submissions.filter(x => x.dealId === dealId && x.item === item);
      const waiting = prev.find(x => x.state === 'sent');
      prev.forEach(x => { if (x.state === 'sent') x.state = 'replaced'; });
      const nv = Math.max(it.v || 0, ...prev.map(x => x.v), 0) + 1;
      a.submissions.push({ id: uid('s'), dealId, item, v: nv, at: iso(), state: 'sent', replying: it.state === 'revision' ? it.feedback : undefined, ...sub });
      d.items[item] = { ...it, state: 'submitted', v: nv, sentAt: iso(), draft: undefined };
      d.submittedAt = iso();
      a.links.filter(l => l.dealId === dealId && l.kind === 'a' && l.state === 'active').forEach(l => (l.state = 'replaced'));
      const round = Object.keys(d.items).filter(n => d.items![n].state === 'submitted');
      const token = tok();
      a.links.push({ token, dealId, kind: 'a', version: nv, items: round, createdAt: iso(), expiresAt: null, firstOpenedAt: null, state: 'active' });
      ev(a, dealId, waiting ? { title: `${item} v${nv} replaced v${waiting.v} before review`, detail: sub.link } : { title: `${item} v${nv} sent for approval`, detail: sub.link + (nv > 1 ? ` · replaces v${nv - 1}` : '') });
      recalc(d); emit(); return token;
    },
  },

  payments: {
    async markPaid(id: string, p: { amount: number; date: string; ref: string }) {
      const a = must(); const d = dealOf(a, id);
      a.payments.push({ id: uid('p'), dealId: id, at: iso(), ...p });
      const got = a.payments.filter(x => x.dealId === id).reduce((x, y) => x + y.amount, 0);
      d.received = got;
      if (got >= d.n) { Object.assign(d, { stage: 'paid', paidAt: p.date, ref: p.ref || d.ref, unclear: undefined }); ev(a, id, { tone: 'positive', title: `Marked ${inr(got)} as paid`, detail: `Received ${fmtDate(p.date)}${p.ref ? ' · ref ' + p.ref : ''}` }); }
      else { d.unclear = { reason: 'A different amount arrived', note: `${inr(got)} of ${inr(d.n)} arrived.`, at: iso() }; ev(a, id, { tone: 'warning', title: `Recorded ${inr(p.amount)} received`, detail: `${inr(got)} of ${inr(d.n)} · marked unclear` }); }
      emit();
    },
    async logReminder(id: string, channel: string, kind: 'payment' | 'approval' | 'terms', text?: string) {
      const a = must(); const d = dealOf(a, id);
      Object.assign(d, { lastReminderAt: iso(), lastReminderChannel: channel, reminders: (d.reminders || 0) + 1 });
      a.reminders.push({ dealId: id, kind, channel, text, at: iso() });
      ev(a, id, { title: kind === 'approval' ? 'Approval reminder sent' : kind === 'terms' ? 'Reminder sent' : 'Payment reminder sent', detail: channel + (text ? ` · “${text}”` : '') });
      emit();
    },
  },

  templates: {
    async add(t: Omit<Template, 'id' | 'used'>) { must().templates.unshift({ ...t, id: uid('t'), used: 0 }); emit(); },
    async update(id: string, p: Partial<Template>) { const a = must(); a.templates = a.templates.map(t => (t.id === id ? { ...t, ...p } : t)); emit(); },
    async remove(id: string) { const a = must(); a.templates = a.templates.filter(t => t.id !== id); emit(); },
    async use(id: string) { const t = must().templates.find(x => x.id === id); if (t) { t.used++; emit(); } },
  },

  // Public brand endpoints: /d/:token and /a/:token. No session.
  brand: {
    get(token: string): BrandLinkView | null {
      const f = findTok(token); if (!f) return null;
      if (expireSweep(f.a)) queueMicrotask(emit); // never emit during render
      const { a, l } = f;
      const d = a.deals.find(x => x.id === l.dealId);
      if (!d) return null;
      const latest = a.links.filter(x => x.dealId === l.dealId && x.kind === l.kind).sort((x, y) => y.createdAt.localeCompare(x.createdAt))[0];
      const ver = a.verifications.find(x => x.dealId === l.dealId && x.device === device() && Date.parse(x.validUntil) > Date.now());
      const answers = a.answers.filter(x => x.token === token);
      return { link: l, deal: d, creator: a.creator, answer: answers[0] || null, answers, verified: !!ver, verifiedEmail: ver?.email || null, latest: latest && latest.token !== token && latest.state === 'active' ? latest.token : null, closing: !!a.creator.deletion, email: mask(d.email) };
    },
    open(token: string) {
      const f = findTok(token); if (!f || f.l.firstOpenedAt || f.l.state !== 'active') return;
      f.l.firstOpenedAt = iso();
      const d = f.a.deals.find(x => x.id === f.l.dealId);
      if (d && f.l.kind === 'd') d.openedAt = f.l.firstOpenedAt;
      ev(f.a, f.l.dealId, { actor: 'system', tone: 'neutral', icon: 'eye', title: f.l.kind === 'd' ? 'Link opened' : 'Approval link opened', detail: (f.l.kind === 'd' ? 'Terms v' + f.l.version : (f.l.items || []).join(', ')) + ' · ' + firstName(d?.contact) });
      emit();
    },
    async requestCode(token: string) {
      const f = findTok(token); if (!f) throw new Error('Not found');
      const c = sixDigits();
      codes.set('brand:' + f.l.dealId, { code: c, expires: Date.now() + CODE_TTL, tries: 0 });
      const d = f.a.deals.find(x => x.id === f.l.dealId);
      ev(f.a, f.l.dealId, { actor: 'system', tone: 'neutral', icon: 'mail', title: 'Code sent to ' + mask(d?.email || '') });
      emit(); return { demoCode: c };
    },
    async verify(token: string, code: string) {
      const f = findTok(token); if (!f) return { ok: false as const, error: 'Not found' };
      const r = checkCode('brand:' + f.l.dealId, code);
      if (!r.ok) return r;
      const d = f.a.deals.find(x => x.id === f.l.dealId);
      f.a.verifications.push({ dealId: f.l.dealId, device: device(), email: mask(d?.email || ''), at: iso(), validUntil: iso(30 * DAY) });
      ev(f.a, f.l.dealId, { actor: 'brand', tone: 'neutral', icon: 'shield-check', title: 'Code verified', detail: 'This device can answer for 30 days' });
      emit(); return r;
    },
    /** One answer per link. Repeat calls return the first answer. */
    async answer(token: string, ans: AnswerInput): Promise<Answer | null> {
      const f = findTok(token); if (!f) return null;
      const { a, l } = f;
      const prior = a.answers.find(x => x.token === token); if (prior) return prior;
      if (l.state !== 'active') return null;
      const d = dealOf(a, l.dealId); const at = iso();
      const rec = { token, at, ...ans } as Answer;
      a.answers.push(rec); l.state = 'answered';
      if (ans.type === 'confirm') {
        if (d.pendingVersion) Object.assign(d, { pendingVersion: undefined, agreedVersion: l.version, confirmedAt: at, confirmedBy: ans.name, confirmedVersion: l.version });
        else { Object.assign(d, { stage: 'wip', confirmedAt: at, confirmedBy: ans.name, confirmedVersion: l.version }); if (!d.items) d.items = mkItems(d); recalc(d); }
        ev(a, d.id, { actor: 'brand', tone: 'positive', title: `Terms v${l.version} confirmed by ${ans.name}`, detail: 'Verified by code sent to ' + mask(d.email) });
      }
      if (ans.type === 'changes') {
        if (!d.pendingVersion) d.stage = 'changes';
        d.changes = { areas: ans.areas, note: ans.note, at, by: d.contact, v: l.version };
        ev(a, d.id, { actor: 'brand', tone: 'warning', title: 'Changes requested: ' + (ans.areas.join(', ') || 'terms'), detail: `“${ans.note}”` });
      }
      if (ans.type === 'decline') {
        if (d.pendingVersion) {
          const agreed = a.termsVersions.filter(x => x.dealId === d.id && x.status === 'confirmed').sort((x, y) => y.n - x.n)[0];
          if (agreed) Object.assign(d, agreed.terms);
          Object.assign(d, { pendingVersion: undefined, version: agreed ? agreed.n : d.version });
        } else Object.assign(d, { stage: 'declined', reason: ans.reason, declinedAt: at });
        ev(a, d.id, { actor: 'brand', tone: 'neutral', icon: 'ban', title: 'Declined by ' + (d.contact || 'the brand'), detail: ans.reason ? 'Reason: ' + ans.reason : undefined });
      }
      emit(); return rec;
    },
    async answerWork(token: string, item: string, ans: WorkAnswerInput): Promise<Answer | null> {
      const f = findTok(token); if (!f) return null;
      const { a, l } = f;
      if (!(l.items || []).includes(item)) return null;
      const prior = a.answers.find(x => x.token === token && x.item === item); if (prior) return prior;
      if (l.state !== 'active') return null;
      const d = dealOf(a, l.dealId); if (!d.items) d.items = mkItems(d);
      const at = iso();
      const rec = { token, at, item, ...ans } as Answer;
      a.answers.push(rec);
      const it = d.items[item];
      const sub = a.submissions.filter(x => x.dealId === d.id && x.item === item).sort((x, y) => y.v - x.v)[0];
      const iv = sub ? sub.v : it.v || 1;
      if (ans.type === 'approve') {
        if (sub) Object.assign(sub, { state: 'approved', approvedBy: ans.name, approvedAt: at });
        d.items[item] = { ...it, state: 'approved', v: iv, by: ans.name, at };
        const all = Object.values(d.items).every(x => x.state === 'approved');
        ev(a, d.id, { actor: 'brand', tone: 'positive', title: `${item} v${iv} approved by ${ans.name}`, detail: 'Verified by code sent to ' + mask(d.email) + (all ? ' · all items approved' : '') });
      } else {
        if (sub) Object.assign(sub, { state: 'revision', feedback: ans.note });
        d.items[item] = { ...it, state: 'revision', v: iv, revs: (it.revs || 0) + 1, feedback: { note: ans.note, at, by: d.contact, v: iv } };
        d.notes = ans.note;
        ev(a, d.id, { actor: 'brand', tone: 'warning', title: `Revision requested on ${item} v${iv}`, detail: `“${ans.note}”` });
      }
      if (l.items!.every(n => a.answers.some(x => x.token === token && x.item === n))) l.state = 'answered';
      recalc(d); emit(); return rec;
    },
    subs(token: string, item: string) {
      const f = findTok(token); if (!f) return [];
      return f.a.submissions.filter(x => x.dealId === f.l.dealId && x.item === item).sort((a, b) => b.v - a.v);
    },
    /** Demo helper: newest link for a deal, so the creator can preview the brand's view. */
    demoToken(dealId: string, kind: 'd' | 'a') {
      for (const k in state.accounts) {
        const l = state.accounts[k].links.filter(x => x.dealId === dealId && x.kind === kind).sort((x, y) => y.createdAt.localeCompare(x.createdAt))[0];
        if (l) return l.token;
      }
      return null;
    },
  },

  reset() { const s = state.session; state = seedState(); state.session = s && state.accounts[s.email] ? s : null; emit(); },
};

export type Api = typeof localApi;
