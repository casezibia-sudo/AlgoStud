import { LayoutGrid, List, Search } from 'lucide-react';
import { CHIPS, type ChipKey } from '@/lib/dealsView';
import { cx } from '@/lib/format';

const ctl = 'h-[34px] rounded-xl bg-white text-sm font-medium text-ink shadow-[0_0_0_1px_rgba(0,0,0,.08)] outline-none focus-visible:shadow-[0_0_0_1.5px_var(--color-brand)]';

export interface FilterProps {
  chip: ChipKey | null; counts: Record<ChipKey | 'all', number>; onChip: (c: ChipKey | null) => void;
  q: string; onQ: (v: string) => void;
  brand: string; brands: { key: string; name: string }[]; onBrand: (v: string) => void;
  view: 'list' | 'board'; onView: (v: 'list' | 'board') => void;
}

/** Stage chips, search, brand filter, the (not yet available) type filter, and the List / Board switch. */
export function FilterBar(p: FilterProps) {
  const chip = (key: ChipKey | null, label: string, n: number) => {
    const on = p.chip === key;
    return (
      <button key={label} type="button" aria-pressed={on} onClick={() => p.onChip(on && key !== null ? null : key)}
        className={cx('inline-flex h-[34px] cursor-pointer items-center gap-1.5 rounded-xl px-3 text-sm font-medium transition-[background,transform] active:scale-[.97]', on ? 'bg-[#111111] text-white shadow-[0_1px_2px_rgba(0,0,0,.2)]' : 'bg-white text-ink-2 shadow-[0_0_0_1px_rgba(0,0,0,.08)] hover:bg-subtle')}>
        {label}<span className={cx('tabular-nums', on ? 'text-white/70' : 'text-muted')}>{n}</span>
      </button>
    );
  };
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
      <div role="group" aria-label="Stage" className="flex flex-wrap gap-[5px]">
        {chip(null, 'All', p.counts.all)}
        {CHIPS.map(c => chip(c.key, c.label, p.counts[c.key]))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative block w-[218px]"><span className="sr-only">Search deals</span>
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input value={p.q} onChange={e => p.onQ(e.target.value)} placeholder="Search deals" className={cx(ctl, 'w-full pl-9 pr-3 placeholder:text-[#8A8A92]')} />
        </label>
        <select aria-label="Brand" value={p.brand} onChange={e => p.onBrand(e.target.value)} className={cx(ctl, 'w-[133px] cursor-pointer px-3')}>
          <option value="">All brands</option>
          {p.brands.map(b => <option key={b.key} value={b.key}>{b.name}</option>)}
        </select>
        {/* Types come with deliverable tracking, so this stays visible but disabled. */}
        <select aria-label="Type" disabled title="Filtering by type arrives with deliverable tracking." className={cx(ctl, 'w-[105px] px-3 opacity-60')}><option>All types</option></select>
        <div role="group" aria-label="View" className="inline-flex rounded-xl bg-[#E6E7E7] p-[3px]">
          {([['list', 'List', List], ['board', 'Board', LayoutGrid]] as const).map(([v, label, Icon]) => (
            <button key={v} type="button" aria-pressed={p.view === v} onClick={() => p.onView(v)}
              className={cx('inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-[9px] px-3 text-sm', p.view === v ? 'bg-white font-semibold shadow-[0_1px_2px_rgba(0,0,0,.08)]' : 'font-medium text-ink-2')}><Icon size={14} aria-hidden="true" />{label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
