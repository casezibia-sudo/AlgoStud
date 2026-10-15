import { CARD, rupee } from '@/components/overview/shared';
import { cx } from '@/lib/format';
import type { Tiles as TileData } from '@/lib/paymentsView';

/** The page title. */
export function PaymentsHead() {
  return (
    <div className="pb-4 pt-3 lg:pt-3.5">
      <h1 className="m-0 text-[30px] font-semibold leading-10 tracking-[-0.02em]">Payments</h1>
    </div>
  );
}

const col = 'flex min-w-0 flex-col gap-1 px-0 py-0 lg:px-8 lg:first:pl-0 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-[#E6E7E7]';

/** The two tiles at the top: what is still to come in, and what came in this month. */
export function Tiles({ t }: { t: TileData }) {
  return (
    <section aria-label="Payment totals" className={cx(CARD, 'grid gap-y-5 rounded-[24px] p-6 sm:grid-cols-2 lg:px-8 lg:py-[21px]')}>
      <div className={col}>
        <span className="text-[13.5px] font-medium text-ink-2">Still to receive</span>
        <span className="text-[46px] font-semibold leading-[1.1] tracking-[-0.02em]">{rupee(t.owed.total)}</span>
        <span className={cx('text-[13.5px] font-medium', t.owed.overdueN ? 'text-danger' : 'text-muted')}>
          {t.owed.overdueN ? `${rupee(t.owed.overdue)} overdue · ${t.owed.overdueN} payment${t.owed.overdueN === 1 ? '' : 's'} late` : t.owed.n ? 'Nothing overdue' : 'Nothing to receive right now'}
        </span>
      </div>
      <div className={col}>
        <span className="text-[13.5px] font-medium text-ink-2">Received this month</span>
        <span className="text-[46px] font-semibold leading-[1.1] tracking-[-0.02em] text-brand-ink">{rupee(t.received.total)}</span>
        <span className="text-[13.5px] font-medium text-muted">From brands in {t.received.month}</span>
      </div>
    </section>
  );
}
