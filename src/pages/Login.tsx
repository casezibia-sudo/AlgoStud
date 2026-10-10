import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/api';
import { Button, Field, Input, Logo } from '@/components/ui';

export default function Login() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') || '/app';
  const [email, setEmail] = useState('ananya@gmail.com');
  const [step, setStep] = useState<'email' | 'code' | 'profile'>('email');
  const [demo, setDemo] = useState('');
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');

  const send = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Enter a valid email.');
    const r = await api.auth.requestCode(email); setDemo(r.demoCode); setStep('code'); setErr('');
  };
  const verify = async () => {
    const r = await api.auth.verifyCode(email, code);
    if (!r.ok) return setErr(r.error);
    if (api.auth.isKnown(email)) { await api.auth.signIn(email); nav(next, { replace: true }); }
    else setStep('profile');
  };

  return (
    <div className="grid min-h-dvh place-items-center bg-canvas px-4">
      <div className="flex w-full max-w-[400px] flex-col gap-6">
        <Link to="/" className="self-center"><Logo size={28} /></Link>
        <section className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-[var(--shadow-card)]">
          {step === 'email' && <>
            <div><h1 className="m-0 text-xl font-bold">Log in or sign up</h1><p className="m-0 mt-1 text-sm font-medium text-muted">We'll email you a 6-digit code. No password.</p></div>
            <Field label="Email" error={err}>{id => <Input id={id} type="email" autoComplete="email" value={email} onChange={e => { setEmail(e.target.value); setErr(''); }} onKeyDown={e => e.key === 'Enter' && send()} />}</Field>
            <Button variant="primary" size="lg" onClick={send}>Send code</Button>
          </>}
          {step === 'code' && <>
            <div><h1 className="m-0 text-xl font-bold">Check your email</h1><p className="m-0 mt-1 text-sm font-medium text-muted">Code sent to {email}. It works for 10 minutes.</p></div>
            <Field label="6-digit code" error={err}>{id => <Input id={id} inputMode="numeric" autoComplete="one-time-code" maxLength={6} autoFocus value={code} onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setErr(''); }} onKeyDown={e => e.key === 'Enter' && code.length === 6 && verify()} className="tracking-[.3em] text-lg" />}</Field>
            <span className="rounded-lg bg-info-tint px-3 py-2 text-xs font-semibold text-info">Demo only: your code is {demo}</span>
            <Button variant="primary" size="lg" disabled={code.length !== 6} onClick={verify}>Continue</Button>
            <button type="button" className="text-[13px] font-semibold text-brand-ink cursor-pointer" onClick={() => { setStep('email'); setCode(''); }}>Use a different email</button>
          </>}
          {step === 'profile' && <>
            <div><h1 className="m-0 text-xl font-bold">Set up your profile</h1><p className="m-0 mt-1 text-sm font-medium text-muted">Brands see your name on every link.</p></div>
            <Field label="Your name">{id => <Input id={id} autoComplete="name" value={name} onChange={e => setName(e.target.value)} />}</Field>
            <Field label="Instagram handle (optional)">{id => <Input id={id} value={handle} onChange={e => setHandle(e.target.value.replace(/^@/, ''))} />}</Field>
            <Button variant="primary" size="lg" disabled={name.trim().length < 2} onClick={async () => { await api.auth.signIn(email, { name: name.trim(), handle }); nav('/app', { replace: true }); }}>Create account</Button>
          </>}
        </section>
      </div>
    </div>
  );
}
