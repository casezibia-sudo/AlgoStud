import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ClipboardPaste } from 'lucide-react';
import { api, isRemote, useAccount, type DealDraft, type Trigger } from '@/api';
import { Button, Card, Field, Input, Label, Select, Textarea, useToast } from '@/components/ui';
import { SendSheet } from '@/components/share';
import { cx, firstName, inr } from '@/lib/format';

const EMPTY: DealDraft = { brand: '', contact: '', email: '', del: '', n: 0, due: '', trigger: 'On approval', usage: '', rev: '2 included', notes: '' };
const TRIGGERS: Trigger[] = ['On approval', 'On posting', 'Days after posting', 'Fixed date'];

/** Client-side helper for "Paste a message". The real parser can move server-side later. */
function parseMessage(t: string): Partial<DealDraft> {
  const out: Partial<DealDraft> = {};
  const amt = t.match(/(?:₹|rs\.?|inr)\s*([\d,]+)|(\d+(?:\.\d+)?)\s*k\b/i);
  if (amt) out.n = amt[1] ? +amt[1].replace(/,/g, '') : Math.round(+amt[2] * 1000);
  const parts: string[] = [];
  for (const [re, name] of [[/(\d+)\s*reels?/i, 'Reel'], [/(\d+)\s*stor(?:y|ies)/i, 'Stor'], [/(\d+)\s*(?:feed\s*)?posts?/i, 'Post'], [/(\d+)\s*(?:youtube\s*)?videos?/i, 'Video']] as const) {
    const m = t.match(re); if (m) { const n = +m[1]; parts.push(`${n} ${name === 'Stor' ? (n > 1 ? 'Stories' : 'Story') : name + (n > 1 ? 's' : '')}`); }
  }
  if (parts.length) out.del = parts.join(', ');
  const em = t.match(/[\w.+-]+@[\w-]+\.[\w.]+/); if (em) out.email = em[0];
  return out;
}

