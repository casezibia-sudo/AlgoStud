import { useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { circleBtn, panel, useDismiss } from './shared';

/** Header search: type and press Enter to search deals (/app/deals?q=...). */
export function SearchBox() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(open, () => setOpen(false), ref);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = q.trim();
    nav(v ? `/app/deals?q=${encodeURIComponent(v)}` : '/app/deals');
    setOpen(false); setQ('');
  };
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-label="Search deals" aria-expanded={open} onClick={() => setOpen(o => !o)} className={circleBtn}><Search size={16} /></button>
      {open && (
        <form onSubmit={submit} role="search" className={`${panel} right-0 top-[46px] w-[300px] p-2`}>
          <label className="flex h-11 items-center gap-2.5 rounded-xl bg-subtle px-3 shadow-[inset_0_0_0_1px_var(--color-line)] focus-within:shadow-[inset_0_0_0_1.5px_var(--color-brand)]">
            <Search size={15} className="text-muted" aria-hidden="true" />
            <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search deals" aria-label="Search deals" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[#8A8A92]" />
          </label>
          <p className="m-0 px-1 pt-2 pb-1 text-xs font-medium text-muted">Press Enter to search by brand, deliverable or contact.</p>
        </form>
      )}
    </div>
  );
}
