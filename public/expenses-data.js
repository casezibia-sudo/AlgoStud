// AlgoStudio shared money data: expenses store + helpers used by every screen.
// Loaded with <script src="expenses-data.js"> in each screen's helmet. Exposes window.ASX.
(function () {
  if (window.ASX) return;
  const KEY = 'asx-expenses-v1', LASTCAT = 'asx-last-category';
  const CURRENT_MONTH = '2026-10'; // the app's "today" is in October 2026
  const TODAY = '2026-10-12';

  const CATEGORIES = [
    { id: 'props', label: 'Props and products', c: '#2E2E33' },
    { id: 'tools', label: 'Editing tools and apps', c: '#55555C' },
    { id: 'shipping', label: 'Shipping', c: '#7A7A82' },
    { id: 'travel', label: 'Travel', c: '#9C9CA4' },
    { id: 'helpers', label: 'Helpers and freelancers', c: '#B9BAC0' },
    { id: 'equipment', label: 'Equipment', c: '#D2D3D7' },
    { id: 'other', label: 'Other', c: '#E6E7E9' },
  ];

  // Deals expenses can be linked to (same ids as the Deals page)
  const DEALS = [
    { id: 'hc', name: 'Morning ritual reel series', brand: 'Hearth Coffee', amount: 45000 },
    { id: 'gs', name: 'Monsoon skincare routine reel', brand: 'GlowSkin India', amount: 32000 },
    { id: 'mh', name: 'Cold-pressed hair oil unboxing', brand: 'Mitti Naturals', amount: 18500 },
    { id: 'md', name: 'Diwali gifting reel', brand: 'Mitti Naturals', amount: 22000 },
    { id: 'kl', name: 'Festive home décor carousel and 2 stories', brand: 'Kora Living', amount: 60000 },
    { id: 'ts', name: 'Saree draping tutorial reel', brand: 'Tara Studio', amount: 25000 },
    { id: 'nb', name: 'Travel bottle review', brand: 'Nomad Bottles', amount: 12000 },
  ];

  // Money received (income side), by date
  const RECEIVED = [
    { date: '2026-08-08', amount: 64000, brand: 'Bloom Botanics' },
    { date: '2026-08-28', amount: 16000, brand: 'Lumen Skincare' },
    { date: '2026-09-05', amount: 14000, brand: 'Kaapi Co' },
    { date: '2026-09-18', amount: 20000, brand: 'Bloom Botanics' },
    { date: '2026-09-24', amount: 22000, brand: 'Nila Foods' },
    { date: '2026-10-02', amount: 17000, brand: 'Saffron Tea' },
    { date: '2026-10-05', amount: 18000, brand: 'Veda Wellness' },
  ];

  const SEED = [
    { id: 'e1', date: '2026-10-01', amount: 3999, category: 'tools', note: 'CapCut Pro, yearly plan', dealId: null, receipt: 'capcut-invoice.pdf', taxDeductible: true },
    { id: 'e2', date: '2026-10-02', amount: 1850, category: 'props', note: 'Coffee beans and mugs for shoot', dealId: 'hc', receipt: 'beans-bill.jpg', taxDeductible: true },
    { id: 'e3', date: '2026-10-03', amount: 2499, category: 'equipment', note: 'Ring light stand', dealId: null, receipt: 'amazon-order.pdf', taxDeductible: true },
    { id: 'e4', date: '2026-10-04', amount: 340, category: 'shipping', note: 'Courier: return hair oil samples', dealId: 'mh', receipt: null, taxDeductible: true },
    { id: 'e5', date: '2026-10-05', amount: 420, category: 'travel', note: 'Auto to Bandra studio', dealId: 'gs', receipt: null, taxDeductible: false },
    { id: 'e6', date: '2026-10-06', amount: 1200, category: 'props', note: 'Towels and skincare props', dealId: 'gs', receipt: 'props-bill.jpg', taxDeductible: true },
    { id: 'e7', date: '2026-10-07', amount: 2500, category: 'helpers', note: 'Shoot assistant, half day', dealId: 'md', receipt: null, taxDeductible: true },
    { id: 'e8', date: '2026-10-08', amount: 1500, category: 'props', note: 'Saree rental for tutorial', dealId: 'ts', receipt: 'rental-slip.jpg', taxDeductible: true },
    { id: 'e9', date: '2026-10-09', amount: 3200, category: 'props', note: 'Décor props, Crawford Market', dealId: 'kl', receipt: 'decor-bill.jpg', taxDeductible: true },
    { id: 'e10', date: '2026-10-10', amount: 4000, category: 'helpers', note: 'Freelance editor for carousel', dealId: 'kl', receipt: 'editor-invoice.pdf', taxDeductible: true },
    { id: 'e11', date: '2026-10-11', amount: 499, category: 'tools', note: 'Canva Pro, monthly', dealId: null, receipt: 'canva-receipt.pdf', taxDeductible: true },
    { id: 'e12', date: '2026-10-12', amount: 610, category: 'travel', note: 'Cab to Andheri for bottle shoot', dealId: 'nb', receipt: null, taxDeductible: false },
    { id: 'e13', date: '2026-09-11', amount: 499, category: 'tools', note: 'Canva Pro, monthly', dealId: null, receipt: 'canva-receipt.pdf', taxDeductible: true },
    { id: 'e14', date: '2026-09-14', amount: 1299, category: 'equipment', note: 'Phone tripod', dealId: null, receipt: 'tripod-bill.jpg', taxDeductible: true },
  ];

  let list;
  try { list = JSON.parse(localStorage.getItem(KEY)) || SEED.slice(); } catch (e) { list = SEED.slice(); }
  const subs = new Set();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} subs.forEach(f => { try { f(); } catch (e) {} }); };

  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const monthOf = d => d.slice(0, 7);
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmtDate = d => { const [y, m, dd] = d.split('-'); return +dd + ' ' + MONTHS[+m - 1]; };
  const monthLabel = m => { const [y, mm] = m.split('-'); return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][+mm - 1] + ' ' + y; };
  const cat = id => CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
  const deal = id => DEALS.find(d => d.id === id) || null;
  const sum = arr => arr.reduce((a, x) => a + x.amount, 0);
  const inMonth = (arr, m) => m ? arr.filter(x => monthOf(x.date) === m) : arr;

  const ASX = {
    CATEGORIES, DEALS, CURRENT_MONTH, TODAY,
    inr, fmtDate, monthLabel, cat, deal,
    list: () => list.slice().sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)),
    get: id => list.find(e => e.id === id) || null,
    add(e) { const x = { id: 'e' + Date.now().toString(36), date: TODAY, dealId: null, receipt: null, taxDeductible: true, note: '', ...e }; list.push(x); this.setLastCategory(x.category); save(); return x; },
    update(id, patch) { list = list.map(e => e.id === id ? { ...e, ...patch } : e); save(); },
    remove(id) { const e = this.get(id); list = list.filter(x => x.id !== id); save(); return e; },
    restore(e) { if (e && !this.get(e.id)) { list.push(e); save(); } },
    reset() { list = SEED.slice(); save(); },
    subscribe(f) { subs.add(f); return () => subs.delete(f); },
    lastCategory: () => { try { return localStorage.getItem(LASTCAT) || 'props'; } catch (e) { return 'props'; } },
    setLastCategory(c) { try { localStorage.setItem(LASTCAT, c); } catch (e) {} },
    months: () => [...new Set(list.map(e => monthOf(e.date)).concat(RECEIVED.map(r => monthOf(r.date))))].sort().reverse(),
    // Derived numbers: every screen uses these, nothing is hardcoded
    spent: m => sum(inMonth(list, m)),
    received: m => sum(inMonth(RECEIVED, m)),
    profit(m) { return this.received(m) - this.spent(m); },
    byCategory(m) { const arr = inMonth(list, m), tot = sum(arr) || 1; return CATEGORIES.map(c => { const a = sum(arr.filter(e => e.category === c.id)); return { ...c, amount: a, pct: Math.round(a / tot * 100) }; }).filter(c => c.amount > 0).sort((a, b) => b.amount - a.amount); },
    dealCosts: id => list.filter(e => e.dealId === id).sort((a, b) => a.date.localeCompare(b.date)),
    dealSpent(id) { return sum(this.dealCosts(id)); },
    dealProfit(id) { const d = deal(id); return d ? d.amount - this.dealSpent(id) : 0; },
    byMonth(months) { return months.map(m => ({ m, received: this.received(m), spent: this.spent(m), profit: this.profit(m) })); },
    csvRows() {
      const rows = [['Type', 'Date', 'Description', 'Category', 'Amount (INR)', 'Linked deal', 'Receipt', 'Tax-deductible']];
      RECEIVED.forEach(r => rows.push(['Income', r.date, 'Payment from ' + r.brand, '', r.amount, '', '', '']));
      this.list().forEach(e => { const d = deal(e.dealId); rows.push(['Expense', e.date, e.note, cat(e.category).label, -e.amount, d ? d.brand + ' · ' + d.name : '', e.receipt ? 'Yes' : 'No', e.taxDeductible ? 'Yes' : 'No']); });
      return rows;
    },
    csv() { return this.csvRows().map(r => r.map(v => /[",\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : v).join(',')).join('\n'); },
    openQuickAdd(opts) { window.dispatchEvent(new CustomEvent('asx-open', { detail: opts || {} })); },
  };
  window.ASX = ASX;
})();
