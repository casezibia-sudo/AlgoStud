import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { effStage, STAGE, useAccount, type Deal } from '@/api';
import { LATER } from '@/api/safe';
import { useDealAction } from '@/components/deal';
import { BoardView } from '@/components/deals/BoardView';
import { FilterBar } from '@/components/deals/FilterBar';
import { ListView, type Group } from '@/components/deals/ListView';
import { DealsBrandsTabs } from '@/components/deals/Tabs';
import { Boundary, DataError } from '@/components/overview/shared';
import { useToast } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { CHIPS, chipOf, dealsHeader, isOpen, rupee, type ChipKey } from '@/lib/dealsView';

const CHIP_KEYS = new Set<string>(CHIPS.map(c => c.key));

export default function Deals() {
  const a = useAccount();
  const { reload } = useAuth();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const { run, sheets } = useDealAction();
  // The header search sends people here as /app/deals?q=...
  const urlQ = params.get('q') || '';
  const [q, setQ] = useState(urlQ);
  useEffect(() => { setQ(urlQ); }, [urlQ]);
  const set = (k: string, v: string | null) => { const p = new URLSearchParams(params); v ? p.set(k, v) : p.delete(k); setParams(p, { replace: true }); };

  const chip = (CHIP_KEYS.has(params.get('stage') || '') ? params.get('stage') : null) as ChipKey | null;
  const view = params.get('view') === 'board' ? 'board' : 'list';
  const brandKey = params.get('brand') || '';
  const later = (what: string) => toast(LATER(what));

  const live = useMemo(() => (a ? a.deals.filter(d => chipOf(d) !== null) : []), [a]);
  const brands = useMemo(() => { const m = new Map<string, string>(); live.forEach(d => { const k = String(d.brand ?? '').trim().toLowerCase(); if (k && !m.has(k)) m.set(k, String(d.brand).trim()); }); return [...m].map(([key, name]) => ({ key, name })).sort((x, y) => x.name.localeCompare(y.name)); }, [live]);

  const match = (d: Deal) => (!q || (d.brand + ' ' + d.del + ' ' + d.contact).toLowerCase().includes(q.toLowerCase())) && (!brandKey || String(d.brand ?? '').trim().toLowerCase() === brandKey);
  const searched = useMemo(() => live.filter(match), [live, q, brandKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const counts = useMemo(() => ({
    all: searched.filter(isOpen).length,
    ...Object.fromEntries(CHIPS.map(c => [c.key, searched.filter(d => chipOf(d) === c.key).length])),
  }) as Record<ChipKey | 'all', number>, [searched]);

  const shown = chip ? searched.filter(d => chipOf(d) === chip) : searched;
  const groups: Group[] = chip === 'done'
    ? [{ title: 'Done', sub: 'Paid and closed', rows: shown }]
    : [
        { title: 'Needs you', sub: 'Your move', rows: shown.filter(d => isOpen(d) && STAGE[effStage(d)].turn === 'you') },
        { title: 'Waiting on brand', sub: "Brand's move", rows: shown.filter(d => isOpen(d) && STAGE[effStage(d)].turn === 'brand') },
        // Searching or filtering by brand should also find paid deals, which the plain list keeps under the Done chip.
        ...(q || brandKey ? [{ title: 'Done', sub: 'Paid and closed', rows: shown.filter(d => chipOf(d) === 'done') }] : []),
      ];
  const filtering = !!(q || chip || brandKey);

  const head = a ? dealsHeader(a) : null;
  const sub = !head ? '' : head.needN || head.lateN
    ? [head.lateN ? `${head.lateN} payment${head.lateN === 1 ? '' : 's'} late` : '', head.needN ? `${head.needN} deal${head.needN === 1 ? '' : 's'} need you` : ''].filter(Boolean).join(', ')
    : 'Nothing needs you right now';

  return (
    <>
      <div className="pt-3"><DealsBrandsTabs current="Deals" /></div>
      {!a || !head ? <div className="pt-6"><DataError onRetry={reload} /></div> : (
        <>
          <Boundary title="Deals">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 pt-2">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <h1 className="m-0 mr-1 text-[32px] font-semibold leading-10 tracking-[-0.02em]">Deals</h1>
                  <span className="text-[13px] font-medium text-ink-2">Open <b className="ml-1 text-base font-semibold tabular-nums">{rupee(head.open)}</b></span>
                  <span className="text-[13px] font-medium text-ink-2">Overdue <b className="ml-1 text-base font-semibold tabular-nums text-danger">{rupee(head.overdue)}</b></span>
                  <span className="text-[13px] font-medium text-ink-2">Received in {head.monthLabel} <b className="ml-1 text-base font-semibold tabular-nums text-brand-ink">{rupee(head.received)}</b></span>
                </div>
                <p className="m-0 text-sm font-medium text-[#3A3A40]">{sub}</p>
              </div>
              <Link to="/app/deals/new" className="mt-2 inline-flex h-[38px] items-center gap-2 rounded-[10px] bg-white px-4 text-sm font-medium text-ink shadow-[0_0_0_1px_rgba(0,0,0,.1),0_1px_2px_rgba(0,0,0,.04)] hover:bg-subtle hover:text-ink"><Plus size={15} aria-hidden="true" />New deal</Link>
            </div>
          </Boundary>
          <Boundary title="Filters">
            <FilterBar chip={chip} counts={counts} onChip={c => set('stage', c)} q={q} onQ={setQ} brand={brandKey} brands={brands} onBrand={v => set('brand', v || null)} view={view} onView={v => set('view', v === 'board' ? 'board' : null)} />
          </Boundary>
          <div className="pb-8 pt-4">
            <Boundary title="Deals">
              {view === 'board' ? <BoardView deals={shown} onRun={run} onLater={later} /> : (
                <section aria-label="Deals list" className="min-w-0 rounded-[18px] bg-[#FAFAFA] p-2 shadow-[0_0_0_1px_rgba(0,0,0,.05),0_1px_3px_rgba(0,0,0,.04)]">
                  {groups.every(g => g.rows.length === 0) ? (
                    <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
                      <span className="text-base font-semibold">{filtering ? 'No deals match' : 'No deals yet'}</span>
                      <span className="max-w-sm text-sm font-medium text-muted">{filtering ? 'Try clearing the search or filters.' : 'Create a deal and it will show up here.'}</span>
                      {filtering ? <button type="button" onClick={() => { setQ(''); setParams(new URLSearchParams(), { replace: true }); }} className="mt-1 h-9 cursor-pointer rounded-[10px] bg-white px-4 text-sm font-medium shadow-[0_0_0_1px_rgba(0,0,0,.12)]">Clear filters</button>
                        : <Link to="/app/deals/new" className="mt-1 inline-flex h-9 items-center rounded-[10px] bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover hover:text-white">New deal</Link>}
                    </div>
                  ) : <ListView groups={groups.filter(g => g.rows.length)} onRun={run} onLater={later} />}
                </section>
              )}
            </Boundary>
          </div>
        </>
      )}
      {sheets}
    </>
  );
}
