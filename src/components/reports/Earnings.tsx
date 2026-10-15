import { useState } from 'react';
import { CARD, rupee } from '@/components/overview/shared';
import { cx } from '@/lib/format';
import { axis, kLabel, monthFull, monthLabel, type Reports } from '@/lib/reportsView';

const H = 240;
const HATCH = 'repeating-linear-gradient(135deg,#BFC3C7 0 1.5px,#EEEFF0 1.5px 5px)';

/** Earnings by month: this period solid, the period before it hatched, bar for bar. Select a month for its details. */
export function Earnings({ r }: { r: Reports }) {
  const m = r.months, last = m.cur.length - 1;
  const [sel, setSel] = useState<number | null>(null);
  const i = sel !== null && sel <= last ? sel : last;
  const { top, step } = axis(m.max), ticks = Array.from({ length: top / step + 1 }, (_, k) => k * step);
  const cur = m.cur[i], prev = m.prev[i], diff = cur.amount - prev.amount;
  const empty = m.max === 0;

  return (
    <section aria-label="Earnings by month" className={cx(CARD, 'flex flex-col rounded-[24px] p-[19px] lg:px-[25px] lg:pb-[19px] lg:pt-[22px]')}>
      <h2 className="m-0 text-[18px] font-medium">Earnings by month</h2>
      <p className="m-0 mt-1 text-[13.5px] font-medium text-ink-2">{m.best ? `${monthFull(m.best.key).split(' ')[0]} was your best month at ${rupee(m.best.amount)}. Select a month to see its details.` : 'Nothing received in this period yet. Select a month to see its details.'}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] font-medium text-ink-2">
        <span className="flex items-center gap-2"><span aria-hidden="true" className="size-3 rounded-[3px] bg-[#0F9467]" />{r.range.text}</span>
        <span className="flex items-center gap-2"><span aria-hidden="true" className="size-3 rounded-[3px]" style={{ background: HATCH }} />{r.range.prevText}</span>
      </div>

      <div aria-live="polite" className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1 rounded-2xl bg-white px-[18px] py-3 shadow-[0_0_0_1px_rgba(0,0,0,.05)]">
        <span className="text-[14px] font-medium text-ink-2">{monthLabel(cur.key)}{i === last ? ' (so far)' : ''}</span>
        <span className="text-[24px] font-semibold tracking-[-0.01em]">{rupee(cur.amount)}</span>
        {prev.amount > 0
          ? <span className={cx('text-[13.5px] font-medium', diff >= 0 ? 'text-brand-ink' : 'text-danger')}>{diff >= 0 ? '+' : '-'}{rupee(Math.abs(diff))} vs {rupee(prev.amount)} last period</span>
          : <span className="text-[13.5px] font-medium text-muted">Nothing received in this month last period</span>}
      </div>

      {empty ? (
        <div className="px-4 py-16 text-center"><p className="m-0 text-[15px] font-semibold">No earnings yet</p><p className="m-0 mt-1 text-[13px] font-medium text-muted">Money from paid deals shows up here, month by month.</p></div>
      ) : (
        <div className="mt-7 flex">
          <div aria-hidden="true" className="relative w-[52px] flex-none" style={{ height: H }}>
            {ticks.map(t => <span key={t} className="absolute left-0 -translate-y-1/2 text-[11.5px] font-medium text-muted" style={{ bottom: (t / top) * H - 0 }}>{kLabel(t)}</span>)}
          </div>
          <div className="relative min-w-0 flex-1">
            <div className="relative" style={{ height: H }}>
              {ticks.map(t => <span key={t} aria-hidden="true" className="absolute inset-x-0 h-px bg-[#E4E6E8]" style={{ bottom: (t / top) * H }} />)}
              <ol className="absolute inset-0 m-0 grid list-none p-0" style={{ gridTemplateColumns: `repeat(${m.cur.length}, minmax(0, 1fr))` }}>
                {m.cur.map((b, k) => (
                  <li key={b.key} className="min-w-0">
                    <button type="button" aria-pressed={k === i} aria-label={`${monthFull(b.key)}: ${rupee(b.amount)}, last period ${rupee(m.prev[k].amount)}`} onClick={() => setSel(k)}
                      className={cx('flex h-full w-full cursor-pointer items-end justify-center gap-[5px] border-0 p-0 transition-colors', k === i ? 'rounded-t-[10px] bg-[#E3F1EA]' : 'bg-transparent hover:bg-black/[.03]')}>
                      <span className="w-[min(28px,32%)] rounded-t-[3px]" style={{ height: (m.prev[k].amount / top) * H, background: HATCH }} />
                      <span className={cx('w-[min(28px,32%)] rounded-t-[3px] transition-colors', k === i ? 'bg-[#0F9467]' : 'bg-[#5CBF9A]')} style={{ height: (b.amount / top) * H }} />
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <ol className="m-0 mt-2.5 grid list-none p-0 text-center text-[13px] font-medium text-ink-2" style={{ gridTemplateColumns: `repeat(${m.cur.length}, minmax(0, 1fr))` }}>
              {m.cur.map((b, k) => <li key={b.key} className={k === i ? 'font-semibold text-ink' : ''}>{b.label}</li>)}
            </ol>
          </div>
        </div>
      )}
    </section>
  );
}
