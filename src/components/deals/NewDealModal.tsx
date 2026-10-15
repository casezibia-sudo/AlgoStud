import { useMemo, useRef, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CircleAlert, CircleCheck, ClipboardPaste, X } from 'lucide-react';
import { api, useAccount } from '@/api';
import { Modal } from '@/components/Modal';
import { useToast } from '@/components/ui';
import { applyTemplate, check, draftProblem, emptyForm, isDirty, KEY_TERMS, REVISION_CHOICES, STRUCTURES, templateLine, toDraft, type Basis, type FormState, type TermKey } from '@/lib/dealForm';
import { cx } from '@/lib/format';

const EXAMPLE = "Hey! Loved your recent reel. We'd like you to make 1 Instagram Reel and 2 Stories for our new product launch. We can pay ₹40,000 total. Need first draft by 20 Nov and final by 25 Nov. Let us know!";
const rupee = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
const field = 'w-full rounded-xl bg-white px-3.5 text-[15px] font-medium text-ink outline-none shadow-[inset_0_0_0_1px_#E1E2E5] transition-shadow placeholder:font-normal placeholder:text-[#A3A3AB] focus:shadow-[inset_0_0_0_1.5px_var(--color-brand)]';
const bad = 'bg-[#FFF8F7] shadow-[inset_0_0_0_1.5px_#D92D20]! focus:shadow-[inset_0_0_0_1.5px_#D92D20]!';

