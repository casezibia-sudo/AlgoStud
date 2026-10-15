import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Bell, CheckCircle2, Clock, Pencil, Send } from 'lucide-react';
import { useAccount, type DealEvent, type Tone } from '@/api';
import { istDate, todayISO } from '@/lib/format';
import { circleBtn, panel, useDismiss } from './shared';

const SEEN_KEY = 'as.events.seen';
const readSeen = () => { try { return localStorage.getItem(SEEN_KEY) || ''; } catch { return ''; } };
const writeSeen = (iso: string) => { try { localStorage.setItem(SEEN_KEY, iso); } catch { /* private mode: the dot just comes back */ } };

const TONE: Record<Tone, { icon: typeof Clock; tile: string }> = {
  positive: { icon: CheckCircle2, tile: 'bg-brand-tint text-brand-ink' },
  warning: { icon: Pencil, tile: 'bg-warn-tint text-warn' },
  info: { icon: Send, tile: 'bg-info-tint text-info' },
  critical: { icon: AlertTriangle, tile: 'bg-danger-tint text-danger' },
  neutral: { icon: Clock, tile: 'bg-[#ECEDEE] text-[#3A3A40]' },
};
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const hhmm = (iso: string) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(iso));
function when(iso: string) {
  const d = istDate(iso), today = todayISO(), yest = istDate(Date.parse(today) - 864e5);
  return `${d === today ? 'Today' : d === yest ? 'Yesterday' : `${+d.slice(8)} ${MON[+d.slice(5, 7) - 1]}`}, ${hhmm(iso)}`;
}

/** Read-only list of the latest deal events. The dot counts only events NOT created by the creator, and only ones not yet seen. */
export function NotificationsMenu() {
  const a = useAccount();
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(readSeen);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(open, () => setOpen(false), ref);
  const events = useMemo(() => [...(a?.events || [])].sort((x, y) => y.at.localeCompare(x.at)).slice(0, 8), [a?.events]);
  const unread = (a?.events || []).some((e: DealEvent) => e.actor !== 'creator' && e.at > seen);
  const toggle = () => {
    if (!open) { const now = new Date().toISOString(); writeSeen(now); setSeen(now); }
    setOpen(o => !o);
  };
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-label={unread ? 'Notifications, new activity' : 'Notifications'} aria-expanded={open} onClick={toggle} className={circleBtn}>
        <Bell size={16} />
        {unread && <span className="absolute right-[11px] top-2.5 size-1.5 rounded-full bg-[#F06A2A] shadow-[0_0_0_1.5px_#FAFAFA]" />}
      </button>
      {open && (
        <div className={`${panel} right-0 top-[46px] w-[340px] p-2`}>
          <div className="px-3 pt-2.5 pb-2 text-sm font-bold">Recent activity</div>
          {events.length === 0 ? (
            <p className="m-0 px-3 pb-4 pt-1 text-[13px] font-medium text-muted">Nothing yet. Activity on your deals shows up here.</p>
          ) : (
            <ul className="m-0 flex max-h-[420px] list-none flex-col overflow-y-auto p-0">
              {events.map(e => {
                const t = TONE[e.tone] || TONE.neutral, Icon = t.icon, deal = a?.deals.find(d => d.id === e.dealId);
                return (
                  <li key={e.id}>
                    <Link to={`/app/deals/${e.dealId}`} onClick={() => setOpen(false)} className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-ink hover:bg-subtle hover:text-ink">
                      <span className={`grid size-9 flex-none place-items-center rounded-[10px] ${t.tile}`}><Icon size={16} aria-hidden="true" /></span>
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="text-[13px] font-semibold leading-snug">{e.title}</span>
                        <span className="truncate text-xs font-medium text-muted">{deal ? `${deal.brand} · ` : ''}{when(e.at)}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
