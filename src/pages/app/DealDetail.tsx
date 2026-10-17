import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, ExternalLink, FileText } from 'lucide-react';
import { api, effStage, isRemote, nextStep, STAGE, TRACK, trackIndex, useAccount } from '@/api';
import { Button, Card, Label, Pill, Sheet, useToast } from '@/components/ui';
import { StagePill, SubmitSheet, useDealAction, PaidSheet, RemoteTools, BRAND_LATER } from '@/components/deal';
import { copy } from '@/components/share';
import { cx, daysFrom, fmtDate, fmtTime, inr } from '@/lib/format';
import { STRUCTURES } from '@/lib/dealForm';
import NotFound from '../NotFound';

export default function DealDetail() {
  const { id = '' } = useParams();
  const a = useAccount()!;
  const nav = useNavigate();
  const toast = useToast();
  const d = a.deals.find(x => x.id === id);
  const { run, sheets } = useDealAction();
  const [submitItem, setSubmitItem] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [confirm, setConfirm] = useState<'cancel' | 'delete' | null>(null);
  if (!d) return <NotFound inApp />;

  const s = effStage(d), meta = STAGE[s], step = nextStep(d);
  const idx = trackIndex(s);
  const link = api.deals.activeLink(d.id, 'd');
  const alink = api.deals.activeLink(d.id, 'a');
  const items = Object.entries(api.deals.items(d));
  const events = api.deals.eventsFor(d.id);
  const closed = ['paid', 'cancelled', 'declined', 'archived'].includes(s);
  // Supabase mode: brands can't answer online yet and item tracking isn't stored, so only creator-side steps run from here.
  const stepRuns = !isRemote || (!!step && ['edit', 'send', 'posting', 'remind-pay'].includes(step.kind));
  const canChangeTerms = !closed && (!isRemote || ['draft', 'sent', 'confirmed'].includes(d.dbStage || ''));
  const terms: [string, string][] = [
    ['Brand', `${d.brand}${d.contact ? ' · ' + d.contact : ''}`], ['Contact email', d.email || '—'], ['Deliverables', d.del || '—'], ['Amount', d.n ? inr(d.n) : '—'],
    ['Payment', `${d.trigger}${d.due ? ' · ' + d.due : ''}`],
    ['Structure', d.paymentStructure ? `${STRUCTURES.find(x => x.value === d.paymentStructure)?.label || d.paymentStructure}${d.paymentStructure === 'advance_balance' && d.advancePercent ? ` · ${d.advancePercent}% advance` : ''}` : 'Not set'],
    ['First draft', d.firstDraftDate ? fmtDate(d.firstDraftDate + 'T00:00:00') : 'Not set'], ['Final delivery', d.finalDeliveryDate ? fmtDate(d.finalDeliveryDate + 'T00:00:00') : 'Not set'],
    ['Usage rights', d.usage || 'Not added'], ['Revisions', d.rev],
  ];

  return (
    <div className="pt-4 lg:pt-6 flex flex-col gap-4">
      <Link to="/app/deals" className="inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-ink"><ArrowLeft size={16} />Deals</Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2"><h1 className="m-0 text-[28px] lg:text-[32px] font-semibold tracking-[-0.02em]">{d.brand}</h1><StagePill d={d} />{d.version && d.version > 1 && <Pill>Version {d.version}</Pill>}</div>
          <span className="text-sm font-medium text-muted">{d.del} · {inr(d.n)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/app/deals/${d.id}/record`} className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[13px] font-semibold text-ink shadow-[inset_0_0_0_1px_var(--color-line-2)] hover:bg-subtle hover:text-ink"><FileText size={16} />Record</Link>
          {d.stage === 'draft' ? <Button onClick={() => setConfirm('delete')}>Delete draft</Button> : !closed && <Button onClick={() => setConfirm('cancel')}>Cancel deal</Button>}
        </div>
      </div>

      <ol aria-label="Deal progress" className="grid grid-cols-7 gap-1">
        {TRACK.map((t, i) => (
          <li key={t.key} className="flex flex-col gap-1.5">
            <span className={cx('h-1.5 rounded-full', i < idx ? 'bg-brand' : i === idx ? (meta.tone === 'critical' ? 'bg-danger' : meta.tone === 'warning' ? 'bg-[#E08A3C]' : 'bg-brand') : 'bg-[#E1E2E5]')} />
            <span className={cx('hidden sm:block text-[11px] font-semibold', i <= idx ? 'text-ink' : 'text-muted')}>{t.label}</span>
          </li>
        ))}
      </ol>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start">
        <div className="flex flex-col gap-4">
          {step && (
            <Card className="p-5 lg:p-6 flex flex-col gap-3">
              <Label>{meta.turn === 'brand' ? `Waiting on ${d.brand}` : 'Next step'}</Label>
              <p className="m-0 text-[15px] font-semibold text-pretty">{isRemote && !stepRuns ? BRAND_LATER : step.hint}</p>
              {d.changes && s === 'changes' && <div className="rounded-xl bg-warn-tint px-4 py-3 text-[13px] font-medium text-warn">“{d.changes.note}” · {d.changes.by}</div>}
              {s === 'sent' && link && <div className="text-[13px] font-medium text-muted">Sent {fmtTime(link.createdAt)} on {link.channel} · {link.firstOpenedAt ? 'Opened ' + fmtTime(link.firstOpenedAt) : 'Not opened yet'} · Expires {fmtDate(link.expiresAt!)} ({daysFrom(link.expiresAt!)} days)</div>}
              <div className="flex flex-wrap gap-2 pt-1">
                {stepRuns && <Button variant="primary" onClick={() => run(d)}>{step.label}</Button>}
                {!isRemote && ['approved', 'due'].includes(d.stage) && <Button onClick={() => setPaying(true)}>Mark as paid</Button>}
              </div>
            </Card>
          )}

          {isRemote && <RemoteTools d={d} onPay={() => setPaying(true)} />}

          {!isRemote && items.length > 0 && !['draft', 'sent', 'changes', 'expired', 'declined', 'cancelled'].includes(d.stage) && (
            <Card className="overflow-hidden">
              <div className="px-5 pt-5 pb-2 lg:px-6"><h2 className="m-0 text-base font-semibold">Deliverables</h2></div>
              <ul className="m-0 list-none p-0 divide-y divide-line">
                {items.map(([n, it]) => (
                  <li key={n} className="flex flex-wrap items-center gap-3 px-5 py-3.5 lg:px-6">
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5"><span className="text-sm font-bold">{n} {it.v > 0 && <span className="font-medium text-muted">v{it.v}</span>}</span><span className="text-xs font-medium text-muted">{it.format}{it.due ? ' · due ' + fmtDate(it.due) : ''}</span></div>
                    <Pill tone={it.state === 'approved' ? 'positive' : it.state === 'revision' ? 'warning' : it.state === 'submitted' ? 'info' : 'neutral'}>{{ todo: 'To do', submitted: 'Awaiting approval', revision: 'Revision requested', approved: 'Approved' }[it.state]}</Pill>
                    {(it.state === 'todo' || it.state === 'revision') && <Button size="sm" onClick={() => setSubmitItem(n)}>{it.state === 'revision' ? 'Submit revision' : 'Submit'}</Button>}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card className="p-5 lg:p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3"><h2 className="m-0 text-base font-semibold">{d.confirmedAt ? `Confirmed terms · v${d.confirmedVersion || 1} · locked` : d.stage === 'draft' ? 'Terms' : `Terms sent · v${d.version || 1}`}</h2>
              {canChangeTerms && <Button size="sm" onClick={() => nav(`/app/deals/${d.id}/edit`)}>{d.stage === 'draft' ? 'Edit' : 'Change terms'}</Button>}</div>
            <dl className="m-0 grid grid-cols-[120px_minmax(0,1fr)] gap-x-4 gap-y-2.5 text-sm">
              {terms.map(([k, v]) => <div key={k} className="contents"><dt className="font-semibold text-muted">{k}</dt><dd className={cx('m-0 font-medium', v === 'Not added' && 'text-warn')}>{v}</dd></div>)}
            </dl>
            {d.confirmedBy && <p className="m-0 text-xs font-medium text-muted">Confirmed by {d.confirmedBy} · {d.email} · 6-digit code checked · {fmtTime(d.confirmedAt!)}</p>}
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          {(link || alink) && (
            <Card className="p-5 flex flex-col gap-3">
              <h2 className="m-0 text-base font-semibold">Brand links</h2>
              {[link && { l: link, label: 'Terms link' }, alink && { l: alink, label: 'Approval link' }].filter(Boolean).map(x => {
                const { l, label } = x as { l: NonNullable<typeof link>; label: string };
                const url = api.deals.linkUrl(l.token);
                return (
                  <div key={l.token} className="flex flex-col gap-2 rounded-xl bg-subtle p-3">
                    <div className="flex items-center justify-between gap-2"><span className="text-[13px] font-semibold">{label}</span><Pill tone={l.state === 'active' ? 'info' : 'neutral'}>{l.state}</Pill></div>
                    <span className="truncate font-mono text-xs text-muted">{url.replace(/^https?:\/\//, '')}</span>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={async () => { await copy(url); toast('Link copied.'); }}><Copy size={14} />Copy link</Button>
                      <a href={url} target="_blank" rel="noopener" className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold hover:bg-black/5"><ExternalLink size={14} />Brand's view</a>
                    </div>
                  </div>
                );
              })}
            </Card>
          )}
          <Card className="p-5 flex flex-col gap-3">
            <h2 className="m-0 text-base font-semibold">Activity</h2>
            <ol className="m-0 list-none p-0 flex flex-col gap-3">
              {events.slice(0, 8).map(e => (
                <li key={e.id} className="grid grid-cols-[10px_minmax(0,1fr)] gap-3">
                  <span className={cx('mt-1.5 size-2 rounded-full', { positive: 'bg-brand', warning: 'bg-[#E08A3C]', critical: 'bg-danger', info: 'bg-info', neutral: 'bg-[#A0A0A8]' }[e.tone])} />
                  <div className="flex min-w-0 flex-col gap-0.5"><span className="text-[13px] font-semibold">{e.title}</span>{e.detail && <span className="break-words text-xs font-medium text-muted">{e.detail}</span>}<span className="text-[11px] font-medium text-muted">{fmtTime(e.at)}</span></div>
                </li>
              ))}
            </ol>
            {events.length > 8 && <Link to={`/app/deals/${d.id}/record`} className="text-[13px] font-semibold">See full record</Link>}
          </Card>
        </div>
      </div>

      {sheets}
      {submitItem && <SubmitSheet d={d} item={submitItem} onClose={() => setSubmitItem(null)} />}
      {paying && <PaidSheet d={d} onClose={() => setPaying(false)} />}
      <Sheet open={!!confirm} onClose={() => setConfirm(null)} title={confirm === 'delete' ? 'Delete this draft?' : 'Cancel this deal?'}
        footer={<><Button onClick={() => setConfirm(null)}>Keep it</Button><Button variant="danger" onClick={async () => { if (confirm === 'delete') { await api.deals.remove(d.id); nav('/app/deals'); toast('Draft deleted.'); } else { await api.deals.cancel(d.id); toast('Deal cancelled.'); } setConfirm(null); }}>{confirm === 'delete' ? 'Delete draft' : 'Cancel deal'}</Button></>}>
        <p className="m-0 text-sm font-medium text-muted">{confirm === 'delete' ? 'It was never sent, so nothing is kept.' : `${d.brand}'s link will stop working. The record keeps everything that happened.`}</p>
      </Sheet>
    </div>
  );
}
