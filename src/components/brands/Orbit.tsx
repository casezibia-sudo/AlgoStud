import type { BrandRec, Level } from '@/lib/brandStats';

const RING: Record<Level, number> = { repeat: 40, returning: 72, new: 104 };
const START: Record<Level, number> = { repeat: 200, returning: 20, new: 100 };
const MAX = 12;

/** Real brands on three rings by deal count: inner = 3+ deals, middle = 2 deals, outer = new. The selected brand is ringed. */
export function Orbit({ brands, selected, onSelect }: { brands: BrandRec[]; selected: string; onSelect: (key: string) => void }) {
  const shown = brands.slice(0, MAX);
  const place = (b: BrandRec) => {
    const same = shown.filter(x => x.level === b.level), i = same.indexOf(b), a = ((START[b.level] + (360 / same.length) * i) * Math.PI) / 180;
    return { x: 120 + RING[b.level] * Math.cos(a), y: 115 + RING[b.level] * Math.sin(a) };
  };
  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 240 230" className="w-full max-w-[250px]" role="group" aria-label={`Your brands by number of deals${brands.length > MAX ? `, showing the top ${MAX}` : ''}`}>
        {(Object.keys(RING) as Level[]).map(l => <circle key={l} cx="120" cy="115" r={RING[l]} fill="none" stroke="rgba(255,255,255,.16)" strokeDasharray="2 4" />)}
        <circle cx="120" cy="115" r="19" fill="#0C3C2C" stroke="#34C39A" strokeWidth="1.5" />
        <text x="120" y="119" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">You</text>
        {shown.map(b => {
          const p = place(b), on = b.key === selected, r = on ? 19 : 13;
          return (
            <g key={b.key} onClick={() => onSelect(b.key)} style={{ cursor: 'pointer' }} role="button" tabIndex={0} aria-label={`${b.name}, ${b.count} deal${b.count === 1 ? '' : 's'}`} aria-pressed={on}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(b.key); } }}>
              {on && <circle cx={p.x} cy={p.y} r={r + 4} fill="none" stroke="#F5D9A8" strokeWidth="2" />}
              <circle cx={p.x} cy={p.y} r={r} fill={b.bg} stroke={on ? '#F5D9A8' : 'rgba(255,255,255,.5)'} strokeWidth={on ? 2 : 1} />
              <text x={p.x} y={p.y + (on ? 4 : 3)} textAnchor="middle" fontSize={on ? 11 : 8} fontWeight="800" fill={b.fg}>{b.initials}</text>
            </g>
          );
        })}
      </svg>
      <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-1 p-0 text-xs font-medium text-white/70">
        <li className="flex items-center gap-1.5"><i className="size-2.5 rounded-full border border-white/50" />Inner · 3+ deals</li>
        <li className="flex items-center gap-1.5"><i className="size-2.5 rounded-full border border-white/50" />Middle · 2 deals</li>
        <li className="col-span-2 flex items-center justify-center gap-1.5"><i className="size-2.5 rounded-full border border-dashed border-white/50" />Outer · new</li>
      </ul>
    </div>
  );
}
