import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, useAccount, type Deal, type Item } from '@/api';
import { Button, Card, Empty, Pill, Segmented } from '@/components/ui';
import { PageHead, SubmitSheet } from '@/components/deal';
import { daysFrom, fmtDate } from '@/lib/format';

const ORDER: Record<Item['state'], number> = { revision: 0, todo: 1, submitted: 2, approved: 3 };
const LABEL: Record<Item['state'], [string, 'warning' | 'neutral' | 'info' | 'positive']> = { revision: ['Revision requested', 'warning'], todo: ['To do', 'neutral'], submitted: ['Awaiting approval', 'info'], approved: ['Approved', 'positive'] };

export default function Deliverables() {
  const a = useAccount()!;
  const [filter, setFilter] = useState<'open' | 'all'>('open');
  const [submit, setSubmit] = useState<{ d: Deal; item: string } | null>(null);
  const rows = useMemo(() => a.deals
    .filter(d => d.items && ['wip', 'confirmed', 'submitted', 'revision', 'approved', 'due', 'paid'].includes(d.stage))
    .flatMap(d => Object.entries(d.items!).map(([name, it]) => ({ d, name, it })))
    .filter(r => filter === 'all' || r.it.state !== 'approved')
    .sort((x, y) => ORDER[x.it.state] - ORDER[y.it.state] || String(x.it.due || '9').localeCompare(String(y.it.due || '9'))), [a, filter]);
  // The most urgent row gets the one green button; every other row is secondary.
  const main = rows.find(r => r.it.state === 'revision') || rows.find(r => r.it.state === 'todo');

  return (
    <>
      <PageHead title="Deliverables" sub="Everything you owe brands, most urgent first." actions={<Segmented size="sm" label="Show" value={filter} onChange={setFilter} options={[{ value: 'open', label: 'Open' }, { value: 'all', label: 'All' }]} />} />
      <Card className="overflow-hidden">
        {rows.length === 0 ? <Empty title="Nothing to deliver" body="Confirmed deals add their deliverables here." /> : (
          <div className="divide-y divide-line">
            {rows.map(({ d, name, it }) => {
              const can = it.state === 'todo' || it.state === 'revision';
              const late = it.due && it.state === 'todo' && daysFrom(it.due) < 0;
              return (
                <div key={d.id + name} className="flex flex-wrap items-center gap-3 px-4 py-3.5 lg:px-6">
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-sm font-bold">{name} <span className="font-medium text-muted">· <Link to={`/app/deals/${d.id}`}>{d.brand}</Link></span></span>
                    <span className="text-xs font-medium text-muted">{it.format}{it.due ? ` · due ${fmtDate(it.due)}` : ''}{late ? ' · late' : ''}{it.feedback && it.state === 'revision' ? ` · “${it.feedback.note}”` : ''}</span>
                  </div>
                  <Pill tone={late ? 'critical' : LABEL[it.state][1]}>{late ? 'Late' : LABEL[it.state][0]}</Pill>
                  {can && <Button size="sm" variant={main && main.d === d && main.name === name ? 'primary' : 'secondary'} onClick={() => setSubmit({ d, item: name })}>{it.state === 'revision' ? 'Submit revision' : 'Submit'}</Button>}
                  {it.state === 'submitted' && <a className="text-xs font-semibold" href={api.deals.linkUrl(api.deals.activeLink(d.id, 'a')?.token || '')} target="_blank" rel="noopener">Brand's view</a>}
                </div>
              );
            })}
          </div>
        )}
      </Card>
      {submit && <SubmitSheet d={submit.d} item={submit.item} onClose={() => setSubmit(null)} />}
    </>
  );
}
