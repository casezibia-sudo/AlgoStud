import { useMemo } from 'react';
import { useAccount } from '@/api';
import { LATER } from '@/api/safe';
import { useDealAction } from '@/components/deal';
import { DueThisWeek } from '@/components/overview/DueThisWeek';
import { EarnedCard } from '@/components/overview/EarnedCard';
import { InsightsCard } from '@/components/overview/InsightsCard';
import { NeedsAction } from '@/components/overview/NeedsAction';
import { OnRecord } from '@/components/overview/OnRecord';
import { OwedCard } from '@/components/overview/OwedCard';
import { Boundary, DataError } from '@/components/overview/shared';
import { useToast } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { overviewStats } from '@/lib/dashboardStats';

/** The Overview. Numbers come from src/lib/dashboardStats.ts; each card has its own empty state and error boundary. */
export default function Home() {
  const account = useAccount();
  const { reload } = useAuth();
  const toast = useToast();
  const { run, sheets } = useDealAction();
  const stats = useMemo(() => (account ? overviewStats(account) : null), [account]);

  const head = (sub: string) => (
    <div className="pb-[23.5px] pt-[26px]">
      <h1 className="m-0 text-[30px] font-semibold leading-10 tracking-[-0.02em] text-ink">Overview</h1>
      <p className="m-0 mt-0.5 text-sm font-medium text-[#3A3A40]">{sub}</p>
    </div>
  );

  // A failed data request: the account never loaded. Inline message with a retry, never a redirect.
  if (!account || !stats) return <>{head('')}<DataError onRetry={reload} /></>;

  const remind = () => toast(LATER('Sending reminders'));
  const need = stats.header.needCount;
  return (
    <>
      <Boundary title="Overview">{head(`${stats.header.date} · ${need ? `${need} ${need === 1 ? 'thing needs' : 'things need'} you today` : 'Nothing needs you today'}`)}</Boundary>
      <div className="flex flex-col gap-4 pb-8">
        <Boundary title="Owed to you"><OwedCard stats={stats} onRemind={remind} /></Boundary>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.77fr)_minmax(0,1fr)]">
          <Boundary title="Needs your action">
            <NeedsAction stats={stats} onAct={r => { if (r.kind.startsWith('remind')) return remind(); const d = account.deals.find(x => x.id === r.id); if (d) run(d); }} />
          </Boundary>
          <Boundary title="Due this week"><DueThisWeek stats={stats} /></Boundary>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,.91fr)]">
          <Boundary title="Earned"><EarnedCard account={account} /></Boundary>
          <Boundary title="On record"><OnRecord stats={stats} /></Boundary>
          <Boundary title="Insights"><InsightsCard stats={stats} /></Boundary>
        </div>
      </div>
      {sheets}
    </>
  );
}
