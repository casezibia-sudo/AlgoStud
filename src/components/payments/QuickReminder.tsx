import { useState } from 'react';
import { Copy, MessageCircle } from 'lucide-react';
import { CARD, rupee } from '@/components/overview/shared';
import { useToast } from '@/components/ui';
import { copy, waHref } from '@/components/share';
import { cx, initials } from '@/lib/format';
import { tint } from '@/lib/dashboardStats';
import { daysLate, reminderMessage, termsQuote, type HRow } from '@/lib/paymentsView';

const firstWord = (s: string) => s.trim().split(/\s+/)[0] || s;

/** Brands with a payment due, a reminder built from the agreed terms, and two ways to send it. Nothing is saved here:
 *  logging reminders is slice 6, so the page never calls the reminder log. */
export function QuickReminder({ rows, creator, onPick }: { rows: HRow[]; creator: { paymentLink?: string }; onPick?: (id: string) => void }) {
  const toast = useToast();
  const [sel, setSel] = useState<string>();
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [all, setAll] = useState(false);
  const r = rows.find(x => x.id === sel) || rows[0];
  const shown = all ? rows : rows.slice(0, 4);

  return (
    <section aria-label="Quick reminder" className={cx(CARD, 'flex flex-col gap-5 rounded-[24px] p-[18px]')}>
      <div className="flex items-baseline justify-between">
        <h2 className="m-0 text-[16.5px] font-medium">Quick reminder</h2>
        {rows.length > 4 && <button type="button" aria-expanded={all} onClick={() => setAll(v => !v)} className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-semibold text-brand-ink hover:underline">{all ? 'Show less' : 'See all'}</button>}
      </div>

      {!r ? (
        <div className="rounded-2xl bg-white px-5 py-8 text-center shadow-[inset_0_0_0_1px_#E8E9EB]">
          <p className="m-0 text-[15px] font-semibold">No payments to chase</p>
          <p className="m-0 mt-1 text-[13px] font-medium text-muted">When a deal is invoiced, its brand appears here with a reminder ready to send.</p>
        </div>
      ) : (
        <>
          <div role="listbox" aria-label="Brands with a payment due" className="grid grid-cols-4 gap-x-0 gap-y-3">
            {shown.map(x => {
              const on = x.id === r.id, [bg, fg] = tint(x.brand);
              return (
                <button key={x.id} type="button" role="option" aria-selected={on} aria-label={`${x.brand}, ${rupee(x.amount)}${x.status === 'overdue' ? ', overdue' : ''}`} onClick={() => { setSel(x.id); onPick?.(x.id); }}
                  className="flex w-full cursor-pointer flex-col items-center gap-1.5 border-0 bg-transparent p-0">
                  <span className={cx('relative grid size-[56px] place-items-center rounded-full text-[15px] font-bold transition-shadow', on ? 'shadow-[0_0_0_2px_#0A7F55,0_0_0_5px_#fff]' : 'shadow-[0_0_0_3px_#fff]')} style={{ background: bg, color: fg }}>
                    {initials(x.brand)}
                    {x.status === 'overdue' && <span aria-hidden="true" className="absolute -right-0.5 top-0 size-3 rounded-full bg-[#E5533D] shadow-[0_0_0_2px_#fff]" />}
                  </span>
                  <span className={cx('max-w-full truncate text-[11px]', on ? 'font-semibold text-ink' : 'font-medium text-muted')}>{firstWord(x.brand)}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[inset_0_0_0_1px_#E8E9EB]">
            <div className="flex items-center gap-2 text-[13px] font-medium text-muted">
              <span aria-hidden="true" className="grid size-5 place-items-center rounded-full text-[8px] font-bold" style={{ background: tint(r.brand)[0], color: tint(r.brand)[1] }}>{initials(r.brand)}</span>
              {r.brand} owes
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[30px] font-semibold leading-none tracking-[-0.02em] tabular-nums">{rupee(r.amount)}</span>
              {r.status === 'overdue' && r.date && <span className="text-[13px] font-semibold text-danger">{daysLate(r.date)} day{daysLate(r.date) === 1 ? '' : 's'} late</span>}
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-muted"><span className="h-px flex-1 bg-[#E8E9EB]" />Reminder quotes your terms<span className="h-px flex-1 bg-[#E8E9EB]" /></div>
            <p className="m-0 text-[13px] font-medium leading-snug text-ink-2">“{termsQuote(r.deal)}”</p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="remind-msg" className="text-[12px] font-medium text-ink-2">Reminder message</label>
            <textarea id="remind-msg" rows={5} value={edits[r.id] ?? reminderMessage(r, creator)} onChange={e => setEdits(s => ({ ...s, [r.id]: e.target.value }))}
              className="w-full resize-y rounded-2xl border-0 bg-white p-3.5 text-[12.5px] font-medium leading-[1.6] text-ink shadow-[inset_0_0_0_1px_#E1E2E5] outline-none focus-visible:shadow-[inset_0_0_0_1.5px_#0A7F55]" />
          </div>
          <MessageActions message={edits[r.id] ?? reminderMessage(r, creator)} brand={r.brand} onCopied={() => toast(`Reminder copied. Paste it to ${r.brand}.`)} onCopyFail={() => toast('Could not copy. Select the message and copy it yourself.')} onOpened={() => toast('WhatsApp opened. Pick the contact to send it to.')} />
        </>
      )}
    </section>
  );
}

function MessageActions({ message, brand, onCopied, onCopyFail, onOpened }: { message: string; brand: string; onCopied: () => void; onCopyFail: () => void; onOpened: () => void }) {
  return (
    <div className="flex gap-2">
      <a href={waHref(message)} target="_blank" rel="noopener noreferrer" aria-label={`Send reminder to ${brand} on WhatsApp`} onClick={onOpened}
        className="inline-flex h-[42px] min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand px-3 text-[13px] font-semibold text-white shadow-[0_8px_18px_-8px_rgba(10,127,85,.6)] hover:bg-brand-hover hover:text-white"><MessageCircle size={17} className="flex-none" aria-hidden="true" />Send on WhatsApp</a>
      <button type="button" onClick={async () => ((await copy(message)) ? onCopied() : onCopyFail())}
        className="inline-flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-white px-4 text-[13px] font-semibold text-ink shadow-[inset_0_0_0_1px_#E1E2E5] hover:bg-subtle"><Copy size={16} className="flex-none" aria-hidden="true" />Copy</button>
    </div>
  );
}
