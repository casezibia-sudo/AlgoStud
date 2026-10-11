import '@/index.css';
import { useState } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { api } from '@/api';
import { settingsApi } from '@/api/settings';
import { Button, Logo, useToast } from '@/components/ui';
import { fmtDate } from '@/lib/format';
import NotFound from '@/pages/NotFound';
import { useAuth } from './auth';

const Centered = ({ children }: { children: React.ReactNode }) => (
  <div className="grid min-h-dvh place-items-center bg-canvas px-4">
    <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">{children}</div>
  </div>
);

function DeletionNotice() {
  const { profile, setProfile, signOut } = useAuth();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  return (
    <Centered>
      <Logo size={28} />
      <h1 className="m-0 text-[28px] font-semibold">Your account will be deleted on {fmtDate(profile!.deletion_scheduled_for!)}</h1>
      <p className="m-0 text-sm font-medium text-muted">Brand links show "This account is closing" until then. You can cancel any time before that date.</p>
      <div className="flex gap-2">
        <Button variant="primary" disabled={busy} onClick={async () => {
          setBusy(true);
          try {
            await settingsApi.cancelDeletion();
            setProfile({ ...profile!, deletion_requested_at: null, deletion_scheduled_for: null });
            toast('Deletion cancelled. Your account is active again.');
          } catch { toast('Could not cancel. Try again.'); setBusy(false); }
        }}>Cancel deletion</Button>
        <Button disabled={busy} onClick={signOut}>Log out</Button>
      </div>
    </Centered>
  );
}

/**
 * Wraps every creator page. Checks run in this order:
 *  1. account being deleted (needs a signed-in profile, so it is read first once the session is known)
 *  2. signed out -> /login, remembering where the person was going
 *  3. deal not found or not theirs -> see RequireDeal
 */
export function RequireCreator() {
  const { status, session, profile, reload } = useAuth();
  const loc = useLocation();

  if (status === 'loading') return <Centered><span className="text-sm font-medium text-muted">Loading…</span></Centered>;
  if (status === 'error') return (
    <Centered>
      <h1 className="m-0 text-xl font-bold">Couldn't load your account</h1>
      <p className="m-0 text-sm font-medium text-muted">Check your connection and try again.</p>
      <Button variant="primary" onClick={reload}>Try again</Button>
    </Centered>
  );
  if (profile?.deletion_scheduled_for) return <DeletionNotice />;
  if (!session) return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />;
  return <Outlet />;
}

/**
 * Check 3. STUB until slice 2: deals still live in the localStorage API, so "not found or not theirs"
 * is a lookup in the signed-in creator's own account. Slice 2 replaces `canOpenDeal` with a Supabase
 * query on `deals` (RLS makes a deal that is not theirs look the same as one that does not exist).
 */
const canOpenDeal = (id: string) => !!api.snapshot().account?.deals.some(d => d.id === id);

export function RequireDeal() {
  const { id = '' } = useParams();
  return canOpenDeal(id) ? <Outlet /> : <NotFound inApp />;
}
