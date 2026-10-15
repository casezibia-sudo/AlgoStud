import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccount } from '@/api';
import { Boundary, DataError } from '@/components/overview/shared';
import { Earnings } from '@/components/reports/Earnings';
import { Head, Tiles } from '@/components/reports/Head';
import { Income } from '@/components/reports/Side';
import { Stages } from '@/components/reports/Stages';
import { TopBrands } from '@/components/reports/TopBrands';
import { useAuth } from '@/lib/auth';
import { buildReports, type Months } from '@/lib/reportsView';

// Reports: the last 3, 6 or 12 months against the same length just before. The choice lives in ?range= so a refresh keeps it.
export default function Reports() {
  const a = useAccount();
  const { reload } = useAuth();
  const [params, setParams] = useSearchParams();
  const n = ([3, 6, 12] as const).find(x => String(x) === params.get('range')) ?? 6;
  const setN = (v: Months) => { const p = new URLSearchParams(params); v === 6 ? p.delete('range') : p.set('range', String(v)); setParams(p, { replace: true }); };
  const r = useMemo(() => (a ? buildReports(a, n) : null), [a, n]);

  return (
    <>
      <Head n={n} onN={setN} r={r} />
      {!a || !r ? <DataError onRetry={reload} /> : (
        <div className="flex flex-col gap-[13px] pb-4">
          <Boundary title="Key numbers"><Tiles k={r.kpis} /></Boundary>
          <div className="grid items-stretch gap-[13px] lg:grid-cols-[minmax(0,1fr)_368px]">
            <Boundary title="Earnings by month"><Earnings r={r} /></Boundary>
            <Boundary title="Income by content type"><Income earned={r.kpis.earned.value} /></Boundary>
          </div>
          <div className="grid items-stretch gap-[13px] lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)]">
            <Boundary title="Deal stages"><Stages r={r} /></Boundary>
            <Boundary title="Top brands"><TopBrands rows={r.brands} /></Boundary>
          </div>
        </div>
      )}
    </>
  );
}
