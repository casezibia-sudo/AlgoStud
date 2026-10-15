export type Stage =
  | 'draft' | 'sent' | 'changes' | 'expired' | 'declined' | 'cancelled'
  | 'confirmed' | 'wip' | 'submitted' | 'revision' | 'approved'
  | 'due' | 'overdue' | 'paid' | 'archived';

/** The nine stages the database stores. The UI Stage above is derived from these (wip, due, overdue, archived...). */
export type DbStage = 'draft' | 'sent' | 'confirmed' | 'in_progress' | 'submitted' | 'approved' | 'invoiced' | 'paid' | 'cancelled';

export type Trigger = 'On approval' | 'On posting' | 'Days after posting' | 'Fixed date';
export type Channel = 'WhatsApp' | 'Copy link' | 'Email' | 'Instagram DM';

export interface Feedback { note: string; at: string; by: string; v: number }

export interface Item {
  state: 'todo' | 'submitted' | 'revision' | 'approved';
  v: number;
  due: string | null;
  platform: string;
  format: string;
  sentAt?: string;
  revs?: number;
  feedback?: Feedback;
  by?: string;
  at?: string;
  draft?: { link: string; note?: string };
}

export interface Deal {
  id: string;
  brand: string;
  contact: string;
  email: string;
  del: string;
  first: string;
  n: number;
  stage: Stage;
  due: string | null;
  trigger: Trigger;
  usage: string | null;
  rev: string;
  src: string;
  version?: number;
  notes?: string;
  reason?: string;
  ref?: string;
  missing?: string[];
  items?: Record<string, Item>;
  seed?: boolean;
  sentAt?: string;
  expiresAt?: string;
  openedAt?: string | null;
  channel?: string;
  confirmedAt?: string;
  confirmedBy?: string;
  confirmedVersion?: number;
  pendingVersion?: number;
  agreedVersion?: number;
  changes?: { areas: string[]; note: string; at: string; by: string; v: number };
  declinedAt?: string;
  expiredAt?: string;
  cancelledAt?: string;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  dueISO?: string;
  postedAt?: string;
  usageEnds?: string;
  paidAt?: string;
  received?: number;
  unclear?: { reason: string; note: string; at: string };
  lastReminderAt?: string;
  lastReminderChannel?: string;
  reminders?: number;
  archivedAt?: string;
  /** Supabase-backed deals only: the stage exactly as stored. */
  dbStage?: DbStage;
}

export interface TermsSnapshot { brand: string; contact: string; del: string; n: number; due: string | null; trigger: Trigger; usage: string | null; rev: string }
export interface TermsVersion { dealId: string; n: number; terms: TermsSnapshot; status: string; at: string }

export interface Link {
  token: string;
  dealId: string;
  kind: 'd' | 'a';
  version: number;
  channel?: string;
  items?: string[];
  createdAt: string;
  expiresAt: string | null;
  firstOpenedAt: string | null;
  state: 'active' | 'answered' | 'expired' | 'replaced' | 'cancelled';
}

export interface Submission {
  id: string; dealId: string; item: string; v: number; link: string; caption?: string; note?: string; at: string;
  state: 'sent' | 'replaced' | 'approved' | 'revision';
  feedback?: string; approvedBy?: string; approvedAt?: string; replying?: Feedback;
}

export interface Verification { dealId: string; device: string; email: string; at: string; validUntil: string }

export type Answer =
  | { token: string; at: string; type: 'confirm'; name: string; item?: undefined }
  | { token: string; at: string; type: 'changes'; areas: string[]; note: string; item?: undefined }
  | { token: string; at: string; type: 'decline'; reason?: string; item?: undefined }
  | { token: string; at: string; type: 'approve'; name: string; item: string }
  | { token: string; at: string; type: 'revision'; note: string; item: string };

export type AnswerInput =
  | { type: 'confirm'; name: string }
  | { type: 'changes'; areas: string[]; note: string }
  | { type: 'decline'; reason?: string };
export type WorkAnswerInput = { type: 'approve'; name: string } | { type: 'revision'; note: string };

export interface Payment { id: string; dealId: string; amount: number; date: string; ref: string; at: string }

export interface Template {
  id: string; name: string; del: string; usage: string; usageFull: string; trigger: Trigger; rev: string; used: number;
}

export interface Reminder { dealId: string; kind: 'payment' | 'approval' | 'terms'; channel: string; text?: string; at: string }

export type Tone = 'info' | 'positive' | 'warning' | 'critical' | 'neutral';
export interface DealEvent { id: string; dealId: string; actor: 'creator' | 'brand' | 'system'; tone: Tone; title: string; detail?: string; icon?: string; at: string }

export interface Prefs { dueSoon: boolean; expiring: boolean; answers: boolean }

export interface Creator {
  email: string; name: string; handle: string; paymentLink?: string; defaultTrigger?: Trigger;
  deletion: { requestedAt: string; scheduledFor: string } | null; createdAt: string; prefs?: Prefs;
}

/** Rows in Supabase `profiles` and `settings` (supabase/migrations/0001). */
export interface Profile {
  id: string; name: string; handle: string; payment_link: string | null;
  deletion_requested_at: string | null; deletion_scheduled_for: string | null;
  created_at?: string;
}
export interface CreatorSettings {
  creator_id: string; default_trigger: Trigger;
  notify_answers: boolean; notify_expiring: boolean; notify_due_soon: boolean;
}

export interface Account {
  creator: Creator;
  deals: Deal[];
  termsVersions: TermsVersion[];
  submissions: Submission[];
  links: Link[];
  verifications: Verification[];
  answers: Answer[];
  payments: Payment[];
  events: DealEvent[];
  templates: Template[];
  reminders: Reminder[];
  deleted?: string[];
}

export interface BrandLinkView {
  link: Link;
  deal: Deal;
  creator: Creator;
  answer: Answer | null;
  answers: Answer[];
  verified: boolean;
  verifiedEmail: string | null;
  latest: string | null;
  closing: boolean;
  email: string;
}

export type DealDraft = Pick<Deal, 'brand' | 'contact' | 'email' | 'del' | 'n' | 'due' | 'trigger' | 'usage' | 'rev'> & { notes?: string; src?: string };
