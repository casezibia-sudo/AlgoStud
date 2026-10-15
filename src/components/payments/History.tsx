import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, CircleAlert, Clock, EllipsisVertical, Search } from 'lucide-react';
import { LATER } from '@/api/safe';
import type { Deal } from '@/api';
import { CARD, rupee } from '@/components/overview/shared';
import { copy } from '@/components/share';
import { useToast } from '@/components/ui';
import { cx, fmtDate, initials } from '@/lib/format';
import { tint } from '@/lib/dashboardStats';
import { reminderMessage, type HRow, type HStatus } from '@/lib/paymentsView';

const STATUS: Record<HStatus, { label: string; cls: string; icon: typeof Check }> = {
  overdue: { label: 'Overdue', cls: 'bg-[#FDE8E8] text-danger', icon: CircleAlert },
  due: { label: 'Due', cls: 'bg-[#FBF0D6] text-[#8A5A0C]', icon: Clock },
  received: { label: 'Received', cls: 'bg-[#DDF1EA] text-brand-ink', icon: Check },
};
const FILTERS = [['all', 'All'], ['received', 'Received'], ['due', 'Due'], ['overdue', 'Overdue']] as const;
type Filter = (typeof FILTERS)[number][0];
const PAGE = 25;
// The columns line up with the header bar: checkbox, brand, date, amount, status, menu.
const GRID = 'lg:grid lg:grid-cols-[24px_minmax(0,1fr)_285px_105px_115px_32px] lg:items-center lg:gap-x-4';

export function History({ rows, creator, onMarkPaid }: { rows: HRow[]; creator: { paymentLink?: string }; onMarkPaid: (d: Deal) => void }) {
  const toast = useToast();
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(PAGE);
  const count = (f: Filter) => rows.filter(r => f === 'all' || r.status === f).length;
  const term = q.trim().toLowerCase();
  const shown = rows.filter(r => (filter === 'all' || r.status === filter) && (!term || (r.brand + ' ' + r.del).toLowerCase().includes(term)));
  const bulk = () => toast(LATER('Bulk actions'));

  return (
    <section aria-label="History" className={cx(CARD, 'rounded-[24px] p-[18px] lg:p-[19px]')}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-[11px] pt-0">
        <h2 className="m-0 text-[16.5px] font-medium">History</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div role="group" aria-label="Filter history" className="inline-flex rounded-full bg-[#F1F2F2] p-[3px]">
            {FILTERS.map(([k, label]) => (
              <button key={k} type="button" aria-pressed={filter === k} onClick={() => { setFilter(k); setLimit(PAGE); }}
                className={cx('inline-flex h-[31px] cursor-pointer items-center gap-1.5 rounded-full border-0 px-2.5 text-[13px] transition-[background,box-shadow] duration-150', filter === k ? 'bg-white font-semibold text-ink shadow-[0_1px_3px_rgba(0,0,0,.1)]' : 'bg-transparent font-medium text-muted hover:text-ink')}>
                {label}<span className={cx('text-xs tabular-nums', filter === k ? 'text-brand-ink' : 'text-muted')}>{count(k)}</span>
              </button>
            ))}
          </div>
          <label className="relative block">
            <span className="sr-only">Search brands</span>
            <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input value={q} onChange={e => { setQ(e.target.value); setLimit(PAGE); }} placeholder="Search brands"
              className="h-[37px] w-full rounded-full border-0 bg-white pl-9 pr-4 text-[13px] font-medium shadow-[inset_0_0_0_1px_#E1E2E5] outline-none placeholder:text-muted focus-visible:shadow-[inset_0_0_0_1.5px_#0A7F55] sm:w-[166px]" />
          </label>
        </div>
      </div>

      <div role="row" className={cx('hidden h-10 rounded-[14px] bg-[#ECEDED] px-3 text-[11px] font-medium text-muted', GRID)}>
        <Check_ label="Select all" onClick={bulk} />
        <span>Brand</span><span>Due date</span><span>Amount</span><span>Status</span><span />
      </div>

      {rows.length === 0 ? (
        <Blank title="No payments yet" body="Once a deal is invoiced or paid, it shows up here." />
      ) : shown.length === 0 ? (
        <Blank title="Nothing matches" body="Try another filter or search." />
      ) : (
        <ul className="m-0 list-none p-0">
          {shown.slice(0, limit).map(r => <Row key={r.id} r={r} creator={creator} onMarkPaid={onMarkPaid} onBulk={bulk} />)}
        </ul>
      )}
      {shown.length > limit && <div className="flex justify-center pt-3"><button type="button" onClick={() => setLimit(l => l + PAGE)} className="h-9 cursor-pointer rounded-full border-0 bg-white px-5 text-sm font-semibold shadow-[inset_0_0_0_1px_#E1E2E5] hover:bg-subtle">Show more ({shown.length - limit})</button></div>}
    </section>
  );
}

