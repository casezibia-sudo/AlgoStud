import { effStage, nextStep, STAGE, type Account, type Deal } from '@/api';
import { DAY, daysFrom, fmtToday, fmtWhen, fmtShort, initials, istDate, todayISO } from './format';

// Definitions for the Overview (one place, so every card agrees):
//  - Owed to you: approved + invoiced deals, INCLUDING overdue, at the amount still outstanding. Drafts and sent never count.
//  - Pipeline ("On the way to paid"): Confirmed, not delivered = confirmed + in progress (incl. revision) + submitted;
//    Delivered, awaiting payment = approved or invoiced and not overdue; Overdue = past the payment date; Paid is a count.
//  - Next payout: the invoiced deal, not overdue, with the earliest payment date.
//  - Due this week: invoiced deals with a payment date from today to today + 6 (India date).
//  - Earned: money from paid deals, by paid date, within a period, vs the equal period before it.
export type Period = 30 | 90 | 365;

export interface Insight { big: string; head: string; sub: string }
export interface NeedRow { id: string; brand: string; av: string; avBg: string; avFg: string; tag: string; red: boolean; task: string; meta: string; btn: string; kind: string }
export interface DueRow { id: string; day: string; mon: string; brand: string; task: string; when: string }
export interface Segment { amount: number; n: number }
export interface RecordRow { id: string; dealId: string; title: string; sub: string; icon: 'check' | 'pencil' | 'wallet' | 'send' | 'alert' | 'clock'; tone: string }

export interface OverviewStats {
  header: { date: string; needCount: number };
  owed: { total: number; n: number; overdue: number; overdueN: number; next: { amount: number; label: string } | null };
  pipeline: { confirmed: Segment; awaiting: Segment; overdue: Segment; paidN: number; activeTotal: number; activeN: number };
  needs: { rows: NeedRow[]; total: number };
  week: { range: string; rows: DueRow[]; nextDeadline: string | null };
  record: RecordRow[];
  insights: Insight[];
}
export interface EarnedStats { total: number; delta: { text: string; up: boolean } | null }

/** Avatar colours from the design. */
const TINTS: [string, string][] = [['#F6E3D3', '#8A4B1E'], ['#E3E8F6', '#3B4A8C'], ['#FBE3EC', '#9A2E5A'], ['#ECE5F7', '#5B3C8C'], ['#DDF1EA', '#0F6247'], ['#E2F0F7', '#1F5E7A'], ['#EFE7DA', '#6B4E2E']];
export const tint = (s: string) => TINTS[[...s].reduce((h, c) => h + c.charCodeAt(0), 0) % TINTS.length];

const outstanding = (d: Deal) => Math.max(0, d.n - (d.received || 0));
const seg = (a: Deal[]): Segment => ({ amount: a.reduce((s, d) => s + outstanding(d), 0), n: a.length });
const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dm = (iso: string) => `${+iso.slice(8, 10)} ${MON[+iso.slice(5, 7) - 1]}`;
const rupee = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

/** Object whose properties are computed on first read. A card that throws while reading its own numbers is caught
 *  by its own error boundary and cannot take down the other cards. */
function lazy<T extends object>(f: { [K in keyof T]: () => T[K] }): T {
  const cache: Partial<T> = {}, o = {} as T;
  (Object.keys(f) as (keyof T)[]).forEach(k => Object.defineProperty(o, k, { enumerable: true, get() { if (!(k in cache)) cache[k] = f[k](); return cache[k] as T[typeof k]; } }));
  return o;
}

function recordIcon(title: string, tone: string): RecordRow['icon'] {
  const t = title.toLowerCase();
  if (/paid|received/.test(t)) return 'wallet';
  if (/confirmed|approved/.test(t)) return 'check';
  if (/revision|changes|requested/.test(t)) return 'pencil';
  if (/sent|reminder|opened/.test(t)) return 'send';
  return tone === 'critical' ? 'alert' : tone === 'positive' ? 'check' : tone === 'warning' ? 'pencil' : tone === 'info' ? 'send' : 'clock';
}

