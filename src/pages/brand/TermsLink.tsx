import '@/index.css';
import { useEffect, useState, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { api, useStore, type BrandLinkView } from '@/api';
import { Button, Field, Input, Logo, Textarea } from '@/components/ui';

const cxLabel = 'font-mono text-[11px] uppercase tracking-[.08em] text-brand-ink';
import { cx, fmtDate, fmtTime, inr, firstName } from '@/lib/format';

export function BrandFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#F4F5F5]">
      <header className="flex h-14 items-center justify-center border-b border-line bg-white"><Logo size={20} /></header>
      <main className="mx-auto flex max-w-[560px] flex-col gap-4 px-4 py-6 pb-16">{children}</main>
    </div>
  );
}
export function StateCard({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
      <h1 className="m-0 text-xl font-bold text-pretty">{title}</h1>
      <p className="m-0 text-sm font-medium text-muted text-pretty">{body}</p>
      {action}
    </section>
  );
}
export const InvalidLink = () => <BrandFrame><StateCard title="This link doesn't work." body="Check that you copied the whole link, or ask the creator to send it again." /></BrandFrame>;

/** Email code step shared by both brand links. Remembers the device for 30 days. */
export function VerifyStep({ token, email, onDone, cta }: { token: string; email: string; onDone: () => void; cta: string }) {
  const [sent, setSent] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  return (
    <section className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-brand" /><h2 className="m-0 text-base font-bold">Check it's you</h2></div>
      {!sent ? <>
        <p className="m-0 text-sm font-medium text-muted">We'll send a 6-digit code to {email}.</p>
        <Button variant="primary" size="lg" onClick={async () => { const r = await api.brand.requestCode(token); setSent(r.demoCode); }}>Send code</Button>
      </> : <>
        <Field label={`Code sent to ${email}`} hint="It works for 10 minutes." error={err}>{id => <Input id={id} inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setErr(''); }} className="tracking-[.3em] text-lg" />}</Field>
        <span className="rounded-lg bg-info-tint px-3 py-2 text-xs font-semibold text-info">Demo only: your code is {sent}</span>
        <Button variant="primary" size="lg" disabled={code.length !== 6} onClick={async () => { const r = await api.brand.verify(token, code); if (r.ok) onDone(); else { setErr(r.error); if (r.error.includes('new')) setSent(null); } }}>{cta}</Button>
        <button type="button" className="text-[13px] font-semibold text-brand-ink cursor-pointer" onClick={async () => { const r = await api.brand.requestCode(token); setSent(r.demoCode); setCode(''); }}>Send a new code</button>
      </>}
    </section>
  );
}

const AREAS = ['Amount', 'Deliverables', 'Payment', 'Due date', 'Usage rights', 'Revisions'];

