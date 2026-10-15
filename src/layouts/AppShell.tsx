import { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Home, Handshake, Wallet, PackageCheck, BarChart3 } from 'lucide-react';
import { api } from '@/api';
import { Logo } from '@/components/ui';
import { cx } from '@/lib/format';
import { NotificationsMenu } from './shell/NotificationsMenu';
import { ProfileMenu } from './shell/ProfileMenu';
import { SearchBox } from './shell/SearchBox';
import { TopNav, type NavItem } from './shell/TopNav';

// Max 5 top-level items. Brands lives as a tab inside Deals; Templates and Settings live in the profile menu.
export const NAV: NavItem[] = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/app/deals', label: 'Deals', icon: Handshake, also: ['/app/brands'] },
  { to: '/app/payments', label: 'Payments', icon: Wallet },
  { to: '/app/deliverables', label: 'Deliverables', icon: PackageCheck },
  { to: '/app/reports', label: 'Reports', icon: BarChart3 },
];

export function AppShell() {
  const loc = useLocation();
  const nav = useNavigate();
  useEffect(() => { api.deals.sweep(); }, [loc.pathname]);
  const isActive = (n: NavItem) => (n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to) || !!n.also?.some(p => loc.pathname.startsWith(p)));
  return (
    <div className="min-h-dvh bg-canvas">
      {/* Phone and tablet: the compact sticky header (logo + account). */}
      <header className="no-print sticky top-0 z-30 bg-canvas/90 backdrop-blur lg:hidden">
        <div className="mx-auto flex h-[72px] max-w-[1680px] items-center gap-4 px-4">
          <NavLink to="/app" aria-label="AlgoStudio home" className="flex-none"><Logo size={22} /></NavLink>
          <div className="ml-auto flex items-center gap-2"><ProfileMenu /></div>
        </div>
      </header>

      {/* Desktop: logo, nav pill with the "+" menu, search, bell and the account pill. Scrolls away with the page. */}
      <header className="no-print relative z-30 hidden lg:block">
        <div className="mx-auto grid max-w-[1680px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-8 pt-6">
          <div className="flex items-center">
            <NavLink to="/app" aria-label="AlgoStudio home" className="relative top-[0.5px] inline-flex flex-none items-center gap-2.5">
              <img src="/assets/logo-mark.png" alt="" className="w-[26px]" />
              <span className="font-display text-[26px] font-semibold leading-none tracking-[-0.02em] text-[#111111] whitespace-nowrap">AlgoStudio</span>
            </NavLink>
          </div>
          <TopNav items={NAV} isActive={isActive} />
          <div className="flex items-center justify-end gap-2">
            <SearchBox />
            <NotificationsMenu />
            <ProfileMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1680px] px-4 pb-28 lg:px-8 lg:pb-16">
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
