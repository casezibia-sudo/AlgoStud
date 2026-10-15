import { effStage, trackIndex, STAGE, type Account, type Deal } from '@/api';
import { DAY, daysFrom } from './format';

// Definitions (kept in one place so every dashboard section agrees):
//  - Money at risk: approved, due (invoiced) and overdue deals. Drafts, unconfirmed deals and work not yet approved never count.
//  - Next payout: the due (not yet past due) deal with the earliest payment date.
//  - Due this week: due deals whose payment date is today through today + 6.
const outstanding = (d: Deal) => Math.max(0, d.n - (d.received || 0));
const sum = (a: Deal[]) => a.reduce((s, d) => s + outstanding(d), 0);

export interface Insight { big: string; head: string; sub: string }

export function dashboardStats(a: Account) {
  const deals = a.deals;
  const by = (...s: string[]) => deals.filter(d => s.includes(effStage(d)));
  const owed = by('approved', 'due'), overdue = by('overdue');
  const upcoming = by('due').filter(d => d.dueISO && daysFrom(d.dueISO) >= 0).sort((x, y) => x.dueISO!.localeCompare(y.dueISO!));
  const week = upcoming.filter(d => daysFrom(d.dueISO!) <= 6);
  const notYetApproved = by('confirmed', 'wip', 'revision', 'submitted');

  const reached = (min: number) => deals.filter(d => trackIndex(effStage(d)) >= min).length;
  const funnel = [
    { label: 'Sent', n: reached(1) }, { label: 'Confirmed', n: reached(2) }, { label: 'Submitted', n: reached(3) },
    { label: 'Approved', n: reached(4) }, { label: 'Paid', n: reached(6) },
  ];

  const insights: Insight[] = [];
  if (overdue.length) insights.push({ big: String(overdue.length), head: `${overdue.length === 1 ? 'Deal is' : 'Deals are'} past the agreed payment date.`, sub: 'Send a reminder from the deal page to get paid sooner.' });
  const waiting = deals.filter(d => STAGE[effStage(d)].turn === 'brand');
  if (waiting.length) insights.push({ big: String(waiting.length), head: `${waiting.length === 1 ? 'Deal is' : 'Deals are'} waiting on a brand.`, sub: 'These move forward as soon as the brand answers or pays.' });
  const times = deals.filter(d => d.paidAt && d.approvedAt).map(d => (Date.parse(d.paidAt!) - Date.parse(d.approvedAt!)) / DAY).filter(n => n >= 0);
  if (times.length) { const avg = Math.round(times.reduce((s, n) => s + n, 0) / times.length); insights.push({ big: `${avg} day${avg === 1 ? '' : 's'}`, head: 'Average time from approval to payment.', sub: `Based on ${times.length} paid deal${times.length === 1 ? '' : 's'}.` }); }

  return {
    owed: sum(owed), overdue: sum(overdue), atRisk: sum(owed) + sum(overdue), overdueN: overdue.length,
    atRiskN: new Set([...owed, ...overdue].map(d => d.id)).size,
    notYetApproved: sum(notYetApproved), notYetApprovedN: notYetApproved.length,
    next: upcoming[0] || null, week, funnel, insights: insights.slice(0, 3),
  };
}
export { outstanding };
