import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { effStage, nextStep, STAGE, TRACK, useAccount, type Deal } from '@/api';
import { Button, Card, Empty, Input, LinkButton, Segmented } from '@/components/ui';
import { DealRow, PageHead, useDealAction } from '@/components/deal';
import { cx, inr } from '@/lib/format';

export function DealsBrandsTabs({ current }: { current: 'Deals' | 'Brands' }) {
  const nav = useNavigate();
  return <Segmented size="sm" label="Deals sections" value={current} onChange={v => nav(v === 'Deals' ? '/app/deals' : '/app/brands')} options={[{ value: 'Deals', label: 'Deals' }, { value: 'Brands', label: 'Brands' }]} />;
}

const PIPE = TRACK.filter(t => t.key !== 'draft');

export default function Deals() {
  const a = useAccount()!;
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as 'open' | 'done') || 'open';
  const stage = params.get('stage');
  const [q, setQ] = useState('');
  const { run, sheets } = useDealAction();
  const set = (k: string, v: string | null) => { const p = new URLSearchParams(params); v ? p.set(k, v) : p.delete(k); setParams(p, { replace: true }); };

  const match = (d: Deal) => (!q || (d.brand + ' ' + d.del + ' ' + d.contact).toLowerCase().includes(q.toLowerCase())) && (!stage || TRACK.find(t => t.key === stage)?.stages.includes(effStage(d)));
  const groups = useMemo(() => {
    const turn = (d: Deal) => STAGE[effStage(d)].turn;
    const G = tab === 'open'
      ? [{ title: 'Needs you', sub: 'Do these first', rows: a.deals.filter(d => turn(d) === 'you') }, { title: 'Waiting on brand', sub: 'Nothing for you to do yet', rows: a.deals.filter(d => turn(d) === 'brand') }]
      : [{ title: 'Done', sub: 'Paid and closed', rows: a.deals.filter(d => turn(d) === 'done') }];
    return G.map(g => ({ ...g, rows: g.rows.filter(match) })).filter(g => g.rows.length);
  }, [a, tab, q, stage]);

  const totals = {
    open: a.deals.filter(d => STAGE[effStage(d)].turn !== 'done').reduce((s, d) => s + d.n, 0),
    due: a.deals.filter(d => ['due', 'approved'].includes(d.stage)).reduce((s, d) => s + d.n, 0),
    paid: a.payments.reduce((s, p) => s + p.amount, 0),
  };
  const pipe = PIPE.map(t => { const ds = a.deals.filter(d => t.stages.includes(effStage(d))); return { ...t, count: ds.length, v: ds.reduce((s, d) => s + d.n, 0), late: ds.filter(d => effStage(d) === 'overdue').length }; });
  const maxV = Math.max(1, ...pipe.map(p => p.v));

  return (
    <>
      <PageHead above={<div className="mb-2"><DealsBrandsTabs current="Deals" /></div>} title="Deals" sub={`${a.deals.length} deals`} actions={<LinkButton to="/app/deals/new">New deal</LinkButton>} />

      <Card label="Pipeline by stage" className="bg-[#FAFAFA]! p-4 lg:px-5 lg:pb-5 flex flex-col gap-3.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div className="flex flex-wrap items-baseline gap-2.5"><h2 className="m-0 text-base font-semibold">Pipeline</h2><span className="text-xs font-medium text-muted">Select a stage to filter the list</span></div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-medium text-muted">
            <span>Open <b className="ml-1 text-base text-ink tabular-nums">{inr(totals.open)}</b></span>
            <span>Owed <b className="ml-1 text-base text-ink tabular-nums">{inr(totals.due)}</b></span>
            <span>Received <b className="ml-1 text-base text-brand-ink tabular-nums">{inr(totals.paid)}</b></span>
          </div>
        </div>
        <div role="group" aria-label="Deal stages" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {pipe.map(p => {
            const on = stage === p.key;
            return (
              <button key={p.key} type="button" aria-pressed={on} onClick={() => set('stage', on ? null : p.key)}
                className={cx('flex flex-col gap-2 rounded-xl p-3 text-left transition-[background,box-shadow,transform] active:scale-[.98] cursor-pointer hover:bg-white', on ? 'bg-white shadow-[inset_0_0_0_1.5px_var(--color-brand)]' : 'bg-[#F1F2F2]')}>
                <span className="flex flex-wrap items-baseline justify-between gap-x-2"><span className="text-[13px] font-semibold">{p.label}</span><span className="text-xs font-medium text-muted">{p.count} deal{p.count === 1 ? '' : 's'}</span></span>
                <span className="text-lg font-semibold tabular-nums tracking-[-0.01em]">{inr(p.v)}</span>
                <span aria-hidden className="h-1 rounded-full bg-[#E4E5E6] overflow-hidden"><span className="block h-full rounded-full bg-brand" style={{ width: `${(p.v / maxV) * 100}%` }} /></span>
                <span className={cx('text-xs', p.late ? 'font-semibold text-danger' : 'font-medium text-muted')}>{p.late ? `${p.late} overdue` : p.count ? 'On track' : 'None'}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="mt-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 lg:px-6">
          <Segmented label="Deal status" value={tab} onChange={v => set('tab', v === 'open' ? null : v)} options={[{ value: 'open', label: 'Open' }, { value: 'done', label: 'Done' }]} />
          <label className="relative w-full sm:w-72"><span className="sr-only">Search deals</span><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><Input className="pl-9 h-10" placeholder="Search brand or deliverable" value={q} onChange={e => setQ(e.target.value)} /></label>
        </div>
        {groups.length === 0 ? <Empty title="No deals here" body={stage || q ? 'Try clearing the filter or search.' : 'Paste a brand message to create your first deal.'} action={stage || q ? <Button onClick={() => { setQ(''); set('stage', null); }}>Clear filters</Button> : <LinkButton variant="primary" to="/app/deals/new">Create deal</LinkButton>} /> :
          groups.map(g => (
            <div key={g.title}>
              <div className="flex items-baseline gap-2 border-t border-line bg-[#F4F5F5] px-4 pt-3.5 pb-1.5 lg:px-6"><span className="text-[13px] font-semibold">{g.title}</span><span className="text-xs font-semibold text-muted">{g.rows.length}</span><span className="text-xs font-medium text-muted">· {g.sub}</span></div>
              <div className="divide-y divide-line">{g.rows.map(d => <DealRow key={d.id} d={d} action={g.title === 'Needs you' && nextStep(d) ? <Button size="sm" onClick={() => run(d)}>{nextStep(d)!.label.replace(/ to .*$/, '').replace(/ for .*$/, '')}</Button> : undefined} />)}</div>
            </div>
          ))}
      </Card>
      {sheets}
    </>
  );
}
