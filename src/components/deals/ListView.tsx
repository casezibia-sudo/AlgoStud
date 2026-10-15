import { Link } from 'react-router-dom';
import { effStage, STAGE, type Deal } from '@/api';
import { rupee } from '@/lib/dealsView';
import { cx } from '@/lib/format';
import { ActionButton, Initials } from './parts';
import { StatusBlock } from './parts';

export interface Group { title: string; sub: string; rows: Deal[] }

/** The list view: "Needs you" and "Waiting on brand" (or "Done"), each row with its status and button. */
export function ListView({ groups, onRun, onLater }: { groups: Group[]; onRun: (d: Deal) => void; onLater: (w: string) => void }) {
  return (
    <div className="flex flex-col gap-5">
      {groups.map(g => (
        <section key={g.title} aria-label={g.title}>
          <div className="flex items-baseline gap-2 px-[10px] pb-[13px] pt-1">
            <h2 className="m-0 text-sm font-semibold">{g.title}</h2><span className="text-sm font-medium text-muted">{g.rows.length}</span><span className="text-xs font-medium text-muted">{g.sub}</span>
          </div>
          <div className="flex flex-col gap-1">
            {g.rows.map(d => {
              const late = effStage(d) === 'overdue', partial = d.received && d.received < d.n && STAGE[effStage(d)].turn !== 'done';
              return (
                <div key={d.id} className={cx('grid min-h-[58px] grid-cols-[36px_minmax(0,1fr)] items-center gap-x-5 gap-y-2 rounded-xl pl-[13px] pr-[15px] py-2 lg:grid-cols-[36px_minmax(0,.66fr)_104px_minmax(0,1fr)_auto]', late ? 'bg-[#FCEBE9] shadow-[0_0_0_1px_rgba(229,53,43,.18)]' : 'bg-white')}>
                  <Initials name={d.brand} />
                  <Link to={`/app/deals/${d.id}`} className="flex min-w-0 flex-col gap-0.5 text-ink hover:text-ink">
                    <span className="truncate text-sm font-semibold">{d.del || 'Untitled deal'}</span>
                    <span className="truncate text-[13px] font-medium text-muted">{d.brand}{d.contact ? ` · ${d.contact}` : ''}</span>
                  </Link>
                  <span className="col-start-2 flex flex-col items-start lg:col-start-auto lg:items-end">
                    <span className="text-base font-semibold tabular-nums">{rupee(d.n)}</span>
                    {partial ? <span className="text-[13px] font-medium text-brand-ink tabular-nums">{rupee(d.received!)} paid</span> : null}
                  </span>
                  <span className="col-start-2 min-w-0 lg:col-start-auto"><StatusBlock d={d} /></span>
                  <span className="col-start-2 justify-self-start lg:col-start-auto lg:justify-self-end"><ActionButton d={d} onRun={onRun} onLater={onLater} /></span>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
