import { effStage, type Account, type Deal } from '@/api';
import { fmtDate, istDate, todayISO } from './format';
import { overviewStats } from './dashboardStats';

// Definitions for the Payments page (one place, so every card agrees):
//  - Still to receive: exactly the Overview "Owed to you" (approved + invoiced, including overdue). See dashboardStats.
//  - Received: paid deals by paid date (Indian date), at the amount received. In real mode there is no payments table yet,
//    so this always comes from the deals themselves, never from account.payments.
//  - History rows: one per invoiced deal (Due / Overdue) and one per paid deal (Received).
//  - Spent / Profit: only when expenses exist. Profit is never "received minus 0".
// TODO (slice 6): advance + balance deals should become two history rows (advance and balance). Today a deal is one row.

export type HStatus = 'overdue' | 'due' | 'received';
export interface HRow { id: string; brand: string; del: string; status: HStatus; /** due date (Due/Overdue) or paid date (Received), YYYY-MM-DD */ date: string; amount: number; deal: Deal }

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const rupee = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
export const monthName = (key: string) => FULL[+key.slice(5, 7) - 1];

const outstanding = (d: Deal) => Math.max(0, d.n - (d.received || 0));
const paidAmount = (d: Deal) => d.received ?? d.n;
const paidDate = (d: Deal) => (d.paidAt ? istDate(d.paidAt) : '');
const byDate = (x: HRow, y: HRow) => (x.date || '9').localeCompare(y.date || '9');

export function historyRows(a: Account): HRow[] {
  const rows: HRow[] = [];
  for (const d of a.deals) {
    const s = effStage(d);
    if (s === 'overdue' || s === 'due') rows.push({ id: d.id, brand: d.brand, del: d.del, status: s, date: d.dueISO || '', amount: outstanding(d), deal: d });
    else if (s === 'paid') rows.push({ id: d.id, brand: d.brand, del: d.del, status: 'received', date: paidDate(d), amount: paidAmount(d), deal: d });
  }
  const part = (s: HStatus) => rows.filter(r => r.status === s).sort(s === 'received' ? (x, y) => byDate(y, x) : byDate);
  return [...part('overdue'), ...part('due'), ...part('received')];
}

/** Brands with money due, overdue first. */
export const reminderRows = (rows: HRow[]) => rows.filter(r => r.status !== 'received');

export interface Tiles {
  owed: { total: number; n: number; overdue: number; overdueN: number };
  received: { total: number; n: number; month: string };
  /** null until expenses exist */
  spent: { total: number; n: number } | null;
  profit: number | null;
}

export function tiles(a: Account, expenses: { date: string; amount: number }[]): Tiles {
  const o = overviewStats(a).owed, month = todayISO().slice(0, 7);
  const rec = a.deals.filter(d => effStage(d) === 'paid' && paidDate(d).slice(0, 7) === month);
  const received = rec.reduce((s, d) => s + paidAmount(d), 0);
  const mine = expenses.filter(e => e.date.slice(0, 7) === month);
  const spentTotal = mine.reduce((s, e) => s + e.amount, 0);
  return {
    owed: { total: o.total, n: o.n, overdue: o.overdue, overdueN: o.overdueN },
    received: { total: received, n: rec.length, month: monthName(month) },
    spent: expenses.length ? { total: spentTotal, n: mine.length } : null,
    profit: expenses.length ? received - spentTotal : null,
  };
}

/** "Payment within 18 days of the work going live." built from the confirmed terms (trigger + days). */
export function termsQuote(d: Deal): string {
  const days = /(\d+)\s*days?/i.exec(d.due || '')?.[1];
  switch (d.trigger) {
    case 'Days after posting': return days ? `Payment within ${days} days of the work going live.` : 'Payment due after the work goes live.';
    case 'On posting': return 'Payment due when the work goes live.';
    case 'Fixed date': return d.dueISO ? `Payment due on ${fmtDate(d.dueISO)}.` : 'Payment due on the agreed date.';
    default: return days ? `Payment within ${days} days of invoice.` : 'Payment due on approval of the work.';
  }
}

/** Days past the payment date (0 if not late). */
export const daysLate = (iso: string) => Math.max(0, Math.round((Date.parse(todayISO()) - Date.parse(iso)) / 864e5));

export function reminderMessage(r: HRow, creator: { paymentLink?: string }): string {
  const late = r.status === 'overdue';
  const when = late ? 'is now overdue' : r.date === todayISO() ? 'is due today' : r.date ? `is due on ${fmtDate(r.date)}` : 'is due';
  const link = creator.paymentLink ? ` You can pay here: ${creator.paymentLink}.` : '';
  return `Hi ${r.brand} team, a quick reminder that the payment of ${rupee(r.amount)} ${when}. As agreed: “${termsQuote(r.deal)}”${link} ${late ? 'Could you share when it will be paid? Thank you!' : 'Could you confirm it is on its way? Thank you!'}`;
}

export interface MonthBar { key: string; label: string; full: string; amount: number }

/** Paid amounts for the 7 months ending this month (Indian date). */
export function monthlyReceived(a: Account): { bars: MonthBar[]; max: number; avg: number } {
  const now = todayISO(), y = +now.slice(0, 4), m = +now.slice(5, 7) - 1;
  const bars: MonthBar[] = [];
  for (let i = 6; i >= 0; i--) {
    const t = y * 12 + m - i, yy = Math.floor(t / 12), mm = t % 12, key = `${yy}-${String(mm + 1).padStart(2, '0')}`;
    const amount = a.deals.filter(d => effStage(d) === 'paid' && paidDate(d).slice(0, 7) === key).reduce((s, d) => s + paidAmount(d), 0);
    bars.push({ key, label: MON[mm], full: `${FULL[mm]} ${yy}`, amount });
  }
  const sum = bars.reduce((s, b) => s + b.amount, 0);
  return { bars, max: Math.max(...bars.map(b => b.amount)), avg: sum / bars.length };
}
