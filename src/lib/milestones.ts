import type { Deal } from '@/api';
import { istDate } from './format';

// ======================= RULES: change these to change the profile menu and avatar =======================
// A deal counts as "closed" once it has been paid.
// Milestones are numbers of closed deals. The "next milestone" is the first one above your closed count.
export const MILESTONES = [1, 5, 10, 25, 50, 100];

// "Paid on time" = paid on or before the payment date (India date). Deals without a payment date can't be measured.
// Badges: first = 1 closed, five = 5 closed, onTime = at least ON_TIME_MIN_DEALS closed AND ON_TIME_MIN_RATE paid on time,
// ten = locked until 10 closed.
export const ON_TIME_MIN_DEALS = 5;
export const ON_TIME_MIN_RATE = 0.8;
export const BADGE_RULES = [
  { id: 'first', label: 'First deal', icon: 'handshake', unlocked: (s: Basics) => s.closed >= 1 },
  { id: 'five', label: '5 deals closed', icon: 'award', unlocked: (s: Basics) => s.closed >= 5 },
  { id: 'onTime', label: 'On-time payer', icon: 'check', unlocked: (s: Basics) => s.closed >= ON_TIME_MIN_DEALS && s.rate >= ON_TIME_MIN_RATE },
  { id: 'ten', label: '10 deals closed', icon: 'lock', unlocked: (s: Basics) => s.closed >= 10 },
] as const;
// ===========================================================================================================

interface Basics { closed: number; onTime: number; measurable: number; rate: number }
export type BadgeIcon = (typeof BADGE_RULES)[number]['icon'];
export interface Badge { id: string; label: string; icon: BadgeIcon; unlocked: boolean }
export interface Milestones extends Basics {
  /** Next milestone to reach, or null when the last one is done. */
  next: number | null;
  /** Deals still to close to reach it (0 when there is no next). */
  toGo: number;
  /** 0..1, progress between the previous milestone and the next one. */
  progress: number;
  badges: Badge[];
}

const isClosed = (d: Deal) => !!d.paidAt || d.stage === 'paid';

export function milestones(deals: Deal[]): Milestones {
  const paid = deals.filter(isClosed);
  const measurable = paid.filter(d => d.paidAt && d.dueISO);
  const onTime = measurable.filter(d => istDate(d.paidAt!) <= d.dueISO!).length;
  const closed = paid.length;
  const rate = measurable.length ? onTime / measurable.length : 0;
  const basics: Basics = { closed, onTime, measurable: measurable.length, rate };

  const next = MILESTONES.find(m => m > closed) ?? null;
  const prev = [...MILESTONES].reverse().find(m => m <= closed) ?? 0;
  return {
    ...basics, next,
    toGo: next === null ? 0 : next - closed,
    progress: next === null ? 1 : (closed - prev) / (next - prev),
    badges: BADGE_RULES.map(b => ({ id: b.id, label: b.label, icon: b.icon, unlocked: b.unlocked(basics) })),
  };
}
