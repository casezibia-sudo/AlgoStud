// Tables and storage that belong to features not built yet. This is a fixed list, on purpose:
// a failed request on any OTHER table (deals, deal_terms, events, templates, profiles, settings) is a real
// error and stays loud. Requests to these are never sent, and nothing may pretend to save into them.
// When a feature gets its table, delete its name here.
export const UNBUILT = [
  'expenses', 'receipts',
  'links', 'answers', 'verifications', 'submissions', 'payments', 'reminders',
] as const;

const set = new Set<string>(UNBUILT);
export const isUnbuilt = (table: string) => set.has(table);

const warned = new Set<string>();
/** One quiet console line per table per page load. */
export function warnOnce(table: string) {
  if (warned.has(table)) return;
  warned.add(table);
  console.warn(`[algostudio] "${table}" is not built yet: skipping requests to it.`);
}

export const LATER = (what: string) => `${what} arrives in a later update.`;

let timer: ReturnType<typeof setTimeout> | undefined;
/** A visible notice for code outside React (the expenses store). Nothing is saved when this shows. */
export function notifyLater(what: string) {
  const msg = LATER(what);
  console.warn('[algostudio]', msg);
  if (typeof document === 'undefined') return;
  let el = document.getElementById('as-later-notice');
  if (!el) {
    el = document.createElement('div');
    el.id = 'as-later-notice';
    el.setAttribute('role', 'status');
    el.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99999;max-width:90vw;padding:12px 18px;border-radius:12px;background:#111;color:#fff;font:600 14px/1.3 system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25)';
    document.body.appendChild(el);
  }
  el.textContent = msg + ' Nothing was saved.';
  el.style.display = 'block';
  clearTimeout(timer);
  timer = setTimeout(() => { if (el) el.style.display = 'none'; }, 4000);
}
