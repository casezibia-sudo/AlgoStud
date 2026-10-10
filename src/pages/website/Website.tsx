import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Copy, Plus } from 'lucide-react';
import { useStore } from '@/api';
import { Logo, btn, useToast } from '@/components/ui';
import { copy } from '@/components/share';
import { cx } from '@/lib/format';

const STEPS = [
  ['Paste the DM or email', 'AlgoStudio pulls the brand, deliverables, amount and dates into a draft.'],
  ['Check the terms', 'Anything missing is named before you send, like “Add payment due date to send.”'],
  ['Send a confirmation link', 'The brand reads the terms and confirms in the browser. No account needed.'],
  ['Track it to paid', 'Each deal shows whose turn it is and the next date. Reminders quote the agreed term.'],
];
const RISKS = [
  ['Usage rights', 'Sets where the brand can reuse your content, and for how long.', 'Will the content be used in paid advertising, and for how long?'],
  ['Paid advertising', 'Paid use is often priced separately from an organic post.', 'Do you plan to run this content as a paid ad? If so, on which platforms and for how long?'],
  ['Exclusivity', 'Limits which other brands you can work with, and for how long.', 'Is there an exclusivity period? Which brands does it cover, and for how long?'],
  ['Revision limits', 'Without a limit, revision requests can keep coming after you deliver.', 'How many rounds of revisions are included in this fee?'],
  ['Payment due date', 'Gives you a date to follow up on if payment is late.', 'When will the payment be made, and how many days after the content goes live?'],
  ['Whitelisting', 'Lets the brand run ads from your account.', 'Will you need to run ads from my account? If so, for how long?'],
];
const RECORD = [['Terms v1 sent', '12 Mar, 11:04'], ['Confirmed by Priya Nair', '12 Mar, 14:32 IST'], ['Reel v1 submitted', '20 Mar, 18:10'], ['Reel approved', '24 Mar, 10:05'], ['Marked ₹ 25,000 as paid', '28 Apr, 09:40']];

function Hidden() {
  const [cur, setCur] = useState(0);
  const [added, setAdded] = useState<number[]>([]);
  const toast = useToast();
  const r = RISKS[cur];
  const reply = 'Hi, before I confirm, could you clarify:\n' + added.map(i => '• ' + RISKS[i][2]).join('\n');
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-[var(--shadow-card)]">
        <span className="text-xs font-semibold text-muted">GlowSkin India · Instagram DM</span>
        <p className="m-0 text-[15px] font-medium leading-relaxed">Hi! We love your skincare content. Could you do <mark className="bg-brand-tint px-1 rounded">1 Reel and 3 Stories</mark> for our new serum? Budget is <mark className="bg-brand-tint px-1 rounded">₹ 25,000</mark>, and we'd like it live <mark className="bg-brand-tint px-1 rounded">before 31 March</mark>. Let us know!</p>
        <div className="flex flex-col gap-2"><span className="text-xs font-semibold text-muted">Not mentioned · {RISKS.length}</span>
          <div className="flex flex-wrap gap-2">{RISKS.map(([l], i) => <button key={l} type="button" aria-pressed={i === cur} onClick={() => setCur(i)} className={cx('h-9 rounded-full px-3.5 text-[13px] font-semibold cursor-pointer inline-flex items-center gap-1.5', i === cur ? 'bg-[#111111] text-white' : 'bg-white shadow-[inset_0_0_0_1px_var(--color-line-2)]')}>{added.includes(i) && <Check size={14} />}{l}</button>)}</div>
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-3xl bg-deep p-6 text-white">
        <span className="font-mono text-[11px] uppercase tracking-[.08em] text-mint">AlgoStudio · before you confirm</span>
        <h3 className="m-0 text-xl font-bold">{r[0]} was not mentioned.</h3>
        <p className="m-0 text-sm font-medium text-mint-soft">{r[1]}</p>
        <div className="rounded-xl bg-deep-2 p-4 text-sm font-medium"><span className="text-xs font-semibold text-[#9FD8C0]">Ask the brand:</span><br />“{r[2]}”</div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn('primary')} onClick={() => setAdded(a => a.includes(cur) ? a.filter(x => x !== cur) : [...a, cur])}>{added.includes(cur) ? <><Check size={16} />Added</> : <><Plus size={16} />Add to reply</>}</button>
          <button type="button" className={btn('dark')} onClick={() => setCur((cur + 1) % RISKS.length)}>Next term<ArrowRight size={16} /></button>
        </div>
        <div className="mt-auto flex flex-col gap-2 border-t border-white/10 pt-4">
          <span className="text-xs font-semibold text-[#9FD8C0]">Reply to GlowSkin India</span>
          {added.length ? <><pre className="m-0 whitespace-pre-wrap font-sans text-[13px] text-white">{reply}</pre><button type="button" className={btn('dark', 'sm', 'self-start')} onClick={async () => { await copy(reply); toast('Reply copied.'); }}><Copy size={14} />Copy reply</button></> : <span className="text-[13px] text-mint-soft">Questions you add appear here.</span>}
        </div>
      </div>
    </div>
  );
}