export default function CreateDeal() {
  const { id } = useParams();
  const [sp] = useSearchParams(); // /app/deals/new?brand=...&contact=...&email=... pre-fills the brand (used by Brands)
  const a = useAccount()!;
  const nav = useNavigate();
  const toast = useToast();
  const existing = id ? a.deals.find(d => d.id === id) : undefined;
  const versionMode = !!existing && existing.stage !== 'draft';
  const [f, setF] = useState<DealDraft>(() => existing ? { brand: existing.brand, contact: existing.contact, email: existing.email, del: existing.del, n: existing.n, due: existing.due || '', trigger: existing.trigger, usage: existing.usage || '', rev: existing.rev, notes: existing.notes || '' } : { ...EMPTY, trigger: a.creator.defaultTrigger || 'On approval', brand: sp.get('brand') || '', contact: sp.get('contact') || '', email: sp.get('email') || '' });
  const [tpl, setTpl] = useState<string | null>(null);
  const [paste, setPaste] = useState('');
  const [showErr, setShowErr] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const set = <K extends keyof DealDraft>(k: K, v: DealDraft[K]) => setF(s => ({ ...s, [k]: v }));
  const missing = api.deals.missing(f);
  const changed = useMemo(() => existing ? (Object.keys(f) as (keyof DealDraft)[]).filter(k => k !== 'notes' && String(f[k] ?? '') !== String(existing[k as keyof typeof existing] ?? '')) : [], [f, existing]);

  const applyTemplate = (tid: string) => {
    const t = a.templates.find(x => x.id === tid); if (!t) return;
    setTpl(tid); setF(s => ({ ...s, del: t.del, usage: t.usageFull, trigger: t.trigger, rev: t.rev }));
    api.templates.use(tid); toast(`Filled from “${t.name}”`);
  };
  const saveDraft = async () => {
    try {
      if (existing && !versionMode) { await api.deals.update(existing.id, f); toast('Draft saved.'); return nav(`/app/deals/${existing.id}`); }
      const nid = await api.deals.create(f); toast('Draft saved.'); nav(`/app/deals/${nid}`);
    } catch (e) { toast((e as Error).message); }
  };
  const trySend = async () => {
    if (missing.length) return setShowErr(true);
    if (versionMode) return setSending(isRemote ? 'remote' : api.deals.prepareToken());
    try {
      let did = existing?.id;
      if (did) await api.deals.update(did, f); else did = await api.deals.create(f);
      nav(`/app/deals/${did}`);
    } catch (e) { toast((e as Error).message); }
  };
  const err = (k: string) => (showErr && missing.includes(k) ? 'Needed to send' : undefined);
  const v = (existing?.version || 1) + 1;

  return (
    <div className="pt-4 lg:pt-6 flex flex-col gap-4 max-w-[920px]">
      <button type="button" onClick={() => nav(-1)} className="inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-ink cursor-pointer"><ArrowLeft size={16} />Back</button>
      <div><h1 className="m-0 text-[28px] lg:text-[32px] font-semibold tracking-[-0.02em]">{versionMode ? `Version ${v}` : existing ? 'Edit draft' : 'New deal'}</h1>
        <p className="m-0 text-sm font-medium text-muted">{versionMode ? `${existing!.brand} confirms the whole version again. Changed terms are marked for them.` : 'You check the terms before anything is sent.'}</p></div>

      {!existing && (
        <Card className="p-5 lg:p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2.5">
            <Label>Start from template</Label>
            <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
              {a.templates.map(t => (
                <button key={t.id} type="button" aria-pressed={tpl === t.id} onClick={() => applyTemplate(t.id)}
                  className={cx('flex flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-[background,box-shadow] cursor-pointer hover:bg-subtle active:scale-[.98]', tpl === t.id ? 'bg-brand-tint shadow-[inset_0_0_0_1.5px_var(--color-brand)]' : 'bg-white shadow-[inset_0_0_0_1px_var(--color-line)]')}>
                  <span className="text-[13px] font-semibold">{t.name}</span><span className="text-xs font-medium text-muted">{t.del} · {t.usage}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Or paste the brand's message</Label>
            <Textarea rows={3} aria-label="Brand message" placeholder="Hi! Can you do 1 reel + 3 stories for our serum? Budget 25k…" value={paste} onChange={e => setPaste(e.target.value)} />
            <div><Button size="sm" disabled={!paste.trim()} onClick={() => { const p = parseMessage(paste); setF(s => ({ ...s, ...p })); toast(Object.keys(p).length ? 'Filled what we found. Check each term.' : 'Nothing found. Fill the terms below.'); }}><ClipboardPaste size={14} />Fill from message</Button></div>
          </div>
        </Card>
      )}

      <Card className="p-5 lg:p-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><Label>Who it's with</Label></div>
        <Field label="Brand" error={err('brand')}>{id => <Input id={id} value={f.brand} onChange={e => set('brand', e.target.value)} />}</Field>
        <Field label="Contact name">{id => <Input id={id} value={f.contact} onChange={e => set('contact', e.target.value)} />}</Field>
        <div className="sm:col-span-2"><Field label="Contact email" hint="They confirm with a code sent here." error={err('brand contact email')}>{id => <Input id={id} type="email" value={f.email} onChange={e => set('email', e.target.value)} />}</Field></div>
        <div className="sm:col-span-2 pt-2"><Label>What and how much</Label></div>
        <Field label="Deliverables" hint="For example: 1 Reel, 2 Stories" error={err('deliverables')}>{id => <Input id={id} value={f.del} onChange={e => set('del', e.target.value)} className={cx(changed.includes('del') && 'bg-warn-tint')} />}</Field>
        <Field label="Amount (₹)" hint={f.n ? inr(f.n) : undefined} error={err('amount')}>{id => <Input id={id} inputMode="numeric" value={f.n || ''} onChange={e => set('n', +e.target.value.replace(/\D/g, '') || 0)} className={cx(changed.includes('n') && 'bg-warn-tint')} />}</Field>
        <Field label="Payment is due">{id => <Select id={id} value={f.trigger} onChange={e => set('trigger', e.target.value as Trigger)}>{TRIGGERS.map(t => <option key={t}>{t}</option>)}</Select>}</Field>
        <Field label={f.trigger === 'Fixed date' ? 'Due date' : 'Days to pay'} hint={f.trigger === 'Fixed date' ? 'For example: 15 Nov 2026' : 'For example: 15 days'} error={err('payment due date')}>{id => <Input id={id} value={f.due || ''} onChange={e => set('due', e.target.value)} className={cx(changed.includes('due') && 'bg-warn-tint')} />}</Field>
        <div className="sm:col-span-2"><Field label="Usage rights" hint="Where the brand can reuse your content, and for how long." error={err('usage rights')}>{id => <Input id={id} value={f.usage || ''} onChange={e => set('usage', e.target.value)} className={cx(changed.includes('usage') && 'bg-warn-tint')} />}</Field></div>
        <Field label="Revisions">{id => <Select id={id} value={f.rev} onChange={e => set('rev', e.target.value)}>{['1 included', '2 included', '3 included'].map(r => <option key={r}>{r}</option>)}</Select>}</Field>
        <div className="sm:col-span-2"><Field label="Notes for the brand (optional)">{id => <Textarea id={id} rows={3} value={f.notes} onChange={e => set('notes', e.target.value)} />}</Field></div>
      </Card>

      <div className="sticky bottom-20 lg:bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/95 backdrop-blur px-4 py-3 shadow-[var(--shadow-pop)]">
        <span className={cx('text-[13px] font-semibold', missing.length ? 'text-warn' : 'text-brand-ink')}>{missing.length ? `Add ${missing.join(', ')} to send.` : versionMode ? `${changed.length} term${changed.length === 1 ? '' : 's'} changed.` : 'Ready to send.'}</span>
        <div className="flex gap-2">
          {!versionMode && <Button onClick={saveDraft}>Save draft</Button>}
          <Button variant="primary" onClick={trySend}>{versionMode ? `Send version ${v}` : 'Review and send'}</Button>
        </div>
      </div>

      {sending && existing && (
        <SendSheet open onClose={() => setSending(null)} title={`Send version ${v} to ${existing.brand}`}
          message={isRemote
            ? `Hi ${firstName(f.contact)}, I've updated the terms for ${f.del} (version ${v}): ${inr(f.n)}, payment ${f.trigger}${f.due ? ' · ' + f.due : ''}, usage: ${f.usage}.\nPlease confirm the new version. Thanks, ${firstName(a.creator.name)}`
            : `Hi ${firstName(f.contact)}, I've updated the terms for ${f.del} (version ${v}): ${location.origin}/d/${sending}\nPlease confirm the new version. Thanks, ${firstName(a.creator.name)}`}
          note={isRemote ? 'Brand links arrive in the next update. Share the terms yourself; sending locks this version.' : undefined}
          onSent={async c => { try { await api.deals.sendNewVersion(existing.id, f, c, sending); toast(`Version ${v} sent.`); nav(`/app/deals/${existing.id}`); } catch (e) { toast((e as Error).message); } }} />
      )}
    </div>
  );
}
