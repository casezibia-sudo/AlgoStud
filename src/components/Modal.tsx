import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
// Open modals, oldest first. Only the top one reacts to Escape and Tab, so a confirm dialog on top of a form
// closes first and keeps keyboard focus to itself.
const stack: symbol[] = [];

/**
 * A modal dialog that keeps keyboard focus inside while it is open:
 *  - Tab and Shift+Tab loop within the dialog; focus can't land on the page behind it
 *  - Escape and a click on the dim backdrop call onRequestClose (the caller decides whether to ask first)
 *  - the page behind doesn't scroll, and focus goes back to what opened the dialog when it closes
 */
export function Modal({ onRequestClose, labelledBy, initialFocus, className, children }: {
  onRequestClose: () => void; labelledBy: string; initialFocus?: RefObject<HTMLElement | null>; className?: string; children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const close = useRef(onRequestClose);
  close.current = onRequestClose;

  useEffect(() => {
    const id = Symbol('modal'), el = box.current!, opener = document.activeElement as HTMLElement | null;
    stack.push(id);
    const root = document.getElementById('root');
    const prevOverflow = document.body.style.overflow;
    if (stack.length === 1) { document.body.style.overflow = 'hidden'; if (root) root.inert = true; }
    const focusables = () => [...el.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(n => n.offsetParent !== null || n === document.activeElement);
    (initialFocus?.current || focusables()[0] || el).focus();

    const top = () => stack[stack.length - 1] === id;
    const onKey = (e: KeyboardEvent) => {
      if (!top()) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close.current(); return; }
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (!f.length) { e.preventDefault(); el.focus(); return; }
      const first = f[0], last = f[f.length - 1], active = document.activeElement as HTMLElement | null;
      if (!el.contains(active)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    };
    const onFocusIn = (e: FocusEvent) => { if (top() && !el.contains(e.target as Node)) (focusables()[0] || el).focus(); };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('focusin', onFocusIn);
      stack.splice(stack.indexOf(id), 1);
      if (stack.length === 0) { document.body.style.overflow = prevOverflow; if (root) root.inert = false; }
      if (opener && document.contains(opener)) opener.focus();
    };
  // The dialog's contents may change while it is open; focus is only set once.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // A click only closes when it both starts and ends on the backdrop (so dragging a text selection out of a field doesn't).
  const down = useRef(false);
  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center p-4 lg:p-8">
      <div className="absolute inset-0 bg-black/50 animate-[fade-in_160ms_ease]" aria-hidden="true"
        onMouseDown={() => { down.current = true; }} onMouseUp={() => { if (down.current) close.current(); down.current = false; }} />
      <div ref={box} role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1} className={`relative outline-none animate-[sheet-in_220ms_var(--ease-out-quint)] ${className || ''}`}>{children}</div>
    </div>,
    document.body,
  );
}
