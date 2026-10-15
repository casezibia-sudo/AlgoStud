import { Link } from 'react-router-dom';
import type { Deal } from '@/api';
import { tint } from '@/lib/dashboardStats';
import { actionOf, statusOf, type Action, type Tone } from '@/lib/dealsView';
import { cx } from '@/lib/format';

const initialsOf = (s: string) => s.split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

/** Brand initials on the brand's tint colour. */
export function Initials({ name, size = 36 }: { name: string; size?: number }) {
  const [bg, fg] = tint(name);
  return <span aria-hidden="true" className="inline-grid flex-none place-items-center rounded-full font-bold" style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.34 }}>{initialsOf(name)}</span>;
}

export const TONE_DOT: Record<Tone, string> = { red: '#E5352B', amber: '#E98A22', grey: '#8A8A92', green: '#0A7F55' };
const TONE_TEXT: Record<Tone, string> = { red: '#B42318', amber: '#A04A0C', grey: '#1A1A1C', green: '#076645' };

/** Status dot + label, with the second line underneath. */
export function StatusBlock({ d, compact }: { d: Deal; compact?: boolean }) {
  const s = statusOf(d);
  return (
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="flex items-center gap-[5px] font-semibold" style={{ color: TONE_TEXT[s.tone], fontSize: compact ? 13 : 13.2 }}>
        <i className="size-[7px] flex-none rounded-full" style={{ background: TONE_DOT[s.tone] }} />{s.label}
      </span>
      {s.sub && !compact && <span className="truncate pl-3 text-[13px] font-medium text-muted">{s.sub}</span>}
    </span>
  );
}

/** The deal's button. Creator-side buttons run the existing deal action; brand-side ones show the later-update notice. */
export function ActionButton({ d, onRun, onLater, block }: { d: Deal; onRun: (d: Deal) => void; onLater: (what: string) => void; block?: boolean }) {
  const a: Action | null = actionOf(d);
  if (!a) return null;
  const cls = cx('inline-flex h-[34px] cursor-pointer items-center justify-center whitespace-nowrap rounded-[10px] px-[13px] text-[13px] font-medium transition-transform active:scale-[.97]', block && 'w-full',
    a.primary ? 'bg-brand text-white shadow-[0_1px_2px_rgba(10,127,85,.3)] hover:bg-brand-hover hover:text-white' : 'bg-white text-ink-2 shadow-[0_0_0_1px_rgba(0,0,0,.12)] hover:bg-subtle hover:text-ink-2');
  if (a.link) return <Link to={a.link} className={cls}>{a.label}</Link>;
  return <button type="button" className={cls} onClick={() => (a.later ? onLater(a.later) : onRun(d))}>{a.label}</button>;
}
