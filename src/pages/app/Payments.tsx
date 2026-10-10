import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, MessageCircle } from 'lucide-react';
import { api, effStage, useAccount } from '@/api';
import { Avatar, Button, Card, Empty, Pill, Textarea, useToast, btn } from '@/components/ui';
import { PageHead, PaidSheet, paymentMessage } from '@/components/deal';
import { copy, waHref } from '@/components/share';
import { cx, daysFrom, fmtDate, inr } from '@/lib/format';

export default function Payments() {
  const a = useAccount()!;
  const toast = useToast();
  const owed = useMemo(() => a.deals.filter(d => ['approved', 'due'].includes(d.stage)).sort((x, y) => String(x.dueISO || '9').localeCompare(String(y.dueISO || '9'))), [a]);
  const [sel, setSel] = useState(owed[0]?.id);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [paying, setPaying] = useState(false);
  const d = owed.find(x => x.id === sel) || owed[0];
  const paid = a.payments.slice().sort((x, y) => y.date.localeCompare(x.date));
  const total = owed.reduce((s, x) => s + x.n - (x.received || 0), 0);
  const msg = d ? drafts[d.id] ?? paymentMessage(d, a.creator) : '';
  const when = (dd: typeof d) => !dd?.dueISO ? (dd?.stage === 'approved' ? 'Add posting date' : 'No date yet') : daysFrom(dd.dueISO) < 0 ? `Overdue ${-daysFrom(dd.dueISO)} days` : daysFrom(dd.dueISO) === 0 ? 'Due today' : `Due in ${daysFrom(dd.dueISO)} days`;

  return (
    <>
      <PageHead title="Payments" sub={`${inr(total)} still to receive from ${owed.length} brand${owed.length === 1 ? '' : 's'}`} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
        <Card className="overflow-hidden">
          <div className="px-4 pt-5 pb-2 lg:px-6"><h2 className="m-0 text-base font-semibold">Owed to you</h2></div>
          {owed.length === 0 ? <Empty title="Nothing owed right now" body="Approved deals appear here until they're paid." /> : (
            <div role="listbox" aria-label="Owed payments" className="divide-y divide-line">
              {owed.map(x => {
                const on = x.id === d?.id, late = effStage(x) === 'overdue';
                return (
                  <button key={x.id} type="button" role="option" aria-selected={on} onClick={() => setSel(x.id)} className={cx('flex w-full items-center gap-3 px-4 py-3.5 text-left lg:px-6 cursor-pointer transition-colors', on ? 'bg-brand-tint' : 'hover:bg-subtle')}>
                    <Avatar name={x.brand} />
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5"><span className="text-sm font-bold">{x.brand}</span><span className="truncate text-[13px] font-medium text-muted">{x.del}{x.dueISO ? ' · ' + fmtDate(x.dueISO) : ''}</span></span>
                    <span className="flex flex-col items-end gap-1"><span className="text-sm font-semibold tabular-nums">{inr(x.n - (x.received || 0))}</span><Pill tone={late ? 'critical' : x.stage === 'approved' ? 'neutral' : 'warning'}>{when(x)}</Pill></span>
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        {d && (
          <Card label="Quick reminder" className="p-5 lg:p-6 flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-0.5"><span className="text-base font-bold">{d.brand}</span><span className="text-[13px] font-medium text-muted">{inr(d.n)} · {d.trigger}{d.lastReminderAt ? ` · last reminded ${fmtDate(d.lastReminderAt)} on ${d.lastReminderChannel}` : ''}</span></div>
              <Link to={`/app/deals/${d.id}`} className="text-[13px] font-semibold whitespace-nowrap">Open deal</Link>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="remind-msg" className="text-xs font-semibold text-[#3A3A40]">Reminder message</label>
              <Textarea id="remind-msg" rows={5} value={msg} onChange={e => setDrafts(s => ({ ...s, [d.id]: e.target.value }))} />
              <span className="text-xs font-medium text-muted">The message quotes your agreed terms. Edit it before sending.</span>
            </div>
            <div className="flex gap-2">
              <a href={waHref(msg)} target="_blank" rel="noopener" onClick={() => { api.payments.logReminder(d.id, 'WhatsApp', 'payment', msg); toast(`Reminder opened in WhatsApp for ${d.brand}.`); }} className={btn('primary', 'md', 'flex-1')}><MessageCircle size={16} />Send on WhatsApp</a>
              <Button onClick={async () => { await copy(msg); api.payments.logReminder(d.id, 'Copy link', 'payment', msg); toast(`Reminder copied. Paste it to ${d.brand}.`); }}><Copy size={15} />Copy</Button>
            </div>
            <div className="h-px bg-line" />
            <Button onClick={() => setPaying(true)}>Mark as paid</Button>
          </Card>
        )}
      </div>

      <Card className="mt-4 overflow-hidden">
        <div className="px-4 pt-5 pb-2 lg:px-6"><h2 className="m-0 text-base font-semibold">Received</h2></div>
        {paid.length === 0 ? <Empty title="No payments yet" /> : (
          <div className="divide-y divide-line">
            {paid.map(p => { const pd = a.deals.find(x => x.id === p.dealId); return (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3 lg:px-6">
                <span className="flex min-w-0 flex-1 flex-col"><span className="text-sm font-semibold">{pd?.brand}</span><span className="text-xs font-medium text-muted">{fmtDate(p.date)}{p.ref ? ' · ref ' + p.ref : ''}</span></span>
                <span className="text-sm font-semibold tabular-nums text-brand-ink">{inr(p.amount)}</span>
              </div>
            ); })}
          </div>
        )}
      </Card>
      {paying && d && <PaidSheet d={d} onClose={() => setPaying(false)} />}
    </>
  );
}
