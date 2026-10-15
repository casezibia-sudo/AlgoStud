import { Link } from 'react-router-dom';
import { effStage, type Deal } from '@/api';
import { BOARD, chipOf, rupee, type ChipKey } from '@/lib/dealsView';
import { ActionButton, Initials, StatusBlock } from './parts';

/** The board: one column per stage group. No drag and drop: stage changes only happen through the deal's own buttons. */
export function BoardView({ deals, onRun, onLater }: { deals: Deal[]; onRun: (d: Deal) => void; onLater: (w: string) => void }) {
  return (
    <div className="grid gap-3 overflow-x-auto pb-2 lg:grid-cols-5 lg:overflow-visible" role="group" aria-label="Deals by stage">
      {BOARD.map(col => {
        const ds = deals.filter(d => chipOf(d) === (col.key as ChipKey));
        return (
          <section key={col.key} aria-label={col.label} className="flex min-w-[260px] flex-col gap-2.5 rounded-[18px] bg-[#E8E9EA] p-2.5">
            <div className="flex items-baseline justify-between px-1 pb-0.5 pt-1">
              <h2 className="m-0 flex items-baseline gap-1.5 text-sm font-semibold">{col.label}<span className="text-sm font-medium text-ink-2">{ds.length}</span></h2>
              <span className="text-[13px] font-medium text-muted tabular-nums">{rupee(ds.reduce((s, d) => s + d.n, 0))}</span>
            </div>
            {ds.length === 0 && <p className="m-0 rounded-[14px] bg-white/60 px-3 py-6 text-center text-[13px] font-medium text-muted">Nothing here yet.</p>}
            {ds.map(d => {
              const late = effStage(d) === 'overdue';
              return (
                <article key={d.id} className="flex flex-col gap-2.5 rounded-[14px] bg-white p-3 shadow-[0_0_0_1px_rgba(0,0,0,.04)]" style={late ? { boxShadow: 'inset 3px 0 0 #E5352B, 0 0 0 1px rgba(0,0,0,.04)' } : undefined}>
                  <Link to={`/app/deals/${d.id}`} className="flex items-start gap-2.5 text-ink hover:text-ink">
                    <Initials name={d.brand} size={26} />
                    <span className="flex min-w-0 flex-col gap-0.5"><span className="text-[13px] font-semibold leading-snug">{d.del || 'Untitled deal'}</span><span className="truncate text-xs font-medium text-muted">{d.brand}</span></span>
                  </Link>
                  <div className="flex items-center justify-between gap-2"><StatusBlock d={d} compact /><span className="text-[13.2px] font-semibold tabular-nums">{rupee(d.n)}</span></div>
                  <ActionButton d={d} onRun={onRun} onLater={onLater} block />
                </article>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
