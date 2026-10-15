import type { DealDraft, PaymentStructure, Template, Trigger } from '@/api';

// The Create Deal form: what counts as filled, what is valid, and how it becomes a draft deal.
//  - "N of 9 key terms" counts these nine as filled; the warning lists the missing ones.
//  - Save as draft needs only a brand name. Save Deal needs all nine.
//  - Amount is typed in rupees (₹ and commas tolerated) and stored as paise by the API layer.
//  - "Paid within N days of going live / invoice" is payment_trigger 'Days after posting' / 'On approval' + days.
//    "Full advance" has no due date until it is marked paid (TODO slice 6: due N days after confirmation).
export const KEY_TERMS = [
  { key: 'brand', label: 'brand name' }, { key: 'contact', label: 'contact person' }, { key: 'del', label: 'deliverables' },
  { key: 'amount', label: 'payment amount' }, { key: 'payment', label: 'payment type' }, { key: 'firstDraft', label: 'first draft date' },
  { key: 'finalDelivery', label: 'final delivery date' }, { key: 'usage', label: 'usage rights' }, { key: 'revisions', label: 'revision limit' },
] as const;
export type TermKey = (typeof KEY_TERMS)[number]['key'];

export const STRUCTURES: { value: PaymentStructure; label: string; hint: string }[] = [
  { value: 'full_after_posting', label: 'Full payment after posting', hint: 'One payment once the content is live.' },
  { value: 'advance_balance', label: 'Advance + balance', hint: 'Part up front, the rest later.' },
  { value: 'full_advance', label: 'Full advance', hint: 'Everything is paid before you start.' },
];
export const REVISION_CHOICES = [0, 1, 2, 3] as const;
export type Basis = 'going_live' | 'invoice';

export interface FormState {
  message: string; brand: string; contact: string; email: string; del: string; amount: string;
  structure: PaymentStructure | ''; basis: Basis | ''; payDays: string; advancePct: string;
  firstDraft: string; finalDelivery: string; usage: string; revisions: number;
}
export const emptyForm = (over: Partial<FormState> = {}): FormState => ({
  message: '', brand: '', contact: '', email: '', del: '', amount: '', structure: '', basis: '', payDays: '', advancePct: '50',
  firstDraft: '', finalDelivery: '', usage: '', revisions: 2, ...over,
});
export const isDirty = (a: FormState, b: FormState) => (Object.keys(a) as (keyof FormState)[]).some(k => a[k] !== b[k]);

export type Amount = { ok: true; rupees: number; paise: number } | { ok: false; message: string };
/** Rupees as typed. Rejects empty, non-numbers, zero and negatives with a message that says what to do. */
export function parseAmount(text: string): Amount {
  const t = text.trim();
  if (!t) return { ok: false, message: 'Enter the payment amount in rupees, for example 25000.' };
  const clean = t.replace(/[₹,\s]/g, '');
  if (!/^-?\d+(\.\d+)?$/.test(clean)) return { ok: false, message: 'Enter the amount as a number in rupees, for example 25000.' };
  const n = Number(clean);
  if (n <= 0) return { ok: false, message: 'The amount must be more than ₹0.' };
  if (/\.\d{3,}/.test(clean)) return { ok: false, message: 'Use at most 2 decimal places.' };
  if (n > 1e9) return { ok: false, message: 'That amount is too large. Check the number of zeros.' };
  return { ok: true, rupees: n, paise: Math.round(n * 100) };
}

const wholeNumber = (s: string, min: number, max: number) => (/^\d+$/.test(s.trim()) && +s >= min && +s <= max ? +s : null);