export default function TermsLink() {
  const { token = '' } = useParams();
  useStore();
  const v: BrandLinkView | null = api.brand.get(token);
  const [mode, setMode] = useState<'review' | 'verify' | 'sign' | 'changes' | 'decline'>('review');
  const [name, setName] = useState('');
  const [agree, setAgree] = useState(false);
  const [areas, setAreas] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [reason, setReason] = useState('');
  useEffect(() => { api.brand.open(token); }, [token]);
  if (!v || v.link.kind !== 'd') return <InvalidLink />;
  const { deal: d, creator: c, link: l } = v;
  const who = c.name || 'The creator', fn = firstName(c.name);

  if (v.answer) {
    const a = v.answer;
    const t = a.type === 'confirm' ? { title: 'Terms confirmed', body: `Confirmed by ${a.name} (${v.email}) at ${fmtTime(a.at)}. A copy of the record has been emailed to you.` }
      : a.type === 'changes' ? { title: 'Change request sent', body: `You asked to change ${a.areas.join(', ') || 'the terms'}. ${fn} will send updated terms to this email.` }
      : { title: 'You declined this deal', body: `Declined on ${fmtDate(a.at)}. ${fn} has been told.` };
    return <BrandFrame><StateCard title={t.title} body={t.body} action={a.type === 'confirm' ? <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-ink"><CheckCircle2 size={18} />Version {l.version} · locked</span> : undefined} /></BrandFrame>;
  }
  if (v.closing) return <BrandFrame><StateCard title="This account is closing." body={`${who}'s account is being deleted, so these terms can't be answered here.`} /></BrandFrame>;
  if (l.state === 'expired') return <BrandFrame><StateCard title="This link has expired." body={`It expired on ${fmtDate(l.expiresAt!)}. Ask ${fn} to send a new one.`} /></BrandFrame>;
  if (l.state === 'cancelled') return <BrandFrame><StateCard title="This deal was cancelled." body={`${fn} cancelled this deal. There's nothing to answer.`} /></BrandFrame>;
  if (l.state === 'replaced') return <BrandFrame><StateCard title="This link was replaced by a newer version." body={`${fn} sent updated terms.`} action={v.latest ? <a className="text-sm font-semibold" href={`/d/${v.latest}`}>Open current version</a> : undefined} /></BrandFrame>;

  const terms: [string, string][] = [['Deliverables', d.del], ['Amount', inr(d.n)], ['Payment', `${d.trigger}${d.due ? ' · ' + d.due : ''}`], ['Usage rights', d.usage || 'Not added'], ['Revisions', d.rev]];
  const changedSince = d.version && d.version > 1 ? api.deals.versionsFor(d.id)[0] : null;

  return (
    <BrandFrame>
      <section className="flex flex-col gap-1 px-1">
        <span className={cxLabel}>Terms · version {l.version}</span>
        <h1 className="m-0 text-2xl font-bold tracking-[-0.01em] text-pretty">{who} sent you these terms</h1>
        <p className="m-0 text-sm font-medium text-muted">{d.brand} × {who}{c.handle ? ` (@${c.handle})` : ''} · link works until {fmtDate(l.expiresAt!)}</p>
      </section>

      <section className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
        <dl className="m-0 flex flex-col divide-y divide-line">
          {terms.map(([k, val]) => {
            const changed = changedSince && ((k === 'Amount' && changedSince.terms.n !== d.n) || (k === 'Deliverables' && changedSince.terms.del !== d.del));
            return <div key={k} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0"><dt className="flex items-center gap-2 text-xs font-semibold text-muted">{k}{changed && <span className="rounded-full bg-warn-tint px-2 py-0.5 text-[11px] text-warn">Changed since version {changedSince!.n}</span>}</dt><dd className="m-0 text-[15px] font-semibold">{val}</dd></div>;
          })}
        </dl>
      </section>

      {mode === 'review' && (
        <div className="flex flex-col gap-2">
          <Button variant="primary" size="lg" onClick={() => setMode(v.verified ? 'sign' : 'verify')}>Confirm terms</Button>
          <div className="grid grid-cols-2 gap-2"><Button size="lg" onClick={() => setMode('changes')}>Request changes</Button><Button size="lg" onClick={() => setMode('decline')}>Decline</Button></div>
          <p className="m-0 pt-1 text-center text-xs font-medium text-muted">No account needed. Your answer is saved to the deal's record.</p>
        </div>
      )}
      {mode === 'verify' && <VerifyStep token={token} email={v.email} cta="Continue" onDone={() => setMode('sign')} />}
      {mode === 'sign' && (
        <section className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
          <Field label="Your full name">{id => <Input id={id} autoComplete="name" value={name} onChange={e => setName(e.target.value)} />}</Field>
          <label className="flex items-start gap-3 text-sm font-medium"><input type="checkbox" className="mt-0.5 size-5 accent-[#0A7F55]" checked={agree} onChange={e => setAgree(e.target.checked)} />I'm confirming these terms for {d.brand}.</label>
          <Button variant="primary" size="lg" disabled={name.trim().length < 2 || !agree} onClick={() => api.brand.answer(token, { type: 'confirm', name: name.trim() })}>Confirm terms</Button>
          <Button variant="ghost" onClick={() => setMode('review')}>Back</Button>
        </section>
      )}
      {mode === 'changes' && (
        <section className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
          <span className="text-sm font-bold">What should change? (optional)</span>
          <div className="flex flex-wrap gap-2">{AREAS.map(x => { const on = areas.includes(x); return <button key={x} type="button" aria-pressed={on} onClick={() => setAreas(s => on ? s.filter(y => y !== x) : [...s, x])} className={cx('h-9 rounded-full px-3.5 text-[13px] font-semibold cursor-pointer', on ? 'bg-[#111111] text-white' : 'bg-white shadow-[inset_0_0_0_1px_var(--color-line-2)]')}>{x}</button>; })}</div>
          <Field label={`Note for ${fn}`}>{id => <Textarea id={id} value={note} onChange={e => setNote(e.target.value)} />}</Field>
          <Button variant="primary" size="lg" disabled={!note.trim()} onClick={() => api.brand.answer(token, { type: 'changes', areas, note: note.trim() })}>Send change request</Button>
          <Button variant="ghost" onClick={() => setMode('review')}>Back</Button>
        </section>
      )}
      {mode === 'decline' && (
        <section className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
          <Field label="Reason (optional)" hint={`${fn} will see this. You can't undo a decline from this link.`}>{id => <Textarea id={id} rows={3} value={reason} onChange={e => setReason(e.target.value)} />}</Field>
          <Button variant="danger" size="lg" onClick={() => api.brand.answer(token, { type: 'decline', reason: reason.trim() || undefined })}>Decline deal</Button>
          <Button variant="ghost" onClick={() => setMode('review')}>Back</Button>
        </section>
      )}
    </BrandFrame>
  );
}
