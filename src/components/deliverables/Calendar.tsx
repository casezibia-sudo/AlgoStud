import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CARD } from '@/components/overview/shared';
import { calendar, short, type DRow } from '@/lib/deliverablesView';
import { cx } from '@/lib/format';
import { TONE } from './parts';

const MAX = 3;
const LEGEND: [string, string][] = [['Late', 'bg-[#D92D20]'], ['Revision or waiting', 'bg-[#D97706]'], ['With brand', 'bg-[#2F5FD0]'], ['Not started / on you', 'bg-[#8E9298]'], ['Posted', 'bg-[#0A7F55]']];

/** The next two weeks from this week's Monday. Deals sit on their due date; empty days are greyed; today is black. */
export function Calendar({ rows }: { rows: DRow[] }) {
  const cal = calendar(rows);
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section aria-label="Next two weeks" className={cx(CARD, 'rounded-[24px] p-[18px] lg:px-[22px] lg:pb-[22px] lg:pt-[19px]')}>
      <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3">
        <h2 className="m-0 text-[18px] font-medium">Next two weeks</h2>
        <p className="m-0 text-[14px] font-medium text-ink-2">{short(cal.from)} — {short(cal.to)} · empty days are greyed out</p>
      </div>
      {cal.weeks.map(w => (
        <div key={w.from} className="mb-3.5">
          <h3 className="m-0 mb-2 text-[14px] font-medium">{w.label} <span className="font-normal text-ink-2">{short(w.from)} — {short(w.to)}</span></h3>
          <ol className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-4 lg:grid-cols-7">
            {w.days.map(d => {
              const shown = open === d.iso ? d.rows : d.rows.slice(0, MAX);
              return (
                <li key={d.iso} className={cx('flex min-h-[112px] min-w-0 flex-col gap-1.5 rounded-[18px] px-2.5 pb-2.5 pt-2', d.today ? 'bg-[#111] text-white' : d.rows.length ? 'bg-white shadow-[0_0_0_1px_rgba(0,0,0,.05)]' : 'bg-[#F1F2F2] text-muted shadow-[0_0_0_1px_rgba(0,0,0,.04)]')}>
                  <div className="flex h-5 items-baseline justify-between px-0.5"><span className="text-[13px] font-medium">{d.dow}</span><span className="text-[18px] font-medium">{d.day}</span></div>
                  {shown.map(r => {
                    const t = TONE[r.status];
                    return (
                      <Link key={r.id} to={`/app/deals/${r.id}`} className={cx('flex min-w-0 flex-col rounded-xl px-2.5 py-[5px] text-[13px] font-medium leading-snug hover:text-inherit', d.today && r.status !== 'posted' && r.status !== 'late' && r.status !== 'revision' && r.status !== 'brand' ? 'bg-[#E4E5E7] text-ink-2' : t.card)}>
                        <span className="truncate font-semibold">{r.brand}</span>
                        <span className="truncate">{r.del || 'Deal'} · {t.label}</span>
                      </Link>
                    );
                  })}
                  {d.rows.length > MAX && open !== d.iso && <button type="button" onClick={() => setOpen(d.iso)} className="cursor-pointer border-0 bg-transparent p-0 text-left text-[12px] font-semibold underline">+{d.rows.length - MAX} more</button>}
                </li>
              );
            })}
          </ol>
        </div>
      ))}
      <ul className="m-0 mt-1 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-[13.5px] font-medium text-ink-2" aria-label="Legend">
        {LEGEND.map(([l, c]) => <li key={l} className="flex items-center gap-2"><span aria-hidden="true" className={cx('size-3 rounded-[4px]', c)} />{l}</li>)}
        {cal.undated > 0 && <li className="text-muted">{cal.undated} deal{cal.undated === 1 ? '' : 's'} with no date set not shown</li>}
      </ul>
    </section>
  );
}
