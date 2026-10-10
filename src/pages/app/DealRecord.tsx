import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { api, useAccount } from '@/api';
import { Button, Card, Empty } from '@/components/ui';
import { cx, fmtTime, inr } from '@/lib/format';
import NotFound from '../NotFound';

export default function DealRecord() {
  const { id = '' } = useParams();
  const a = useAccount()!;
  const d = a.deals.find(x => x.id === id);
  if (!d) return <NotFound inApp />;
  const events = [...api.deals.eventsFor(d.id)].reverse();
  const versions = api.deals.versionsFor(d.id);
  return (
    <div className="pt-4 lg:pt-6 flex flex-col gap-4 max-w-[860px]">
      <Link to={`/app/deals/${d.id}`} className="no-print inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-ink"><ArrowLeft size={16} />{d.brand}</Link>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="m-0 text-[28px] font-semibold tracking-[-0.02em]">Deal record</h1><p className="m-0 text-sm font-medium text-muted">{d.brand} · {d.del} · {inr(d.n)} · {events.length} entries</p></div>
        {/* PDF: uses print for now. The backend should render a signed PDF (record "PDF generating" state). */}
        <Button variant="primary" className="no-print" onClick={() => print()} disabled={!events.length}><Download size={16} />Download PDF</Button>
      </div>
      <Card className="p-5 lg:p-6">
        {events.length === 0 ? <Empty title="Nothing recorded yet" body="Entries appear once the terms are sent." /> : (
          <ol className="m-0 list-none p-0 flex flex-col">
            {events.map((e, i) => (
              <li key={e.id} className="grid grid-cols-[16px_minmax(0,1fr)] gap-3">
                <div className="flex flex-col items-center"><span className={cx('mt-1.5 size-2.5 rounded-full', { positive: 'bg-brand', warning: 'bg-[#E08A3C]', critical: 'bg-danger', info: 'bg-info', neutral: 'bg-[#A0A0A8]' }[e.tone])} />{i < events.length - 1 && <span className="w-px flex-1 bg-line" />}</div>
                <div className="flex flex-col gap-0.5 pb-5"><span className="text-sm font-semibold">{e.title}</span>{e.detail && <span className="break-words text-[13px] font-medium text-muted">{e.detail}</span>}<span className="text-xs font-medium text-muted">{fmtTime(e.at)} · {e.actor === 'brand' ? d.brand : e.actor === 'system' ? 'AlgoStudio' : 'You'}</span></div>
              </li>
            ))}
          </ol>
        )}
      </Card>
      {versions.length > 0 && (
        <Card className="p-5 lg:p-6 flex flex-col gap-3">
          <h2 className="m-0 text-base font-semibold">Earlier versions</h2>
          {versions.map(v => <div key={v.n} className="flex flex-wrap justify-between gap-2 rounded-xl bg-subtle px-4 py-3 text-[13px] font-medium"><span className="font-semibold">Version {v.n} · {v.status}</span><span className="text-muted">{v.terms.del} · {inr(v.terms.n)} · {v.terms.usage || 'No usage rights'}</span></div>)}
        </Card>
      )}
    </div>
  );
}
