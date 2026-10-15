import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccount, type Deal } from '@/api';
import { expenses } from '@/api/expenses';
import { PaidSheet } from '@/components/deal';
import { Boundary, DataError } from '@/components/overview/shared';
import { ExpensesTab } from '@/components/payments/ExpensesTab';
import { History } from '@/components/payments/History';
import { MonthChart } from '@/components/payments/MonthChart';
import { PaymentsHead, Tiles, type PayTab } from '@/components/payments/PaymentsHead';
import { QuickReminder } from '@/components/payments/QuickReminder';
import { useAuth } from '@/lib/auth';
import { historyRows, monthlyReceived, reminderRows, tiles } from '@/lib/paymentsView';

// Payments: Received and Expenses tabs. The tab lives in ?tab= so a refresh keeps it and the router stays as it is.
export default function Payments() {
  const a = useAccount();
  const { reload } = useAuth();
  const [params, setParams] = useSearchParams();
  const tab: PayTab = params.get('tab') === 'expenses' ? 'expenses' : 'received';
  const [paying, setPaying] = useState<Deal | null>(null);
  const setTab = (t: PayTab) => { const p = new URLSearchParams(params); t === 'expenses' ? p.set('tab', 'expenses') : p.delete('tab'); setParams(p, { replace: true }); };

  const rows = useMemo(() => (a ? historyRows(a) : []), [a]);
  const exp = expenses.list();

  return (
    <>
      <PaymentsHead tab={tab} onTab={setTab} />
      {!a ? <DataError onRetry={reload} /> : (
        <div className="flex flex-col gap-[13px] pb-4">
          <Boundary title="Totals"><Tiles t={tiles(a, exp)} /></Boundary>
          {tab === 'expenses' ? (
            <Boundary title="Expenses"><ExpensesTab rows={exp} /></Boundary>
          ) : (
            <div className="grid items-start gap-[13px] lg:grid-cols-[281px_minmax(0,1fr)]">
              <div className="flex flex-col gap-[13px]">
                <Boundary title="Quick reminder"><QuickReminder rows={reminderRows(rows)} creator={a.creator} /></Boundary>
                <Boundary title="Received by month"><MonthChart data={monthlyReceived(a)} /></Boundary>
              </div>
              <Boundary title="History"><History rows={rows} creator={a.creator} onMarkPaid={setPaying} /></Boundary>
            </div>
          )}
        </div>
      )}
      {paying && <PaidSheet d={paying} onClose={() => setPaying(null)} />}
    </>
  );
}