export interface Check { filled: Record<TermKey, boolean>; problems: Partial<Record<TermKey, string>>; count: number; missing: string[] }
/** Which of the nine key terms are filled, and what is wrong with the ones that aren't. */
export function check(f: FormState): Check {
  const problems: Partial<Record<TermKey, string>> = {};
  const filled = {} as Record<TermKey, boolean>;
  const set = (k: TermKey, ok: boolean, why: string) => { filled[k] = ok; if (!ok) problems[k] = why; };

  set('brand', !!f.brand.trim(), 'Add the brand name.');
  set('contact', !!f.contact.trim(), 'Add who you are dealing with, a name or an @handle.');
  set('del', !!f.del.trim(), 'Say what you are creating: format, quantity and platform.');
  const amt = parseAmount(f.amount);
  set('amount', amt.ok, amt.ok ? '' : amt.message);

  const days = wholeNumber(f.payDays, 0, 365), pct = wholeNumber(f.advancePct, 1, 99);
  let payWhy = '';
  if (!f.structure) payWhy = 'Choose how you will be paid.';
  else if (f.structure !== 'full_advance' && (!f.basis || days === null)) payWhy = 'Enter the number of days (0 to 365) and whether it counts from going live or from the invoice.';
  else if (f.structure === 'advance_balance' && pct === null) payWhy = 'Enter the advance share, between 1 and 99%.';
  set('payment', !payWhy, payWhy);

  set('firstDraft', !!f.firstDraft, 'Choose the date of the first draft.');
  const order = !!f.firstDraft && !!f.finalDelivery && f.finalDelivery < f.firstDraft;
  set('finalDelivery', !!f.finalDelivery && !order, order ? "Final delivery can't be before the first draft." : 'Choose the final delivery date.');
  set('usage', !!f.usage.trim(), 'Say where and for how long the brand can use the content.');
  set('revisions', REVISION_CHOICES.includes(f.revisions as 0 | 1 | 2 | 3), 'Choose the number of revisions.');

  return { filled, problems, count: KEY_TERMS.filter(t => filled[t.key]).length, missing: KEY_TERMS.filter(t => !filled[t.key]).map(t => t.label) };
}

/** What Save as draft needs: a brand name, and an amount that is a real amount if one was typed. */
export function draftProblem(f: FormState): { field: TermKey; message: string } | null {
  if (!f.brand.trim()) return { field: 'brand', message: 'Add the brand name to save a draft.' };
  if (f.amount.trim()) { const a = parseAmount(f.amount); if (!a.ok) return { field: 'amount', message: a.message }; }
  return null;
}

/** The form as a draft deal for api.deals.create. Amount stays in rupees here; the API layer converts it to paise. */
export function toDraft(f: FormState): DealDraft {
  const amt = parseAmount(f.amount), days = wholeNumber(f.payDays, 0, 365), pct = wholeNumber(f.advancePct, 1, 99);
  const timed = !!f.structure && f.structure !== 'full_advance' && !!f.basis && days !== null;
  return {
    brand: f.brand.trim(), contact: f.contact.trim(), email: f.email.trim(), del: f.del.trim(), n: amt.ok ? amt.rupees : 0,
    due: timed ? `${days} days` : '',
    // Full advance (or nothing chosen yet) has no payment trigger: there is no due date until it is paid.
    trigger: (timed ? (f.basis === 'going_live' ? 'Days after posting' : 'On approval') : null) as unknown as Trigger,
    usage: f.usage.trim() || null, rev: `${f.revisions} included`,
    firstDraftDate: f.firstDraft || undefined, finalDeliveryDate: f.finalDelivery || undefined,
    paymentStructure: f.structure || undefined, advancePercent: f.structure === 'advance_balance' && pct !== null ? pct : undefined,
    src: f.message.trim() ? 'Pasted message' : 'Manual', message: f.message,
  };
}

/** Fill the form from a template. Older templates may only know deliverables, usage, revisions and a payment trigger. */
export function applyTemplate(f: FormState, t: Template): FormState {
  const rev = parseInt(t.rev, 10);
  const basis: Basis | '' = t.trigger === 'Days after posting' || t.trigger === 'On posting' ? 'going_live' : t.trigger === 'On approval' ? 'invoice' : '';
  const structure = t.payStructure || (basis ? 'full_after_posting' : '');
  return {
    ...f, del: t.del || f.del, usage: t.usageFull || f.usage,
    revisions: Number.isFinite(rev) ? Math.min(3, Math.max(0, rev)) : f.revisions,
    structure, basis: structure === 'full_advance' ? '' : basis,
    payDays: structure === 'full_advance' ? '' : t.payDays != null ? String(t.payDays) : t.trigger === 'On posting' ? '0' : f.payDays,
    advancePct: t.advancePct != null ? String(t.advancePct) : f.advancePct,
  };
}

export const templateLine = (t: Template) => `${t.del || 'No deliverables'}${t.payDays != null ? ` · paid in ${t.payDays} days` : t.trigger ? ` · ${t.trigger.toLowerCase()}` : ''}`;
