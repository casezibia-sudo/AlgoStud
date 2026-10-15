import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Handshake, Plus } from 'lucide-react';
import { notifyLater } from '@/api/safe';
import { panel, useDismiss } from './shared';

/** The green "+" in the nav: New deal, Add expense. */
export function PlusMenu() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(open, () => setOpen(false), ref);
  const items = [
    { label: 'New deal', hint: 'Paste a DM or email to draft terms', icon: Handshake, go: () => nav('/app/deals/new') },
    // Expenses are not built yet: this shows the standard "arrives in a later update, nothing was saved" notice.
    { label: 'Add expense', hint: 'Props, travel, tools, helpers', icon: DollarSign, go: () => notifyLater('Adding expenses') },
  ];
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-label="Create" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(o => !o)}
        className="grid size-[34px] place-items-center rounded-[10px] bg-brand text-white shadow-[0_6px_14px_-4px_rgba(10,127,85,.55)] hover:bg-brand-hover cursor-pointer transition-transform duration-150 active:scale-95">
        <Plus size={18} />
      </button>
      {open && (
        <div role="menu" className={`${panel} right-0 top-[44px] w-[240px] p-1.5`}>
          {items.map(i => (
            <button key={i.label} role="menuitem" type="button" onClick={() => { setOpen(false); i.go(); }} className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left hover:bg-subtle cursor-pointer">
              <span className="grid size-8 flex-none place-items-center rounded-lg bg-[#ECEDEE] text-ink-2"><i.icon size={16} aria-hidden="true" /></span>
              <span className="flex flex-col"><span className="text-sm font-semibold">{i.label}</span><span className="text-xs font-medium leading-snug text-muted">{i.hint}</span></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
