import { useMemo, useState } from 'react';
import type { Account } from '@/api';
import { earnedStats, type Period } from '@/lib/dashboardStats';
import { CARD, rupee } from './shared';

const PERIODS: { value: Period; label: string }[] = [{ value: 30, label: '30 days' }, { value: 90, label: '90 days' }, { value: 365, label: 'This year' }];

/** Money from paid deals, by paid date, with its own period toggle. The split by content type needs deliverable tracking. */
export function EarnedCard({ account }: { account: Account }) {
  const [period, setPeriod] = useState<Period>(365);
  const e = useMemo(() => earnedStats(account, period), [account, period]);
  return (
    <section aria-label="Earned" className={`${CARD} flex flex-col`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5"><h2 className="m-0 text-base font-semibold">Earned</h2><span className="text-xs font-medium text-muted">{period === 365 ? 'This year' : `Last ${period} days`}</span></div>
        <div role="radiogroup" aria-label="Time period" className="flex gap-0.5 rounded-[10px] bg-[#E6E7E7] p-[3px] shadow-[0_0_0_1px_rgba(0,0,0,.05)]">
          {PERIODS.map(p => (
            <button key={p.value} type="button" role="radio" aria-checked={p.value === period} onClick={() => setPeriod(p.value)}
              className={`h-[30px] cursor-pointer whitespace-nowrap rounded-lg px-[11px] text-xs text-ink-2 transition-[background,transform] duration-150 active:scale-[.97] ${p.value === period ? 'bg-white font-semibold shadow-[0_1px_2px_rgba(0,0,0,.08)]' : 'font-medium'}`}>{p.label}</button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 pb-4 pt-6">
        <span className="text-xs font-medium text-muted">Money received in your account</span>
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[40px] font-medium leading-none tracking-[-0.03em] tabular-nums text-ink">{rupee(e.total)}</span>
          <span className="inline-flex h-[26px] items-center gap-1 rounded-full bg-[#E3F4EC] px-2.5 text-[12.5px] font-semibold text-brand-ink">
            {e.delta ? `${e.delta.up ? '+' : '−'} ${e.delta.text} vs last period` : 'No earlier payments to compare'}
          </span>
        </div>
      </div>
      <div aria-hidden="true" className="h-[11px] rounded-full bg-[#E1E3E3]" />
      <p className="m-0 mt-auto border-t border-[#ECEDEE] pt-4 text-[13px] font-medium leading-[1.45] text-[#3A3A40]">
        {e.total ? 'The split by Reels, Stories and UGC arrives with deliverable tracking.' : 'Payments you receive will show up here.'}
      </p>
    </section>
  );
}
