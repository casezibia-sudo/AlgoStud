// Deliverables, one row per DEAL for now.
// TODO(slice 4): individual deliverable items (Reel 1, Story set...) arrive then; each row here splits into one row per
//   item, with its own due date and status. Until then the deal's final delivery date and stage stand in for them.
// Statuses are derived on read and never written.
import type { Account, Deal } from '@/api';
import { istDate, todayISO } from '@/lib/format';

export type DStatus = 'late' | 'revision' | 'brand' | 'todo' | 'approved' | 'posted';
export type Group = 'needs' | 'soon' | 'later' | 'done';

export interface DRow {
  id: string; deal: Deal; brand: string; del: string; sub: string;
  due: string | null;          // final delivery date, ISO yyyy-mm-dd
  status: DStatus;
  late: boolean;               // due date passed and not yet submitted (a late revision stays "Revision requested")
  onYou: boolean;
  group: Group;
  sentAt?: string;             // when the work was submitted, if the record says
}

const DAY = 864e5;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const addDays = (iso: string, n: number) => new Date(Date.parse(iso) + n * DAY).toISOString().slice(0, 10);
const gap = (a: string, b: string) => Math.round((Date.parse(a) - Date.parse(b)) / DAY);
/** "31 Mar" from yyyy-mm-dd, never shifted by time zone. */
export const short = (iso: string) => { const [, m, d] = iso.split('-'); return `${d} ${MON[+m - 1]}`; };
export const dowName = (iso: string) => DOW[new Date(iso).getUTCDay()];
export const headerDate = (iso: string) => `${dowName(iso)} ${short(iso)}`;
export const mondayOf = (iso: string) => addDays(iso, -((new Date(iso).getUTCDay() + 6) % 7));

const WORK = ['confirmed', 'wip', 'revision', 'submitted', 'approved'];
const NOT_SUBMITTED = ['confirmed', 'wip', 'revision'];
const STAGE_EVENTS = ['Revision requested', 'Work submitted', 'Work started'];

/** Revision requested: stored as in_progress after a submitted -> in_progress move (the event is titled "Revision requested").
 *  The local demo stores a 'revision' stage directly. */
function inRevision(d: Deal, a: Account): boolean {
  if (d.stage === 'revision') return true;
  if (d.stage !== 'wip') return false;
  const last = a.events.filter(e => e.dealId === d.id && STAGE_EVENTS.includes(e.title)).sort((x, y) => y.at.localeCompare(x.at))[0];
  return last?.title === 'Revision requested';
}

function sentAt(d: Deal, a: Account): string | undefined {
  const e = a.events.filter(e => e.dealId === d.id && e.title === 'Work submitted').sort((x, y) => y.at.localeCompare(x.at))[0];
  return e?.at || d.submittedAt;
}

export function deliverableRows(a: Account): DRow[] {
  const today = todayISO(), week = addDays(today, 6);
  return a.deals.filter(d => WORK.includes(d.stage)).map((d): DRow => {
    const due = d.finalDeliveryDate || null;
    const rev = inRevision(d, a);
    const open = NOT_SUBMITTED.includes(d.stage);
    const late = open && !!due && due < today;
    const posted = d.stage === 'approved' && !!d.postedAt;
    const status: DStatus = posted ? 'posted' : d.stage === 'approved' ? 'approved' : rev ? 'revision' : d.stage === 'submitted' ? 'brand' : late ? 'late' : 'todo';
    const onYou = open || (d.stage === 'approved' && !d.postedAt);
    const group: Group = status === 'late' || status === 'revision' ? 'needs'
      : status === 'posted' || status === 'approved' ? 'done'
      : status === 'brand' || (due && due <= week) ? 'soon' : 'later';
    return { id: d.id, deal: d, brand: d.brand, del: d.del, sub: d.title || d.del, due, status, late, onYou, group, sentAt: d.stage === 'submitted' ? sentAt(d, a) : undefined };
  });
}

