// Reports. Every number here comes from a rule that already exists; this file only picks the period and arranges them.
//  - Paid deals, their paid date and amount: paymentsView (effStage 'paid', paid date in India time, received ?? n).
//  - Average time to get paid: daysToPay (brandStats), the same per-deal days as "Usually pays in".
//  - Paid on time: milestones(), the same rule as the profile menu and the Overview insight.
//  - Open / Overdue / Active: openTotals (dealsView), the same "Open" as the Deals header and the Overview.
//    Active = open but not overdue. Paid is counted for the period, like Earned.
//  - Top brands: brandStats() grouping, name and colours; "Usually pays in" is the brand's all-time value (as on Brands).
// Period = the last N calendar months including this one (India date), compared with the N months just before.
import { effStage, type Account, type Deal } from '@/api';
import { brandStats, daysToPay } from './brandStats';
import { openTotals } from './dealsView';
import { milestones } from './milestones';
import { monthBars, paidAmount, paidDate, type MonthBar } from './paymentsView';
import { todayISO } from './format';

export type Months = 3 | 6 | 12;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const monthLabel = (key: string) => `${MON[+key.slice(5, 7) - 1]} ${key.slice(0, 4)}`;
export const monthFull = (key: string) => `${FULL[+key.slice(5, 7) - 1]} ${key.slice(0, 4)}`;
const keyAt = (back: number) => { const t = +todayISO().slice(0, 4) * 12 + +todayISO().slice(5, 7) - 1 - back; return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}`; };

export interface Delta { text: string; up: boolean }
export interface Kpi { value: string; sub: string; delta: Delta | null; vs: string | null }

interface PaidRow { d: Deal; key: string; amount: number }
const inKeys = (r: PaidRow, from: string, to: string) => r.key >= from && r.key <= to;

export interface Reports {
  range: { from: string; to: string; prevFrom: string; prevTo: string; text: string; prevText: string };
  hasPaid: boolean;
  kpis: { earned: Kpi; completed: Kpi; avg: Kpi; onTime: Kpi };
  months: { cur: MonthBar[]; prev: MonthBar[]; max: number; best: MonthBar | null };
  stages: { active: Seg; overdue: Seg; paid: Seg; total: number };
  brands: BrandRow[];
}
export interface Seg { amount: number; n: number; pct: number }
export interface BrandRow { key: string; name: string; initials: string; bg: string; fg: string; deals: number; earned: number; paysIn: number | null; share: number }

/** "+3%" when there is a previous period; null (shown as "—") when it was zero. */
const pct = (cur: number, prev: number): Delta | null => { if (!prev) return null; const p = Math.round(((cur - prev) / prev) * 100); return { text: `${p >= 0 ? '+' : '-'}${Math.abs(p)}%`, up: p >= 0 }; };
const avg = (a: number[]) => (a.length ? Math.round(a.reduce((s, n) => s + n, 0) / a.length) : null);
const rupee = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

export function buildReports(a: Account, n: Months): Reports {
  const to = keyAt(0), from = keyAt(n - 1), prevTo = keyAt(n), prevFrom = keyAt(2 * n - 1);
  const paid: PaidRow[] = a.deals.filter(d => effStage(d) === 'paid' && paidDate(d)).map(d => ({ d, key: paidDate(d).slice(0, 7), amount: paidAmount(d) }));
  const cur = paid.filter(r => inKeys(r, from, to)), prev = paid.filter(r => inKeys(r, prevFrom, prevTo));
  const sum = (rows: PaidRow[]) => rows.reduce((s, r) => s + r.amount, 0);
  const earned = sum(cur), earnedPrev = sum(prev);

  // Average time to get paid and paid on time, for each period.
  const days = (rows: PaidRow[]) => avg(rows.flatMap(r => { const x = daysToPay(a, r.d); return x === null ? [] : [x]; }));
  const dCur = days(cur), dPrev = days(prev);
  const mCur = milestones(cur.map(r => r.d)), mPrev = milestones(prev.map(r => r.d));
  const rCur = mCur.measurable ? Math.round(mCur.rate * 100) : null, rPrev = mPrev.measurable ? Math.round(mPrev.rate * 100) : null;
  const diff = (c: number | null, p: number | null) => (c === null || p === null ? null : c - p);
  const dd = diff(dCur, dPrev), rd = diff(rCur, rPrev), cd = cur.length - prev.length;

  const kpis = {
    earned: { value: rupee(earned), sub: '', delta: pct(earned, earnedPrev), vs: `vs ${rupee(earnedPrev)}` },
    completed: { value: String(cur.length), sub: '', delta: prev.length ? { text: `${cd >= 0 ? '+' : '-'}${Math.abs(cd)}`, up: cd >= 0 } : null, vs: `vs ${prev.length} deal${prev.length === 1 ? '' : 's'}` },
    avg: { value: dCur === null ? '—' : `${dCur} day${dCur === 1 ? '' : 's'}`, sub: dCur === null ? 'No paid deals with a payment date yet' : '', delta: dd === null ? null : { text: dd === 0 ? 'No change' : `${Math.abs(dd)} day${Math.abs(dd) === 1 ? '' : 's'} ${dd < 0 ? 'faster' : 'slower'}`, up: dd <= 0 }, vs: dPrev === null ? null : `vs ${dPrev} day${dPrev === 1 ? '' : 's'}` },
    onTime: { value: rCur === null ? '—' : `${rCur}%`, sub: rCur === null ? 'No paid deals with a payment date yet' : '', delta: rd === null ? null : { text: `${rd >= 0 ? '+' : '-'}${Math.abs(rd)} pts`, up: rd >= 0 }, vs: rPrev === null ? null : `vs ${rPrev}%` },
  };

  // Earnings by month: this period, and the one before it bar for bar.
  const curBars = monthBars(a, n), prevBars = monthBars(a, n, n);
  const best = curBars.reduce<MonthBar | null>((m, b) => (b.amount > 0 && (!m || b.amount > m.amount) ? b : m), null);

  // Deal stages: Active and Overdue are the app-wide "Open" rule; Paid is this period's paid deals.
  const ot = openTotals(a), pd = { amount: earned, n: cur.length };
  const total = ot.active.amount + ot.overdue.amount + pd.amount, sh = (x: number) => (total ? Math.round((x / total) * 100) : 0);

  // Top brands: the Brands tab's grouping; deals and earned are this period's paid deals, "usually pays in" is all-time.
  const inPeriod = new Map(cur.map(r => [r.d.id, r.amount]));
  const brands: BrandRow[] = brandStats(a).flatMap(b => {
    const ds = b.deals.filter(d => inPeriod.has(d.id));
    if (!ds.length) return [];
    const e = ds.reduce((s, d) => s + inPeriod.get(d.id)!, 0);
    return [{ key: b.key, name: b.name, initials: b.initials, bg: b.bg, fg: b.fg, deals: ds.length, earned: e, paysIn: b.paysIn, share: earned ? Math.round((e / earned) * 100) : 0 }];
  });

  const text = (f: string, t: string) => `${monthLabel(f)} — ${monthLabel(t)}`;
  return {
    range: { from, to, prevFrom, prevTo, text: text(from, to), prevText: text(prevFrom, prevTo) },
    hasPaid: paid.length > 0, kpis,
    months: { cur: curBars, prev: prevBars, max: Math.max(0, ...curBars.map(b => b.amount), ...prevBars.map(b => b.amount)), best },
    stages: { active: { ...ot.active, pct: sh(ot.active.amount) }, overdue: { ...ot.overdue, pct: sh(ot.overdue.amount) }, paid: { ...pd, pct: sh(pd.amount) }, total },
    brands,
  };
}

/** A round axis for the chart: the top value and the tick step (₹10k, 20k, 50k, ...). */
export function axis(max: number): { top: number; step: number } {
  const steps = [1000, 2000, 5000, 10000, 20000, 25000, 50000, 100000, 200000, 250000, 500000, 1000000, 2000000, 5000000];
  const step = steps.find(s => max / s <= 4) ?? 5000000, top = Math.max(step, Math.ceil(max / step) * step);
  return { top, step };
}
export const kLabel = (v: number) => (v === 0 ? '₹0' : v >= 1000 ? `₹${Number((v / 1000).toFixed(1))}k` : `₹${v}`);
