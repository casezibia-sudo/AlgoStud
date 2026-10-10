import { useMemo, useState } from 'react';
import { Download, FileDown } from 'lucide-react';
import { useAccount } from '@/api';
import { Button, Card, Segmented } from '@/components/ui';
import { PageHead } from '@/components/deal';
import { DAY, fmtDate, inr } from '@/lib/format';

type Period = 30 | 90 | 365;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Reports() {
  const a = useAccount()!;
  const [period, setPeriod] = useState<Period>(365);
  const r = useMemo(() => {
    const start = period === 365 ? Date.parse(new Date().getFullYear() + '-01-01') : Date.now() - period * DAY;
    const pays = a.payments.filter(p => Date.parse(p.date) >= start);
    const byBrand = new Map<string, { brand: string; earned: number; deals: number; days: number[] }>();
    pays.forEach(p => {
      const d = a.deals.find(x => x.id === p.dealId); if (!d) return;
      const b = byBrand.get(d.brand) || { brand: d.brand, earned: 0, deals: 0, days: [] };
      b.earned += p.amount; b.deals++;
      if (d.approvedAt) b.days.push(Math.max(0, Math.round((Date.parse(p.date) - Date.parse(d.approvedAt)) / DAY)));
      byBrand.set(d.brand, b);
    });
    const sent = a.deals.filter(d => d.sentAt && Date.parse(d.sentAt) >= start);
    const confirmed = sent.filter(d => d.confirmedAt);
    const approved = confirmed.filter(d => d.approvedAt);
    const paidN = approved.filter(d => d.paidAt);
    const months = Array.from({ length: 12 }, (_, m) => ({ label: MON[m], v: pays.filter(p => new Date(p.date).getMonth() === m).reduce((s, p) => s + p.amount, 0) }));
    return { total: pays.reduce((s, p) => s + p.amount, 0), pays, brands: [...byBrand.values()].sort((x, y) => y.earned - x.earned), funnel: [['Sent', sent.length], ['Confirmed', confirmed.length], ['Approved', approved.length], ['Paid', paidN.length]] as [string, number][], months };
  }, [a, period]);

  const csv = () => {
    const rows = [['Date', 'Brand', 'Deliverables', 'Amount', 'Reference'], ...r.pays.map(p => { const d = a.deals.find(x => x.id === p.dealId); return [p.date, d?.brand || '', d?.del || '', String(p.amount), p.ref]; })];
    const blob = new Blob([rows.map(x => x.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const el = document.createElement('a'); el.href = url; el.download = 'algostudio-payments.csv'; el.click(); URL.revokeObjectURL(url);
  };
  const max = Math.max(1, ...r.months.map(m => m.v));
  const top = r.funnel[0][1] || 1;

  return (
    <>
      <PageHead title="Reports" sub={`${inr(r.total)} received · ${period === 365 ? 'this year' : `last ${period} days`}`}
        actions={<><Segmented size="sm" label="Time period" value={period} onChange={setPeriod} options={[{ value: 30, label: '30 days' }, { value: 90, label: '90 days' }, { value: 365, label: 'This year' }]} /><Button className="no-print" onClick={csv}><Download size={15} />Download CSV</Button><Button className="no-print" variant="primary" onClick={() => print()}><FileDown size={15} />Export PDF</Button></>} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5 lg:p-6 flex flex-col gap-4">
          <h2 className="m-0 text-base font-semibold">Earnings by month</h2>
          <div className="grid grid-cols-12 items-end gap-1.5 h-48">
            {r.months.map(m => (
              <div key={m.label} aria-label={`${m.label}: ${inr(m.v)}`} className="flex h-full flex-col items-center justify-end gap-1">
                <span className="text-[10px] sm:text-[11px] font-semibold tabular-nums text-muted">{m.v ? Math.round(m.v / 1000) + 'k' : ''}</span>
                <div className="w-full rounded-md bg-brand" style={{ height: `${Math.max(2, (m.v / max) * 100)}%`, opacity: m.v ? 1 : 0.12 }} />
                <span className="text-[11px] font-semibold text-muted">{m.label[0]}</span>
              </div>
            ))}
          </div>
        </Card>
        {/* Conversion and drop-off are written out, so they work on touch screens. */}
        <Card className="p-5 lg:p-6 flex flex-col gap-3">
          <h2 className="m-0 text-base font-semibold">From sent to paid</h2>
          {r.funnel.map(([label, n], i) => {
            const prev = i ? r.funnel[i - 1][1] : n;
            return (
              <div key={label} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between text-[13px]"><span className="font-semibold">{label}</span><span className="font-medium text-muted tabular-nums">{n} deals{i > 0 && prev ? ` · ${Math.round((n / prev) * 100)}% of ${r.funnel[i - 1][0].toLowerCase()}` : ''}{i > 0 && prev - n > 0 ? ` · ${prev - n} dropped` : ''}</span></div>
                <div className="h-2.5 rounded-full bg-[#ECEDEE] overflow-hidden"><div className="h-full rounded-full bg-brand" style={{ width: `${(n / top) * 100}%` }} /></div>
              </div>
            );
          })}
        </Card>
      </div>

      <Card className="mt-4 overflow-hidden">
        <div className="px-4 pt-5 pb-2 lg:px-6"><h2 className="m-0 text-base font-semibold">By brand</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead><tr className="text-left text-xs font-semibold text-muted">{['Brand', 'Deals paid', 'Earned', 'Avg. days to pay'].map(h => <th key={h} className="px-4 lg:px-6 py-2 font-semibold">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-line">
              {r.brands.map(b => <tr key={b.brand}><td className="px-4 lg:px-6 py-3 font-semibold">{b.brand}</td><td className="px-4 lg:px-6 py-3 tabular-nums">{b.deals}</td><td className="px-4 lg:px-6 py-3 tabular-nums font-semibold">{inr(b.earned)}</td><td className="px-4 lg:px-6 py-3 tabular-nums">{b.days.length ? Math.round(b.days.reduce((s, x) => s + x, 0) / b.days.length) + ' days' : '—'}</td></tr>)}
              {r.brands.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center font-medium text-muted">No payments in this period.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="m-0 px-4 py-3 lg:px-6 text-xs font-medium text-muted">Generated {fmtDate(Date.now())}</p>
      </Card>
    </>
  );
}
