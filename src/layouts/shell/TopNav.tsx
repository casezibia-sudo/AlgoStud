import type { ComponentType } from 'react';
import { NavLink } from 'react-router-dom';
import { cx } from '@/lib/format';
import { PlusMenu } from './PlusMenu';

export interface NavItem { to: string; label: string; icon: ComponentType<{ size?: number; strokeWidth?: number }>; end?: boolean; also?: string[] }

/** The raised nav pill: five tabs and the "+" menu. The active tab is black with a small green bar under it. */
export function TopNav({ items, isActive }: { items: NavItem[]; isActive: (n: NavItem) => boolean }) {
  return (
    <div className="inline-flex items-center rounded-2xl bg-[#FAFAFA] p-1 shadow-[0_0_0_1px_rgba(0,0,0,.05),0_6px_16px_-8px_rgba(0,0,0,.22)]">
      <nav aria-label="Main" className="flex items-center gap-1">
        {items.map(n => {
          const on = isActive(n);
          return (
            <NavLink key={n.to} to={n.to} end={n.end} aria-current={on ? 'page' : undefined}
              className={cx('relative inline-flex h-[34px] items-center rounded-[10px] px-3.5 text-[13px] font-medium transition-colors',
                on ? 'bg-[#111111] text-white shadow-[0_0_0_1px_#000,inset_0_1px_0_rgba(255,255,255,.18),0_4px_10px_-4px_rgba(0,0,0,.4)] hover:text-white' : 'text-ink-2 hover:bg-black/5 hover:text-ink-2')}>
              {n.label}
              {on && <span aria-hidden="true" className="absolute -bottom-[4px] left-1/2 h-[2.5px] w-[18px] -translate-x-1/2 rounded-full bg-brand" />}
            </NavLink>
          );
        })}
      </nav>
      <span aria-hidden="true" className="mx-[7px] h-5 w-px bg-black/10" />
      <PlusMenu />
    </div>
  );
}
