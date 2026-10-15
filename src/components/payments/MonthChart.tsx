import { useState } from 'react';
import { CARD, rupee, useReducedMotion } from '@/components/overview/shared';
import { cx } from '@/lib/format';
import type { MonthBar } from '@/lib/paymentsView';

const H = 222, LBL = 22, MAXF = 0.71;

/** Paid amounts for the last 7 months. The best month is picked out until you hover or focus another bar. */
export function MonthChart({ data }: { data: { bars: MonthBar[]; max: number; avg: number } }) {
  const { bars, max, avg } = data;
  const reduced = useReducedMotion();
  const best = max > 0 ? bars.findIndex(b => b.amount === max) : -1;
  const [hot, setHot] = useState<number | null>(null);
  const active = hot ?? best;
  const range = `${bars[0].label} — ${bars[bars.length - 1].label}`;
  const hasAny = max > 0;

  return (
    <section aria-label="Received by month" className={cx(CARD, 'rounded-[24px] p-[18px]')}>
      <div className="flex items-baseline justify-between">
        <h2 className="m-0 text-[16.5px] font-medium">Received by month</h2>
        <span className="text-[13px] font-medium text-muted">{range}</span>
      </div>
      {!hasAny ? (
        <div className="mt-4 rounded-2xl bg-white px-5 py-10 text-center shadow-[inset_0_0_0_1px_#E8E9EB]">
          <p className="m-0 text-[15px] font-semibold">Nothing received yet</p>
          <p className="m-0 mt-1 text-[13px] font-medium text-muted">Paid deals show up here, month by month.</p>
        </div>
      ) : (
        <div className="relative mt-4" style={{ height: H }} onMouseLeave={() => setHot(null)}>
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 z-[1] border-t border-dashed border-[#9AA09D]" style={{ bottom: LBL + (avg / max) * (H - LBL) * MAXF }} />
          <div className="absolute inset-0 flex justify-between">
            {bars.map((b, i) => {
              const on = i === active, fill = b.amount > 0 ? Math.max(6, (b.amount / max) * (H - LBL) * MAXF) : 0;
              return (
                <button key={b.key} type="button" aria-label={`${b.full}: ${rupee(b.amount)}`} onMouseEnter={() => setHot(i)} onFocus={() => setHot(i)} onBlur={() => setHot(null)}
                  className="relative flex w-[28px] cursor-pointer flex-col items-center justify-end gap-2.5 border-0 bg-transparent p-0 outline-none [&:focus-visible>span:first-child]:shadow-[0_0_0_2px_#0A7F55]">
                  <span className="relative flex w-full flex-none items-end overflow-hidden rounded-t-[16px] rounded-b-[8px] bg-[#EEF0EF]" style={{ height: H - LBL }}>
                    <span className={cx('block w-full rounded-t-[16px] rounded-b-[8px]', !reduced && 'transition-[height,background] duration-300')}
                      style={{ height: fill, background: on ? 'linear-gradient(180deg,#0B9A66,#0A7F55)' : 'linear-gradient(180deg,#C9F0E0,#B4E6D2)' }} />
                  </span>
                  <span className={cx('text-[11px] leading-none', on ? 'font-bold text-ink' : 'font-medium text-muted')}>{b.label}</span>
                  {on && (
                    <span role="status" className="pointer-events-none absolute z-10 whitespace-nowrap rounded-xl bg-white px-2.5 py-1.5 text-left shadow-[0_0_0_1px_rgba(0,0,0,.06),0_6px_18px_-6px_rgba(0,0,0,.2)]"
                      style={{ bottom: LBL + fill + 8, left: i < 2 ? 0 : i > 4 ? 'auto' : '50%', right: i > 4 ? 0 : 'auto', transform: i >= 2 && i <= 4 ? 'translateX(-50%)' : undefined }}>
                      <span className="block text-[11px] font-medium text-muted">{b.full}</span>
                      <span className="block text-sm font-semibold tabular-nums text-ink">{rupee(b.amount)}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
