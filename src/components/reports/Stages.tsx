import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Share } from 'lucide-react';
import { LATER } from '@/api/safe';
import { CARD, rupee } from '@/components/overview/shared';
import { useToast } from '@/components/ui';
import { cx } from '@/lib/format';
import type { Reports, Seg } from '@/lib/reportsView';

const R_MAX = 208, H = 228;
const icoBtn = 'grid size-10 cursor-pointer place-items-center rounded-full border-0 bg-white text-ink shadow-[0_0_0_1px_rgba(0,0,0,.08)] hover:bg-subtle';

/** Active, Overdue and Paid with amounts, counts and share of the total, and bubbles sized from the real amounts. */
export function Stages({ r }: { r: Reports }) {
  const nav = useNavigate(), toast = useToast(), s = r.stages;
  const cards: { key: string; label: string; dot: string; seg: Seg }[] = [
    { key: 'active', label: 'Active', dot: 'bg-[#0F9467]', seg: s.active }, { key: 'overdue', label: 'Overdue', dot: 'bg-[#E5533D]', seg: s.overdue }, { key: 'paid', label: 'Paid', dot: 'bg-[#9AD9C0]', seg: s.paid },
  ];
  const maxA = Math.max(...cards.map(c => c.seg.amount), 1);
  const rad = (a: number) => R_MAX * Math.max(0.4, Math.sqrt(a / maxA));
  const fill: Record<string, [string, string]> = { active: ['linear-gradient(180deg,#38BB8C,#0B8D5E)', '#fff'], overdue: ['linear-gradient(180deg,#F3A090,#E26F5B)', '#fff'], paid: ['#C9EBDD', '#1C3B30'] };
  // Where each bubble sits across the card (a share of its width); they overlap like the design.
  const cx_: Record<string, string> = { active: '23%', paid: '55%', overdue: '84%' };
  const none = s.total === 0;

  return (
    <section aria-label="Deal stages" className={cx(CARD, 'flex flex-col overflow-hidden rounded-[24px] p-[19px] lg:px-[25px] lg:pb-0 lg:pt-[22px]')}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="m-0 text-[18px] font-medium">Deal stages</h2>
        <div className="flex gap-2.5">
          <button type="button" aria-label="New deal" title="New deal" onClick={() => nav('/app/deals/new')} className={icoBtn}><Plus size={17} aria-hidden="true" /></button>
          <button type="button" aria-label="Export deal stages" title="Export" onClick={() => toast(LATER('Exporting deal stages'))} className={icoBtn}><Share size={16} aria-hidden="true" /></button>
          <button type="button" aria-label="Open the deliverables calendar" title="Deliverables calendar" onClick={() => nav('/app/deliverables?view=calendar')} className={icoBtn}><Calendar size={16} aria-hidden="true" /></button>
        </div>
      </div>
      <div className="mt-4 grid gap-[13px] sm:grid-cols-3">
        {cards.map(c => (
          <div key={c.key} className="flex flex-col gap-0.5 rounded-2xl bg-white px-4 py-2.5 shadow-[0_0_0_1px_rgba(0,0,0,.05)]">
            <span className="flex items-center gap-2 text-[13px] font-medium"><span aria-hidden="true" className={cx('size-2 rounded-full', c.dot)} />{c.label}</span>
            <span className="text-[19px] font-semibold leading-tight tracking-[-0.01em]">{rupee(c.seg.amount)}</span>
            <span className="text-[12.5px] font-medium text-muted">{c.seg.n} deal{c.seg.n === 1 ? '' : 's'} · {c.seg.pct}% of all</span>
          </div>
        ))}
      </div>

      {none ? (
        <div className="px-4 py-16 text-center"><p className="m-0 text-[15px] font-semibold">No deals yet</p><p className="m-0 mt-1 text-[13px] font-medium text-muted">Active, overdue and paid deals show up here as bubbles.</p></div>
      ) : (
        <div role="img" aria-label={cards.map(c => `${c.label}: ${rupee(c.seg.amount)}, ${c.seg.n} deals`).join('. ')} className="relative mt-auto min-h-[228px] flex-none overflow-hidden lg:-mx-[25px]" style={{ height: H, marginTop: 'auto' }}>
          {[...cards].sort((x, y) => y.seg.amount - x.seg.amount).map(c => {
            if (!c.seg.n) return null;
            const rr = rad(c.seg.amount), [bg, fg] = fill[c.key], cy = H - 20;
            return (
              <div key={c.key}>
                <div className="absolute rounded-full" style={{ width: rr * 2, height: rr * 2, left: `calc(${cx_[c.key]} - ${rr}px)`, top: cy - rr, background: bg, color: fg }}>
                  <div className="absolute inset-x-0 text-center" style={{ top: Math.max(18, rr * 0.3) }}>
                    <div className="text-[16px] font-semibold">{c.label}</div>
                    <div className="mt-1 text-[14px] font-semibold opacity-90">{rupee(c.seg.amount)}</div>
                  </div>
                </div>
                <span className="absolute grid size-11 place-items-center rounded-full bg-white text-[20px] font-semibold shadow-[0_2px_8px_rgba(0,0,0,.12)]" style={{ left: `calc(${cx_[c.key]} - ${rr * 0.74}px - 22px)`, top: cy - rr * 0.74 - 22 }}>{c.seg.n}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