function Blank({ title, body }: { title: string; body: string }) {
  return <div className="px-4 py-14 text-center"><p className="m-0 text-[15px] font-semibold">{title}</p><p className="m-0 mt-1 text-[13px] font-medium text-muted">{body}</p></div>;
}

/** A checkbox that is shown but does not tick: bulk actions arrive later, so ticking would promise something. */
function Check_({ label, onClick }: { label: string; onClick: () => void }) {
  return <button type="button" role="checkbox" aria-checked="false" aria-label={label} onClick={onClick} className="size-[17px] cursor-pointer rounded-[5px] border-0 bg-white p-0 shadow-[inset_0_0_0_1.5px_#C9CCD0] hover:shadow-[inset_0_0_0_1.5px_#8E9298]" />;
}

function Row({ r, creator, onMarkPaid, onBulk }: { r: HRow; creator: { paymentLink?: string }; onMarkPaid: (d: Deal) => void; onBulk: () => void }) {
  const s = STATUS[r.status], [bg, fg] = tint(r.brand), I = s.icon, paid = r.status === 'received';
  return (
    <li className={cx('group flex items-center gap-3 rounded-[14px] border-b border-[#EEEFEF] px-3 py-3 transition-colors last:border-b-transparent hover:bg-white lg:h-16 lg:py-0', GRID)}>
      <span className="hidden lg:block"><Check_ label={`Select ${r.brand}`} onClick={onBulk} /></span>
      <span className="flex min-w-0 flex-1 items-center gap-3.5 lg:flex-none">
        <span aria-hidden="true" className="grid size-9 flex-none place-items-center rounded-full text-xs font-bold" style={{ background: bg, color: fg }}>{initials(r.brand)}</span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <Link to={`/app/deals/${r.id}`} className="truncate text-[13.5px] font-medium text-ink hover:text-ink hover:underline">{r.brand}</Link>
          <span className="truncate text-[11px] font-medium text-muted">{r.del}<span className="lg:hidden">{r.date ? ' · ' + fmtDate(r.date) : ''}</span></span>
        </span>
      </span>
      <span className="hidden text-[12.5px] font-medium text-ink-2 lg:block">{r.date ? fmtDate(r.date) : '—'}</span>
      <span className={cx('text-[13.5px] font-medium tabular-nums', r.status === 'overdue' ? 'text-danger' : paid ? 'font-semibold text-brand-ink' : 'text-ink')}>{paid ? '+' : ''}{rupee(r.amount)}</span>
      <span className={cx('inline-flex h-6 w-fit items-center gap-1.5 rounded-full px-2 text-[11px] font-semibold', s.cls)}><I size={12} aria-hidden="true" />{s.label}</span>
      <RowMenu r={r} creator={creator} onMarkPaid={onMarkPaid} />
    </li>
  );
}

function RowMenu({ r, creator, onMarkPaid }: { r: HRow; creator: { paymentLink?: string }; onMarkPaid: (d: Deal) => void }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); ref.current?.querySelector('button')?.focus(); } };
    addEventListener('mousedown', h); addEventListener('keydown', k);
    return () => { removeEventListener('mousedown', h); removeEventListener('keydown', k); };
  }, [open]);
  const unpaid = r.status !== 'received', item = 'flex w-full cursor-pointer items-center rounded-xl border-0 bg-transparent px-3 py-2.5 text-left text-[13px] font-medium text-ink hover:bg-subtle hover:text-ink';
  return (
    <div ref={ref} className="relative justify-self-end">
      <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label={`Actions for ${r.brand}`} onClick={() => setOpen(o => !o)} className="grid size-8 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-ink-2 hover:bg-black/5"><EllipsisVertical size={17} aria-hidden="true" /></button>
      {open && (
        <div role="menu" className="absolute right-0 top-9 z-40 w-[170px] rounded-2xl bg-white p-1.5 shadow-[var(--shadow-pop)]">
          <Link role="menuitem" to={`/app/deals/${r.id}`} className={item}>View deal</Link>
          {unpaid && <button role="menuitem" type="button" className={item} onClick={() => { setOpen(false); onMarkPaid(r.deal); }}>Mark paid</button>}
          {unpaid && <button role="menuitem" type="button" className={item} onClick={async () => { setOpen(false); toast((await copy(reminderMessage(r, creator))) ? `Reminder copied. Paste it to ${r.brand}.` : 'Could not copy the reminder.'); }}>Copy reminder</button>}
        </div>
      )}
    </div>
  );
}
