import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck } from 'lucide-react';
import type { OverviewStats } from '@/lib/dashboardStats';
import { CARD } from './shared';

/** Payments due today to today + 6 (India date). Deliverable due dates arrive with deliverable tracking. */
export function DueThisWeek({ stats }: { stats: OverviewStats }) {
  const w = stats.week;
  const [hv, setHv] = useState<number | null>(null);
  return (
    <section aria-label="Due this week" className={`${CARD} flex flex-col gap-4`} onMouseLeave={() => setHv(null)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5"><h2 className="m-0 text-base font-semibold">Due this week</h2><span className="text-xs font-medium text-muted">{w.range} · sorted by date</span></div>
        <div className="flex gap-2 whitespace-nowrap text-xs font-medium text-muted">
          <span className="inline-flex items-center gap-1"><i className="size-[7px] rounded-full bg-[#2E2E33]" />Deliverable</span>
          <span className="inline-flex items-center gap-1"><i className="size-[7px] rounded-full bg-[#5A9E2F]" />Payment</span>
        </div>
      </div>
      {w.rows.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-[14px] bg-white px-3 py-8 text-center shadow-[0_0_0_1px_rgba(0,0,0,.04)]">
          <span className="grid size-10 place-items-center rounded-xl bg-[#EFF6E5] text-[#3E7420]"><CalendarCheck size={18} aria-hidden="true" /></span>
          <span className="text-base font-semibold">Nothing due this week.</span>
          <span className="text-[13px] font-medium text-muted">{w.nextDeadline ? `Your next deadline is ${w.nextDeadline}.` : 'Payments with a date in the next 7 days will show here.'}</span>
        </div>
      ) : (
        <div className="relative flex flex-col gap-0.5">
          <span aria-hidden="true" className="absolute bottom-3.5 left-[27px] top-3.5 w-px bg-[#E4E4E8]" />
          {w.rows.map((d, i) => {
            const soon = i === 0, on = hv === i;
            return (
              <Link key={d.id} to={`/app/deals/${d.id}`} onMouseEnter={() => setHv(i)} style={{ background: on ? '#FFFFFF' : 'transparent' }}
                className="relative grid min-h-[54px] cursor-pointer grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-2 rounded-xl py-1.5 pr-3 text-ink transition-colors hover:text-ink">
                <span className="grid size-11 place-items-center justify-self-center rounded-xl leading-[1.05] shadow-[0_0_0_1px_rgba(0,0,0,.05)]" style={{ background: soon ? '#111111' : on ? '#F2F3F5' : '#FFFFFF' }}>
                  <span className="flex flex-col items-center"><span className="text-base font-bold" style={{ color: soon ? '#fff' : '#0E0E10' }}>{d.day}</span><span className="text-xs font-semibold" style={{ color: soon ? '#B4B4BA' : '#6E6E76' }}>{d.mon}</span></span>
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="flex items-center gap-2 text-sm font-semibold"><i className="size-[7px] flex-none rounded-full bg-[#5A9E2F]" />{d.brand}</span>
                  <span className="truncate text-[13px] font-medium text-[#5E5E66]">{d.task}</span>
                </span>
                <span className="whitespace-nowrap text-xs font-semibold" style={{ color: soon ? '#B4560F' : '#3E7420' }}>{d.when}</span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
