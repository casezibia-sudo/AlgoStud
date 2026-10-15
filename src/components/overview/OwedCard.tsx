import { Check } from 'lucide-react';
import type { OverviewStats } from '@/lib/dashboardStats';
import { CARD, plural, rupee } from './shared';

/** "Owed to you" with the "On the way to paid" pipeline. Everything comes from OverviewStats. */
export function OwedCard({ stats, onRemind }: { stats: OverviewStats; onRemind: () => void }) {
  const o = stats.owed, p = stats.pipeline;
  const segs = [
    { key: 'unconfirmed', label: 'Not confirmed yet', s: p.unconfirmed, box: 'bg-[#E6E7E8] text-ink-2', dot: 'bg-[#E6E7E8] shadow-[inset_0_0_0_1px_rgba(0,0,0,.08)]' },
    { key: 'confirmed', label: 'Confirmed, not delivered', s: p.confirmed, box: 'bg-[#CDE8DC] text-[#0F3D2E]', dot: 'bg-[#CDE8DC] shadow-[inset_0_0_0_1px_rgba(0,0,0,.08)]' },
    { key: 'awaiting', label: 'Delivered, awaiting payment', s: p.awaiting, box: 'bg-brand text-white', dot: 'bg-brand' },
    { key: 'overdue', label: 'Overdue', s: p.overdue, box: 'bg-danger text-white', dot: 'bg-danger' },
  ];
  const visible = segs.filter(x => x.s.n > 0);
  return (
    <section aria-label="Owed to you" className={`${CARD} grid gap-6 p-7 pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.72fr)] lg:gap-0`}>
      <div className="flex flex-col gap-2 lg:pr-8">
        <h2 className="m-0 mt-[2px] flex items-center gap-2 text-base font-semibold"><span className="size-2 rounded-full bg-[#E5352B]" />Owed to you</h2>
        <span className="text-[52px] font-medium leading-none tracking-[-0.03em] tabular-nums text-ink">{rupee(o.total)}</span>
        <p className="m-0 mt-0.5 text-sm font-medium text-[#3A3A40]">
          {o.n ? <>{plural(o.n, 'deal')} delivered, not paid yet{o.overdue > 0 && <> · <span className="font-semibold text-danger">{rupee(o.overdue)} overdue</span></>}</> : 'Nothing owed right now'}
        </p>
        <div className="mt-[15px] flex flex-wrap items-center gap-x-3 gap-y-2">
          {o.overdueN > 0 && <button type="button" onClick={onRemind} className="h-[38px] cursor-pointer rounded-[10px] bg-danger px-4 text-[13px] font-semibold text-white transition-transform active:scale-[.97] hover:bg-[#962016]">Send reminders</button>}
          <span className="text-[13.3px] font-medium text-muted">{o.next ? `Next payout ${rupee(o.next.amount)} · ${o.next.label}` : 'No payout scheduled'}</span>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-3.5 lg:border-l lg:border-[#E6E7E7] lg:pl-8">
        <div className="flex translate-y-[3px] flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="m-0 text-[13px] font-semibold">On the way to paid</h3>
          {p.openN > 0 && <span className="text-[13px] font-medium text-muted">{rupee(p.openTotal)} across {plural(p.openN, 'open deal')}</span>}
        </div>
        <div className="flex gap-1">
          {visible.length ? (
            <div className="flex min-w-0 flex-1 gap-1">
              {visible.map(x => (
                <div key={x.key} style={{ flex: `${Math.max(x.s.amount, 1)} 1 0` }} className={`flex h-14 min-w-[92px] flex-col justify-center rounded-xl px-3.5 ${x.box}`}>
                  <span className="text-[15px] font-semibold leading-tight tabular-nums">{rupee(x.s.amount)}</span>
                  <span className="text-xs font-medium opacity-90">{plural(x.s.n, 'deal')}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-14 min-w-0 flex-1 items-center rounded-xl bg-[#ECEDEE] px-4 text-[13px] font-medium text-muted">No open deals yet. New deals show up here.</div>
          )}
          <div className="flex h-14 w-[83px] flex-none flex-col items-center justify-center gap-0.5 rounded-xl bg-white text-[13px] font-semibold shadow-[0_0_0_1px_rgba(0,0,0,.06)]" title={`${plural(p.paidN, 'paid deal')}`}>
            <Check size={16} className="rounded-full text-brand shadow-[inset_0_0_0_1.5px_currentColor]" aria-hidden="true" />Paid
          </div>
        </div>
        <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-1.5 p-0 text-[13px] font-medium text-ink-2">
          {segs.map(x => <li key={x.key} className="flex items-center gap-2"><span className={`size-2.5 rounded-[3px] ${x.dot}`} aria-hidden="true" />{x.label}</li>)}
        </ul>
        <p className="m-0 mt-1 border-t border-[#E6E7E7] pt-3.5 text-[13px] font-medium text-[#3A3A40]">{p.unconfirmed.n ? 'Grey deals are not confirmed by the brand yet. Reminders quote the agreed payment date.' : 'Every deal here has terms the brand confirmed. Reminders quote the agreed payment date.'}</p>
      </div>
    </section>
  );
}
