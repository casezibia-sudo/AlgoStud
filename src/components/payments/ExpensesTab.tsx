import { Check, Pencil, Plus, Receipt, Search, Trash2 } from 'lucide-react';
import { LATER } from '@/api/safe';
import { expenses as store, type Expense } from '@/api/expenses';
import { CARD, rupee } from '@/components/overview/shared';
import { useToast } from '@/components/ui';
import { cx, todayISO } from '@/lib/format';
import { monthName } from '@/lib/paymentsView';

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// date, description, category, amount, deal, receipt, tax, actions
const GRID = 'lg:grid lg:grid-cols-[84px_minmax(0,1fr)_221px_60px_374px_75px_70px_71px] lg:items-center lg:gap-x-0';
const ctl = 'h-10 rounded-2xl border-0 bg-white px-4 text-[13.5px] font-medium shadow-[inset_0_0_0_1px_#E1E2E5] disabled:cursor-not-allowed disabled:opacity-60';
const icoBtn = 'grid size-8 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-ink-2 hover:bg-black/5';

/** The Expenses tab. The expenses table is not built yet, so the list is empty (store.list() already returns nothing and
 *  sends no request while it is unbuilt, see safe.ts) and every action says it arrives later. Nothing is saved. */
export function ExpensesTab({ rows }: { rows: Expense[] }) {
  const toast = useToast();
  const later = (what: string) => toast(LATER(what));
  const month = todayISO().slice(0, 7);
  const total = rows.reduce((s, e) => s + e.amount, 0), deductible = rows.filter(e => e.taxDeductible).reduce((s, e) => s + e.amount, 0);

  return (
    <section aria-label="Expenses" className={cx(CARD, 'rounded-[24px] p-[18px]')}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-[16.5px] font-medium">Expenses</h2>
          <p className="m-0 text-[13.5px] font-medium text-ink-2">{rows.length ? `${rows.length} expense${rows.length === 1 ? '' : 's'} · ${rupee(total)} · ${rupee(deductible)} marked tax-deductible` : 'Not tracked yet'}</p>
        </div>
        <button type="button" onClick={() => later('Adding expenses')} className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border-0 bg-brand px-5 text-[13.5px] font-semibold text-white shadow-[0_8px_18px_-8px_rgba(10,127,85,.6)] hover:bg-brand-hover"><Plus size={16} aria-hidden="true" />Add expense</button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2.5">
        <label className="relative block min-w-[220px] flex-1">
          <span className="sr-only">Search expenses</span>
          <Search size={15} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input disabled placeholder="Search expenses" className={cx(ctl, 'w-full pl-10 placeholder:text-muted')} />
        </label>
        <select disabled aria-label="Month" className={cx(ctl, 'w-[149px]')}><option>{monthName(month)} {month.slice(0, 4)}</option></select>
        <select disabled aria-label="Category" className={cx(ctl, 'w-[192px]')}><option>All categories</option></select>
      </div>

      <div className={cx('mt-3.5 hidden h-9 rounded-[14px] bg-[#ECEDED] px-3 text-[11px] font-medium text-muted', GRID)}>
        <span>Date</span><span>Description</span><span>Category</span><span className="text-right">Amount</span><span className="pl-3">Deal</span><span>Receipt</span><span>Tax</span><span />
      </div>

      {rows.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <p className="m-0 text-[15px] font-semibold">No expenses yet</p>
          <p className="m-0 mt-1 text-[13px] font-medium text-muted">Expense tracking arrives in a later update. Spent and Profit stay as “—” until then.</p>
        </div>
      ) : (
        <ul className="m-0 list-none p-0">
          {rows.map(e => {
            const d = store.deal(e.dealId), [, m, dd] = e.date.split('-'), cat = store.cat(e.category);
            return (
              <li key={e.id} className={cx('flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-[#EEEFEF] px-3 py-3 last:border-b-transparent lg:h-[58px] lg:py-0', GRID)}>
                <span className="text-[14px] font-medium">{+dd} {MON[+m - 1]}</span>
                <span className="min-w-0 truncate text-[14px] font-medium">{e.note}</span>
                <span className="flex items-center gap-2 truncate text-[13px] font-medium text-ink-2"><span aria-hidden="true" className="size-2 flex-none rounded-full" style={{ background: cat.c }} />{cat.label}</span>
                <span className="text-right text-[14px] font-semibold tabular-nums">{rupee(e.amount)}</span>
                <span className="min-w-0 truncate pl-3 text-[13px] font-medium text-muted">{d ? `${d.brand} · ${d.name}` : 'Not linked'}</span>
                <span className="text-[13px] font-medium text-muted">{e.receipt ? <span className="grid size-8 place-items-center rounded-[10px] bg-[#ECEDED] text-ink-2"><Receipt size={16} aria-label="Receipt attached" /></span> : 'None'}</span>
                <span><span role="img" aria-label={e.taxDeductible ? 'Tax-deductible' : 'Not tax-deductible'} className={cx('grid size-6 place-items-center rounded-[7px]', e.taxDeductible ? 'bg-[#111] text-white' : 'bg-white shadow-[inset_0_0_0_1.5px_#C9CCD0]')}>{e.taxDeductible && <Check size={14} aria-hidden="true" />}</span></span>
                <span className="flex justify-end gap-1">
                  <button type="button" aria-label={`Edit ${e.note}`} onClick={() => later('Editing expenses')} className={icoBtn}><Pencil size={15} aria-hidden="true" /></button>
                  <button type="button" aria-label={`Delete ${e.note}`} onClick={() => later('Deleting expenses')} className={icoBtn}><Trash2 size={15} aria-hidden="true" /></button>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
