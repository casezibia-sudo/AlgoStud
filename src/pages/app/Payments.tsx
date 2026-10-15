import { useMemo, useState } from 'react';
import { useAccount, type Deal } from '@/api';
import { PaidSheet } from '@/components/deal';
import { Boundary, DataError } from '@/components/overview/shared';
import { History } from '@/components/payments/History';
import { MonthChart } from '@/components/payments/MonthChart';
import { PaymentsHead, Tiles } from '@/components/payments/PaymentsHead';
import { QuickReminder } from '@/components/payments/QuickReminder';
import { useAuth } from '@/lib/auth';
import { historyRows, monthlyReceived, reminderRows, tiles } from '@/lib/paymentsView';

// Payments: what is still to come in, what came in, and the history of both.
export default function Payments() {
  const a = useAccount();
  const { reload } = useAuth();
  const [paying, setPaying] = useState<Deal | null>(null);
  const rows = useMemo(() => (a ? historyRows(a) : []), [a]);

  return (
    <>
      <PaymentsHead />
      {!a ? <DataError onRetry={reload} /> : (
        <div className="flex flex-col gap-[13px] pb-4">
          <Boundary title="Totals"><Tiles t={tiles(a)} /></Boundary>
          <div className="grid items-start gap-[13px] lg:grid-cols-[281px_minmax(0,1fr)]">
            <div className="flex flex-col gap-[13px]">
              <Boundary title="Quick reminder"><QuickReminder rows={reminderRows(rows)} creator={a.creator} /></Boundary>
              <Boundary title="Received by month"><MonthChart data={monthlyReceived(a)} /></Boundary>
            </div>
            <Boundary title="History"><History rows={rows} creator={a.creator} onMarkPaid={setPaying} /></Boundary>
          </div>
        </div>
      )}
      {paying && <PaidSheet d={paying} onClose={() => setPaying(null)} />}
    </>
  );
}
