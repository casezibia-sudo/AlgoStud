import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { api, type CreatorSettings, type Profile } from '@/api';
import { settingsApi } from '@/api/settings';
import { supabase } from '@/lib/supabase';

type Status = 'loading' | 'ready' | 'error';

interface AuthState {
  /** loading: still checking. ready: session and profile are known (session may be null). error: profile could not be loaded. */
  status: Status;
  session: Session | null;
  profile: Profile | null;
  settings: CreatorSettings | null;
  reload: () => void;
  setProfile: (p: Profile) => void;
  setSettings: (s: CreatorSettings) => void;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

/**
 * Deals still live in the localStorage API (src/api/local.ts) until slice 2. The pages read the creator
 * from there, so every time the Supabase profile changes we copy it over. Supabase is the source of truth.
 */
const mirror = (email: string, p: Profile, s: CreatorSettings) =>
  api.auth.signIn(email, {
    name: p.name,
    handle: p.handle,
    paymentLink: p.payment_link ?? undefined,
    defaultTrigger: s.default_trigger,
    deletion: p.deletion_scheduled_for && p.deletion_requested_at
      ? { requestedAt: p.deletion_requested_at, scheduledFor: p.deletion_scheduled_for }
      : null,
  });

export function AuthProvider({ children }: { children: ReactNode }) {
  // undefined = not checked yet, null = signed out
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [data, setData] = useState<{ profile: Profile; settings: CreatorSettings } | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: d }) => setSession(d.session));
    // Only set state in here: calling Supabase from inside this callback can deadlock.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const uid = session === undefined ? undefined : session?.user.id ?? null;
  const email = session?.user.email ?? '';

  useEffect(() => {
    if (uid === undefined) return;
    setData(null);
    setFailed(false);
    if (uid === null) { api.auth.signOut(); return; }
    let live = true;
    settingsApi.load(uid)
      .then(async d => { await mirror(email, d.profile, d.settings); if (live) setData(d); })
      .catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
    // Reload only when the person changes (token refreshes keep the same uid).
  }, [uid, attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  const setProfile = useCallback((profile: Profile) => {
    setData(d => { if (d) { mirror(email, profile, d.settings); return { ...d, profile }; } return d; });
  }, [email]);
  const setSettings = useCallback((settings: CreatorSettings) => {
    setData(d => { if (d) { mirror(email, d.profile, settings); return { ...d, settings }; } return d; });
  }, [email]);

  const value = useMemo<AuthState>(() => {
    const status: Status = uid === undefined ? 'loading' : uid === null ? 'ready' : failed ? 'error' : data ? 'ready' : 'loading';
    return {
      status,
      session: session ?? null,
      profile: uid ? data?.profile ?? null : null,
      settings: uid ? data?.settings ?? null : null,
      reload: () => setAttempt(n => n + 1),
      setProfile,
      setSettings,
      signOut: async () => { await supabase.auth.signOut(); },
    };
  }, [uid, session, data, failed, setProfile, setSettings]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside AuthProvider');
  return v;
}

/** Only allow same-site paths as a post-login destination. */
export const safeNext = (next: string | null, fallback = '/app') =>
  next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : fallback;
