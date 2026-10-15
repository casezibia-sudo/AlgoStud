import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAccount } from '@/api';
import { BrandCard } from '@/components/brands/BrandCard';
import { BrandHero } from '@/components/brands/BrandHero';
import { DealsBrandsTabs } from '@/components/deals/Tabs';
import { Boundary, DataError, CARD } from '@/components/overview/shared';
import { useAuth } from '@/lib/auth';
import { brandStats } from '@/lib/brandStats';
import { cx } from '@/lib/format';

type Filter = 'all' | 'repeat' | 'new';

export default function Brands() {
  const a = useAccount();
  const { reload } = useAuth();
  const all = useMemo(() => (a ? brandStats(a) : []), [a]);
  const [filter, setFilter] = useState<Filter>('all');
  const [sel, setSel] = useState('');

  const counts = { all: all.length, repeat: all.filter(b => b.count >= 2).length, new: all.filter(b => b.count === 1).length };
  const shown = all.filter(b => filter === 'all' || (filter === 'repeat' ? b.count >= 2 : b.count === 1));
  const current = all.find(b => b.key === sel) || shown[0] || all[0];

  return (
    <>
      <div className="pt-5"><DealsBrandsTabs current="Brands" /></div>
      {!a ? <div className="pt-6"><DataError onRetry={reload} /></div> : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 pt-[13px]">
            <div className="flex flex-col gap-1">
              <h1 className="m-0 text-[30px] font-semibold leading-10 tracking-[-0.02em]">Brands</h1>
              <p className="m-0 text-sm font-medium text-[#3A3A40]">Everyone you've worked with, and how they work with you.</p>
            </div>
            <div role="group" aria-label="Brand filter" className="inline-flex rounded-xl bg-[#E6E7E7] p-[3px]">
              {([['all', 'All'], ['repeat', 'Repeat'], ['new', 'New']] as const).map(([k, label]) => (
                <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}
                  className={cx('inline-flex h-[30px] cursor-pointer items-center gap-1.5 rounded-[9px] px-3 text-sm', filter === k ? 'bg-white font-semibold shadow-[0_1px_2px_rgba(0,0,0,.08)]' : 'font-medium text-ink-2')}>{label}<span className="text-muted tabular-nums">{counts[k]}</span></button>
              ))}
            </div>
          </div>
          {all.length === 0 ? (
            <section className={`${CARD} flex flex-col items-center gap-2 py-14 text-center`}>
              <span className="text-base font-semibold">No brands yet</span>
              <span className="max-w-sm text-sm font-medium text-muted">Brands appear here once you create a deal. You'll see how many deals you've done with each, what they paid, and how quickly.</span>
              <Link to="/app/deals/new" className="mt-1 inline-flex h-9 items-center gap-2 rounded-[10px] bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover hover:text-white"><Plus size={15} aria-hidden="true" />New deal</Link>
            </section>
          ) : (
            <div className="flex flex-col gap-[18px] pb-8">
              <Boundary title="Brand"><BrandHero brand={current} brands={all} onSelect={setSel} /></Boundary>
              <Boundary title="Brands">
                {shown.length === 0
                  ? <p className={`${CARD} m-0 text-center text-sm font-medium text-muted`}>No {filter === 'new' ? 'new' : 'repeat'} brands yet.</p>
                  : <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">{shown.map(b => <BrandCard key={b.key} brand={b} selected={b.key === current.key} onSelect={() => setSel(b.key)} />)}</div>}
              </Boundary>
            </div>
          )}
        </>
      )}
    </>
  );
}
