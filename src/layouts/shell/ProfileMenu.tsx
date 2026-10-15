import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, ChevronDown, CircleCheck, Copy, Handshake, Link2, Lock, LogOut, Settings, Users } from 'lucide-react';
import { useAccount } from '@/api';
import { LATER } from '@/api/safe';
import { useToast } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { cx } from '@/lib/format';
import { milestones, type BadgeIcon } from '@/lib/milestones';
import { ProgressAvatar } from './ProgressAvatar';
import { panel, useDismiss } from './shared';

const BADGE_ICON: Record<BadgeIcon, typeof Award> = { handshake: Handshake, award: Award, check: CircleCheck, lock: Lock };
const itemCls = 'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium hover:bg-subtle cursor-pointer';

/** Avatar with a progress ring. From lg up it is the full pill (name, role, chevron); below lg it is just the avatar. */
export function ProfileMenu() {
  const a = useAccount();
  const { signOut } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => setOpen(false), [loc.pathname]);
  useDismiss(open, () => setOpen(false), ref);
  const m = useMemo(() => milestones(a?.deals || []), [a?.deals]);

  const name = a?.creator.name || a?.creator.email || 'You';
  const items = [
    { label: 'Settings', icon: Settings, go: () => nav('/app/settings') },
    { label: 'Brands', icon: Users, go: () => nav('/app/brands') },
    { label: 'Manage templates', icon: Copy, go: () => nav('/app/templates') },
    // Profile links are not built yet.
    { label: 'Copy my profile link', icon: Link2, go: () => toast(LATER('Copying your profile link')) },
  ];
  const ini = name.split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label="Account menu" onClick={() => setOpen(o => !o)}
        className="flex items-center rounded-full p-0.5 cursor-pointer hover:bg-black/5 lg:bg-[#FAFAFA] lg:p-[5px] lg:pr-2 lg:shadow-[0_0_0_1px_rgba(0,0,0,.07),0_1px_2px_rgba(0,0,0,.05)] lg:hover:bg-white">
        <ProgressAvatar name={name} progress={m.progress} toGo={m.toGo} />
        <span className="hidden lg:flex ml-[11px] flex-col text-left leading-tight">
          <span className="text-[13px] font-semibold text-ink">{a?.creator.name || 'Your account'}</span>
          <span className="text-[10px] font-medium text-muted">Creator</span>
        </span>
        <ChevronDown size={14} aria-hidden="true" className={cx('hidden lg:block ml-[13px] text-ink-2 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div role="menu" className={`${panel} right-0 top-[54px] w-[272px]`}>
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <span aria-hidden="true" className="grid size-9 flex-none place-items-center rounded-full bg-brand-tint text-[13px] font-bold text-brand-ink">{ini}</span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[13px] font-semibold">{a?.creator.name || 'Your account'}</span>
              <span className="truncate text-xs font-medium text-muted">{a?.creator.handle ? '@' + a.creator.handle : a?.creator.email}</span>
            </span>
          </div>

          <div className="flex flex-col gap-2 border-b border-line px-4 py-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[.06em] text-muted">{m.next === null ? 'All milestones reached' : 'Next milestone'}</span>
              {m.next !== null && <span className="text-xs font-semibold text-brand-ink">{m.toGo} to go</span>}
            </div>
            {m.next !== null && <span className="-mt-0.5 text-sm font-semibold">{m.next} {m.next === 1 ? 'deal' : 'deals'} closed</span>}
            <div className="h-1.5 rounded-full bg-[#E6E7E7]" role="progressbar" aria-label="Progress to the next milestone" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(m.progress * 100)}>
              <div className="h-full rounded-full bg-brand" style={{ width: `${m.progress * 100}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col rounded-xl bg-subtle px-3 py-2"><span className="text-[17px] font-semibold leading-tight">{m.closed}</span><span className="text-xs font-medium text-muted">Deals closed</span></div>
              <div className="flex flex-col rounded-xl bg-subtle px-3 py-2"><span className="text-[17px] font-semibold leading-tight">{m.measurable ? `${m.onTime} of ${m.measurable}` : '—'}</span><span className="text-xs font-medium text-muted">Paid on time</span></div>
            </div>
            <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
              {m.badges.map(b => {
                const Icon = b.unlocked && b.icon === 'lock' ? Award : BADGE_ICON[b.icon];
                return (
                  <li key={b.id} className={cx('inline-flex h-[22px] items-center gap-1 rounded-full px-2 text-[11px] font-semibold', b.unlocked ? 'bg-[#E3F4EC] text-[#076645]' : 'bg-white text-muted shadow-[inset_0_0_0_1px_var(--color-line-2)]')}>
                    <Icon size={12} aria-hidden="true" />{b.label}{!b.unlocked && <span className="sr-only"> (locked)</span>}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="p-2">
            {items.map(i => (
              <button key={i.label} role="menuitem" type="button" onClick={() => { setOpen(false); i.go(); }} className={itemCls}><i.icon size={16} aria-hidden="true" />{i.label}</button>
            ))}
            <div className="my-1 h-px bg-line" />
            <button role="menuitem" type="button" onClick={async () => { await signOut(); nav('/login', { replace: true }); }} className={cx(itemCls, 'text-danger hover:bg-danger-tint')}>
              <LogOut size={16} aria-hidden="true" />Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
