import { useNavigate } from 'react-router-dom';
import { cx } from '@/lib/format';

/** The Deals | Brands switch at the top of both pages. */
export function DealsBrandsTabs({ current }: { current: 'Deals' | 'Brands' }) {
  const nav = useNavigate();
  return (
    <div role="tablist" aria-label="Deals sections" className="inline-flex rounded-[14px] bg-[#E6E7E7] p-[3px]">
      {(['Deals', 'Brands'] as const).map(t => (
        <button key={t} type="button" role="tab" aria-selected={current === t} onClick={() => nav(t === 'Deals' ? '/app/deals' : '/app/brands')}
          className={cx('h-[30px] cursor-pointer rounded-[11px] px-3 text-sm transition-[background,box-shadow] duration-150', current === t ? 'bg-white font-semibold shadow-[0_1px_3px_rgba(0,0,0,.1)]' : 'font-medium text-ink-2 hover:text-ink')}>{t}</button>
      ))}
    </div>
  );
}
