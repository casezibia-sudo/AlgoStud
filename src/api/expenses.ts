// Expenses store. Same API as public/expenses-data.js (window.ASX), so the converted
// screens keep working. Local mode uses localStorage; remote mode uses the `expenses`
// table, and income comes from the real payments and deals in the account.
import { sb, remoteEnabled } from './supabase';
import { api } from './index';
import { isUnbuilt, LATER, notifyLater, warnOnce } from './safe';

// The expenses and receipts tables are not built yet (see safe.ts). While that is true, the list stays empty,
// no request is sent, and every attempt to save shows a visible notice instead of pretending to work.
const EXPENSES_READY = !isUnbuilt('expenses');
const RECEIPTS_READY = !isUnbuilt('receipts');

export interface Expense { id: string; date: string; amount: number; category: string; note: string; dealId: string | null; receipt: string | null; taxDeductible: boolean }

const KEY = 'asx-expenses-v1', LASTCAT = 'asx-last-category';
// TODO: this todayISO is UTC, so between 00:00 and 05:30 IST it returns yesterday. When the expenses table is built,
// use the shared Asia/Kolkata todayISO from src/lib/format.ts instead.
const todayISO = () => new Date().toISOString().slice(0, 10);

export const CATEGORIES = [
  { id: 'props', label: 'Props and products', c: '#2E2E33' },
  { id: 'tools', label: 'Editing tools and apps', c: '#55555C' },
  { id: 'shipping', label: 'Shipping', c: '#7A7A82' },
  { id: 'travel', label: 'Travel', c: '#9C9CA4' },
  { id: 'helpers', label: 'Helpers and freelancers', c: '#B9BAC0' },
  { id: 'equipment', label: 'Equipment', c: '#D2D3D7' },
  { id: 'other', label: 'Other', c: '#E6E7E9' },
];

const toRow = (e: Expense) => ({ id: e.id, date: e.date, amount: e.amount, category: e.category, note: e.note, deal_id: e.dealId, receipt: e.receipt, tax_deductible: e.taxDeductible });
const fromRow = (r: any): Expense => ({ id: r.id, date: r.date, amount: Number(r.amount), category: r.category, note: r.note, dealId: r.deal_id, receipt: r.receipt, taxDeductible: r.tax_deductible });

let list: Expense[] = [];
const subs = new Set<() => void>();
const changed = () => {
  if (!remoteEnabled) try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* quota */ }
  subs.forEach(f => { try { f(); } catch { /* screen error */ } });
};
const blocked = () => remoteEnabled && !EXPENSES_READY;
const write = (p: PromiseLike<{ error: unknown }>) => { if (remoteEnabled && EXPENSES_READY) Promise.resolve(p).then(r => { if (r.error) { console.error('[expenses]', r.error); void reload(); } }); };

async function reload() {
  if (blocked()) { warnOnce('expenses'); list = []; return; }
  const { data, error } = await sb.from('expenses').select('*').is('deleted_at', null);
  if (!error) { list = (data || []).map(fromRow); changed(); }
}

const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthOf = (d: string) => d.slice(0, 7);
const sum = (a: { amount: number }[]) => a.reduce((s, x) => s + x.amount, 0);
const inMonth = <T extends { date: string }>(a: T[], m?: string) => (m ? a.filter(x => monthOf(x.date) === m) : a);
const cat = (id: string) => CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

/** Deals and money received, from the shared account (remote) or the demo arrays (local). */
let fallback: { DEALS: any[]; RECEIVED: any[] } = { DEALS: [], RECEIVED: [] };
const deals = () => {
  const a = api.snapshot().account;
  return remoteEnabled && a ? a.deals.map(d => ({ id: d.id, name: d.del, brand: d.brand, amount: d.n })) : fallback.DEALS;
};
const received = () => {
  const a = api.snapshot().account;
  if (!remoteEnabled || !a) return fallback.RECEIVED;
  return a.payments.map(p => ({ date: p.date, amount: p.amount, brand: a.deals.find(d => d.id === p.dealId)?.brand || '' }));
};
const deal = (id: string | null) => deals().find(d => d.id === id) || null;

