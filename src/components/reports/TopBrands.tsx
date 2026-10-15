import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { CARD, rupee } from '@/components/overview/shared';
import { cx } from '@/lib/format';
import type { BrandRow } from '@/lib/reportsView';

type Key = 'deals' | 'earned' | 'paysIn';
const GRID = 'lg:grid lg:grid-cols-[minmax(0,1fr)_56px_90px_124px_233px] lg:items-center';
const SHOWN = 7;
const SLOW = 20;

export function TopBrands({ rows }: { rows: BrandRow[] }) {
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: 'earned', dir: -1 });
  const click = (key: Key) => setSort(s => (s.key === key ? { key, dir: (-s.dir) as 1 | -1 } : { key, dir: -1 }));
  // A brand with no "usually pays in" yet goes last whichever way the column is sorted.
  const val = (b: BrandRow) => (sort.key === 'paysIn' ? b.paysIn : sort.key === 'deals' ? b.deals : b.earned);
  const sorted = [...rows].sort((x, y) => {
    const a = val(x), b = val(y);
    if (a === null && b === null) return 0;
    if (a === null) return 1;
    if (b === null) return -1;
    return (a - b) * sort.dir || y.earned - x.earned || x.name.localeCompare(y.name);
  }).slice(0, SHOWN);
  const head = (key: Key, label: string) => {
    const on = sort.key === key, I = !on ? ArrowUpDown : sort.dir === -1 ? ArrowDown : ArrowUp;
    return (
      <button type="button" onClick={() => click(key)} aria-label={`Sort by ${label}`} className={cx('inline-flex cursor-pointer items-center justify-end gap-1 border-0 bg-transparent p-0 text-[12px] lg:w-full', on ? 'font-semibold text-ink' : 'font-medium text-muted hover:text-ink')}>{label}<I size={13} aria-hidden="true" /></button>
    );
  };
  return (
    <section aria-label="Top brands" className={cx(CARD, 'flex flex-col rounded-[24px] p-[19px] lg:px-[25px] lg:pb-[22px] lg:pt-[22px]')}>
      <div className="flex items-baseline justify-between"><h2 className="m-0 text-[18px] font-medium">Top brands</h2><Link to="/app/brands" className="text-[13.5px] font-semibold text-brand-ink hover:underline">All brands</Link></div>
      <div role="row" className={cx('mt-4 hidden h-[38px] rounded-[14px] bg-[#ECEDED] px-3 text-[12px] font-medium text-muted', GRID)}>
        <span>Brand</span>{head('deals', 'Deals')}{head('earned', 'Earned')}{head('paysIn', 'Usually pays in')}<span className="pl-6">Share of earnings</span>
      </div>
      {sorted.length === 0 ? (
        <div className="px-4 py-14 text-center"><p className="m-0 text-[15px] font-semibold">No paid deals in this period</p><p className="m-0 mt-1 text-[13px] font-medium text-muted">Brands that paid you show up here, with how much and how fast.</p></div>
      ) : (
        <ul className="m-0 list-none p-0">
          {sorted.map(b => (
            <li key={b.key} className={cx('flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-[#EEEFEF] px-3 py-2.5 last:border-b-0 lg:h-[53px] lg:py-0', GRID)}>
              <span className="flex min-w-0 flex-1 items-center gap-3 lg:flex-none">
                <span aria-hidden="true" className="grid size-8 flex-none place-items-center rounded-full text-[11px] font-bold" style={{ background: b.bg, color: b.fg }}>{b.initials}</span>
                <span className="truncate text-[14.5px] font-medium">{b.name}</span>
              </span>
              <span className="text-right text-[14.5px] font-medium tabular-nums">{b.deals}</span>
              <span className="text-right text-[14.5px] font-medium tabular-nums">{rupee(b.earned)}</span>
              <span className={cx('text-right text-[14.5px] font-medium tabular-nums', b.paysIn !== null && b.paysIn > SLOW ? 'text-danger' : '')}>{b.paysIn === null ? "—" : `${b.paysIn} day${b.paysIn === 1 ? "" : "s"}`}</span>
              <span className="flex items-center gap-3 lg:pl-6">
                <span className="h-[7px] min-w-0 max-w-[188px] flex-1 overflow-hidden rounded-full bg-[#E6E7E8]"><span className="block h-full rounded-full bg-[#0F9467]" style={{ width: `${Math.max(b.share, 2)}%` }} /></span>
                <span className="w-9 text-right text-[14px] font-medium tabular-nums">{b.share}%</span>
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="m-0 mt-auto pt-4 text-[13px] font-medium leading-snug text-ink-2">Amounts are as agreed, before tax. Brands that usually pay after more than {SLOW} days are shown in red. Usually pays in is based on all your deals with this brand.</p>
    </section>
  );
}
