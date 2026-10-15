import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck } from 'lucide-react';
import type { NeedRow, OverviewStats } from '@/lib/dashboardStats';
import { CARD } from './shared';

/** "Needs your action": up to three rows from deals and nextStep(). The button is handled by the page. */
export function NeedsAction({ stats, onAct }: { stats: OverviewStats; onAct: (r: NeedRow) => void }) {
  const { rows, total } = stats.needs;
  const [hv, setHv] = useState<string | null>(null);
  return (
    <section aria-label="Needs your action" className={`${CARD} flex flex-col gap-4`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 className="m-0 text-base font-semibold">Needs your action</h2>
          <span className="text-[13px] font-medium text-muted">{total ? `${total} ${total === 1 ? 'thing needs' : 'things need'} you today` : 'All caught up for today'}</span>
        </div>
        <Link to="/app/deals" className="inline-flex items-center gap-1 whitespace-nowrap text-[13px] font-semibold text-brand hover:text-[#064F37]">See all<ArrowRight size={13} aria-hidden="true" /></Link>
      </div>
      {rows.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-[14px] bg-white px-3 py-8 text-center shadow-[0_0_0_1px_rgba(0,0,0,.04)]">
          <span className="grid size-10 place-items-center rounded-xl bg-[#EFF6E5] text-[#3E7420]"><CalendarCheck size={18} aria-hidden="true" /></span>
          <span className="text-base font-semibold">You're all caught up</span>
          <span className="text-[13px] font-medium text-muted">New brand answers and deals that need you will show up here.</span>
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,.05)]" onMouseLeave={() => setHv(null)}>
          {rows.map((r, i) => (
            <div key={r.id} onMouseEnter={() => setHv(r.id)} style={{ borderTop: i ? '1px solid #F0F1F2' : 0, background: hv === r.id ? '#F7F8F8' : '#FFFFFF' }}
              className="grid min-h-[76px] lg:flex-1 grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 transition-colors">
              <span className="relative grid size-10 place-items-center rounded-full text-[13px] font-bold" style={{ background: r.avBg, color: r.avFg }} aria-hidden="true">{r.av}
                <i className="absolute -bottom-px -right-px size-3 rounded-full shadow-[0_0_0_2px_#fff]" style={{ background: r.red ? '#E5352B' : '#F08A3E' }} /></span>
              <Link to={`/app/deals/${r.id}`} className="flex min-w-0 flex-col gap-1 text-ink hover:text-ink">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{r.brand}</span>
                  <span className="inline-flex h-[22px] items-center whitespace-nowrap rounded-md px-2 text-xs font-semibold" style={{ background: r.red ? '#FDECEB' : '#FFF1E5', color: r.red ? '#B42318' : '#A04A0C' }}>{r.tag}</span>
                </span>
                <span className="truncate text-[13px] font-medium text-[#3A3A40]">{r.task}</span>
                <span className="truncate text-xs font-medium text-muted">{r.meta}</span>
              </Link>
              <button type="button" onClick={() => onAct(r)} className={`h-9 cursor-pointer whitespace-nowrap rounded-[10px] px-4 text-[13px] font-semibold transition-transform active:scale-[.97] ${i === 0 ? 'bg-brand text-white shadow-[0_1px_2px_rgba(10,127,85,.3)] hover:bg-brand-hover' : 'bg-white text-ink-2 shadow-[0_0_0_1px_rgba(0,0,0,.12)] hover:bg-subtle'}`}>{r.btn}</button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
