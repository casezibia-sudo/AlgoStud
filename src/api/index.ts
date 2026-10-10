import { useSyncExternalStore } from 'react';
import { localApi } from './local';
import type { Deal, Stage } from './types';
import { daysFrom, todayISO } from '@/lib/format';

// Swap this for a fetch-based client with the same shape when the backend exists.
export const api = localApi;
export * from './types';

export function useStore() {
  return useSyncExternalStore(api.subscribe, api.snapshot);
}
export function useAccount() {
  const s = useStore();
  return s.account;
}

export const isOverdue = (d: Deal) => d.stage === 'due' && !!d.dueISO && d.dueISO < todayISO();
export const effStage = (d: Deal): Stage => (isOverdue(d) ? 'overdue' : d.stage);

type Tone = 'neutral' | 'info' | 'positive' | 'warning' | 'critical';
export const STAGE: Record<Stage, { label: string; tone: Tone; turn: 'you' | 'brand' | 'done' }> = {
  draft: { label: 'Draft', tone: 'neutral', turn: 'you' },
  sent: { label: 'Sent to brand', tone: 'info', turn: 'brand' },
  changes: { label: 'Changes requested', tone: 'warning', turn: 'you' },
  expired: { label: 'Link expired', tone: 'warning', turn: 'you' },
  declined: { label: 'Declined', tone: 'neutral', turn: 'done' },
  cancelled: { label: 'Cancelled', tone: 'neutral', turn: 'done' },
  confirmed: { label: 'Terms confirmed', tone: 'positive', turn: 'you' },
  wip: { label: 'In progress', tone: 'positive', turn: 'you' },
  submitted: { label: 'Awaiting approval', tone: 'info', turn: 'brand' },
  revision: { label: 'Revision requested', tone: 'warning', turn: 'you' },
  approved: { label: 'Approved', tone: 'positive', turn: 'you' },
  due: { label: 'Payment due', tone: 'warning', turn: 'brand' },
  overdue: { label: 'Overdue', tone: 'critical', turn: 'you' },
  paid: { label: 'Paid', tone: 'positive', turn: 'done' },
  archived: { label: 'Archived', tone: 'neutral', turn: 'done' },
};

export const TRACK: { key: string; label: string; stages: Stage[] }[] = [
  { key: 'draft', label: 'Draft', stages: ['draft'] },
  { key: 'sent', label: 'Sent', stages: ['sent', 'changes', 'expired'] },
  { key: 'work', label: 'In progress', stages: ['confirmed', 'wip', 'revision'] },
  { key: 'submitted', label: 'Submitted', stages: ['submitted'] },
  { key: 'approved', label: 'Approved', stages: ['approved'] },
  { key: 'due', label: 'Payment due', stages: ['due', 'overdue'] },
  { key: 'paid', label: 'Paid', stages: ['paid', 'archived'] },
];
export const trackIndex = (s: Stage) => TRACK.findIndex(t => t.stages.includes(s));

/** The one thing the creator should do next on a deal. */
export function nextStep(d: Deal): { label: string; hint: string; kind: string } | null {
  const s = effStage(d);
  switch (s) {
    case 'draft': return d.missing?.length ? { kind: 'edit', label: 'Finish terms', hint: 'Add ' + d.missing.join(' and ') + ' to send.' } : { kind: 'send', label: 'Send to brand', hint: 'Terms are ready.' };
    case 'sent': return { kind: 'remind-terms', label: `Send reminder to ${d.brand}`, hint: d.openedAt ? 'Opened, no answer yet.' : 'Not opened yet.' };
    case 'changes': return { kind: 'new-version', label: 'Send new version', hint: `${d.brand} asked to change ${d.changes?.areas.join(', ') || 'the terms'}.` };
    case 'expired': return { kind: 'resend', label: 'Send new link', hint: `${d.brand} didn't answer in 7 days.` };
    case 'declined': return { kind: 'new-version', label: 'Create new version', hint: d.reason ? 'Reason: ' + d.reason : 'No reason given.' };
    case 'confirmed': case 'wip': return { kind: 'submit', label: `Submit ${d.first}`, hint: 'Send the work for approval.' };
    case 'revision': return { kind: 'submit', label: `Submit revision for ${d.first}`, hint: d.notes ? `“${d.notes}”` : 'The brand asked for changes.' };
    case 'submitted': return { kind: 'remind-approval', label: `Remind ${d.brand} to review`, hint: 'Waiting for approval.' };
    case 'approved': return { kind: 'posting', label: 'Add posting date', hint: d.trigger === 'Days after posting' || d.trigger === 'On posting' ? 'Payment is counted from the posting date.' : 'Used to track usage rights.' };
    case 'due': return { kind: 'remind-pay', label: 'Send payment reminder', hint: d.dueISO ? `Due in ${daysFrom(d.dueISO)} days.` : 'Payment is due.' };
    case 'overdue': return { kind: 'remind-pay', label: 'Send payment reminder', hint: d.dueISO ? `Overdue by ${-daysFrom(d.dueISO)} days.` : 'Payment is overdue.' };
    default: return null;
  }
}
