import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { effStage, nextStep, STAGE, useAccount } from '@/api';
import { Button, Card, Empty, Segmented } from '@/components/ui';
import { DealRow, PageHead, useDealAction } from '@/components/deal';
import { DAY, firstName, inr } from '@/lib/format';

type Period = 30 | 90 | 365;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Home() {
  const a = useAccount()!;
  const [period, setPeriod] = useState<Period>(365);
  const { run, sheets } = useDealAction();

  const stats = useMemo(() => {
    const now = Date.now();
    const start = period === 365 ? Date.parse(new Date().getFullYear() + '-01-01') : now - period * DAY;
    const prevStart = start - (now - start);
    const sum = (from: number, to: number) => a.payments.filter(p => Date.parse(p.date) >= from && Date.parse(p.date) < to).reduce((s, p) => s + p.amount, 0);
    const earned = sum(start, now), prev = sum(prevStart, start);
    const owedDeals = a.deals.filter(d => ['approved', 'due'].includes(d.stage));
    const overdue = a.deals.filter(d => effStage(d) === 'overdue');
    const months = Array.from({ length: 6 }, (_, i) => { const d = new Date(); d.setMonth(d.getMonth() - 5 + i, 1); return d; });
    const bars = months.map(m => {
      const next = new Date(m); next.setMonth(m.getMonth() + 1);
      return { label: MON[m.getMonth()], v: sum(m.getTime(), next.getTime()) };
    });
    return {
      earned, delta: prev ? Math.round(((earned - prev) / prev) * 100) : null,
      owed: owedDeals.reduce((s, d) => s + d.n - (d.received || 0), 0), owedN: owedDeals.length,
      overdue: overdue.reduce((s, d) => s + d.n, 0), overdueN: overdue.length, bars,
    };
  }, [a, period]);

  const needs = a.deals.filter(d => STAGE[effStage(d)].turn === 'you' && nextStep(d));
  const waiting = a.deals.filter(d => STAGE[effStage(d)].turn === 'brand');
  const max = Math.max(1, ...stats.bars.map(b => b.v));
  const top = needs[0];

  return (
    <>
      <PageHead title={`Hi ${firstName(a.creator.name) || 'there'}`} sub="What needs your attention next, and how much is still to receive."
        actions={<div className="flex items-center gap-2.5"><Segmented label="Time period" value={period} onChange={setPeriod} size="sm" options={[{ value: 30, label: '30 days' }, { value: 90, label: '90 days' }, { value: 365, label: 'This year' }]} /><span className="text-xs font-medium text-muted">vs previous period</span></div>} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 flex flex-col gap-1"><span className="text-[13px] font-semibold text-muted">Earned · {period === 365 ? 'this year' : `last ${period} days`}</span><span className="text-[32px] font-semibold tracking-[-0.02em] tabular-nums">{inr(stats.earned)}</span><span className="text-xs font-semibold text-brand-ink">{stats.delta === null ? 'No earlier payments to compare' : `${stats.delta >= 0 ? '+' : ''}${stats.delta}% vs previous period`}</span></Card>
        <Card className="p-5 flex flex-col gap-1"><span className="text-[13px] font-semibold text-muted">Still to receive</span><span className="text-[32px] font-semibold tracking-[-0.02em] tabular-nums">{inr(stats.owed)}</span><span className="text-xs font-semibold text-muted">{stats.owedN} deals approved or due</span></Card>
        <Card className="p-5 flex flex-col gap-1"><span className="text-[13px] font-semibold text-muted">Overdue</span><span className="text-[32px] font-semibold tracking-[-0.02em] tabular-nums text-danger">{inr(stats.overdue)}</span><span className="text-xs font-semibold text-muted">{stats.overdueN ? `${stats.overdueN} deal${stats.overdueN > 1 ? 's' : ''} past the agreed date` : 'Nothing overdue'}</span></Card>
      </div>

      {top && (
        <Card className="mt-4 p-5 lg:p-6 flex flex-wrap items-center justify-between gap-4 bg-deep! text-white">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] uppercase tracking-[.08em] text-mint">Do this first</span>
            <span className="text-lg font-bold">{top.brand} · {nextStep(top)!.label}</span>
            <span className="text-sm font-medium text-mint-soft">{nextStep(top)!.hint}</span>
          </div>
          <Button variant="primary" size="lg" onClick={() => run(top)}>{nextStep(top)!.label}</Button>
        </Card>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          <div className="flex items-baseline justify-between px-4 pt-5 pb-2 lg:px-6"><h2 className="m-0 text-base font-semibold">Needs you <span className="text-muted">{needs.length}</span></h2><Link to="/app/deals" className="text-[13px] font-semibold">All deals</Link></div>
          {needs.length ? <div className="divide-y divide-line">{needs.slice(1, 7).map(d => <DealRow key={d.id} d={d} action={<Button size="sm" onClick={() => run(d)}>{nextStep(d)!.label.replace(/ to .*$/, '')}</Button>} />)}</div> : <Empty title="You're all caught up" body="New brand answers will show up here." />}
          {waiting.length > 0 && <div className="border-t border-line bg-[#F4F5F5] px-4 py-3 lg:px-6 text-[13px] font-medium text-muted">{waiting.length} waiting on brands · <Link to="/app/deals" className="font-semibold">View</Link></div>}
        </Card>
        {/* Values are printed on the bars, so nothing depends on hover. */}
        <Card className="p-5 lg:p-6 flex flex-col gap-4">
          <h2 className="m-0 text-base font-semibold">Payments received · last 6 months</h2>
          <div className="grid grid-cols-6 items-end gap-2 h-44" role="list">
            {stats.bars.map(b => (
              <div key={b.label} role="listitem" aria-label={`${b.label}: ${inr(b.v)}`} className="flex h-full flex-col justify-end items-center gap-1.5">
                <span className="text-[11px] font-semibold tabular-nums text-muted">{b.v ? Math.round(b.v / 1000) + 'k' : '—'}</span>
                <div className="w-full rounded-lg bg-brand transition-[height] duration-500" style={{ height: `${Math.max(3, (b.v / max) * 100)}%`, opacity: b.v ? 1 : 0.15 }} />
                <span className="text-xs font-semibold text-muted">{b.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {sheets}
    </>
  );
}
