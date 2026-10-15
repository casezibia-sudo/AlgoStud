import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, isRemote, type Deal } from '@/api';
import { LATER } from '@/api/safe';
import { CARD } from '@/components/overview/shared';
import { SubmitSheet } from '@/components/deal';
import { useToast } from '@/components/ui';
import { cx, initials } from '@/lib/format';
import { tint } from '@/lib/dashboardStats';
import { dueNote, grouped, short, type DRow } from '@/lib/deliverablesView';
import { PostingSheet, TONE } from './parts';

const GRID = 'lg:grid lg:grid-cols-[minmax(0,1fr)_168px_233px_122px] lg:items-center lg:gap-x-0';
const btn = 'inline-flex h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-[17px] text-[14px] font-semibold disabled:cursor-wait disabled:opacity-60';

/** What the one button on a row does, using the deal actions that already exist. Supabase mode moves the stage by hand
 *  (brands can't answer online yet, and the submit sheet needs deliverable items); the local demo keeps its submit sheet. */
function action(r: DRow): { label: string; kind: 'stage' | 'sheet' | 'posting' | 'later'; to?: 'in_progress' | 'submitted' } | null {
  const s = r.deal.stage;
  if (r.status === 'posted') return null;
  if (r.status === 'approved') return { label: 'Add posting date', kind: 'posting' };
  if (r.status === 'brand') return { label: 'Remind brand', kind: 'later' };
  if (r.status === 'revision') return isRemote ? { label: 'Submit revision', kind: 'stage', to: 'submitted' } : { label: 'Upload revision', kind: 'sheet' };
  if (!isRemote) return { label: 'Upload draft', kind: 'sheet' };
  return s === 'confirmed' ? { label: 'Start work', kind: 'stage', to: 'in_progress' } : { label: 'Mark submitted', kind: 'stage', to: 'submitted' };
}

export function List({ rows }: { rows: DRow[] }) {
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<{ brand: string; msg: string; run: () => void } | null>(null);
  const [sheet, setSheet] = useState<Deal | null>(null);
  const [posting, setPosting] = useState<Deal | null>(null);
  const groups = grouped(rows);
  const main = groups[0]?.rows.find(r => action(r)?.kind !== 'later');

  const go = (r: DRow) => {
    const a = action(r);
    if (!a) return;
    if (a.kind === 'later') return void toast(LATER('Reminding the brand'));
    if (a.kind === 'sheet') return setSheet(r.deal);
    if (a.kind === 'posting') return setPosting(r.deal);
    const run = async () => {
      setBusy(r.id); setErr(null);
      try { await api.deals.setStage(r.id, a.to!); toast('Saved.'); } catch (e) { setErr({ brand: r.brand, msg: (e as Error).message || 'Could not save.', run }); } finally { setBusy(null); }
    };
    void run();
  };

  return (
    <section aria-label="All deliverables" className={cx(CARD, 'rounded-[24px] p-[18px] lg:px-[22px] lg:pb-[22px] lg:pt-[19px]')}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-[18px]">
        <h2 className="m-0 text-[18px] font-medium">All deliverables</h2>
        <div role="group" aria-label="Filter by type" className="inline-flex rounded-full bg-[#F1F2F2] p-[3px] shadow-[inset_0_0_0_1px_#E1E2E5]">
          {['All', 'Reels', 'Stories'].map(l => (
            <button key={l} type="button" aria-pressed={l === 'All'} disabled={l !== 'All'} title={l === 'All' ? undefined : 'Arrives with deliverable items'}
              className={cx('h-[34px] rounded-full border-0 px-4 text-[13.5px] disabled:cursor-not-allowed', l === 'All' ? 'bg-white font-semibold shadow-[0_1px_3px_rgba(0,0,0,.1)]' : 'bg-transparent font-medium text-muted opacity-70')}>{l}</button>
          ))}
        </div>
      </div>

      <div role="row" className={cx('hidden h-[34px] rounded-[14px] bg-[#ECEDED] px-[17px] text-[13px] font-medium text-ink-2', GRID)}>
        <span>Deliverable</span><span>Due</span><span>Status</span><span className="text-right">Next step</span>
      </div>

      {err && (
        <div role="alert" className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#FDE8E8] px-4 py-3 text-[13px] font-medium text-danger">
          <span>Couldn't update {err.brand}: {err.msg}</span>
          <span className="flex gap-3"><button type="button" onClick={err.run} className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-danger underline">Retry</button><button type="button" onClick={() => setErr(null)} className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-danger">Dismiss</button></span>
        </div>
      )}

      {groups.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <p className="m-0 text-[15px] font-semibold">Nothing to deliver</p>
          <p className="m-0 mt-1 text-[13px] font-medium text-muted">Deals that are confirmed or in progress show up here.</p>
        </div>
      ) : groups.map(g => (
        <div key={g.key} className="mt-[18px] first:mt-3.5">
          <h3 className={cx('m-0 mb-1.5 pl-[5px] text-[14.5px] font-medium', g.key === 'needs' ? 'text-[#B42318]' : 'text-ink')}>{g.label} <span className="ml-1.5 font-normal text-ink-2">{g.rows.length}</span></h3>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {g.rows.map(r => <Row key={r.id} r={r} primary={main === r} busy={busy === r.id} onGo={() => go(r)} />)}
          </ul>
        </div>
      ))}

      {sheet && <SubmitSheet d={sheet} onClose={() => setSheet(null)} />}
      {posting && <PostingSheet id={posting.id} brand={posting.brand} onClose={() => setPosting(null)} />}
    </section>
  );
}

