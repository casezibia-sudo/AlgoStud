import { useState } from 'react';
import { api, useAccount, type Prefs, type Trigger } from '@/api';
import { Button, Card, Field, Input, Select, Sheet, useToast } from '@/components/ui';
import { PageHead } from '@/components/deal';
import { cx, fmtDate } from '@/lib/format';

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

export default function Settings() {
  const a = useAccount()!;
  const toast = useToast();
  const c = a.creator;
  const [p, setP] = useState({ name: c.name, handle: c.handle, paymentLink: c.paymentLink || '', defaultTrigger: c.defaultTrigger || 'On approval' as Trigger });
  const [del, setDel] = useState(false);
  const prefs = api.creator.prefs();
  const dirty = p.name !== c.name || p.handle !== c.handle || p.paymentLink !== (c.paymentLink || '') || p.defaultTrigger !== (c.defaultTrigger || 'On approval');

  if (c.deletion) return (
    <div className="mx-auto max-w-lg pt-16 flex flex-col gap-4 text-center">
      <h1 className="m-0 text-[28px] font-semibold">Your account will be deleted on {fmtDate(c.deletion.scheduledFor)}</h1>
      <p className="m-0 text-sm font-medium text-muted">Brand links show "This account is closing" until then. You can cancel any time before that date.</p>
      <div><Button variant="primary" onClick={async () => { await api.creator.cancelDeletion(); toast('Deletion cancelled.'); }}>Cancel deletion</Button></div>
    </div>
  );

  return (
    <div className="max-w-[760px]">
      <PageHead title="Settings" />
      <div className="flex flex-col gap-4">
        <Card className="p-5 lg:p-6 flex flex-col gap-4">
          <h2 className="m-0 text-base font-semibold">Profile</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" hint="Brands see this on every link.">{id => <Input id={id} value={p.name} onChange={e => setP({ ...p, name: e.target.value })} />}</Field>
            <Field label="Instagram handle">{id => <Input id={id} value={p.handle} onChange={e => setP({ ...p, handle: e.target.value.replace(/^@/, '') })} />}</Field>
          </div>
          <Field label="Email">{id => <Input id={id} value={c.email} disabled />}</Field>
        </Card>
        <Card className="p-5 lg:p-6 flex flex-col gap-4">
          <h2 className="m-0 text-base font-semibold">Payment details</h2>
          <Field label="Payment link" hint="UPI or bank link. Added to payment reminders.">{id => <Input id={id} value={p.paymentLink} onChange={e => setP({ ...p, paymentLink: e.target.value })} />}</Field>
          <Field label="Default payment timing">{id => <Select id={id} value={p.defaultTrigger} onChange={e => setP({ ...p, defaultTrigger: e.target.value as Trigger })}>{['On approval', 'On posting', 'Days after posting', 'Fixed date'].map(x => <option key={x}>{x}</option>)}</Select>}</Field>
        </Card>
        {dirty && <div className="sticky bottom-20 lg:bottom-4 flex justify-end gap-2 rounded-2xl bg-white px-4 py-3 shadow-[var(--shadow-pop)]"><Button onClick={() => setP({ name: c.name, handle: c.handle, paymentLink: c.paymentLink || '', defaultTrigger: c.defaultTrigger || 'On approval' })}>Discard changes</Button><Button variant="primary" onClick={async () => { await api.creator.update(p); toast('Settings saved.'); }}>Save</Button></div>}
        <Card className="p-5 lg:p-6 flex flex-col">
          <h2 className="m-0 mb-1 text-base font-semibold">Notifications</h2>
          {([['answers', 'Brand answers', 'Confirmations, change requests, approvals and revisions.'], ['expiring', 'Link expiring', 'When a terms link has under 24 hours left.'], ['dueSoon', 'Payment due soon', '3 days before a payment date.']] as [keyof Prefs, string, string][]).map(([k, l, h]) =>
            <Toggle key={k} on={prefs[k]} label={l} hint={h} onChange={v => api.creator.setPref(k, v)} />)}
        </Card>
        <Card className="p-5 lg:p-6 flex flex-col gap-3">
          <h2 className="m-0 text-base font-semibold">Data and legal</h2>
          <div className="flex flex-wrap gap-2"><a href="/privacy" className="text-[13px] font-semibold">Privacy</a><span className="text-muted">·</span><a href="/terms" className="text-[13px] font-semibold">Terms</a></div>
          <div className="flex flex-wrap gap-2 pt-1"><Button onClick={() => { api.reset(); toast('Demo data reset.'); }}>Reset demo data</Button><Button variant="danger" onClick={() => setDel(true)}>Delete account</Button></div>
        </Card>
      </div>
      <Sheet open={del} onClose={() => setDel(false)} title="Delete your account?" footer={<><Button onClick={() => setDel(false)}>Keep account</Button><Button variant="danger" onClick={async () => { await api.creator.scheduleDeletion(); setDel(false); }}>Schedule deletion</Button></>}>
        <p className="m-0 text-sm font-medium text-muted">Your account and every deal record are deleted after 30 days. Open brand links will show that the account is closing. You can cancel before then.</p>
      </Sheet>
    </div>
  );
}
