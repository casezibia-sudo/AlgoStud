import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { api, effStage, nextStep, STAGE, useAccount, type Deal } from '@/api';
import { Avatar, Button, Field, Input, Pill, Select, Sheet, Textarea, useToast } from './ui';
import { SendSheet } from './share';
import { firstName, fmtDate, inr, todayISO } from '@/lib/format';

export function StagePill({ d }: { d: Deal }) {
  const s = STAGE[effStage(d)];
  return <Pill tone={s.tone}>{s.label}</Pill>;
}

export function PageHead({ title, sub, actions, above }: { title: string; sub?: ReactNode; actions?: ReactNode; above?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pt-4 pb-6 lg:pt-6">
      <div className="flex min-w-0 flex-col gap-1">
        {above}
        <h1 className="m-0 text-[28px] lg:text-[32px] font-semibold tracking-[-0.02em] leading-tight">{title}</h1>
        {sub && <p className="m-0 text-sm font-medium text-muted">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function DealRow({ d, action }: { d: Deal; action?: ReactNode }) {
  const step = nextStep(d);
  return (
    <div className="group flex items-center gap-3 px-4 py-3.5 lg:px-6 hover:bg-subtle transition-colors">
      <Avatar name={d.brand} size={36} />
      <Link to={`/app/deals/${d.id}`} className="flex min-w-0 flex-1 flex-col gap-0.5 text-ink hover:text-ink">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="text-sm font-bold">{d.brand}</span><StagePill d={d} /></span>
        <span className="truncate text-[13px] font-medium text-muted">{d.del} · {step?.hint || (d.paidAt ? 'Paid ' + fmtDate(d.paidAt) : '')}</span>
      </Link>
      <span className="hidden sm:block text-sm font-semibold tabular-nums">{inr(d.n)}</span>
      {action ?? <ChevronRight size={18} className="text-muted" />}
    </div>
  );
}

const messages = (d: Deal, creator: string, url = '') => {
  const fn = firstName(d.contact), me = firstName(creator) || '';
  return {
    terms: `Hi ${fn}, here are the terms for ${d.del} with ${d.brand}: ${url}\nYou can confirm them with a code sent to ${d.email}. The link works for 7 days.\nThanks, ${me}`,
    remindTerms: `Hi ${fn}, a quick reminder to review the terms for ${d.del}: ${url}\nThanks, ${me}`,
    remindApproval: `Hi ${fn}, ${d.first} is ready for your review: ${url}\nThanks, ${me}`,
  };
};
export const paymentMessage = (d: Deal, creator: { name: string; paymentLink?: string }) => {
  const late = !!d.dueISO && d.dueISO < todayISO();
  return `Hi ${firstName(d.contact)}, a reminder that ${inr(d.n)} for ${d.del} ${late ? 'was due on' : 'is due on'} ${d.due}, as agreed.${creator.paymentLink ? ' You can pay here: ' + creator.paymentLink + '.' : ''} Thanks, ${firstName(creator.name)}`;
};

/** Runs the next-step action for a deal. Returns a trigger and the sheets to render. */
export function useDealAction() {
  const a = useAccount();
  const nav = useNavigate();
  const toast = useToast();
  const [st, setSt] = useState<{ kind: string; d: Deal; token?: string } | null>(null);
  const close = () => setSt(null);
  const creator = a?.creator.name || '';

  const run = (d: Deal, kind = nextStep(d)?.kind) => {
    if (!kind) return;
    if (kind === 'edit' || kind === 'new-version') return nav(`/app/deals/${d.id}/edit`);
    if (kind === 'send' || kind === 'resend') return setSt({ kind, d, token: api.deals.prepareToken() });
    setSt({ kind, d });
  };

  let sheets: ReactNode = null;
  if (st) {
    const { d } = st;
    const termsTok = api.deals.activeLink(d.id, 'd')?.token;
    const apprTok = api.deals.activeLink(d.id, 'a')?.token;
    const url = (t?: string) => (t ? `${location.origin}/${st.kind.includes('approval') ? 'a' : 'd'}/${t}` : '');
    const m = messages(d, creator, url(st.token || (st.kind === 'remind-approval' ? apprTok : termsTok)));
    if (st.kind === 'send' || st.kind === 'resend')
      sheets = <SendSheet open onClose={close} title={`Send terms to ${d.brand}`} message={m.terms} subject={`Terms for ${d.del}`} note={`${firstName(d.contact)} confirms with a code sent to ${d.email}. The link works for 7 days.`}
        onSent={async c => { try { await api.deals.sendLink(d.id, c, { token: st.token }); toast(c === 'Copy link' ? 'Link copied.' : `Link shared on ${c}.`); } catch (e) { toast((e as Error).message); } }} />;
    if (st.kind === 'remind-terms' || st.kind === 'remind-approval')
      sheets = <SendSheet open onClose={close} title={`Remind ${d.brand}`} message={st.kind === 'remind-terms' ? m.remindTerms : m.remindApproval}
        onSent={async (c, text) => { await api.payments.logReminder(d.id, c, st.kind === 'remind-terms' ? 'terms' : 'approval', text); toast('Reminder logged.'); }} />;
    if (st.kind === 'remind-pay' && a)
      sheets = <SendSheet open onClose={close} title={`Payment reminder to ${d.brand}`} message={paymentMessage(d, a.creator)}
        onSent={async (c, text) => { await api.payments.logReminder(d.id, c, 'payment', text); toast('Reminder logged.'); }} />;
    if (st.kind === 'submit') sheets = <SubmitSheet d={d} onClose={close} />;
    if (st.kind === 'posting') sheets = <PostingSheet d={d} onClose={close} />;
    if (st.kind === 'paid') sheets = <PaidSheet d={d} onClose={close} />;
  }
  return { run, sheets };
}

export function SubmitSheet({ d, onClose, item: initial }: { d: Deal; onClose: () => void; item?: string }) {
  const items = Object.entries(api.deals.items(d)).filter(([, i]) => i.state !== 'approved');
  const [item, setItem] = useState(initial || items.find(([n]) => n === d.first)?.[0] || items[0]?.[0] || '');
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');
  const toast = useToast();
  const it = api.deals.items(d)[item];
  const submit = async () => {
    if (!/^https?:\/\/\S+\.\S+/.test(link)) return setErr('Paste a full link, starting with https://');
    await api.work.submit(d.id, item, { link, note });
    toast(`${item} sent for approval.`); onClose();
  };
  return (
    <Sheet open onClose={onClose} title={it?.state === 'revision' ? `Submit revision for ${item}` : 'Submit work'}
      footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" onClick={submit}>Send for approval</Button></>}>
      {it?.feedback && <div className="rounded-xl bg-warn-tint px-4 py-3 text-[13px] font-medium text-warn">“{it.feedback.note}” · {it.feedback.by}</div>}
      {items.length > 1 && <Field label="Deliverable">{id => <Select id={id} value={item} onChange={e => setItem(e.target.value)}>{items.map(([n]) => <option key={n}>{n}</option>)}</Select>}</Field>}
      <Field label="Link to the work" hint="Google Drive, Instagram draft or similar. Uploads come after V1." error={err}>{id => <Input id={id} inputMode="url" placeholder="https://" value={link} onChange={e => { setLink(e.target.value); setErr(''); }} />}</Field>
      <Field label="Note for the brand (optional)">{id => <Textarea id={id} rows={3} value={note} onChange={e => setNote(e.target.value)} />}</Field>
    </Sheet>
  );
}

function PostingSheet({ d, onClose }: { d: Deal; onClose: () => void }) {
  const [date, setDate] = useState(todayISO());
  const toast = useToast();
  return (
    <Sheet open onClose={onClose} title="Add posting date" footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" onClick={async () => { await api.deals.addPosting(d.id, date); toast('Posting date added.'); onClose(); }}>Save</Button></>}>
      <Field label="Date it went live">{id => <Input id={id} type="date" max={todayISO()} value={date} onChange={e => setDate(e.target.value)} />}</Field>
    </Sheet>
  );
}

export function PaidSheet({ d, onClose }: { d: Deal; onClose: () => void }) {
  const [amount, setAmount] = useState(String(d.n - (d.received || 0)));
  const [date, setDate] = useState(todayISO());
  const [ref, setRef] = useState('');
  const toast = useToast();
  return (
    <Sheet open onClose={onClose} title={`Mark ${d.brand} as paid`} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" onClick={async () => { await api.payments.markPaid(d.id, { amount: +amount || 0, date, ref }); toast('Payment recorded.'); onClose(); }}>Mark as paid</Button></>}>
      <Field label="Amount received (₹)" hint={`Agreed: ${inr(d.n)}`}>{id => <Input id={id} inputMode="numeric" value={amount} onChange={e => setAmount(e.target.value.replace(/\D/g, ''))} />}</Field>
      <Field label="Date received">{id => <Input id={id} type="date" max={todayISO()} value={date} onChange={e => setDate(e.target.value)} />}</Field>
      <Field label="Reference / UTR (optional)">{id => <Input id={id} value={ref} onChange={e => setRef(e.target.value)} />}</Field>
    </Sheet>
  );
}
