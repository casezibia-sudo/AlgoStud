import { type Account, type Deal } from '@/api';
import { DAY } from './format';
import { tint } from './dashboardStats';

// Brands are built from deals, grouped by brand name (trimmed, case-insensitive).
//  - Earned: paid deals (what was received).
//  - Usually pays in: average days from the "Payment due" event (written when a deal is invoiced) to the paid date;
//    falls back to the approval date, and a deal with neither is left out.
//  - Payment record: one chip per paid deal that has a payment date: on time (paid on or before it) or N days late.
//  - Level: 3+ deals = repeat, 2 = returning, 1 = new. The Repeat filter is 2+ deals, New is 1.
//  - Category is not stored, so none is shown.
export type Level = 'repeat' | 'returning' | 'new';
export interface RecordChip { onTime: boolean; daysLate: number }
export interface BrandRec {
  key: string; name: string; initials: string; bg: string; fg: string;
  deals: Deal[]; count: number; earned: number; open: number;
  paysIn: number | null; record: RecordChip[]; since: string | null; contact: string; email: string; level: Level;
}

const day = (iso: string) => Date.parse(iso.slice(0, 10));
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const sinceLabel = (iso: string) => `${MON[+iso.slice(5, 7) - 1]} ${iso.slice(0, 4)}`;
const initialsOf = (s: string) => s.split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

export function brandStats(a: Account): BrandRec[] {
  const groups = new Map<string, Deal[]>();
  a.deals.filter(d => d.stage !== 'cancelled' && d.stage !== 'declined').forEach(d => {
    const k = String(d.brand ?? '').trim().toLowerCase(); if (!k) return;
    groups.set(k, [...(groups.get(k) || []), d]);
  });
  const recs = [...groups.entries()].map(([key, deals]): BrandRec => {
    const name = String(deals[0].brand).trim(), [bg, fg] = tint(name);
    const paid = deals.filter(d => d.paidAt || d.stage === 'paid');
    const days = paid.flatMap(d => {
      if (!d.paidAt) return [];
      const inv = a.events.filter(e => e.dealId === d.id && /^payment due/i.test(e.title)).sort((x, y) => x.at.localeCompare(y.at))[0];
      const from = inv?.at || d.approvedAt;
      return from ? [Math.max(0, Math.round((day(d.paidAt) - day(from)) / DAY))] : [];
    });
    const firstSeen = deals.map(d => d.createdAt || d.sentAt || a.events.filter(e => e.dealId === d.id).map(e => e.at).sort()[0]).filter(Boolean).sort()[0];
    const latest = [...deals].sort((x, y) => (y.sentAt || '').localeCompare(x.sentAt || ''))[0];
    return {
      key, name, initials: initialsOf(name), bg, fg, deals, count: deals.length,
      earned: paid.reduce((s, d) => s + (d.received ?? d.n), 0),
      open: deals.filter(d => !(d.paidAt || d.stage === 'paid' || d.stage === 'archived')).reduce((s, d) => s + d.n, 0),
      paysIn: days.length ? Math.round(days.reduce((s, n) => s + n, 0) / days.length) : null,
      record: paid.filter(d => d.paidAt && d.dueISO).map(d => { const late = Math.round((day(d.paidAt!) - day(d.dueISO!)) / DAY); return { onTime: late <= 0, daysLate: Math.max(0, late) }; }),
      since: firstSeen ? firstSeen.slice(0, 10) : null,
      contact: latest?.contact || deals.find(d => d.contact)?.contact || '', email: latest?.email || deals.find(d => d.email)?.email || '',
      level: deals.length >= 3 ? 'repeat' : deals.length === 2 ? 'returning' : 'new',
    };
  });
  return recs.sort((x, y) => y.earned - x.earned || y.count - x.count || x.name.localeCompare(y.name));
}
