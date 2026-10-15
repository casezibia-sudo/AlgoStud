import { CircleCheck, Clock, Download, FileText, Handshake, TrendingDown, TrendingUp, Wallet, type LucideIcon } from 'lucide-react';
import { LATER } from '@/api/safe';
import { CARD } from '@/components/overview/shared';
import { useToast } from '@/components/ui';
import { cx } from '@/lib/format';
import type { Kpi, Months, Reports } from '@/lib/reportsView';

const OPTIONS: Months[] = [3, 6, 12];

/** Title, the two date ranges, the 3 / 6 / 12 month switch and the two export buttons (not built yet). */
export function Head({ n, onN, r }: { n: Months; onN: (n: Months) => void; r: Reports | null }) {
  const toast = useToast();
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 pb-4 pt-3 lg:pt-3.5">
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-[30px] font-semibold leading-10 tracking-[-0.02em]">Reports</h1>
        {r && <p className="m-0 text-[15px] font-medium text-ink-2">{r.range.text} · compared with {r.range.prevText}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3 lg:mt-1">
        <div role="group" aria-label="Period" className="inline-flex rounded-full bg-[#E6E7E7] p-[3px]">
          {OPTIONS.map(o => (
            <button key={o} type="button" aria-pressed={n === o} onClick={() => onN(o)}
              className={cx('h-[34px] cursor-pointer rounded-full border-0 px-4 text-[14px] transition-[background,box-shadow] duration-150', n === o ? 'bg-white font-semibold shadow-[0_1px_3px_rgba(0,0,0,.1)]' : 'bg-transparent font-medium text-ink-2 hover:text-ink')}>Last {o} months</button>
          ))}
        </div>
        <button type="button" onClick={() => toast(LATER('Downloading a CSV'))} className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border-0 bg-white px-5 text-[14px] font-semibold text-ink shadow-[0_0_0_1px_rgba(0,0,0,.08)] hover:bg-subtle"><Download size={16} aria-hidden="true" />Download CSV</button>
        <button type="button" onClick={() => toast(LATER('Exporting a PDF'))} className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border-0 bg-brand px-5 text-[14px] font-semibold text-white shadow-[0_8px_18px_-8px_rgba(10,127,85,.6)] hover:bg-brand-hover"><FileText size={16} aria-hidden="true" />Export PDF</button>
      </div>
    </div>
  );
}

const TILES: { key: keyof Reports['kpis']; label: string; icon: LucideIcon; green?: boolean }[] = [
  { key: 'earned', label: 'Earned', icon: Wallet, green: true },
  { key: 'completed', label: 'Deals completed', icon: Handshake, green: true }, { key: 'avg', label: 'Average time to get paid', icon: Clock }, { key: 'onTime', label: 'Paid on time', icon: CircleCheck, green: true },
];

export function Tiles({ k }: { k: Reports['kpis'] }) {
  return (
    <section aria-label="Key numbers" className="grid gap-[13px] sm:grid-cols-2 lg:grid-cols-4">
      {TILES.map(t => <Tile key={t.key} label={t.label} icon={t.icon} green={t.green} v={k[t.key]} />)}
    </section>
  );
}

function Tile({ label, icon: I, green, v }: { label: string; icon: LucideIcon; green?: boolean; v: Kpi }) {
  const none = v.value === '—';
  return (
    <div className={cx(CARD, 'flex flex-col gap-3 rounded-[24px] px-[19px] pb-5 pt-[18px] xl:min-h-[171px]')}>
      <div className="flex items-center gap-2 whitespace-nowrap text-[13.5px] font-medium">
        <span aria-hidden="true" className={cx('grid size-7 flex-none place-items-center rounded-full', green ? 'bg-[#DDF1EA] text-brand-ink' : 'bg-[#E6E7E8] text-ink-2')}><I size={15} /></span>
        <span className="min-w-0">{label}</span>
      </div>
      <span className={cx('text-[40px] font-semibold leading-[1.1] tracking-[-0.02em]', none && 'text-muted')}>{v.value}</span>
      {(v.delta || v.vs) ? (
        <div className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-muted">
          {v.delta
            ? <span className={cx('inline-flex h-6 items-center gap-1 rounded-full px-2 text-[12px] font-semibold', v.delta.up ? 'bg-[#DDF1EA] text-brand-ink' : 'bg-[#FDE8E8] text-danger')}>{v.delta.up ? <TrendingUp size={13} aria-hidden="true" /> : <TrendingDown size={13} aria-hidden="true" />}{v.delta.text}</span>
            : <span aria-label="No comparison available" className="inline-flex h-6 items-center rounded-full bg-[#ECEDED] px-2 text-[12px] font-semibold text-muted">—</span>}
          {v.vs && <span>{v.vs}</span>}
        </div>
      ) : null}
      {v.sub && <span className="text-[13px] font-medium text-muted">{v.sub}</span>}
    </div>
  );
}
