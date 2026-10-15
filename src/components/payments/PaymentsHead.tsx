import { ChartColumn, CircleHelp, FileText, Send, Settings, TriangleAlert } from 'lucide-react';
import { LATER } from '@/api/safe';
import { useToast } from '@/components/ui';
import { CARD, rupee } from '@/components/overview/shared';
import { cx } from '@/lib/format';
import type { Tiles as TileData } from '@/lib/paymentsView';

export type PayTab = 'received' | 'expenses';

/** Received | Expenses switch, the page title and the six shortcut icons. */
export function PaymentsHead({ tab, onTab }: { tab: PayTab; onTab: (t: PayTab) => void }) {
  const toast = useToast();
  // None of these exist yet: each one says so instead of doing nothing.
  const icons = [
    { label: 'Payment alerts', icon: TriangleAlert },
    { label: 'Send payment links', icon: Send },
    { label: 'Invoices', icon: FileText },
    { label: 'Payment reports', icon: ChartColumn },
    { label: 'Payment settings', icon: Settings },
    { label: 'Payment help', icon: CircleHelp },
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-[19px] gap-y-3 pb-4 pt-3 lg:pt-3.5">
      <h1 className="m-0 text-[30px] font-semibold leading-10 tracking-[-0.02em]">Payments</h1>
      <div role="tablist" aria-label="Payments sections" className="inline-flex rounded-[14px] bg-[#E6E7E7] p-[3px]">
        {(['received', 'expenses'] as const).map(t => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => onTab(t)}
            className={cx('h-[31px] cursor-pointer rounded-[11px] px-[15px] text-[13px] capitalize transition-[background,box-shadow] duration-150', tab === t ? 'bg-white font-semibold shadow-[0_1px_3px_rgba(0,0,0,.1)]' : 'font-medium text-ink-2 hover:text-ink')}>{t}</button>
        ))}
      </div>
      <div className="inline-flex items-center rounded-full bg-[#FAFAFA] px-0.5 py-1 shadow-[0_0_0_1px_rgba(0,0,0,.06),0_1px_2px_rgba(0,0,0,.04)]">
        {icons.map(({ label, icon: I }) => (
          <button key={label} type="button" aria-label={label} title={label} onClick={() => toast(LATER(label))}
            className="grid h-[34px] w-[38px] cursor-pointer place-items-center rounded-full text-ink-2 hover:bg-black/5"><I size={17} aria-hidden="true" /></button>
        ))}
      </div>
    </div>
  );
}

const col = 'flex min-w-0 flex-col gap-1 px-0 py-0 lg:px-6 lg:first:pl-0 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-[#E6E7E7]';

/** The four tiles at the top of both tabs. */
export function Tiles({ t }: { t: TileData }) {
  return (
    <section aria-label="Payment totals" className={cx(CARD, 'grid gap-y-5 rounded-[24px] p-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-7 lg:py-[21px]')}>
      <div className={col}>
        <span className="text-[13.5px] font-medium text-ink-2">Still to receive</span>
        <span className="text-[46px] font-semibold leading-[1.1] tracking-[-0.02em]">{rupee(t.owed.total)}</span>
        <span className={cx('text-[13.5px] font-medium', t.owed.overdueN ? 'text-danger' : 'text-muted')}>
          {t.owed.overdueN ? `${rupee(t.owed.overdue)} overdue · ${t.owed.overdueN} payment${t.owed.overdueN === 1 ? '' : 's'} late` : t.owed.n ? 'Nothing overdue' : 'Nothing to receive right now'}
        </span>
      </div>
      <div className={col}>
        <span className="text-[13.5px] font-medium text-ink-2">Received this month</span>
        <span className="text-[38px] font-semibold leading-[1.2] tracking-[-0.02em] text-brand-ink">{rupee(t.received.total)}</span>
        <span className="text-[13px] font-medium text-muted">From brands in {t.received.month}</span>
      </div>
      <div className={col}>
        <span className="text-[13.5px] font-medium text-ink-2">Spent this month</span>
        <span className={cx('text-[38px] font-semibold leading-[1.2] tracking-[-0.02em]', !t.spent && 'text-muted')}>{t.spent ? rupee(t.spent.total) : '—'}</span>
        <span className="text-[13px] font-medium text-muted">{t.spent ? `${t.spent.n} expense${t.spent.n === 1 ? '' : 's'} logged` : 'Not tracked yet'}</span>
      </div>
      <div className={col}>
        <span className="text-[13.5px] font-medium text-ink-2">Profit this month</span>
        <span className={cx('text-[38px] font-semibold leading-[1.2] tracking-[-0.02em]', t.profit === null ? 'text-muted' : t.profit < 0 ? 'text-danger' : 'text-brand-ink')}>{t.profit === null ? '—' : t.profit < 0 ? '-' + rupee(-t.profit) : rupee(t.profit)}</span>
        <span className="text-[13px] font-medium text-muted">{t.profit === null ? 'Not tracked yet' : 'Received minus spent'}</span>
      </div>
    </section>
  );
}