/** The Create Deal pop-up. Both Save buttons create a DRAFT deal through the existing create function; sending happens later. */
export function NewDealModal({ onDone, onCancel }: { onDone: (id: string, mode: 'draft' | 'deal') => void; onCancel: () => void }) {
  const account = useAccount();
  const toast = useToast();
  const [sp] = useSearchParams(); // /app/deals/new?brand=&contact=&email= pre-fills the brand (used by Brands)
  const initial = useMemo(() => emptyForm({ brand: sp.get('brand') || '', contact: sp.get('contact') || '', email: sp.get('email') || '' }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [f, setF] = useState<FormState>(initial);
  const [tplId, setTplId] = useState<string | null>(null);
  const [tried, setTried] = useState(false);          // Save Deal was pressed with problems: show them on the fields
  const [draftErr, setDraftErr] = useState<{ field: TermKey; message: string } | null>(null);
  const [saving, setSaving] = useState<'draft' | 'deal' | null>(null);
  const [error, setError] = useState('');
  const [pasteHint, setPasteHint] = useState('');
  const [confirming, setConfirming] = useState(false);
  const saveLock = useRef(false);                     // set synchronously, so a fast double click can't start two saves
  const refs = useRef<Partial<Record<TermKey | 'message', HTMLElement | null>>>({});
  const keepEditing = useRef<HTMLButtonElement>(null);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => { setF(s => ({ ...s, [k]: v })); setError(''); setDraftErr(null); };

  const c = useMemo(() => check(f), [f]);
  const shown = (k: TermKey) => (tried ? c.problems[k] : undefined) || (draftErr?.field === k ? draftErr.message : undefined);
  const dirty = isDirty(f, initial);
  const templates = account?.templates || [];
  const amountN = Number(f.amount.replace(/[₹,\s]/g, ''));
  const split = f.structure === 'advance_balance' && Number.isFinite(amountN) && amountN > 0 && +f.advancePct >= 1 && +f.advancePct <= 99;

  const requestClose = () => { if (saving) return; if (dirty) setConfirming(true); else onCancel(); };
  const focusField = (k: TermKey) => { const el = refs.current[k]; el?.scrollIntoView({ block: 'center' }); el?.focus(); };

  const submit = async (mode: 'draft' | 'deal') => {
    if (saveLock.current) return;
    if (mode === 'draft') {
      const p = draftProblem(f);
      if (p) { setDraftErr(p); focusField(p.field); return; }
    } else if (c.count < KEY_TERMS.length) {
      setTried(true);
      const first = KEY_TERMS.find(t => !c.filled[t.key]);
      if (first) setTimeout(() => focusField(first.key), 0);
      return;
    }
    saveLock.current = true; setSaving(mode); setError('');
    try {
      const id = await api.deals.create(toDraft(f));
      if (tplId) api.templates.use(tplId).catch(() => undefined); // counts the template as used only once the deal exists
      toast(mode === 'deal' ? 'Deal saved' : 'Draft saved');
      onDone(id, mode);
    } catch (e) {
      // Stay open and keep everything that was typed.
      setError((e as Error).message || 'Something went wrong.');
      saveLock.current = false; setSaving(null);
    }
  };

  const paste = async () => {
    try {
      const t = await navigator.clipboard.readText();
      if (!t) { setPasteHint('The clipboard is empty.'); return; }
      set('message', t); setPasteHint('');
    } catch { setPasteHint('Press Ctrl+V to paste instead'); (refs.current.message as HTMLTextAreaElement | null)?.focus(); }
  };

  const Label = ({ id, children, hint }: { id: string; children: ReactNode; hint?: string }) => (
    <label htmlFor={id} className="flex flex-col gap-0.5"><span className="text-[15px] font-medium text-ink">{children}</span>{hint && <span className="text-[13px] font-normal text-muted">{hint}</span>}</label>
  );
  const Err = ({ k }: { k: TermKey }) => (shown(k) ? <span role="alert" className="text-[13px] font-medium text-[#B42318]">{shown(k)}</span> : null);
  const section = (t: string) => <h3 className="m-0 text-[12px] font-semibold uppercase tracking-[.08em] text-muted">{t}</h3>;
  const ref = (k: TermKey | 'message') => (el: HTMLElement | null) => { refs.current[k] = el; };
  const days = f.structure && f.structure !== 'full_advance';

  return (
    <>
      <Modal onRequestClose={requestClose} labelledBy="new-deal-title" initialFocus={{ get current() { return (refs.current.message as HTMLElement) ?? null; } }}
        className="flex max-h-[calc(100dvh-32px)] w-[min(1080px,calc(100vw-32px))] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_64px_-16px_rgba(0,0,0,.45)]">
        <header className="flex items-start justify-between gap-4 border-b border-[#ECEDEE] px-7 pb-5 pt-6">
          <div className="flex max-w-[640px] flex-col gap-2">
            <h2 id="new-deal-title" className="m-0 text-[28px] font-medium leading-tight tracking-[-0.01em]">Create Deal</h2>
            <p className="m-0 text-[15px] font-normal leading-[1.4] text-[#5E5E66]">Paste the brand's message (Instagram DM, WhatsApp, email, etc.). We'll help you turn it into a clear deal.</p>
          </div>
          <button type="button" aria-label="Close" onClick={requestClose} className="grid size-[35px] flex-none cursor-pointer place-items-center rounded-full bg-[#F1F2F2] text-ink-2 hover:bg-[#E6E7E7]"><X size={16} /></button>
        </header>

        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:overflow-hidden">
          {/* left: the pasted message and the key-terms check */}
          <section className="flex flex-col gap-3 px-7 py-6 lg:overflow-y-auto" aria-label="Brand message">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="deal-message" className="text-[15px] font-medium">Brand message</label>
              <button type="button" onClick={paste} className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-[10px] bg-white px-3 text-[13px] font-semibold text-brand-ink shadow-[inset_0_0_0_1px_#E1E2E5] hover:bg-subtle"><ClipboardPaste size={14} aria-hidden="true" />Paste from clipboard</button>
            </div>
            <textarea id="deal-message" ref={ref('message')} value={f.message} onChange={e => set('message', e.target.value)} placeholder={EXAMPLE} aria-describedby="paste-hint"
              className={cx(field, 'min-h-[220px] flex-1 resize-y py-4 leading-[1.5] lg:min-h-[279px]')} />
            <span id="paste-hint" role="status" className={cx('-mt-1.5 text-[13px] font-medium text-muted', !pasteHint && 'sr-only')}>{pasteHint}</span>
            <div role="status" className={cx('flex flex-col gap-3 rounded-[14px] p-4 text-[15px] font-medium leading-[1.4]', c.count === KEY_TERMS.length ? 'bg-[#EEF6F2] text-[#076645] shadow-[inset_0_0_0_1px_#CFE6DB]' : 'bg-[#FFF6E8] text-[#8A4B0C] shadow-[inset_0_0_0_1px_#F5DDB8]')}>
              <div className="flex items-start gap-3">
                {c.count === KEY_TERMS.length ? <CircleCheck size={20} className="mt-px flex-none" aria-hidden="true" /> : <CircleAlert size={20} className="mt-px flex-none" aria-hidden="true" />}
                <span>{c.count === KEY_TERMS.length ? 'All 9 key terms are filled in. Save the deal, then send it from its page.' : `Missing important details: ${c.missing.join(', ')}.`}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/10" aria-hidden="true"><div className="h-full rounded-full transition-[width] duration-300" style={{ width: `${(c.count / KEY_TERMS.length) * 100}%`, background: c.count === KEY_TERMS.length ? '#0A7F55' : '#E98A22' }} /></div>
                <span className="whitespace-nowrap text-[13px] font-medium text-[#5E5E66]">{c.count} of {KEY_TERMS.length} key terms</span>
              </div>
            </div>
          </section>

          {/* right: template, then the terms */}
          <section className="flex flex-col gap-4 bg-[#FAFAFA] px-7 py-6 lg:overflow-y-auto lg:border-l lg:border-[#ECEDEE]" aria-label="Deal terms">
            {section('Start from template')}
            {templates.length === 0 ? (
              <p className="m-0 rounded-[14px] bg-white px-4 py-5 text-[13px] font-medium leading-snug text-muted shadow-[inset_0_0_0_1px_#E1E2E5]">No templates yet. Open a deal and choose "Save as template" to reuse its terms here.</p>
            ) : (
              <div className="grid gap-2.5 sm:grid-cols-2">
                {templates.map(t => (
                  <button key={t.id} type="button" aria-pressed={tplId === t.id} onClick={() => { setF(s => applyTemplate(s, t)); setTplId(t.id); setError(''); }}
                    className={cx('flex cursor-pointer flex-col gap-1 rounded-[14px] bg-white px-4 py-3 text-left transition-[box-shadow,transform] active:scale-[.99]', tplId === t.id ? 'shadow-[inset_0_0_0_1.5px_var(--color-brand)]' : 'shadow-[inset_0_0_0_1px_#E1E2E5] hover:shadow-[inset_0_0_0_1px_#C8C9CC]')}>
                    <span className="text-[15px] font-medium">{t.name}</span><span className="line-clamp-2 text-[13px] font-normal leading-snug text-muted">{templateLine(t)}</span>
                  </button>
                ))}
              </div>
            )}

            {section("Who it's with")}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5"><Label id="deal-brand">Brand name</Label>
                <input id="deal-brand" ref={ref('brand')} value={f.brand} onChange={e => set('brand', e.target.value)} placeholder="e.g., Glow Skin Co." aria-invalid={!!shown('brand')} className={cx(field, 'h-[42px]', shown('brand') && bad)} /><Err k="brand" /></div>
              <div className="flex flex-col gap-1.5"><Label id="deal-contact">Contact person / handle</Label>
                <input id="deal-contact" ref={ref('contact')} value={f.contact} onChange={e => set('contact', e.target.value)} placeholder="e.g., @glowskin or Sarah from Glow Skin" aria-invalid={!!shown('contact')} className={cx(field, 'h-[42px]', shown('contact') && bad)} /><Err k="contact" /></div>
            </div>
            <div className="flex flex-col gap-1.5"><Label id="deal-del" hint="What exactly are you creating? Include format, quantity, and platform.">Deliverables</Label>
              <textarea id="deal-del" ref={ref('del')} rows={3} value={f.del} onChange={e => set('del', e.target.value)} placeholder="1x Instagram Reel (30–45 sec), 2x Stories with link, 1x static post" aria-invalid={!!shown('del')} className={cx(field, 'resize-y py-3 leading-[1.45]', shown('del') && bad)} /><Err k="del" /></div>

            {section('Compensation')}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5"><Label id="deal-amount">Payment amount</Label>
                <div className="relative"><span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] font-medium text-muted" aria-hidden="true">₹</span>
                  <input id="deal-amount" ref={ref('amount')} inputMode="decimal" value={f.amount} onChange={e => set('amount', e.target.value)} placeholder="40,000" aria-invalid={!!shown('amount')} className={cx(field, 'h-[42px] pl-8 tabular-nums', shown('amount') && bad)} /></div><Err k="amount" /></div>
              <div className="flex flex-col gap-1.5"><Label id="deal-structure">Payment type</Label>
                <select id="deal-structure" ref={ref('payment')} value={f.structure} onChange={e => setF(s => ({ ...s, structure: e.target.value as FormState['structure'], ...(e.target.value === 'full_advance' ? { basis: '' as const, payDays: '' } : {}) }))} aria-invalid={!!shown('payment')} className={cx(field, 'h-[42px] cursor-pointer', !f.structure && 'text-[#A3A3AB]', shown('payment') && bad)}>
                  <option value="">Select payment type</option>{STRUCTURES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select></div>
            </div>
            {f.structure === 'advance_balance' && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] font-medium">
                <label htmlFor="deal-pct" className="text-ink">Advance share</label>
                <span className="relative w-[96px]"><input id="deal-pct" inputMode="numeric" value={f.advancePct} onChange={e => set('advancePct', e.target.value.replace(/[^\d]/g, ''))} className={cx(field, 'h-[38px] pr-8 tabular-nums', shown('payment') && !(+f.advancePct >= 1 && +f.advancePct <= 99) && bad)} /><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true">%</span></span>
                <span className="text-[13px] font-normal text-muted">{split ? `${rupee((amountN * +f.advancePct) / 100)} up front, ${rupee((amountN * (100 - +f.advancePct)) / 100)} for the balance` : 'The rest is paid as the balance.'}</span>
              </div>
            )}
            {days && (
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[14px] font-medium">
                <span>{f.structure === 'advance_balance' ? 'Balance paid within' : 'Paid within'}</span>
                <input aria-label="Number of days" inputMode="numeric" value={f.payDays} onChange={e => set('payDays', e.target.value.replace(/[^\d]/g, ''))} placeholder="15" className={cx(field, 'h-[38px] w-[72px] text-center tabular-nums', shown('payment') && !f.payDays && bad)} />
                <span>days of</span>
                <select aria-label="Counted from" value={f.basis} onChange={e => set('basis', e.target.value as Basis | '')} className={cx(field, 'h-[38px] w-auto cursor-pointer pr-8', !f.basis && 'text-[#A3A3AB]', shown('payment') && !f.basis && bad)}>
                  <option value="">choose…</option><option value="going_live">going live</option><option value="invoice">invoice</option>
                </select>
              </div>
            )}
            {f.structure === 'full_advance' && <p className="m-0 -mt-1 text-[13px] font-normal text-muted">Paid in full before you start, so there's no due date to track.</p>}
            <Err k="payment" />

            {section('Timeline')}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5"><Label id="deal-first">First draft date</Label>
                <input id="deal-first" ref={ref('firstDraft')} type="date" value={f.firstDraft} onChange={e => set('firstDraft', e.target.value)} aria-invalid={!!shown('firstDraft')} className={cx(field, 'h-[42px]', shown('firstDraft') && bad)} /><Err k="firstDraft" /></div>
              <div className="flex flex-col gap-1.5"><Label id="deal-final">Final delivery date</Label>
                <input id="deal-final" ref={ref('finalDelivery')} type="date" min={f.firstDraft || undefined} value={f.finalDelivery} onChange={e => set('finalDelivery', e.target.value)} aria-invalid={!!shown('finalDelivery')} className={cx(field, 'h-[42px]', shown('finalDelivery') && bad)} /><Err k="finalDelivery" /></div>
            </div>

            {section('Terms')}
            <div className="flex flex-col gap-1.5"><Label id="deal-usage" hint="Where the brand can reuse your content, and for how long.">Usage rights</Label>
              <input id="deal-usage" ref={ref('usage')} value={f.usage} onChange={e => set('usage', e.target.value)} placeholder="e.g., Brand can repost on Instagram for 60 days" aria-invalid={!!shown('usage')} className={cx(field, 'h-[42px]', shown('usage') && bad)} /><Err k="usage" /></div>
            <div className="flex flex-col gap-1.5 pb-1"><span id="rev-label" className="text-[15px] font-medium">Revision limit</span>
              <div role="radiogroup" aria-labelledby="rev-label" className="inline-flex gap-2">
                {REVISION_CHOICES.map(n => (
                  <button key={n} type="button" role="radio" aria-checked={f.revisions === n} onClick={() => set('revisions', n)}
                    className={cx('h-[38px] min-w-[52px] cursor-pointer rounded-xl px-4 text-[15px] font-medium transition-transform active:scale-[.97]', f.revisions === n ? 'bg-[#111111] text-white' : 'bg-white text-ink-2 shadow-[inset_0_0_0_1px_#E1E2E5] hover:bg-subtle')}>{n}</button>
                ))}
              </div>
            </div>
          </section>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-[#ECEDEE] px-7 py-4">
          {error
            ? <p role="alert" className="m-0 max-w-[560px] text-[13px] font-medium text-[#B42318]">Couldn't save the deal: {error} What you typed is still here, so you can try again.</p>
            : <p className="m-0 text-[13px] font-normal text-muted">All fields are required unless marked optional.</p>}
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={requestClose} disabled={!!saving} className="h-[43px] cursor-pointer rounded-[14px] px-4 text-base font-medium text-ink-2 hover:bg-black/5 disabled:opacity-50">Cancel</button>
            <button type="button" onClick={() => submit('draft')} disabled={!!saving} className="h-[43px] cursor-pointer rounded-[14px] bg-white px-5 text-base font-medium shadow-[inset_0_0_0_1px_#E1E2E5] hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-60">{saving === 'draft' ? 'Saving…' : 'Save as draft'}</button>
            <button type="button" onClick={() => submit('deal')} disabled={!!saving} className="h-[43px] min-w-[107px] cursor-pointer rounded-[14px] bg-brand px-5 text-base font-semibold text-white shadow-[0_8px_18px_-8px_rgba(10,127,85,.6)] hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60">{saving === 'deal' ? 'Saving…' : 'Save Deal'}</button>
          </div>
        </footer>
      </Modal>

      {confirming && (
        <Modal onRequestClose={() => setConfirming(false)} labelledBy="discard-title" initialFocus={keepEditing} className="w-[min(400px,calc(100vw-32px))] rounded-[20px] bg-white p-6 shadow-[0_24px_64px_-16px_rgba(0,0,0,.5)]">
          <h2 id="discard-title" className="m-0 text-xl font-semibold">Discard this deal?</h2>
          <p className="m-0 mt-1.5 text-[15px] font-normal text-[#5E5E66]">What you typed will be lost.</p>
          <div className="mt-5 flex justify-end gap-2.5">
            <button ref={keepEditing} type="button" onClick={() => setConfirming(false)} className="h-10 cursor-pointer rounded-xl bg-white px-4 text-sm font-semibold shadow-[inset_0_0_0_1px_#E1E2E5] hover:bg-subtle">Keep editing</button>
            <button type="button" onClick={() => { setConfirming(false); onCancel(); }} className="h-10 cursor-pointer rounded-xl bg-danger px-4 text-sm font-semibold text-white hover:bg-[#962016]">Discard</button>
          </div>
        </Modal>
      )}
    </>
  );
}