export default function Website() {
  const { session } = useStore();
  const cta = session ? { to: '/app', label: 'Open the app' } : { to: '/login', label: 'Create your first deal' };
  return (
    <div className="bg-[#F7F7F9] text-ink">
      <header className="sticky top-0 z-30 bg-[#F7F7F9]/90 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center gap-6 px-5">
          <Link to="/"><Logo size={26} /></Link>
          <nav className="ml-auto hidden md:flex items-center gap-6 text-sm font-semibold"><a href="#how" className="text-ink hover:text-ink">How it works</a><a href="#brands" className="text-ink hover:text-ink">For brands</a></nav>
          <div className="ml-auto md:ml-0 flex items-center gap-2"><Link to="/login" className={btn('ghost')}>Log in</Link><Link to={cta.to} className={btn('primary')}>{cta.label}</Link></div>
        </div>
      </header>

      <section className="mx-auto flex max-w-[1200px] flex-col items-start gap-6 px-5 pt-16 pb-20 lg:pt-28 lg:pb-28">
        <h1 className="m-0 max-w-[900px] font-display text-[44px] sm:text-[64px] lg:text-[80px] font-medium leading-[1.02] tracking-[-0.03em] text-pretty">Turn a brand's DM into a deal you can track to payment.</h1>
        <p className="m-0 max-w-[620px] text-lg font-medium text-muted">Terms drafted, confirmed by the brand, on record.</p>
        <div className="flex flex-wrap gap-3"><Link to={cta.to} className={btn('primary', 'lg')}>{cta.label}<ArrowRight size={18} /></Link><a href="#how" className={btn('secondary', 'lg')}>See how it works</a></div>
      </section>

      <section id="how" className="border-t border-line bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-20">
          <h2 className="m-0 max-w-[720px] font-display text-[36px] lg:text-[48px] font-medium leading-[1.05] tracking-[-0.02em]">From the first message to the payment, one deal at a time.</h2>
          <ol className="m-0 mt-10 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([t, b], i) => <li key={t} className="flex flex-col gap-2 rounded-3xl bg-[#F7F7F9] p-6"><span className="font-mono text-xs text-brand-ink">0{i + 1}</span><span className="text-lg font-bold">{t}</span><span className="text-sm font-medium text-muted text-pretty">{b}</span></li>)}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-20">
        <h2 className="m-0 font-display text-[36px] lg:text-[48px] font-medium tracking-[-0.02em]">The terms brands forget to mention</h2>
        <p className="m-0 mt-2 mb-8 text-base font-medium text-muted">A brand deal is more than deliverables.</p>
        <Hidden />
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-20 lg:grid-cols-2 items-center">
          <div className="flex flex-col gap-3"><h2 className="m-0 font-display text-[36px] lg:text-[48px] font-medium leading-[1.05] tracking-[-0.02em]">Every confirmation is saved with a timestamp.</h2>
            <p className="m-0 text-base font-medium text-muted text-pretty">Each version of the terms, each confirmation, submission, approval and payment is added to the deal's record. Download it whenever you need to show what was agreed.</p></div>
          <div className="rounded-3xl bg-[#F7F7F9] p-6 flex flex-col gap-3">
            <div className="flex justify-between"><span className="text-sm font-bold">Deal record · GlowSkin India · 1 Reel</span><span className="text-xs font-semibold text-muted">{RECORD.length} entries</span></div>
            {RECORD.map(([t, w]) => <div key={t} className="flex justify-between gap-3 rounded-xl bg-white px-4 py-3 text-[13px]"><span className="font-semibold">{t}</span><span className="font-medium text-muted whitespace-nowrap">{w}</span></div>)}
          </div>
        </div>
      </section>

      <section id="brands" className="mx-auto grid max-w-[1200px] gap-10 px-5 py-20 lg:grid-cols-2 items-center">
        <div className="flex flex-col gap-3"><h2 className="m-0 font-display text-[36px] lg:text-[48px] font-medium leading-[1.05] tracking-[-0.02em]">Review the terms from a link. No account, no app.</h2>
          <p className="m-0 text-base font-medium text-muted text-pretty">The creator sends you one link per deal. Read the terms in plain words, then confirm, request a change or decline. Later links let you approve submitted work.</p></div>
        <div className="mx-auto w-full max-w-[380px] rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] flex flex-col gap-4">
          <span className="font-mono text-[11px] text-muted">algostudio.in/d/glowskin-priya</span>
          <span className="text-lg font-bold">Priya Sharma sent you these terms</span>
          {[['Deliverables', '1 Reel · 3 Stories'], ['Amount', '₹ 25,000'], ['Usage rights', '90 days, own channels']].map(([k, v]) => <div key={k} className="flex flex-col"><span className="text-xs font-semibold text-muted">{k}</span><span className="text-[15px] font-semibold">{v}</span></div>)}
          <span className={btn('primary', 'lg')}>Confirm terms</span><span className={btn('secondary', 'lg')}>Request a change</span>
          <span className="text-center text-xs font-medium text-muted">No account needed. Your response is saved to the deal's record.</span>
        </div>
      </section>

      <section className="bg-deep text-white">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-5 px-5 py-24">
          <h2 className="m-0 max-w-[760px] font-display text-[40px] lg:text-[56px] font-medium leading-[1.04] tracking-[-0.02em]">Start with the next brand message you get.</h2>
          <p className="m-0 text-lg font-medium text-mint-soft">Paste it in. You check the terms before anything is sent.</p>
          <Link to={cta.to} className={btn('primary', 'lg')}>{cta.label}<ArrowRight size={18} /></Link>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-4 px-5 py-8 text-[13px] font-medium text-muted"><span>© 2026 AlgoStudio</span><a href="/privacy" className="ml-auto">Privacy</a><a href="/terms">Terms</a></footer>
    </div>
  );
}
