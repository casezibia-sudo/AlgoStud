const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DAY = 864e5;

export const inr = (n: number) => '₹ ' + Number(n).toLocaleString('en-IN');

export const fmtDate = (iso: string | number) => {
  const d = new Date(iso);
  return String(d.getDate()).padStart(2, '0') + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear();
};

export const fmtShort = (iso: string | number) => {
  const d = new Date(iso);
  return String(d.getDate()).padStart(2, '0') + ' ' + MON[d.getMonth()];
};

export const fmtTime = (iso: string | number) => {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
    .formatToParts(new Date(iso))
    .reduce<Record<string, string>>((o, x) => ((o[x.type] = x.value), o), {});
  return `${p.day} ${p.month} ${p.year}, ${p.hour}:${p.minute} IST`;
};

export const mask = (e: string) => {
  e = String(e || '');
  if (e.includes('•')) return e;
  const [u, dm] = e.split('@');
  return dm ? (u[0] || '') + '•••@' + dm : e;
};

export const firstName = (s?: string) => (s || 'The brand').split(' ')[0];
export const initials = (s: string) => s.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
/** Today's date in India (YYYY-MM-DD), not UTC: between 00:00 and 05:30 IST the UTC date is still yesterday. */
const IST_DATE = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' });
export const istDate = (t: Date | string | number) => IST_DATE.format(new Date(t));
export const todayISO = () => istDate(Date.now());
export const daysFrom = (iso: string) => Math.round((Date.parse(iso) - Date.parse(todayISO())) / DAY);
export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
