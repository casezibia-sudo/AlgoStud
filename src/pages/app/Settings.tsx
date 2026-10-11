import { useState } from 'react';
import { type CreatorSettings, type Trigger } from '@/api';
import { settingsApi } from '@/api/settings';
import { Button, Card, Field, Input, Select, useToast } from '@/components/ui';
import { PageHead } from '@/components/deal';
import { useAuth } from '@/lib/auth';
import { cx } from '@/lib/format';
import { DeleteAccountSheet } from './DeleteAccountSheet';

function Toggle({ on, onChange, label, hint }: { on: boolean; onChange: (v: boolean) => void; label: string; hint: string }) {
  return (
    <label className="flex items-center justify-between gap-4 py-3 cursor-pointer">
      <span className="flex flex-col gap-0.5"><span className="text-sm font-semibold">{label}</span><span className="text-xs font-medium text-muted">{hint}</span></span>
      <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className={cx('relative h-7 w-12 flex-none rounded-full transition-colors cursor-pointer', on ? 'bg-brand' : 'bg-[#C9CACE]')}>
        <span className={cx('absolute top-1 size-5 rounded-full bg-white shadow transition-transform duration-200', on ? 'translate-x-6' : 'translate-x-1')} />
      </button>
    </label>
  );
}

const NOTIFY: [keyof Pick<CreatorSettings, 'notify_answers' | 'notify_expiring' | 'notify_due_soon'>, string, string][] = [
  ['notify_answers', 'Brand answers', 'Confirmations, change requests, approvals and revisions.'],
  ['notify_expiring', 'Link expiring', 'When a terms link has under 24 hours left.'],
  ['notify_due_soon', 'Payment due soon', '3 days before a payment date.'],
];

export default function Settings() {
  const { profile, settings, session, setProfile, setSettings } = useAuth();
  const toast = useToast();
  // RequireCreator guarantees all three exist and the account is not being deleted.
  const c = profile!, s = settings!, email = session!.user.email ?? '';
  const saved = { name: c.name, handle: c.handle, paymentLink: c.payment_link || '', defaultTrigger: s.default_trigger };
  const [p, setP] = useState(saved);
  const [del, setDel] = useState(false);
  const [saving, setSaving] = useState(false);
  const dirty = p.name !== saved.name || p.handle !== saved.handle || p.paymentLink !== saved.paymentLink || p.defaultTrigger !== saved.defaultTrigger;
  const nameOk = p.name.trim().length >= 2;

  const save = async () => {
    setSaving(true);
    try {
      const uid = c.id;
      const [np, ns] = await Promise.all([
        settingsApi.updateProfile(uid, { name: p.name.trim(), handle: p.handle, payment_link: p.paymentLink.trim() || null }),
        settingsApi.updateSettings(uid, { default_trigger: p.defaultTrigger }),
      ]);
      setProfile(np); setSettings(ns);
      setP({ name: np.name, handle: np.handle, paymentLink: np.payment_link || '', defaultTrigger: ns.default_trigger });
      toast('Settings saved.');
    } catch { toast('Could not save. Try again.'); }
    setSaving(false);
  };

  const setNotify = async (k: (typeof NOTIFY)[number][0], v: boolean) => {
    try { setSettings(await settingsApi.updateSettings(c.id, { [k]: v })); }
    catch { toast('Could not save. Try again.'); }
  };

  return (
    <div className="max-w-[760px]">
      <PageHead title="Settings" />
      <div className="flex flex-col gap-4">
        <Card className="p-5 lg:p-6 flex flex-col gap-4">
          <h2 className="m-0 text-base font-semibold">Profile</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" hint="Brands see this on every link." error={dirty && !nameOk ? 'Enter at least 2 characters.' : undefined}>{id => <Input id={id} maxLength={100} value={p.name} onChange={e => setP({ ...p, name: e.target.value })} />}</Field>
            <Field label="Instagram handle">{id => <Input id={id} maxLength={30} value={p.handle} onChange={e => setP({ ...p, handle: e.target.value.replace(/[^A-Za-z0-9._]/g, '') })} />}</Field>
          </div>
          <Field label="Email">{id => <Input id={id} value={email} disabled />}</Field>
        </Card>
        <Card className="p-5 lg:p-6 flex flex-col gap-4">
          <h2 className="m-0 text-base font-semibold">Payment details</h2>
          <Field label="Payment link" hint="UPI or bank link. Added to payment reminders.">{id => <Input id={id} maxLength={500} value={p.paymentLink} onChange={e => setP({ ...p, paymentLink: e.target.value })} />}</Field>
          <Field label="Default payment timing">{id => <Select id={id} value={p.defaultTrigger} onChange={e => setP({ ...p, defaultTrigger: e.target.value as Trigger })}>{['On approval', 'On posting', 'Days after posting', 'Fixed date'].map(x => <option key={x}>{x}</option>)}</Select>}</Field>
        </Card>
        {dirty && <div className="sticky bottom-20 lg:bottom-4 flex justify-end gap-2 rounded-2xl bg-white px-4 py-3 shadow-[var(--shadow-pop)]"><Button disabled={saving} onClick={() => setP(saved)}>Discard changes</Button><Button variant="primary" disabled={saving || !nameOk} onClick={save}>Save</Button></div>}
        <Card className="p-5 lg:p-6 flex flex-col">
          <h2 className="m-0 mb-1 text-base font-semibold">Notifications</h2>
          {NOTIFY.map(([k, l, h]) => <Toggle key={k} on={s[k]} label={l} hint={h} onChange={v => setNotify(k, v)} />)}
        </Card>
        <Card className="p-5 lg:p-6 flex flex-col gap-3">
          <h2 className="m-0 text-base font-semibold">Data and legal</h2>
          <div className="flex flex-wrap gap-2"><a href="/privacy" className="text-[13px] font-semibold">Privacy</a><span className="text-muted">·</span><a href="/terms" className="text-[13px] font-semibold">Terms</a></div>
          <div className="flex flex-wrap gap-2 pt-1"><Button variant="danger" onClick={() => setDel(true)}>Delete account</Button></div>
        </Card>
      </div>
      <DeleteAccountSheet open={del} onClose={() => setDel(false)} />
    </div>
  );
}
