import { useState } from 'react';
import { settingsApi } from '@/api/settings';
import { Button, Field, Input, Sheet } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

/**
 * Scheduling deletion needs a fresh email code. Verifying the code gives this session a new login
 * time, and the schedule_deletion() function in the database refuses unless that login is under 5 minutes old.
 */
export function DeleteAccountSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { session, setProfile } = useAuth();
  const email = session?.user.email ?? '';
  const [step, setStep] = useState<'intro' | 'code'>('intro');
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const close = () => { setStep('intro'); setCode(''); setErr(''); setBusy(false); onClose(); };

  const sendCode = async () => {
    setBusy(true); setErr('');
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    setBusy(false);
    if (error) return setErr(error.status === 429 ? 'Too many tries. Wait a minute, then ask for a new code.' : 'Could not send the code. Try again.');
    setStep('code');
  };

  const confirm = async () => {
    setBusy(true); setErr('');
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
    if (error) { setBusy(false); return setErr(error.status === 429 ? 'Too many tries. Wait a few minutes.' : "That code doesn't match or has expired."); }
    try {
      await settingsApi.scheduleDeletion();
      const { profile: fresh } = await settingsApi.load((await supabase.auth.getUser()).data.user!.id);
      setProfile(fresh); // RequireCreator now shows the "account will be deleted" page
      close();
    } catch {
      setBusy(false); setErr('Could not schedule deletion. Try again.');
    }
  };

  return (
    <Sheet open={open} onClose={close} title="Delete your account?"
      footer={step === 'intro'
        ? <><Button onClick={close}>Keep account</Button><Button variant="danger" disabled={busy} onClick={sendCode}>Email me a code</Button></>
        : <><Button onClick={close}>Keep account</Button><Button variant="danger" disabled={busy || code.length !== 6} onClick={confirm}>Schedule deletion</Button></>}>
      {step === 'intro' ? (
        <div className="flex flex-col gap-2">
          <p className="m-0 text-sm font-medium text-muted">Your account and every deal record are deleted after 30 days. Open brand links will show that the account is closing. You can cancel before then.</p>
          <p className="m-0 text-sm font-medium text-muted">To make sure it's you, we'll email a 6-digit code to {email}.</p>
          {err && <p role="alert" className="m-0 text-sm font-semibold text-danger">{err}</p>}
        </div>
      ) : (
        <Field label="6-digit code" hint={`Sent to ${email}. It works for 10 minutes.`} error={err}>
          {id => <Input id={id} inputMode="numeric" autoComplete="one-time-code" maxLength={6} autoFocus value={code}
            onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setErr(''); }}
            onKeyDown={e => e.key === 'Enter' && code.length === 6 && !busy && confirm()} className="tracking-[.3em] text-lg" />}
        </Field>
      )}
    </Sheet>
  );
}
