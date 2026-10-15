import { Link } from 'react-router-dom';
import { Check, Plus, X } from 'lucide-react';
import { sinceLabel, type BrandRec } from '@/lib/brandStats';
import { Orbit } from './Orbit';

const rupee = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

/** The selected brand: orbit of all brands, name, contact, the three numbers, and the payment record. */
export function BrandHero({ brand, brands, onSelect }: { brand: BrandRec; brands: BrandRec[]; onSelect: (key: string) => void }) {
  const onTime = brand.record.filter(r => r.onTime).length, rec = brand.record.length;
  const newDeal = `/app/deals/new?${new URLSearchParams({ brand: brand.name, ...(brand.contact ? { contact: brand.contact } : {}), ...(brand.email ? { email: brand.email } : {}) })}`;
  return (
    <section aria-label={brand.name} className="relative grid gap-6 overflow-hidden rounded-3xl px-8 py-5 text-white lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-10"
      style={{ background: 'radial-gradient(70% 120% at 12% 100%, #0F3D2E 0%, rgba(15,61,46,0) 70%), radial-gradient(60% 100% at 100% 0%, #2A2A1E 0%, rgba(42,42,30,0) 60%), linear-gradient(120deg,#0A2A20 0%,#06140E 70%)' }}>
      <Orbit brands={brands} selected={brand.key} onSelect={onSelect} />
      <div className="flex min-w-0 flex-col gap-2">
        {brand.since && <span className="inline-flex h-[26px] items-center self-start rounded-lg bg-white/10 px-2.5 text-xs font-semibold text-white/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,.14)]">Since {sinceLabel(brand.since)}</span>}
        <h2 className="m-0 break-words text-[40px] font-bold leading-none tracking-[-0.03em] text-[#F5D9A8] lg:text-[44px]">{brand.name}</h2>
        {(brand.contact || brand.email) && <p className="m-0 text-sm font-medium text-white/85">{[brand.contact, brand.email].filter(Boolean).join(' · ')}</p>}
        <dl className="m-0 grid grid-cols-3 divide-x divide-white/10 rounded-xl bg-black/25 shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)]">
          {[['Deals', String(brand.count)], ['Earned', rupee(brand.earned)], ['Usually pays in', brand.paysIn === null ? '—' : `${brand.paysIn} days`]].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5 px-4 py-2"><dt className="text-[13px] font-medium text-white/65">{k}</dt><dd className="m-0 text-[22px] font-semibold tabular-nums">{v}</dd></div>
          ))}
        </dl>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <span className="text-sm font-semibold text-white/90">Payment record</span>
          <span className="text-xs font-medium text-white/70">{rec ? (onTime === rec ? `All ${rec} paid on time` : `${onTime} of ${rec} paid on time`) : ''}</span>
        </div>
        {rec ? (
          <ul className="m-0 -mt-1.5 flex list-none flex-wrap gap-1.5 p-0">
            {brand.record.map((r, i) => (
              <li key={i} className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,.16)] ${r.onTime ? 'bg-[#34C39A]/15 text-[#BFEFDB]' : 'bg-[#E5352B]/20 text-[#FFC9C4]'}`}>
                {r.onTime ? <Check size={12} aria-hidden="true" /> : <X size={12} aria-hidden="true" />}{r.onTime ? 'On time' : `${r.daysLate} ${r.daysLate === 1 ? 'day' : 'days'} late`}
              </li>
            ))}
          </ul>
        ) : <p className="m-0 -mt-1.5 text-[13px] font-medium text-white/60">No payments yet. Each paid deal shows here as on time or late.</p>}
        <div className="mt-1 flex flex-wrap gap-2.5">
          <Link to={newDeal} className="inline-flex h-[38px] items-center gap-2 rounded-xl bg-[#34C39A] px-4 text-[13.5px] font-semibold text-[#06140E] shadow-[0_8px_20px_-8px_rgba(52,195,154,.7)] hover:bg-[#2FB38D] hover:text-[#06140E]"><Plus size={16} aria-hidden="true" />New deal with {brand.name}</Link>
          <Link to={`/app/deals?q=${encodeURIComponent(brand.name)}`} className="inline-flex h-[38px] items-center rounded-xl bg-white/10 px-4 text-[13.5px] font-semibold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.18)] hover:bg-white/15 hover:text-white">See deals</Link>
        </div>
      </div>
    </section>
  );
}
