import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { X } from 'lucide-react';
import { cx } from '@/lib/format';

// ---------- Button
// Rule: one green primary per screen. Everything else is secondary (white + grey outline).
type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'dark';
type Size = 'sm' | 'md' | 'lg';
const base = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background,box-shadow,transform] duration-150 active:scale-[.97] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand cursor-pointer';
const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-hover hover:text-white',
  secondary: 'bg-white text-ink shadow-[inset_0_0_0_1px_var(--color-line-2)] hover:bg-subtle hover:text-ink',
  danger: 'bg-danger text-white hover:bg-[#962016] hover:text-white',
  ghost: 'bg-transparent text-ink hover:bg-black/5 hover:text-ink',
  dark: 'bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.14)] hover:bg-white/15 hover:text-white',
};
const sizes: Record<Size, string> = { sm: 'h-8 px-3.5 text-xs', md: 'h-10 px-4 text-[13px]', lg: 'h-12 px-6 text-[15px]' };
export const btn = (v: Variant = 'secondary', s: Size = 'md', extra?: string) => cx(base, variants[v], sizes[s], extra);

export function Button({ variant = 'secondary', size = 'md', className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button type="button" className={btn(variant, size, className)} {...p} />;
}
export function LinkButton({ variant = 'secondary', size = 'md', className, ...p }: LinkProps & { variant?: Variant; size?: Size }) {
  return <Link className={btn(variant, size, className)} {...p} />;
}

// ---------- Pill (all pairs ≥ 4.5:1)
type Tone = 'neutral' | 'info' | 'positive' | 'warning' | 'critical';
const tones: Record<Tone, string> = {
  neutral: 'bg-[#ECEDEE] text-[#3A3A40]',
  info: 'bg-info-tint text-info',
  positive: 'bg-brand-tint text-brand-ink',
  warning: 'bg-warn-tint text-warn',
  critical: 'bg-danger-tint text-danger',
};
export function Pill({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cx('inline-flex items-center h-6 px-2.5 rounded-full text-xs font-semibold whitespace-nowrap', tones[tone], className)}>{children}</span>;
}

// ---------- Card
export function Card({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return <section aria-label={label} className={cx('rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]', className)}>{children}</section>;
}

export function Label({ children }: { children: ReactNode }) {
  return <span className="text-[11px] font-semibold uppercase tracking-[.05em] text-muted">{children}</span>;
}

// ---------- Fields
const inputCls = 'w-full rounded-xl bg-white px-3.5 text-sm font-medium text-ink shadow-[inset_0_0_0_1px_var(--color-line)] outline-none transition-shadow focus:shadow-[inset_0_0_0_1.5px_var(--color-brand)] placeholder:text-[#8A8A92]';
export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-[#3A3A40]">{label}</label>
      {children(id)}
      {error ? <span className="text-xs font-semibold text-danger">{error}</span> : hint ? <span className="text-xs font-medium text-muted">{hint}</span> : null}
    </div>
  );
}
export const Input = (p: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={cx(inputCls, 'h-11', p.className)} />;
export const Textarea = (p: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea rows={4} {...p} className={cx(inputCls, 'py-3 leading-relaxed resize-y', p.className)} />;
export const Select = (p: SelectHTMLAttributes<HTMLSelectElement>) => <select {...p} className={cx(inputCls, 'h-11 pr-8', p.className)} />;

// ---------- Segmented control
export function Segmented<T extends string | number>({ value, options, onChange, label, size = 'md' }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string; size?: 'sm' | 'md' }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex gap-0.5 rounded-full bg-[#E2E3E4] p-[3px]">
      {options.map(o => {
        const on = o.value === value;
        return (
          <button key={String(o.value)} type="button" role="radio" aria-checked={on} onClick={() => onChange(o.value)}
            className={cx('rounded-full font-semibold transition-colors cursor-pointer', size === 'sm' ? 'h-7 px-3 text-xs' : 'h-8 px-4 text-[13px]', on ? 'bg-white text-ink shadow-[0_1px_3px_rgba(0,0,0,.08)]' : 'text-muted hover:text-ink')}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Sheet: bottom sheet below 1024px, centred dialog at 1024+
export function Sheet({ open, onClose, title, children, footer, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    addEventListener('keydown', k);
    ref.current?.querySelector<HTMLElement>('input,textarea,select,button:not([data-close])')?.focus();
    return () => { removeEventListener('keydown', k); prev?.focus(); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
      <div className="absolute inset-0 bg-black/35 animate-[fade-in_160ms_ease]" onClick={onClose} />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title}
        className={cx('relative w-full max-h-[92vh] overflow-auto bg-white rounded-t-3xl lg:rounded-3xl shadow-[var(--shadow-pop)] animate-[sheet-in_260ms_var(--ease-out-quint)]', wide ? 'lg:max-w-[720px]' : 'lg:max-w-[480px]')}>
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-white px-6 pt-5 pb-3">
          <h2 className="m-0 text-lg font-bold">{title}</h2>
          <button data-close type="button" aria-label="Close" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-black/5 cursor-pointer"><X size={18} /></button>
        </div>
        <div className="px-6 pb-6 flex flex-col gap-4">{children}</div>
        {footer && <div className="sticky bottom-0 flex flex-wrap justify-end gap-2 border-t border-line bg-white px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

// ---------- Toast
const ToastCtx = createContext<(msg: string) => void>(() => {});
export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<{ t: string; k: number } | null>(null);
  const show = useCallback((t: string) => setMsg({ t, k: Date.now() }), []);
  useEffect(() => { if (!msg) return; const id = setTimeout(() => setMsg(null), 3200); return () => clearTimeout(id); }, [msg]);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div aria-live="polite" className="no-print">
        {msg && <div key={msg.k} className="fixed bottom-24 lg:bottom-8 left-1/2 z-[60] max-w-[90vw] rounded-full bg-ink px-5 py-3 text-[13px] font-semibold text-white shadow-[var(--shadow-pop)] animate-[toast-in_220ms_var(--ease-out-quint)]">{msg.t}</div>}
      </div>
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);

// ---------- Misc
export function Empty({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
      <span className="text-[15px] font-bold">{title}</span>
      {body && <span className="max-w-sm text-sm font-medium text-muted text-pretty">{body}</span>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function Avatar({ name, size = 36, dark }: { name: string; size?: number; dark?: boolean }) {
  const ini = name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return <span aria-hidden="true" style={{ width: size, height: size, fontSize: size * 0.36 }} className={cx('inline-grid flex-none place-items-center rounded-full font-bold', dark ? 'bg-deep-2 text-mint-soft' : 'bg-[#E2E3E4] text-ink')}>{ini}</span>;
}

export function Logo({ size = 26, white }: { size?: number; white?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <img src={white ? '/assets/logo-mark-white.png' : '/assets/logo-mark.png'} alt="" style={{ width: size * 0.92 }} />
      <span className={cx('font-display font-semibold leading-none tracking-[-0.02em] whitespace-nowrap', white ? 'text-white' : 'text-[#111111]')} style={{ fontSize: size }}>AlgoStudio</span>
    </span>
  );
}