const byDue = (x: DRow, y: DRow) => (x.due || '9999').localeCompare(y.due || '9999') || x.brand.localeCompare(y.brand);
export const GROUPS: { key: Group; label: string }[] = [
  { key: 'needs', label: 'Needs you now' }, { key: 'soon', label: 'Due soon' }, { key: 'later', label: 'Later' }, { key: 'done', label: 'Approved & posted' },
];
export function grouped(rows: DRow[]) {
  return GROUPS.map(g => ({ ...g, rows: rows.filter(r => r.group === g.key).sort(g.key === 'needs' ? (x, y) => Number(y.late) - Number(x.late) || byDue(x, y) : byDue) })).filter(g => g.rows.length);
}

export interface Tile { label: string; right: string; n: number; next: string }
const nextLine = (r?: DRow, date?: string | null) => r ? `Next: ${r.brand} · ${r.del} · ${(date ?? r.due) ? short((date ?? r.due)!) : 'No date set'}` : 'Next: nothing yet';

export function header(rows: DRow[]) {
  return { onYou: rows.filter(r => r.onYou).length, late: rows.filter(r => r.late).length, date: headerDate(todayISO()) };
}

export function tiles(rows: DRow[]): Tile[] {
  const today = todayISO(), week = addDays(today, 6), month = today.slice(0, 7);
  const lateRows = rows.filter(r => r.late).sort(byDue);
  const thisWeek = rows.filter(r => NOT_SUBMITTED.includes(r.deal.stage) && r.due && r.due >= today && r.due <= week).sort(byDue);
  const awaiting = rows.filter(r => r.status === 'brand').sort(byDue);
  const rev = rows.filter(r => r.status === 'revision').sort(byDue);
  const posted = rows.filter(r => r.status === 'posted' && r.deal.postedAt!.startsWith(month)).sort((x, y) => y.deal.postedAt!.localeCompare(x.deal.postedAt!));
  return [
    { label: 'Due this week', right: `${lateRows.length} late`, n: thisWeek.length, next: nextLine(lateRows[0] || thisWeek[0]) },
    { label: 'Awaiting approval', right: 'With brands', n: awaiting.length, next: nextLine(awaiting[0]) },
    { label: 'Revision requested', right: 'Needs you', n: rev.length, next: nextLine(rev[0]) },
    { label: 'Posted', right: 'This period', n: posted.length, next: nextLine(posted[0], posted[0]?.deal.postedAt) },
  ];
}

/** "2 days late", "In 2 days", "Today"... under the due date. */
export function dueNote(r: DRow): string {
  if (r.status === 'posted') return `Posted ${short(r.deal.postedAt!)}`;
  if (r.status === 'brand' && r.sentAt) { const n = -gap(istDate(r.sentAt), todayISO()); return n <= 0 ? 'Sent today' : `Sent ${n} day${n === 1 ? '' : 's'} ago`; }
  if (!r.due || r.status === 'approved') return '';
  const n = gap(r.due, todayISO());
  return n < 0 ? `${-n} day${n === -1 ? '' : 's'} late` : n === 0 ? 'Due today' : n === 1 ? 'Tomorrow' : `In ${n} days`;
}

export interface Day { iso: string; day: number; dow: string; today: boolean; rows: DRow[] }
/** Two weeks from this week's Monday. Deals sit on their due date; deals with no date are left off. */
export function calendar(rows: DRow[]): { weeks: { label: string; from: string; to: string; days: Day[] }[]; undated: number; from: string; to: string } {
  const today = todayISO(), mon = mondayOf(today);
  const weeks = [0, 1].map(w => {
    const from = addDays(mon, w * 7);
    const days: Day[] = Array.from({ length: 7 }, (_, i) => {
      const iso = addDays(from, i);
      return { iso, day: +iso.slice(8), dow: dowName(iso), today: iso === today, rows: rows.filter(r => r.due === iso).sort((x, y) => x.brand.localeCompare(y.brand)) };
    });
    return { label: w ? 'Next week' : 'This week', from, to: addDays(from, 6), days };
  });
  return { weeks, undated: rows.filter(r => !r.due).length, from: mon, to: addDays(mon, 13) };
}
