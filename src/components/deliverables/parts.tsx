import { useState } from 'react';
import { Calendar as CalIcon, List as ListIcon } from 'lucide-react';
import { api } from '@/api';
import { CARD } from '@/components/overview/shared';
import { Button, Field, Input, Sheet } from '@/components/ui';
import { cx, todayISO } from '@/lib/format';
import type { DStatus, Tile } from '@/lib/deliverablesView';

export type View = 'list' | 'calendar';

/** Per-status colours, shared by the list pills and the calendar cards. */
export const TONE: Record<DStatus, { pill: string; dot: string; card: string; label: string }> = {
  late: { pill: 'bg-[#FBD9D9] text-[#B42318]', dot: 'bg-[#D92D20]', card: 'bg-[#FBD9D9] text-[#9B1C1C]', label: 'Late' },
  revision: { pill: 'bg-[#FCE6B8] text-[#8A5A0C]', dot: 'bg-[#D97706]', card: 'bg-[#FCE6B8] text-[#7A4A08]', label: 'Revision requested' },
  brand: { pill: 'bg-[#D8E3FB] text-[#1E3A8A]', dot: 'bg-[#2F5FD0]', card: 'bg-[#D8E3FB] text-[#1E3A8A]', label: 'With brand' },
  todo: { pill: 'bg-[#E6E7E8] text-ink-2', dot: 'bg-[#8E9298]', card: 'bg-[#E4E5E7] text-ink-2', label: 'Not started' },
  approved: { pill: 'bg-[#E6E7E8] text-ink-2', dot: 'bg-[#8E9298]', card: 'bg-[#E4E5E7] text-ink-2', label: 'Approved' },
  posted: { pill: 'bg-[#DDF1EA] text-brand-ink', dot: 'bg-[#0A7F55]', card: 'bg-brand text-white', label: 'Posted' },
};

/** Title, the "N on you · N late · date" line and the List | Calendar switch. */
export function Head({ view, onView, onYou, late, date }: { view: View; onView: (v: View) => void; onYou: number; late: number; date: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 pb-4 pt-3 lg:pt-3.5">
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-[30px] font-semibold leading-10 tracking-[-0.02em]">Deliverables</h1>
        <p className="m-0 text-[15px] font-medium text-ink-2">{onYou} on you · {late} late · {date}</p>
      </div>
      <div role="tablist" aria-label="Deliverables view" className="inline-flex rounded-full bg-[#E6E7E7] p-[3px] lg:mt-1">
        {([['list', 'List', ListIcon], ['calendar', 'Calendar', CalIcon]] as const).map(([k, label, I]) => (
          <button key={k} type="button" role="tab" aria-selected={view === k} onClick={() => onView(k)}
            className={cx('inline-flex h-8 cursor-pointer items-center gap-2 rounded-full border-0 px-5 text-[14px] transition-[background,box-shadow] duration-150', view === k ? 'bg-white font-semibold shadow-[0_1px_3px_rgba(0,0,0,.1)]' : 'bg-transparent font-medium text-ink-2 hover:text-ink')}>
            <I size={16} aria-hidden="true" />{label}
          </button>
        ))}
      </div>
    </div>
  );
}

const DOTS = ['bg-ink', 'bg-[#2F5FD0]', 'bg-[#D97706]', 'bg-[#0A7F55]'];
const RIGHT = ['text-danger', 'text-[#1E3A8A]', 'text-[#8A5A0C]', 'text-brand-ink'];

export function Tiles({ tiles }: { tiles: Tile[] }) {
  return (
    <section aria-label="Deliverables summary" className="grid gap-[13px] sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((t, i) => (
        <div key={t.label} className={cx(CARD, 'flex flex-col gap-0 rounded-[24px] px-5 py-[14px]', i === 0 && 'bg-white shadow-[0_0_0_1px_rgba(0,0,0,.09),0_2px_6px_rgba(0,0,0,.06)]')}>
          <div className="flex items-center justify-between gap-2 text-[14px] font-medium">
            <span className="flex items-center gap-2"><span aria-hidden="true" className={cx('size-2 rounded-full', DOTS[i])} />{t.label}</span>
            <span className={cx('text-[13px]', i === 0 && !t.right.startsWith('0 ') ? 'text-danger' : i === 0 ? 'text-muted' : RIGHT[i])}>{t.right}</span>
          </div>
          <span className="mt-1 text-[40px] font-semibold leading-[1.15] tracking-[-0.02em]">{t.n}</span>
          <span className="mt-2.5 truncate text-[13px] font-medium text-muted">{t.next}</span>
        </div>
      ))}
    </section>
  );
}

/** Add a posting date. A failed save shows the message here and keeps the date typed. */
export function PostingSheet({ id, brand, onClose }: { id: string; brand: string; onClose: () => void }) {
  const [date, setDate] = useState(todayISO());
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true); setErr('');
    try { await api.deals.addPosting(id, date); onClose(); } catch (e) { setErr((e as Error).message || 'Could not save. Try again.'); } finally { setBusy(false); }
  };
  return (
    <Sheet open onClose={onClose} title={`Add posting date for ${brand}`} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" disabled={busy || !date} onClick={save}>{busy ? 'Saving…' : 'Save'}</Button></>}>
      <Field label="Date it went live" error={err}>{fid => <Input id={fid} type="date" max={todayISO()} value={date} onChange={e => { setDate(e.target.value); setErr(''); }} />}</Field>
    </Sheet>
  );
}