function Row({ r, primary, busy, onGo }: { r: DRow; primary: boolean; busy: boolean; onGo: () => void }) {
  const [bg, fg] = tint(r.brand), t = TONE[r.status], a = action(r), note = dueNote(r);
  const label = r.status === 'late' ? (r.deal.stage === 'confirmed' ? 'Late · not started' : 'Late · in progress')
    : r.status === 'brand' ? 'With brand · awaiting approval' : r.status === 'todo' ? (r.deal.stage === 'confirmed' ? 'Not started' : 'In progress') : t.label;
  return (
    <li className={cx('flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl bg-white px-[13px] py-3 shadow-[0_0_0_1px_rgba(0,0,0,.05)] lg:h-16 lg:py-0', GRID)}>
      <span className="flex min-w-0 flex-1 items-center gap-3.5 lg:flex-none">
        <span aria-hidden="true" className="grid size-9 flex-none place-items-center rounded-full text-[13px] font-bold" style={{ background: bg, color: fg }}>{initials(r.brand)}</span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <Link to={`/app/deals/${r.id}`} className="truncate text-[15px] font-medium text-ink hover:text-ink hover:underline">{r.brand}{r.del ? ` · ${r.del}` : ''}</Link>
          <span className="truncate text-[13px] font-medium text-ink-2">{r.sub}</span>
        </span>
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-[15px] font-medium">{r.due ? short(r.due) : 'No date set'}</span>
        {note && <span className={cx('text-[13px] font-medium', r.late ? 'text-danger' : 'text-ink-2')}>{note}</span>}
      </span>
      <span className={cx('inline-flex h-[30px] w-fit whitespace-nowrap items-center gap-2 rounded-full px-3 text-[13px] font-semibold', t.pill)}><span aria-hidden="true" className={cx('size-2 rounded-full', t.dot)} />{label}</span>
      <span className="justify-self-end">
        {a && <button type="button" disabled={busy} onClick={onGo} className={cx(btn, primary ? 'border-0 bg-brand text-white shadow-[0_8px_18px_-8px_rgba(10,127,85,.6)] hover:bg-brand-hover' : 'border-0 bg-white text-ink shadow-[inset_0_0_0_1px_#C9CCD0] hover:bg-subtle')}>{busy ? 'Saving…' : a.label}</button>}
      </span>
    </li>
  );
}
