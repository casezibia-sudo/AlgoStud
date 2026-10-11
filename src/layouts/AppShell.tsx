import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Users, Copy, Settings, LogOut, Home, Handshake, Wallet, PackageCheck, BarChart3 } from 'lucide-react';
import { api, useAccount } from '@/api';
import { Avatar, Logo } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { cx } from '@/lib/format';

// Max 5 top-level items. Brands lives as a tab inside Deals; Templates and Settings live in the profile menu.
export const NAV = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/app/deals', label: 'Deals', icon: Handshake, also: ['/app/brands'] },
  { to: '/app/payments', label: 'Payments', icon: Wallet },
  { to: '/app/deliverables', label: 'Deliverables', icon: PackageCheck },
  { to: '/app/reports', label: 'Reports', icon: BarChart3 },
];

function ProfileMenu() {
  const a = useAccount();
  const { signOut } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('mousedown', h); addEventListener('keydown', k);
    return () => { removeEventListener('mousedown', h); removeEventListener('keydown', k); };
  }, [open]);
  const name = a?.creator.name || a?.creator.email || '';
  const items = [
    { label: 'Brands', icon: Users, go: () => nav('/app/brands') },
    { label: 'Manage templates', icon: Copy, go: () => nav('/app/templates') },
    { label: 'Settings', icon: Settings, go: () => nav('/app/settings') },
  ];
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label="Account menu" onClick={() => setOpen(o => !o)} className="flex items-center rounded-full p-0.5 cursor-pointer hover:bg-black/5">
        <Avatar name={name || 'You'} />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-12 z-40 w-64 rounded-2xl bg-white p-2 shadow-[var(--shadow-pop)] animate-[sheet-in_180ms_var(--ease-out-quint)]">
          <div className="flex flex-col gap-0.5 px-3 py-2.5">
            <span className="text-sm font-bold">{a?.creator.name || 'Your account'}</span>
            <span className="text-xs font-medium text-muted">{a?.creator.handle ? '@' + a.creator.handle : a?.creator.email}</span>
          </div>
          <div className="my-1 h-px bg-line" />
          {items.map(i => (
            <button key={i.label} role="menuitem" type="button" onClick={i.go} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold hover:bg-subtle cursor-pointer">
              <i.icon size={16} />{i.label}
            </button>
          ))}
          <div className="my-1 h-px bg-line" />
          <button role="menuitem" type="button" onClick={async () => { await signOut(); nav('/login', { replace: true }); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-danger hover:bg-danger-tint cursor-pointer">
            <LogOut size={16} />Log out
          </button>
        </div>
      )}
    </div>
  );
}

export function AppShell() {
  const loc = useLocation();
  const nav = useNavigate();
  useEffect(() => { api.deals.sweep(); }, [loc.pathname]);
  const isActive = (n: (typeof NAV)[number]) => (n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to) || !!n.also?.some(p => loc.pathname.startsWith(p)));
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="no-print sticky top-0 z-30 bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center gap-4 px-4 lg:px-8">
          <NavLink to="/app" aria-label="AlgoStudio home" className="flex-none"><span className="lg:hidden"><Logo size={22} /></span><span className="hidden lg:inline"><Logo size={26} /></span></NavLink>
          <nav aria-label="Main" className="mx-auto hidden lg:flex items-center gap-1 rounded-full bg-[#E6E7E7] p-1">
            {NAV.map(n => {
              const on = isActive(n);
              return (
                <NavLink key={n.to} to={n.to} end={n.end} aria-current={on ? 'page' : undefined}
                  className={cx('h-9 rounded-full px-4 inline-flex items-center text-[13px] font-semibold transition-colors', on ? 'bg-[#111111] text-white hover:text-white' : 'text-ink-2 hover:bg-black/5 hover:text-ink-2')}>
                  {n.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="ml-auto lg:ml-0 flex items-center gap-2">
            <button type="button" aria-label="Create deal" onClick={() => nav('/app/deals/new')} className="hidden lg:grid size-10 place-items-center rounded-full bg-brand text-white hover:bg-brand-hover cursor-pointer transition-transform active:scale-95"><Plus size={20} /></button>
            <ProfileMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 pb-28 lg:px-8 lg:pb-16">
        <Outlet />
      </main>

      {/* Mobile web: bottom tab bar + create button */}
      <button type="button" aria-label="Create deal" onClick={() => nav('/app/deals/new')} className="no-print lg:hidden fixed right-4 bottom-[84px] z-30 grid size-14 place-items-center rounded-full bg-brand text-white shadow-[0_8px_24px_-6px_rgba(10,127,85,.5)] active:scale-95 transition-transform"><Plus size={24} /></button>
      <nav aria-label="Main" className="no-print lg:hidden fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-white pb-[env(safe-area-inset-bottom)]">
        {NAV.map(n => {
          const on = isActive(n);
          return (
            <NavLink key={n.to} to={n.to} end={n.end} aria-current={on ? 'page' : undefined} className={cx('flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold', on ? 'text-ink' : 'text-muted')}>
              <n.icon size={20} strokeWidth={on ? 2.4 : 2} />{n.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