export function overviewStats(a: Account): OverviewStats {
  const deals = a.deals;
  const by = (...s: string[]) => deals.filter(d => s.includes(effStage(d)));
  const upcoming = () => by('due').filter(d => d.dueISO && daysFrom(d.dueISO) >= 0).sort((x, y) => x.dueISO!.localeCompare(y.dueISO!));
  const needsAll = () => deals.filter(d => STAGE[effStage(d)].turn === 'you' && nextStep(d));

  return lazy<OverviewStats>({
    header: () => ({ date: fmtToday(), needCount: needsAll().length }),
    owed: () => {
      const all = by('approved', 'due', 'overdue'), overdue = by('overdue'), n = upcoming()[0];
      return { total: seg(all).amount, n: all.length, overdue: seg(overdue).amount, overdueN: overdue.length, next: n ? { amount: outstanding(n), label: `${fmtShort(n.dueISO!)} · ${n.brand}` } : null };
    },
    pipeline: () => {
      const confirmed = seg(by('confirmed', 'wip', 'revision', 'submitted')), awaiting = seg(by('approved', 'due')), overdue = seg(by('overdue'));
      return { confirmed, awaiting, overdue, paidN: by('paid').length, activeTotal: confirmed.amount + awaiting.amount + overdue.amount, activeN: confirmed.n + awaiting.n + overdue.n };
    },
    needs: () => {
      const all = needsAll();
      const rows: NeedRow[] = all.slice(0, 3).map(d => {
        const s = effStage(d), step = nextStep(d)!, [avBg, avFg] = tint(d.brand), red = s === 'overdue';
        return {
          id: d.id, brand: d.brand, av: initials(d.brand), avBg, avFg, red, kind: step.kind,
          tag: red && d.dueISO ? `${-daysFrom(d.dueISO)} days late` : s === 'draft' ? 'Draft not sent' : STAGE[s].label,
          // Wording follows the v3 design: payments read "Payment of ₹X for ...", with the payment date and contact underneath.
          task: s === 'due' || red ? `Payment of ${rupee(outstanding(d))} for ${d.del}` : `${d.del} · ${rupee(d.n)}`,
          meta: d.dueISO ? `${red ? 'Was due' : 'Due'} ${dm(d.dueISO)}${d.contact ? ' · ' + d.contact : ''}` : step.hint,
          btn: step.kind === 'remind-pay' ? 'Send reminder' : step.label.replace(/ to .*$/, ''),
        };
      });
      return { rows, total: all.length };
    },
    week: () => {
      const up = upcoming(), rows = up.filter(d => daysFrom(d.dueISO!) <= 6);
      const t = todayISO(), end = istDate(Date.parse(t) + 6 * DAY);
      const next = up.find(d => daysFrom(d.dueISO!) > 6) || null;
      return {
        range: t.slice(5, 7) === end.slice(5, 7) ? `${+t.slice(8)} – ${dm(end)}` : `${dm(t)} – ${dm(end)}`,
        rows: rows.map(d => {
          const n = daysFrom(d.dueISO!), [dd, mon] = dm(d.dueISO!).split(' ');
          const when = n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : n <= 3 ? `In ${n} days` : WEEKDAY[new Date(d.dueISO + 'T00:00:00Z').getUTCDay()];
          return { id: d.id, day: dd.padStart(2, '0'), mon, brand: d.brand, task: `Payment expected · ${rupee(outstanding(d))}`, when };
        }),
        nextDeadline: next ? dm(next.dueISO!) : null,
      };
    },
    record: () => [...a.events].sort((x, y) => y.at.localeCompare(x.at)).slice(0, 4).map(e => {
      const d = deals.find(x => x.id === e.dealId);
      return { id: e.id, dealId: e.dealId, title: e.title, sub: `${d ? d.brand + ' · ' : ''}${fmtWhen(e.at)}`, icon: recordIcon(e.title, e.tone), tone: e.tone };
    }),
    insights: () => {
      const out: Insight[] = [];
      const od = by('overdue');
      if (od.length) out.push({ big: String(od.length), head: `${od.length === 1 ? 'Deal is' : 'Deals are'} past the agreed payment date.`, sub: 'Send a reminder from the deal page to get paid sooner.' });
      const waiting = deals.filter(d => STAGE[effStage(d)].turn === 'brand');
      if (waiting.length) out.push({ big: String(waiting.length), head: `${waiting.length === 1 ? 'Deal is' : 'Deals are'} waiting on a brand.`, sub: 'These move forward as soon as the brand answers or pays.' });
      const measurable = deals.filter(d => d.paidAt && d.dueISO);
      if (measurable.length) {
        const onTime = measurable.filter(d => istDate(d.paidAt!) <= d.dueISO!).length;
        out.push({ big: `${Math.round((onTime / measurable.length) * 100)}%`, head: `${onTime} of ${measurable.length} paid ${measurable.length === 1 ? 'deal was' : 'deals were'} paid on time.`, sub: 'Counted against the payment date in the terms the brand confirmed.' });
      }
      return out.slice(0, 3);
    },
  });
}

/** Earned for the card's own period: paid amounts by paid date, vs the same length of time before it. */
export function earnedStats(a: Account, period: Period): EarnedStats {
  const now = Date.now();
  const start = period === 365 ? Date.parse(todayISO().slice(0, 4) + '-01-01') : now - period * DAY;
  const prevStart = start - (now - start);
  const rows = a.payments.length
    ? a.payments.map(p => ({ t: Date.parse(p.date), v: p.amount }))
    : a.deals.filter(d => d.paidAt).map(d => ({ t: Date.parse(d.paidAt!), v: d.received ?? d.n }));
  const tot = (from: number, to: number) => rows.filter(r => r.t >= from && r.t < to).reduce((s, r) => s + r.v, 0);
  const total = tot(start, now + DAY), prev = tot(prevStart, start);
  const d = prev ? Math.round(((total - prev) / prev) * 100) : null;
  return { total, delta: d === null ? null : { text: `${Math.abs(d)}%`, up: d >= 0 } };
}
