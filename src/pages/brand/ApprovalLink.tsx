import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { api, useStore } from '@/api';
import { Button, Field, Pill, Textarea } from '@/components/ui';
import { BrandFrame, InvalidLink, StateCard, VerifyStep } from './TermsLink';
import { firstName, fmtTime } from '@/lib/format';

export default function ApprovalLink() {
  const { token = '' } = useParams();
  useStore();
  const v = api.brand.get(token);
  const [verifyFor, setVerifyFor] = useState<string | null>(null);
  const [revFor, setRevFor] = useState<string | null>(null);
  const [note, setNote] = useState('');
  useEffect(() => { api.brand.open(token); }, [token]);
  if (v === undefined) return null;
  if (!v || v.link.kind !== 'a') return <InvalidLink />;
  const { deal: d, creator: c, link: l } = v;
  const fn = firstName(c.name);
  if (l.state === 'replaced') return <BrandFrame><StateCard title={`${fn} sent a newer version.`} body="Review the latest version instead." action={v.latest ? <a className="text-sm font-semibold" href={`/a/${v.latest}`}>Open latest version</a> : undefined} /></BrandFrame>;
  if (l.state === 'cancelled' || d.stage === 'cancelled') return <BrandFrame><StateCard title="This deal was cancelled." body="There's nothing to review." /></BrandFrame>;

  const items = l.items || [];
  const answerOf = (n: string) => v.answers.find(a => a.item === n);
  const allDone = items.every(n => answerOf(n));
  const approve = async (n: string) => { await api.brand.answerWork(token, n, { type: 'approve', name: d.contact || 'Brand' }); setVerifyFor(null); };

  return (
    <BrandFrame>
      <section className="flex flex-col gap-1 px-1">
        <span className="font-mono text-[11px] uppercase tracking-[.08em] text-brand-ink">Approval · {d.brand}</span>
        <h1 className="m-0 text-2xl font-bold tracking-[-0.01em] text-pretty">{allDone ? 'Thanks, you’ve reviewed everything' : `${c.name || 'The creator'} sent work for your approval`}</h1>
        <p className="m-0 text-sm font-medium text-muted">{d.del} · {d.rev} revisions included</p>
      </section>

      {items.map(n => {
        const sub = api.brand.subs(token, n)[0];
        const ans = answerOf(n);
        return (
          <section key={n} className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between gap-3"><h2 className="m-0 text-base font-bold">{n} {sub && <span className="font-medium text-muted">v{sub.v}</span>}</h2>
              {ans && <Pill tone={ans.type === 'approve' ? 'positive' : 'warning'}>{ans.type === 'approve' ? 'Approved' : 'Revision requested'}</Pill>}</div>
            {sub && <a href={sub.link} target="_blank" rel="noopener" className="flex items-center gap-2 rounded-xl bg-subtle px-4 py-3 text-sm font-semibold"><ExternalLink size={16} /><span className="truncate">{sub.link.replace(/^https?:\/\//, '')}</span></a>}
            {sub?.note && <p className="m-0 text-sm font-medium text-muted">“{sub.note}” · {fn}</p>}
            {ans ? (
              <p className="m-0 inline-flex items-center gap-2 text-[13px] font-semibold text-brand-ink">{ans.type === 'approve' && <CheckCircle2 size={16} />}{ans.type === 'approve' ? `Approved by ${ans.name} · ${fmtTime(ans.at)}` : `Sent to ${fn} · ${fmtTime(ans.at)}`}</p>
            ) : verifyFor === n ? (
              <VerifyStep token={token} email={v.email} cta="Verify and approve" onDone={() => approve(n)} />
            ) : revFor === n ? (
              <div className="flex flex-col gap-3">
                <Field label="What should change?" hint={`${fn} gets this right away.`}>{id => <Textarea id={id} value={note} onChange={e => setNote(e.target.value)} />}</Field>
                <Button variant="primary" size="lg" disabled={!note.trim()} onClick={async () => { await api.brand.answerWork(token, n, { type: 'revision', note: note.trim() }); setRevFor(null); setNote(''); }}>Send revision request</Button>
                <Button variant="ghost" onClick={() => setRevFor(null)}>Back</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="primary" size="lg" onClick={() => (v.verified ? approve(n) : setVerifyFor(n))}>Approve</Button>
                <Button size="lg" onClick={() => setRevFor(n)}>Request revision</Button>
              </div>
            )}
          </section>
        );
      })}
      {allDone && <p className="m-0 text-center text-xs font-medium text-muted">You can close this page. {fn} has been told.</p>}
    </BrandFrame>
  );
}
