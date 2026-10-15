import { Component, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Deal } from '@/api';
import { Button, Card, Empty } from '@/components/ui';
import { fmtShort, inr } from '@/lib/format';
import { outstanding, type Insight } from '@/lib/dashboardStats';

/** A section that fails to render shows a message in place. It never throws up to the router or the auth guard. */
export class SectionBoundary extends Component<{ title: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <Card className="p-5 lg:p-6 flex flex-col gap-2">
        <h2 className="m-0 text-base font-semibold">{this.props.title}</h2>
        <p className="m-0 text-sm font-medium text-muted">Couldn't show this section.</p>
        <div><Button size="sm" onClick={() => this.setState({ failed: false })}>Try again</Button></div>
      </Card>
    );
  }
}

type Stats = ReturnType<typeof import('@/lib/dashboardStats').dashboardStats>;

export function MoneyAtRisk({ s }: { s: Stats }) {
  return (
    <Card className="p-5 lg:p-6 flex flex-col gap-3" label="Money at risk">
      <div className="flex flex-col gap-1">
        <h2 className="m-0 text-base font-semibold">Money at risk</h2>
        <span className="text-[13px] font-medium text-muted">What brands still owe you</span>
      </div>
      {s.atRiskN === 0 ? <Empty title="Nothing owed right now" body="Money shows here once work is approved or invoiced." /> : (
        <>
          <span className="text-[32px] font-semibold tracking-[-0.02em] tabular-nums">{inr(s.atRisk)}</span>
          <div className="grid grid-cols-2 gap-3 text-[13px] font-medium text-muted">
            <span>Owed to you<br /><b className="text-ink tabular-nums">{inr(s.owed)}</b></span>
            <span>Overdue<br /><b className={s.overdue ? 'text-danger tabular-nums' : 'text-ink tabular-nums'}>{inr(s.overdue)}</b></span>
          </div>
        </>
      )}
      {s.notYetApprovedN > 0 && <span className="border-t border-line pt-3 text-[13px] font-medium text-muted">Agreed, not yet approved: {inr(s.notYetApproved)} · {s.notYetApprovedN} deal{s.notYetApprovedN > 1 ? 's' : ''}</span>}
    </Card>
  );
}

export function NextPayout({ d }: { d: Deal | null }) {
  return (
    <Card className="p-5 lg:p-6 flex flex-col gap-2" label="Next payout">
      <h2 className="m-0 text-base font-semibold">Next payout</h2>
      {!d ? <Empty title="No payout scheduled" body="Invoiced deals with a payment date show up here." /> : (
        <>
          <span className="text-[32px] font-semibold tracking-[-0.02em] tabular-nums">{inr(outstanding(d))}</span>
          <span className="text-[13px] font-medium text-muted">{fmtShort(d.dueISO!)} · <Link to={`/app/deals/${d.id}`} className="font-semibold">{d.brand}</Link></span>
        </>
      )}
    </Card>
  );
}

export function DueThisWeek({ deals }: { deals: Deal[] }) {
  return (
    <Card className="overflow-hidden" label="Due this week">
      <div className="px-4 pt-5 pb-2 lg:px-6"><h2 className="m-0 text-base font-semibold">Payments due this week</h2></div>
      {deals.length === 0 ? <Empty title="Nothing due this week" body="Payments due in the next 7 days will show here." /> : (
        <div className="divide-y divide-line">
          {deals.map(d => (
            <Link key={d.id} to={`/app/deals/${d.id}`} className="flex items-center justify-between gap-3 px-4 py-3.5 lg:px-6 text-ink hover:bg-subtle hover:text-ink">
              <span className="flex min-w-0 flex-col"><span className="text-sm font-bold">{d.brand}</span><span className="truncate text-[13px] font-medium text-muted">{fmtShort(d.dueISO!)} · {d.del}</span></span>
              <span className="text-sm font-semibold tabular-nums">{inr(outstanding(d))}</span>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}

export function DealsFunnel({ steps }: { steps: { label: string; n: number }[] }) {
  const max = Math.max(1, ...steps.map(x => x.n));
  const empty = steps.every(x => x.n === 0);
  return (
    <Card className="p-5 lg:p-6 flex flex-col gap-4" label="Deals funnel">
      <h2 className="m-0 text-base font-semibold">Deals funnel</h2>
      {empty ? <Empty title="No deals sent yet" body="Once you send terms to a brand, you'll see how deals move to paid." /> : (
        <div className="flex flex-col gap-2.5">
          {steps.map(x => (
            <div key={x.label} className="grid grid-cols-[88px_1fr_28px] items-center gap-3 text-[13px] font-semibold">
              <span className="text-muted">{x.label}</span>
              <div className="h-3 rounded-full bg-subtle"><div className="h-3 rounded-full bg-brand" style={{ width: `${(x.n / max) * 100}%`, opacity: x.n ? 1 : 0.15 }} /></div>
              <span className="tabular-nums text-right">{x.n}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/** Manual carousel: no auto-advance, so there is no motion to switch off for reduced-motion users. */
export function InsightsCarousel({ items }: { items: Insight[] }) {
  const [i, setI] = useState(0);
  const cur = items[Math.min(i, items.length - 1)];
  return (
    <Card className="p-5 lg:p-6 flex flex-col gap-3" label="Insights">
      <div className="flex items-center justify-between">
        <h2 className="m-0 text-base font-semibold">Insights</h2>
        {items.length > 1 && (
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Previous insight" className="grid h-8 w-8 place-items-center rounded-full hover:bg-subtle" onClick={() => setI((i + items.length - 1) % items.length)}><ChevronLeft size={16} /></button>
            <span className="text-xs font-semibold tabular-nums text-muted">{Math.min(i, items.length - 1) + 1} / {items.length}</span>
            <button type="button" aria-label="Next insight" className="grid h-8 w-8 place-items-center rounded-full hover:bg-subtle" onClick={() => setI((i + 1) % items.length)}><ChevronRight size={16} /></button>
          </div>
        )}
      </div>
      {!cur ? <Empty title="No insights yet" body="Insights appear as you send deals and get paid." /> : (
        <div aria-live="polite" className="flex flex-col gap-1">
          <span className="text-[32px] font-semibold tracking-[-0.02em] tabular-nums">{cur.big}</span>
          <span className="text-sm font-bold">{cur.head}</span>
          <span className="text-[13px] font-medium text-muted">{cur.sub}</span>
        </div>
      )}
    </Card>
  );
}
