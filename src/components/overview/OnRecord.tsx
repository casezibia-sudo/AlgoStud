import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, Pencil, Send, Wallet } from 'lucide-react';
import type { OverviewStats, RecordRow } from '@/lib/dashboardStats';
import { CARD } from './shared';

const ICON: Record<RecordRow['icon'], { Icon: typeof Clock; tile: string }> = {
  check: { Icon: CheckCircle2, tile: 'bg-[#E3F4EC] text-brand-ink' },
  pencil: { Icon: Pencil, tile: 'bg-warn-tint text-warn' },
  wallet: { Icon: Wallet, tile: 'bg-[#E3F4EC] text-brand-ink' },
  send: { Icon: Send, tile: 'bg-[#ECEDEE] text-[#3A3A40]' },
  alert: { Icon: AlertTriangle, tile: 'bg-danger-tint text-danger' },
  clock: { Icon: Clock, tile: 'bg-[#ECEDEE] text-[#3A3A40]' },
};

/** The latest deal events, newest first. Each is saved with a timestamp on its deal. */
export function OnRecord({ stats }: { stats: OverviewStats }) {
  const rows = stats.record;
  return (
    <section aria-label="On record" className={`${CARD} flex flex-col gap-4`}>
      <div className="flex flex-col gap-0.5"><h2 className="m-0 text-base font-semibold">On record</h2><span className="text-xs font-medium text-muted">Saved to each deal with a timestamp</span></div>
      {rows.length === 0 ? (
        <p className="m-0 rounded-[14px] bg-white px-4 py-8 text-center text-[13px] font-medium text-muted shadow-[0_0_0_1px_rgba(0,0,0,.04)]">Nothing recorded yet. Every step on a deal is saved here with a timestamp.</p>
      ) : (
        <ul className="m-0 flex list-none flex-col p-0">
          {rows.map(r => {
            const { Icon, tile } = ICON[r.icon];
            return (
              <li key={r.id}>
                <Link to={`/app/deals/${r.dealId}`} className="flex items-center gap-[11px] rounded-xl px-2 py-[11px] text-ink hover:text-ink">
                  <span className={`grid size-8 flex-none place-items-center rounded-[10px] ${tile}`}><Icon size={16} aria-hidden="true" /></span>
                  <span className="flex min-w-0 flex-col gap-0.5"><span className="truncate text-[13px] font-semibold">{r.title}</span><span className="truncate text-[12.5px] font-medium text-muted">{r.sub}</span></span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <Link to="/app/deals" className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] font-semibold text-brand hover:text-[#064F37]">Open deal records<ArrowRight size={14} aria-hidden="true" /></Link>
    </section>
  );
}
