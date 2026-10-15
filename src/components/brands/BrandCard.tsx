import type { BrandRec } from '@/lib/brandStats';
import { cx } from '@/lib/format';

const rupee = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
const LEVEL = { repeat: 'Repeat', returning: 'Returning', new: 'New' } as const;

/** One brand in the grid. The tile uses the brand's colour; the number of deals decides the chip. */
export function BrandCard({ brand, selected, onSelect }: { brand: BrandRec; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" aria-pressed={selected} onClick={onSelect}
      className={cx('flex min-w-0 cursor-pointer flex-col gap-3 rounded-[18px] bg-[#FAFAFA] p-4 pb-4 text-left transition-[transform,box-shadow] duration-150 active:scale-[.99]', selected ? 'shadow-[0_0_0_2px_var(--color-brand)]' : 'shadow-[0_0_0_1px_rgba(0,0,0,.05),0_1px_3px_rgba(0,0,0,.04)] hover:shadow-[0_0_0_1px_rgba(0,0,0,.1)]')}>
      <span className="relative block h-[112px] overflow-hidden rounded-xl" style={{ background: `linear-gradient(135deg, ${brand.bg} 0%, color-mix(in srgb, ${brand.bg} 60%, white) 100%)` }}>
        <span aria-hidden="true" className="absolute -top-3 left-1 select-none text-[120px] font-black leading-none tracking-[-0.06em] opacity-[.16]" style={{ color: brand.fg }}>{brand.initials}</span>
        <span className="absolute bottom-2.5 left-3 text-[26px] font-black leading-none tracking-[-0.03em]" style={{ color: brand.fg }}>{brand.initials}</span>
        <span className="absolute bottom-2.5 right-2.5 inline-flex h-6 items-center rounded-full bg-white/90 px-2.5 text-xs font-semibold" style={{ color: brand.fg }}>{LEVEL[brand.level]}</span>
      </span>
      <span className="flex min-w-0 flex-col gap-0.5"><span className="truncate text-[15px] font-semibold">{brand.name}</span><span className="truncate text-[12.5px] font-medium text-muted">{brand.contact || ' '}</span></span>
      <span className="grid grid-cols-3 gap-2 border-t border-[#ECEDEE] pt-3 text-[10.5px] font-medium text-muted">
        <span className="flex flex-col gap-0.5">Deals<b className="text-[13px] font-semibold text-ink tabular-nums">{brand.count}</b></span>
        <span className="flex flex-col gap-0.5">Earned<b className="text-[13px] font-semibold text-ink tabular-nums">{rupee(brand.earned)}</b></span>
        <span className="flex flex-col gap-0.5">Pays in<b className={cx('text-[13px] font-semibold tabular-nums', brand.paysIn !== null && brand.paysIn > 20 ? 'text-danger' : 'text-ink')}>{brand.paysIn === null ? '—' : `${brand.paysIn} days`}</b></span>
      </span>
    </button>
  );
}
