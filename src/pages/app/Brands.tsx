import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { effStage, STAGE, useAccount } from '@/api';
import { Avatar, Card, Pill } from '@/components/ui';
import { PageHead, StagePill } from '@/components/deal';
import { DealsBrandsTabs } from './Deals';
import { cx, DAY, inr } from '@/lib/format';

export default function Brands() {
  const a = useAccount()!;
  const brands = useMemo(() => {
    const m = new Map<string, { brand: string; contact: string; deals: typeof a.deals; earned: number; open: number; days: number[] }>();
    a.deals.forEach(d => {
      const b = m.get(d.brand) || { brand: d.brand, contact: d.contact, deals: [], earned: 0, open: 0, days: [] };
      b.deals.push(d);
      if (STAGE[effStage(d)].turn !== 'done') b.open += d.n;
      a.payments.filter(p => p.dealId === d.id).forEach(p => { b.earned += p.amount; if (d.approvedAt) b.days.push(Math.round((Date.parse(p.date) - Date.parse(d.approvedAt)) / DAY)); });
      m.set(d.brand, b);
    });
    return [...m.values()].sort((x, y) => y.earned + y.open - (x.earned + x.open));
  }, [a]);
  const [sel, setSel] = useState(brands[0]?.brand);
  const b = brands.find(x => x.brand === sel) || brands[0];
  const avg = (b?.days.length ? Math.round(b.days.reduce((s, x) => s + x, 0) / b.days.length) : null);

  return (
    <>
      <PageHead above={<div className="mb-2"><DealsBrandsTabs current="Brands" /></div>} title="Brands" sub={`${brands.length} brands you've worked with`} />
      {b && (
        <section aria-label={b.brand} className="rounded-[var(--radius-card)] bg-deep p-5 lg:px-6 lg:py-5 text-white flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3"><Avatar name={b.brand} size={48} dark /><div className="flex flex-col"><span className="font-display text-[28px] lg:text-[34px] leading-none font-medium tracking-[-0.02em]">{b.brand}</span><span className="text-[13px] font-medium text-mint-soft">{b.contact} · {b.deals.length} deal{b.deals.length === 1 ? '' : 's'}</span></div></div>
          <div className="ml-auto grid grid-cols-3 gap-2 min-w-[280px] flex-1 lg:flex-none lg:w-[480px]">
            {[['Earned', inr(b.earned)], ['Open', inr(b.open)], ['Pays in', avg === null ? '—' : `${avg} days`]].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1 rounded-xl bg-deep-2 px-3.5 py-2.5"><span className="text-[11px] font-semibold uppercase tracking-[.05em] text-[#9FD8C0]">{k}</span><span className="text-xl font-semibold tabular-nums whitespace-nowrap">{v}</span></div>
            ))}
          </div>
        </section>
      )}
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-start">
        <Card className="overflow-hidden">
          <div role="listbox" aria-label="Brands" className="divide-y divide-line">
            {brands.map(x => (
              <button key={x.brand} type="button" role="option" aria-selected={x.brand === b?.brand} onClick={() => setSel(x.brand)} className={cx('flex w-full items-center gap-3 px-4 py-3 text-left lg:px-6 cursor-pointer', x.brand === b?.brand ? 'bg-brand-tint' : 'hover:bg-subtle')}>
                <Avatar name={x.brand} size={32} /><span className="flex-1 text-sm font-semibold">{x.brand}</span><span className="text-[13px] font-semibold tabular-nums text-muted">{inr(x.earned)}</span>
              </button>
            ))}
          </div>
        </Card>
        {b && (
          <Card className="overflow-hidden">
            <div className="px-4 pt-5 pb-2 lg:px-6"><h2 className="m-0 text-base font-semibold">Deals with {b.brand}</h2></div>
            <div className="divide-y divide-line">
              {b.deals.map(d => (
                <Link key={d.id} to={`/app/deals/${d.id}`} className="flex items-center gap-3 px-4 py-3.5 lg:px-6 text-ink hover:text-ink hover:bg-subtle">
                  <span className="flex min-w-0 flex-1 flex-col gap-1"><span className="text-sm font-semibold">{d.del}</span><span className="flex gap-2"><StagePill d={d} />{d.version && d.version > 1 && <Pill>v{d.version}</Pill>}</span></span>
                  <span className="text-sm font-semibold tabular-nums">{inr(d.n)}</span>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
