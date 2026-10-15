import { useRef, useState, type MouseEvent } from 'react';
import type { Insight, OverviewStats } from '@/lib/dashboardStats';
import { useReducedMotion } from './shared';

const EMPTY: Insight = { big: '—', head: 'No insights yet.', sub: 'Insights appear as you send deals and get paid.' };

/**
 * A green card whose slide changes every 6s. Each progress bar fills over 6s and the slide advances when the fill
 * finishes, so the bar and the slide can't drift. Hover or keyboard focus pauses the fill. With reduced motion nothing
 * animates and nothing auto-advances: the current bar is full and the bars are buttons.
 */
export function InsightsCard({ stats }: { stats: OverviewStats }) {
  const items = stats.insights; // read here, inside this card, so a failure stays in its own error boundary
  const reduced = useReducedMotion();
  const [ins, setIns] = useState(0);
  const [fading, setFading] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const p0 = useRef<HTMLDivElement>(null), p1 = useRef<HTMLDivElement>(null), p2 = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const list = items.length ? items : [EMPTY];
  const cur = list[Math.min(ins, list.length - 1)];
  const paused = hover || focus;

  const go = (i: number) => {
    if (i === ins) return;
    setFading(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { setIns(i); setFading(false); }, reduced ? 0 : 220);
  };
  const move = (e: MouseEvent<HTMLElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    if (p0.current) p0.current.style.transform = `translate(${px * -10}px,${py * -10}px)`;
    if (p1.current) p1.current.style.transform = `translate(${px * 18}px,${py * 14}px)`;
    if (p2.current) p2.current.style.transform = `translate(${px * 30}px,${py * 24}px)`;
  };
  const release = () => { setHover(false); [p0, p1, p2].forEach(r => { if (r.current) r.current.style.transform = ''; }); };
  const shape = 'pointer-events-none absolute aspect-square transition-transform duration-300 ease-[var(--ease-out-quint)]';

  return (
    <section aria-label="Insights" aria-roledescription="carousel" onMouseEnter={() => setHover(true)} onMouseLeave={release} onMouseMove={move}
      onFocus={() => setFocus(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocus(false); }}
      className="relative flex min-h-[230px] min-w-0 flex-col overflow-hidden rounded-[18px] p-6 text-white shadow-[0_0_0_1px_rgba(0,0,0,.05),0_1px_3px_rgba(0,0,0,.06)]"
      style={{ background: 'radial-gradient(120% 90% at 100% 0%,#F4D9A6 0%,rgba(244,217,166,0) 45%),radial-gradient(90% 70% at 20% 10%,#9FE6C8 0%,rgba(159,230,200,0) 60%),linear-gradient(180deg,#4FBF93 0%,#0E8A5E 45%,#064F37 100%)' }}>
      <div aria-hidden="true" ref={p0} className={`${shape} -bottom-[30%] -left-[20%] w-[70%]`}><div className="ov-shape-0 size-full rounded-full" style={{ background: 'radial-gradient(closest-side,rgba(191,239,219,.38),rgba(191,239,219,0))' }} /></div>
      <div aria-hidden="true" ref={p1} className={`${shape} -right-[14%] -top-[10%] w-[62%]`}><div className="ov-shape-1 size-full rounded-[28%] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,.45)] backdrop-blur-[6px]" style={{ background: 'linear-gradient(135deg,rgba(255,255,255,.28),rgba(255,255,255,.04))' }} /></div>
      <div aria-hidden="true" ref={p2} className={`${shape} right-[4%] top-[6%] w-[30%]`}><div className="ov-shape-2 size-full rounded-[24%] shadow-[inset_0_0_0_1px_rgba(255,255,255,.35)]" /></div>
      <span className="relative inline-flex h-[26px] items-center self-start rounded-lg bg-white/[.18] px-2.5 text-xs font-medium shadow-[inset_0_0_0_1px_rgba(255,255,255,.35)] backdrop-blur-[6px]">Insights</span>
      <div className="flex-1" />
      <div aria-live="polite" className="relative flex flex-col gap-2 transition-[opacity,transform] duration-300" style={{ opacity: fading ? 0 : 1, transform: `translateY(${fading ? '6px' : '0'})` }}>
        <span className="text-[32px] font-medium leading-none tracking-[-0.02em]">{cur.big}</span>
        <span className="max-w-[300px] text-balance text-base font-semibold leading-[1.35]">{cur.head}</span>
        <span className="max-w-[280px] text-pretty text-xs font-medium leading-normal text-[#E6F6EF]">{cur.sub}</span>
      </div>
      <div className="relative mt-4 flex gap-2">
        {list.map((_, i) => {
          const on = i === ins && !fading && items.length > 0;
          return (
            <button key={i} type="button" aria-label={`Insight ${i + 1}`} aria-current={i === ins} onClick={() => go(i)} className="h-3.5 flex-1 cursor-pointer py-[5px] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/35">
                <span className={`absolute inset-0 origin-left rounded-[inherit] bg-white ${on && !reduced ? 'ov-fill-run' : ''}`}
                  onAnimationEnd={() => { if (i === ins && items.length > 1) go((i + 1) % items.length); }}
                  style={{ transform: `scaleX(${reduced && i === ins ? 1 : 0})`, animationPlayState: paused ? 'paused' : 'running' }} />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
