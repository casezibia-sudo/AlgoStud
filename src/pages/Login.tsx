import '@/index.css';
import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { settingsApi } from '@/api/settings';
import { Button, Field, Input, Logo } from '@/components/ui';
import { safeNext, useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

type AuthError = { status?: number; code?: string; message: string };

/** Turn a Supabase auth error into the copy the design uses. */
function codeError(e: AuthError) {
  if (e.status === 429 || /rate limit|too many/i.test(e.message)) return 'Too many tries. To keep your account safe, new codes are paused for a few minutes.';
  if (/expired/i.test(e.message)) return 'That code has expired. Ask for a new one.';
  return "That code doesn't match. Check it and try again.";
}

export default function Login() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));
  const { status, session, setProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'code' | 'profile'>('email');
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');

  const oauth = params.get('oauth') === '1';

  // Back from Google: send brand-new accounts to profile setup, everyone else to where they were headed.
  useEffect(() => {
    if (!oauth || !session) return;
    settingsApi.load(session.user.id)
      .then(({ profile }) => { if (profile.name) nav(next, { replace: true }); else setStep('profile'); })
      .catch(() => setErr('Signed in, but your profile did not load. Refresh the page.'));
  }, [oauth, session?.user.id]);

  // Already signed in: skip the form. (Not during the code, profile or Google-return steps, which finish the sign-in themselves.)
  if (step === 'email' && !oauth && status !== 'loading' && session) return <Navigate to={next} replace />;

  const send = async () => {
    const addr = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(addr)) return setErr('Enter a valid email.');
    setBusy(true); setErr('');
    const { error } = await supabase.auth.signInWithOtp({ email: addr, options: { shouldCreateUser: true } });
    setBusy(false);
    if (error) return setErr(error.status === 429 ? 'Too many tries. Wait a minute, then ask for a new code.' : 'Could not send the code. Try again.');
    setEmail(addr); setStep('code');
  };

  const google = async () => {
    setBusy(true); setErr('');
    const redirectTo = `${location.origin}/login?oauth=1&next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
    if (error) { setBusy(false); setErr('Could not start Google sign-in. Try again.'); }
  };

  const verify = async () => {
    setBusy(true); setErr('');
    const { data, error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
    if (error || !data.user) { setBusy(false); return setErr(error ? codeError(error) : 'Could not sign you in. Try again.'); }
    try {
      const { profile } = await settingsApi.load(data.user.id);
      setBusy(false);
      if (profile.name) nav(next, { replace: true });
      else setStep('profile');
    } catch {
      setBusy(false); setErr('Signed in, but your profile did not load. Refresh the page.');
    }
  };

  const createProfile = async () => {
    setBusy(true); setErr('');
    try {
      const uid = (await supabase.auth.getUser()).data.user!.id;
      setProfile(await settingsApi.updateProfile(uid, { name: name.trim(), handle }));
      nav(next, { replace: true });
    } catch {
      setBusy(false); setErr('Could not save your profile. Try again.');
    }
  };

  return (
    <div className="grid min-h-dvh place-items-center bg-canvas px-4">
      <div className="flex w-full max-w-[400px] flex-col gap-6">
        <Link to="/" className="self-center"><Logo size={28} /></Link>
        <section className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-[var(--shadow-card)]">
          {step === 'email' && <>
            <div><h1 className="m-0 text-xl font-bold">Log in or sign up</h1><p className="m-0 mt-1 text-sm font-medium text-muted">We'll email you a 6-digit code. No password.</p></div>
            <Field label="Email" error={err}>{id => <Input id={id} type="email" autoComplete="email" autoFocus value={email} onChange={e => { setEmail(e.target.value); setErr(''); }} onKeyDown={e => e.key === 'Enter' && !busy && send()} />}</Field>
            <Button variant="primary" size="lg" disabled={busy} onClick={send}>Send code</Button>
            <div className="flex items-center gap-3 text-xs font-semibold text-muted"><span className="h-px flex-1 bg-black/10" />or<span className="h-px flex-1 bg-black/10" /></div>
            <Button variant="secondary" size="lg" disabled={busy} onClick={google}>Continue with Google</Button>
          </>}
          {step === 'code' && <>
            <div><h1 className="m-0 text-xl font-bold">Check your email</h1><p className="m-0 mt-1 text-sm font-medium text-muted">Code sent to {email}. It works for 10 minutes.</p></div>
            <Field label="6-digit code" error={err}>{id => <Input id={id} inputMode="numeric" autoComplete="one-time-code" maxLength={6} autoFocus value={code} onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setErr(''); }} onKeyDown={e => e.key === 'Enter' && code.length === 6 && !busy && verify()} className="tracking-[.3em] text-lg" />}</Field>
            <Button variant="primary" size="lg" disabled={code.length !== 6 || busy} onClick={verify}>Continue</Button>
            <button type="button" className="text-[13px] font-semibold text-brand-ink cursor-pointer" onClick={() => { setStep('email'); setCode(''); setErr(''); }}>Use a different email</button>
          </>}
          {step === 'profile' && <>
            <div><h1 className="m-0 text-xl font-bold">Set up your profile</h1><p className="m-0 mt-1 text-sm font-medium text-muted">Brands see your name on every link.</p></div>
            <Field label="Your name" error={err}>{id => <Input id={id} autoComplete="name" autoFocus value={name} onChange={e => setName(e.target.value)} />}</Field>
            <Field label="Instagram handle (optional)">{id => <Input id={id} value={handle} onChange={e => setHandle(e.target.value.replace(/[^A-Za-z0-9._]/g, ''))} />}</Field>
            <Button variant="primary" size="lg" disabled={name.trim().length < 2 || busy} onClick={createProfile}>Create account</Button>
          </>}
        </section>
      </div>
    </div>
  );
}
