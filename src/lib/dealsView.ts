import { effStage, nextStep, STAGE, type Account, type Deal } from '@/api';
import { daysFrom, istDate, todayISO } from './format';

// How the Deals page groups and words things (one place, so the list, the board and the header agree).
//  - Chips: Offer = draft; Terms = sent + confirmed (+ the demo-only "changes requested" / "link expired");
//    Delivery = in progress, revision, submitted, approved; Payment = invoiced, including overdue; Done = paid.
//    Cancelled, declined and archived deals are hidden.
//  - "All" means every OPEN deal (everything except Done), as in the design.
//  - Needs you / Waiting on brand come from STAGE[...].turn.
export type ChipKey = 'offer' | 'terms' | 'delivery' | 'payment' | 'done';
export const CHIPS: { key: ChipKey; label: string }[] = [
  { key: 'offer', label: 'Offer' }, { key: 'terms', label: 'Terms' }, { key: 'delivery', label: 'Delivery' },
  { key: 'payment', label: 'Payment' }, { key: 'done', label: 'Done' },
];
export const BOARD: { key: ChipKey; label: string }[] = [
  { key: 'offer', label: 'Offer' }, { key: 'terms', label: 'Terms confirmed' }, { key: 'delivery', label: 'Delivery' },
  { key: 'payment', label: 'Payment' }, { key: 'done', label: 'Closed' },
];

const CHIP_OF: Record<string, ChipKey | null> = {
  draft: 'offer', sent: 'terms', changes: 'terms', expired: 'terms', confirmed: 'terms',
  wip: 'delivery', revision: 'delivery', submitted: 'delivery', approved: 'delivery',
  due: 'payment', overdue: 'payment', paid: 'done',
  declined: null, cancelled: null, archived: null,
};
export const chipOf = (d: Deal): ChipKey | null => CHIP_OF[effStage(d)] ?? null;
export const isOpen = (d: Deal) => { const c = chipOf(d); return c !== null && c !== 'done'; };

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const dm = (iso: string) => `${+iso.slice(8, 10)} ${MON[+iso.slice(5, 7) - 1]}`;
export const rupee = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
const daysAgo = (iso: string) => Math.max(0, -daysFrom(istDate(iso)));

export type Tone = 'red' | 'amber' | 'grey' | 'green';
export interface Status { label: string; sub?: string; tone: Tone }

/** The one-line status ("Payment 9 days late") with its second line. */
export function statusOf(d: Deal): Status {
  const s = effStage(d), step = nextStep(d);
  switch (s) {
    case 'overdue': return { tone: 'red', label: `Payment ${d.dueISO ? -daysFrom(d.dueISO) : ''} days late`.replace('  ', ' '), sub: d.dueISO ? `Due ${dm(d.dueISO)}` : undefined };
    case 'due': { const n = d.dueISO ? daysFrom(d.dueISO) : null; return { tone: 'grey', label: n === null ? 'Payment due' : n === 0 ? 'Payment due today' : `Payment due in ${n} days`, sub: d.dueISO ? `Due ${dm(d.dueISO)}` : undefined }; }
    case 'revision': return { tone: 'amber', label: 'Revision requested', sub: d.notes ? d.notes.slice(0, 60) : 'Upload a new version' };
    case 'submitted': return { tone: 'grey', label: 'Brand reviewing', sub: d.submittedAt ? `Sent ${daysAgo(d.submittedAt)} days ago` : 'Waiting for approval' };
    case 'sent': return { tone: 'grey', label: 'Offer sent', sub: d.sentAt ? `Sent ${daysAgo(d.sentAt)} days ago` : 'Waiting on the brand' };
    case 'changes': return { tone: 'amber', label: 'Changes requested', sub: step?.hint };
    case 'expired': return { tone: 'amber', label: 'Link expired', sub: step?.hint };
    case 'draft': return { tone: 'grey', label: 'Draft not sent', sub: d.missing?.length ? `Add ${d.missing.join(' and ')} to send` : 'Ready to send' };
    case 'confirmed': return { tone: 'amber', label: 'Terms confirmed', sub: step?.hint };
    case 'wip': return { tone: 'amber', label: 'In progress', sub: step?.hint };
    case 'approved': return { tone: 'amber', label: 'Approved', sub: step?.hint };
    case 'paid': return { tone: 'green', label: `Paid${d.paidAt ? ' ' + dm(d.paidAt.slice(0, 10)) : ''}` };
    default: return { tone: 'grey', label: STAGE[s].label };
  }
}

export interface Action { label: string; /** brand-side or not built yet: show the "arrives in a later update" notice */ later?: string; link?: string; primary?: boolean }
/** The button on a deal, from nextStep(). Brand-side buttons only show the later-update notice. */
export function actionOf(d: Deal): Action | null {
  const s = effStage(d), step = nextStep(d);
  if (s === 'paid') return { label: 'View record', link: `/app/deals/${d.id}/record` };
  if (!step) return null;
  if (step.kind === 'remind-pay') return s === 'overdue' ? { label: 'Send reminder', later: 'Sending reminders', primary: true } : { label: 'Remind', later: 'Sending reminders' };
  if (step.kind === 'remind-approval') return { label: 'Nudge', later: 'Sending reminders' };
  if (step.kind === 'remind-terms') return { label: 'Follow up', later: 'Sending reminders' };
  return { label: step.label.replace(/ to .*$/, '').replace(/ for .*$/, '') };
}

export interface DealsHeader { open: number; overdue: number; received: number; monthLabel: string; lateN: number; needN: number }
export function dealsHeader(a: Account): DealsHeader {
  const month = todayISO().slice(0, 7), live = a.deals.filter(d => chipOf(d) !== null);
  return {
    open: live.filter(isOpen).reduce((s, d) => s + d.n, 0),
    overdue: live.filter(d => effStage(d) === 'overdue').reduce((s, d) => s + d.n, 0),
    received: live.filter(d => d.paidAt && d.paidAt.slice(0, 7) === month).reduce((s, d) => s + (d.received ?? d.n), 0),
    monthLabel: MON[+month.slice(5) - 1],
    lateN: live.filter(d => effStage(d) === 'overdue').length,
    needN: live.filter(d => isOpen(d) && STAGE[effStage(d)].turn === 'you').length,
  };
}
