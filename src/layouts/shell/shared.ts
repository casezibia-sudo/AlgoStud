import { useEffect, type RefObject } from 'react';

/** The round 38px header buttons (search, bell). */
export const circleBtn = 'relative grid size-[38px] flex-none place-items-center rounded-full bg-[#FAFAFA] text-ink-2 shadow-[0_0_0_1px_rgba(0,0,0,.07),0_1px_2px_rgba(0,0,0,.05)] hover:bg-white cursor-pointer transition-[background,transform] duration-150 active:scale-95';
/** Dropdown panels. */
export const panel = 'absolute z-40 rounded-2xl bg-white shadow-[var(--shadow-pop)] animate-[sheet-in_180ms_var(--ease-out-quint)]';

/** Closes a popover on an outside click or Escape. */
export function useDismiss(open: boolean, close: () => void, ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) close(); };
    // Escape from inside the panel would otherwise leave focus on the page body: hand it back to the trigger.
    const k = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const t = ref.current?.querySelector<HTMLElement>('[aria-expanded]');
      const inside = !!ref.current?.contains(document.activeElement) && document.activeElement !== t;
      close();
      if (inside) t?.focus();
    };
    addEventListener('mousedown', h); addEventListener('keydown', k);
    return () => { removeEventListener('mousedown', h); removeEventListener('keydown', k); };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
}