export const expenses = {
  CATEGORIES,
  get DEALS() { return deals(); },
  get TODAY() { return todayISO(); },
  get CURRENT_MONTH() { return todayISO().slice(0, 7); },
  inr, cat, deal,
  fmtDate: (d: string) => { const [, m, dd] = d.split('-'); return +dd + ' ' + MONTHS[+m - 1]; },
  monthLabel: (m: string) => { const [y, mm] = m.split('-'); return FULL[+mm - 1] + ' ' + y; },
  list: () => list.slice().sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)),
  get: (id: string) => list.find(e => e.id === id) || null,
  add(e: Partial<Expense> & { amount: number; category: string }) {
    const x: Expense = { id: 'e' + Date.now().toString(36), date: todayISO(), dealId: null, receipt: null, taxDeductible: true, note: '', ...e };
    if (blocked()) { notifyLater('Saving expenses'); return x; }
    list.push(x); this.setLastCategory(x.category); changed();
    write(sb?.from('expenses').insert(toRow(x)));
    return x;
  },
  update(id: string, patch: Partial<Expense>) {
    if (blocked()) return notifyLater('Editing expenses');
    list =list.map(e => (e.id === id ? { ...e, ...patch } : e)); changed();
    const e = this.get(id); if (e) write(sb?.from('expenses').update(toRow(e)).eq('id', id));
  },
  /** Soft delete; restore() undoes it. */
  remove(id: string) {
    if (blocked()) { notifyLater('Deleting expenses'); return null; }
    const e = this.get(id); list = list.filter(x => x.id !== id); changed();
    write(sb?.from('expenses').update({ deleted_at: new Date().toISOString() }).eq('id', id));
    return e;
  },
  restore(e: Expense | null) {
    if (!e || this.get(e.id)) return;
    if (blocked()) return notifyLater('Restoring expenses');
    list.push(e); changed();
    write(sb?.from('expenses').update({ deleted_at: null }).eq('id', e.id));
  },
  reset() { if (!remoteEnabled) { localStorage.removeItem(KEY); location.reload(); } },
  subscribe(f: () => void) { subs.add(f); return () => subs.delete(f); },
  lastCategory: () => { try { return localStorage.getItem(LASTCAT) || 'props'; } catch { return 'props'; } },
  setLastCategory(c: string) { try { localStorage.setItem(LASTCAT, c); } catch { /* private mode */ } },
  months: () => [...new Set(list.map(e => monthOf(e.date)).concat(received().map(r => monthOf(r.date))))].sort().reverse(),
  spent: (m?: string) => sum(inMonth(list, m)),
  received: (m?: string) => sum(inMonth(received(), m)),
  profit(m?: string) { return this.received(m) - this.spent(m); },
  byCategory(m?: string) {
    const arr = inMonth(list, m), tot = sum(arr) || 1;
    return CATEGORIES.map(c => { const a = sum(arr.filter(e => e.category === c.id)); return { ...c, amount: a, pct: Math.round((a / tot) * 100) }; })
      .filter(c => c.amount > 0).sort((a, b) => b.amount - a.amount);
  },
  dealCosts: (id: string) => list.filter(e => e.dealId === id).sort((a, b) => a.date.localeCompare(b.date)),
  dealSpent(id: string) { return sum(this.dealCosts(id)); },
  dealProfit(id: string) { const d = deal(id); return d ? d.amount - this.dealSpent(id) : 0; },
  byMonth(months: string[]) { return months.map(m => ({ m, received: this.received(m), spent: this.spent(m), profit: this.profit(m) })); },
  csvRows() {
    const rows: (string | number)[][] = [['Type', 'Date', 'Description', 'Category', 'Amount (INR)', 'Linked deal', 'Receipt', 'Tax-deductible']];
    received().forEach(r => rows.push(['Income', r.date, 'Payment from ' + r.brand, '', r.amount, '', '', '']));
    this.list().forEach(e => { const d = deal(e.dealId); rows.push(['Expense', e.date, e.note, cat(e.category).label, -e.amount, d ? d.brand + ' · ' + d.name : '', e.receipt ? 'Yes' : 'No', e.taxDeductible ? 'Yes' : 'No']); });
    return rows;
  },
  csv() { return this.csvRows().map(r => r.map(v => (/[",\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : v)).join(',')).join('\n'); },
  openQuickAdd(opts?: unknown) { if (blocked()) return notifyLater('Adding expenses'); window.dispatchEvent(new CustomEvent('asx-open', { detail: opts || {} })); },

  /** Uploads a receipt photo or PDF and returns its storage path (remote only). */
  async uploadReceipt(file: File) {
    if (remoteEnabled && !RECEIPTS_READY) { warnOnce('receipts'); throw new Error(LATER('Receipt uploads')); }
    const { data: u } = await sb.auth.getUser();
    const path = `${u.user!.id}/${Date.now().toString(36)}-${file.name}`;
    const { error } = await sb.storage.from('receipts').upload(path, file, { contentType: file.type });
    if (error) throw error;
    return path;
  },
  /** Signed URL for showing a receipt full size; valid for 1 hour. */
  async receiptUrl(path: string) {
    if (remoteEnabled && !RECEIPTS_READY) { warnOnce('receipts'); return null; }
    const { data } = await sb.storage.from('receipts').createSignedUrl(path, 3600);
    return data?.signedUrl || null;
  },
};

/** Installs window.ASX before any screen loads public/expenses-data.js (which then does nothing). */
export async function installASX() {
  const w = window as any;
  if (remoteEnabled) {
    await reload();
    sb.auth.onAuthStateChange(() => { void reload(); });
    api.subscribe(() => subs.forEach(f => f()));
  } else {
    // Local mode: load the demo data from the original script, then take over its list.
    await new Promise<void>(res => { const s = document.createElement('script'); s.src = '/expenses-data.js'; s.onload = s.onerror = () => res(); document.head.appendChild(s); });
    const demo = w.ASX;
    if (demo) { list = demo.list(); fallback = { DEALS: demo.DEALS, RECEIVED: demo.csvRows().filter((r: any[]) => r[0] === 'Income').map((r: any[]) => ({ date: r[1], amount: r[4], brand: String(r[2]).replace('Payment from ', '') })) }; }
  }
  w.ASX = expenses;
}
