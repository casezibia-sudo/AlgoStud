import { cx } from '@/lib/format';

/** The creator's initials with a ring showing progress to the next milestone, and the number of deals still to go. */
export function ProgressAvatar({ name, progress, toGo, className }: { name: string; progress: number; toGo: number; className?: string }) {
  const ini = name.split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'YOU';
  const r = 18, c = 2 * Math.PI * r;
  return (
    <span aria-hidden="true" className={cx('relative inline-grid size-9 flex-none place-items-center', className)}>
      <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90">
        <circle cx="20" cy="20" r={r} fill="none" stroke="#DCE9E2" strokeWidth="2" />
        <circle cx="20" cy="20" r={r} fill="none" stroke="#0A7F55" strokeWidth="2" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, Math.max(0, progress)))} />
      </svg>
      <span className="grid size-7 place-items-center rounded-full bg-brand-tint text-[10px] font-bold text-brand-ink">{ini}</span>
      {toGo > 0 && <span className="absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full bg-white text-[9px] font-bold text-brand-ink shadow-[0_0_0_1px_rgba(0,0,0,.08)]">{toGo}</span>}
    </span>
  );
}
