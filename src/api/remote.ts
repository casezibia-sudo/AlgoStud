// Supabase implementation of the API. Creator-side mutations reuse the exact logic in
// local.ts on an in-memory copy of the account; after each change, the changed rows are
// diffed and written to Postgres (RLS limits every write to the signed-in creator).
// Brand-side calls go to the `brand` edge function, because brands have no account.
import { localApi, localInternals } from './local';
import { sb } from './supabase';
import type { Account, Answer, AnswerInput, BrandLinkView, Creator, Submission, WorkAnswerInput } from './types';

type Doc = Record<string, unknown> & { dealId?: string };
const TABLES: { field: keyof Account; table: string; key: (x: any) => string }[] = [
  { field: 'deals', table: 'deals', key: x => x.id },
  { field: 'termsVersions', table: 'terms_versions', key: x => `${x.dealId}:${x.n}` },
  { field: 'links', table: 'links', key: x => x.token },
  { field: 'answers', table: 'answers', key: x => `${x.token}:${x.item || ''}` },
  { field: 'submissions', table: 'submissions', key: x => x.id },
  { field: 'verifications', table: 'verifications', key: x => `${x.dealId}:${x.device}:${x.at}` },
  { field: 'payments', table: 'payments', key: x => x.id },
  { field: 'events', table: 'events', key: x => x.id },
  { field: 'templates', table: 'templates', key: x => x.id },
  { field: 'reminders', table: 'reminders', key: x => `${x.dealId}:${x.at}` },
];
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

let session: { email: string; at: string; userId: string } | null = null;
let synced: Account | null = null;
let queue: Promise<unknown> = Promise.resolve();

async function loadAccount(userId: string, email: string): Promise<Account> {
  const [cr, ...docs] = await Promise.all([
    sb.from('creators').select('data').eq('id', userId).maybeSingle(),
    ...TABLES.map(t => sb.from(t.table).select('data').eq('user_id', userId)),
  ]);
  const { deleted, ...creator } = (cr.data?.data || {}) as Creator & { deleted?: string[] };
  const a = { creator: { ...creator, email }, deleted } as Account;
  TABLES.forEach((t, i) => { (a as any)[t.field] = (docs[i].data || []).map(r => r.data); });
  a.events.sort((x, y) => y.at.localeCompare(x.at));
  return a;
}

async function push(prev: Account | null, next: Account) {
  const userId = session!.userId;
  const creatorDoc = (a: Account | null) => (a ? JSON.stringify({ ...a.creator, deleted: a.deleted }) : '');
  const jobs: PromiseLike<unknown>[] = [];
  if (creatorDoc(prev) !== creatorDoc(next)) jobs.push(sb.from('creators').update({ data: JSON.parse(creatorDoc(next)), updated_at: new Date().toISOString() }).eq('id', userId));
  for (const t of TABLES) {
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

export const remoteApi = {
  ...localApi,

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
