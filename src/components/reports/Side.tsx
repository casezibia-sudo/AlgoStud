import { CARD, rupee } from '@/components/overview/shared';
import { cx } from '@/lib/format';
import type { Reports } from '@/lib/reportsView';

const shell = cx(CARD, 'flex flex-col rounded-[24px] p-[19px] lg:px-[25px] lg:pb-[19px] lg:pt-[22px]');

/** Slice 4 adds deliverable items with a format (Reel, Story...). Until then there is nothing to split income by. */
export function Income({ earned }: { earned: string }) {
  return (
    <section aria-label="Income by content type" className={shell}>
      <h2 className="m-0 text-[18px] font-medium">Income by content type</h2>
      <p className="m-0 mt-1 text-[13.5px] font-medium text-ink-2">Share of {earned} earned</p>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <p className="m-0 text-[15px] font-semibold">Not available yet</p>
        <p className="m-0 mt-1 text-[13px] font-medium text-muted">Income by Reels, Stories and other formats appears once deliverables are tracked item by item.</p>
      </div>
    </section>
  );
}

export function SpentBy({ r }: { r: Reports }) {
  const s = r.spentBy;
  return (
    <section aria-label="Spent by category" className={shell}>
      <h2 className="m-0 text-[18px] font-medium">Spent by category</h2>
      <p className="m-0 mt-1 text-[13.5px] font-medium text-ink-2">{s.n ? `${rupee(s.total)} across ${s.n} expense${s.n === 1 ? '' : 's'} · ${r.range.text}` : 'Not tracked yet'}</p>
      {s.n === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <p className="m-0 text-[15px] font-semibold">No expenses yet</p>
          <p className="m-0 mt-1 text-[13px] font-medium text-muted">Expense tracking arrives in a later update. This fills in once expenses are logged.</p>
        </div>
      ) : (
        <>
          <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-[#E6E7E8]" role="img" aria-label="Share of spending by category">
            {s.rows.map(x => <span key={x.id} style={{ width: `${x.pct}%`, background: x.color }} />)}
          </div>
          <ul className="m-0 mt-4 flex list-none flex-col p-0">
            {s.rows.map(x => (
              <li key={x.id} className="flex items-center gap-3 border-b border-[#EEEFEF] py-3 text-[14px] font-medium last:border-b-0">
                <span aria-hidden="true" className="size-2.5 flex-none rounded-[3px]" style={{ background: x.color }} />
                <span className="min-w-0 flex-1 truncate">{x.label}</span>
                <span className="font-semibold tabular-nums">{rupee(x.amount)}</span>
                <span className="w-10 text-right text-ink-2 tabular-nums">{x.pct}%</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
