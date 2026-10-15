import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

/** The green "+" in the nav: straight to the Create Deal pop-up. */
export function PlusMenu() {
  const nav = useNavigate();
  return (
    <button type="button" aria-label="New deal" title="New deal" onClick={() => nav('/app/deals/new')}
      className="grid size-[34px] place-items-center rounded-[10px] bg-brand text-white shadow-[0_6px_14px_-4px_rgba(10,127,85,.55)] hover:bg-brand-hover cursor-pointer transition-transform duration-150 active:scale-95">
      <Plus size={18} />
    </button>
  );
}
