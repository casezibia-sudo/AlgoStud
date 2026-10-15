import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccount } from '@/api';
import { Boundary, DataError } from '@/components/overview/shared';
import { Calendar } from '@/components/deliverables/Calendar';
import { List } from '@/components/deliverables/List';
import { Head, Tiles, type View } from '@/components/deliverables/parts';
import { useAuth } from '@/lib/auth';
import { deliverableRows, header, tiles } from '@/lib/deliverablesView';

// Deliverables: one row per deal for now (items arrive in slice 4). The view lives in ?view= so a refresh keeps it.
export default function Deliverables() {
  const a = useAccount();
  const { reload } = useAuth();
  const [params, setParams] = useSearchParams();
  const view: View = params.get('view') === 'calendar' ? 'calendar' : 'list';
  const setView = (v: View) => { const p = new URLSearchParams(params); v === 'calendar' ? p.set('view', 'calendar') : p.delete('view'); setParams(p, { replace: true }); };
  const rows = useMemo(() => (a ? deliverableRows(a) : []), [a]);
  const h = header(rows);

  if (!a) return <><Head view={view} onView={setView} onYou={0} late={0} date={header([]).date} /><DataError onRetry={reload} /></>;
  return (
    <>
      <Head view={view} onView={setView} {...h} />
      <div className="flex flex-col gap-[13px] pb-4">
        <Boundary title="Summary"><Tiles tiles={tiles(rows)} /></Boundary>
        <Boundary title="Deliverables">{view === 'calendar' ? <Calendar rows={rows} /> : <List rows={rows} />}</Boundary>
      </div>
    </>
  );
}
