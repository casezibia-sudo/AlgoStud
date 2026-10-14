// Public brand endpoints for /d/:token and /a/:token. Brands have no account,
// so every action runs here with the service role and is scoped by the link token.
// Deploy: supabase functions deploy brand --no-verify-jwt
import { createClient } from 'npm:@supabase/supabase-js@2';

const DAY = 864e5, MIN = 6e4, CODE_TTL = 10 * MIN, CODE_TRIES = 3;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = (v: string | number) => { const d = new Date(v); return String(d.getDate()).padStart(2, '0') + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear(); };
const mask = (e: string) => { e = String(e || ''); if (e.includes('•')) return e; const [u, dm] = e.split('@'); return dm ? (u[0] || '') + '•••@' + dm : e; };
const firstName = (s?: string) => (s || 'The brand').split(' ')[0];
const iso = (ms = 0) => new Date(Date.now() + ms).toISOString();
const uid = (p: string) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const sha = async (s: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))).map(b => b.toString(16).padStart(2, '0')).join('');

// deno-lint-ignore no-explicit-any
type J = any;
const WORK = ['confirmed', 'wip', 'submitted', 'revision', 'approved'];
const FMT: Record<string, string> = { Reel: 'Reel, 30–60 seconds', Story: 'Story, up to 15 seconds', Post: 'Feed post', Video: 'Video' };
const itemNames = (d: J) => {
  const out: string[] = [];
  String(d.del || '').split(/,\s*/).forEach(p => {
    const m = p.match(/(\d+)\s*x?\s*(\w+)/i); if (!m) return;
    const t = m[2].replace(/ies$/, 'y').replace(/s$/, ''); const T = t[0].toUpperCase() + t.slice(1);
    for (let i = 1; i <= +m[1]; i++) out.push(T + ' ' + i);
  });
  return out;
};
const mkItems = (d: J) => { const o: J = {}; itemNames(d).forEach(n => { o[n] = { state: 'todo', v: 0, due: null, platform: 'Instagram', format: FMT[n.split(' ')[0]] || n.split(' ')[0] }; }); return o; };
const recalc = (d: J) => {
  if (!WORK.includes(d.stage) || !d.items) return;
  const it = d.items, ns = Object.keys(it);
  const by = (st: string) => ns.filter(n => it[n].state === st);
  const byDue = (l: string[]) => [...l].sort((x, y) => String(it[x].due || '9').localeCompare(String(it[y].due || '9')));
  if (by('revision').length) { d.stage = 'revision'; d.first = by('revision')[0]; return; }
  if (by('todo').length) { d.stage = 'wip'; d.first = byDue(by('todo'))[0]; return; }
  if (by('submitted').length) { d.stage = 'submitted'; d.first = by('submitted')[0]; return; }
  d.stage = 'approved';
  const last = ns.map(n => it[n]).sort((x, y) => String(y.at).localeCompare(String(x.at)))[0];
  d.approvedAt = last?.at || iso(); d.approvedBy = last?.by;
  if (!d.dueISO && d.trigger === 'On approval') {
    const m = String(d.due || '').match(/(\d+) days/);
    d.dueISO = new Date(Date.parse(d.approvedAt) + (m ? +m[1] : 0) * DAY).toISOString().slice(0, 10); d.due = fmtDate(d.dueISO);
  }
  if (d.dueISO && d.trigger !== 'Days after posting' && d.trigger !== 'On posting') d.stage = 'due';
};

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

async function load(token: string) {
  const { data: l } = await db.from('links').select('user_id, data').eq('key', token).maybeSingle();
  if (!l) return null;
  const user = l.user_id as string, link = l.data as J;
  const [deal, creator] = await Promise.all([
    db.from('deals').select('data').eq('user_id', user).eq('key', link.dealId).maybeSingle(),
    db.from('creators').select('data').eq('id', user).maybeSingle(),
  ]);
  if (!deal.data) return null;
  return { user, link, deal: deal.data.data as J, creator: (creator.data?.data || {}) as J };
}
type Ctx = NonNullable<Awaited<ReturnType<typeof load>>>;

const put = (c: Ctx, table: string, key: string, data: J) =>
  db.from(table).upsert({ user_id: c.user, key, deal_id: data.dealId ?? c.deal.id, data, updated_at: iso() });
const saveLink = (c: Ctx) => put(c, 'links', c.link.token, c.link);
const saveDeal = (c: Ctx) => put(c, 'deals', c.deal.id, c.deal);
const event = (c: Ctx, e: J) => { const x = { id: uid('e'), dealId: c.deal.id, actor: 'system', tone: 'info', at: iso(), ...e }; return put(c, 'events', x.id, x); };
const rows = async (c: Ctx, table: string) => ((await db.from(table).select('data').eq('user_id', c.user).eq('deal_id', c.deal.id)).data || []).map(r => r.data as J);

async function expireIfDue(c: Ctx) {
  const l = c.link;
  if (l.kind !== 'd' || l.state !== 'active' || !l.expiresAt || Date.parse(l.expiresAt) >= Date.now()) return;
  l.state = 'expired'; await saveLink(c);
  if (c.deal.stage === 'sent' && (c.deal.version || 1) === l.version) { c.deal.stage = 'expired'; c.deal.expiredAt = l.expiresAt; await saveDeal(c); }
  await event(c, { tone: 'critical', title: 'Link expired', detail: `Terms v${l.version} · ${c.deal.brand} didn't answer`, at: l.expiresAt });
}

async function view(c: Ctx, device: string) {
  await expireIfDue(c);
  const [links, answers, vers, subs] = await Promise.all([rows(c, 'links'), rows(c, 'answers'), rows(c, 'verifications'), rows(c, 'submissions')]);
  const latest = links.filter(x => x.kind === c.link.kind).sort((x, y) => y.createdAt.localeCompare(x.createdAt))[0];
  const ver = vers.find(x => x.device === device && Date.parse(x.validUntil) > Date.now());
  const mine = answers.filter(x => x.token === c.link.token);
  const bySub: Record<string, J[]> = {};
  (c.link.items || []).forEach((n: string) => { bySub[n] = subs.filter(s => s.item === n).sort((a, b) => b.v - a.v); });
  const { name, handle, paymentLink, deletion } = c.creator;
  return {
    link: c.link, deal: { ...c.deal, email: mask(c.deal.email) }, creator: { name, handle, paymentLink, deletion },
    answer: mine[0] || null, answers: mine, verified: !!ver, verifiedEmail: ver?.email || null,
    latest: latest && latest.token !== c.link.token && latest.state === 'active' ? latest.token : null,
    closing: !!deletion, email: mask(c.deal.email), subs: bySub,
  };
}

async function sendCodeEmail(to: string, code: string, brand: string) {
  const key = Deno.env.get('RESEND_API_KEY'); if (!key) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: Deno.env.get('MAIL_FROM') || 'AlgoStudio <codes@algostudio.app>', to, subject: `Your AlgoStudio code: ${code}`, text: `Your code to answer for ${brand} is ${code}. It works for 10 minutes.` }),
  });
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  const b = await req.json().catch(() => ({})) as J;
  const c = typeof b.token === 'string' ? await load(b.token) : null;
  if (!c) return json({ view: null });
  const d = c.deal, l = c.link;

  switch (b.action) {
    case 'get': return json({ view: await view(c, b.device) });

    case 'open': {
      if (!l.firstOpenedAt && l.state === 'active') {
        l.firstOpenedAt = iso(); await saveLink(c);
        if (l.kind === 'd') { d.openedAt = l.firstOpenedAt; await saveDeal(c); }
        await event(c, { tone: 'neutral', icon: 'eye', title: l.kind === 'd' ? 'Link opened' : 'Approval link opened', detail: (l.kind === 'd' ? 'Terms v' + l.version : (l.items || []).join(', ')) + ' · ' + firstName(d.contact) });
      }
      return json({ ok: true });
    }

    case 'requestCode': {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      await db.from('brand_codes').upsert({ user_id: c.user, deal_id: d.id, code_hash: await sha(code), expires_at: iso(CODE_TTL), tries: 0 });
      await sendCodeEmail(d.email, code, d.brand);
      await event(c, { tone: 'neutral', icon: 'mail', title: 'Code sent to ' + mask(d.email) });
      return json({ demoCode: Deno.env.get('DEMO_CODES') === 'true' ? code : '' });
    }

    case 'verify': {
      const { data: p } = await db.from('brand_codes').select('*').eq('user_id', c.user).eq('deal_id', d.id).maybeSingle();
      const drop = () => db.from('brand_codes').delete().eq('user_id', c.user).eq('deal_id', d.id);
      if (!p) return json({ ok: false, error: 'Ask for a new code.' });
      if (Date.parse(p.expires_at) < Date.now()) { await drop(); return json({ ok: false, error: 'This code has expired. Ask for a new one.' }); }
      if (p.code_hash !== await sha(String(b.code || '').trim())) {
        const tries = p.tries + 1;
        if (tries >= CODE_TRIES) { await drop(); return json({ ok: false, error: 'Too many tries. Ask for a new code.' }); }
        await db.from('brand_codes').update({ tries }).eq('user_id', c.user).eq('deal_id', d.id);
        const left = CODE_TRIES - tries;
        return json({ ok: false, error: `That code doesn't match. ${left} ${left === 1 ? 'try' : 'tries'} left.` });
      }
      await drop();
      const v = { dealId: d.id, device: b.device, email: mask(d.email), at: iso(), validUntil: iso(30 * DAY) };
      await put(c, 'verifications', `${d.id}:${b.device}:${v.at}`, v);
      await event(c, { actor: 'brand', tone: 'neutral', icon: 'shield-check', title: 'Code verified', detail: 'This device can answer for 30 days' });
      return json({ ok: true });
    }

    case 'answer': {
      const answers = await rows(c, 'answers');
      const prior = answers.find(x => x.token === l.token && !x.item);
      if (prior) return json({ answer: prior });
      if (l.state !== 'active') return json({ answer: null });
      const ans = b.answer as J, at = iso();
      const rec = { token: l.token, at, ...ans };
      await put(c, 'answers', `${l.token}:`, { ...rec, dealId: d.id });
      l.state = 'answered'; await saveLink(c);
      if (ans.type === 'confirm') {
        if (d.pendingVersion) Object.assign(d, { pendingVersion: undefined, agreedVersion: l.version, confirmedAt: at, confirmedBy: ans.name, confirmedVersion: l.version });
        else { Object.assign(d, { stage: 'wip', confirmedAt: at, confirmedBy: ans.name, confirmedVersion: l.version }); if (!d.items) d.items = mkItems(d); recalc(d); }
        await event(c, { actor: 'brand', tone: 'positive', title: `Terms v${l.version} confirmed by ${ans.name}`, detail: 'Verified by code sent to ' + mask(d.email) });
      }
      if (ans.type === 'changes') {
        if (!d.pendingVersion) d.stage = 'changes';
        d.changes = { areas: ans.areas, note: ans.note, at, by: d.contact, v: l.version };
        await event(c, { actor: 'brand', tone: 'warning', title: 'Changes requested: ' + (ans.areas.join(', ') || 'terms'), detail: `“${ans.note}”` });
      }
      if (ans.type === 'decline') {
        if (d.pendingVersion) {
          const agreed = (await rows(c, 'terms_versions')).filter(x => x.status === 'confirmed').sort((x, y) => y.n - x.n)[0];
          if (agreed) Object.assign(d, agreed.terms);
          Object.assign(d, { pendingVersion: undefined, version: agreed ? agreed.n : d.version });
        } else Object.assign(d, { stage: 'declined', reason: ans.reason, declinedAt: at });
        await event(c, { actor: 'brand', tone: 'neutral', icon: 'ban', title: 'Declined by ' + (d.contact || 'the brand'), detail: ans.reason ? 'Reason: ' + ans.reason : undefined });
      }
      await saveDeal(c);
      return json({ answer: rec });
    }

    case 'answerWork': {
      const item = String(b.item), ans = b.answer as J;
      if (!(l.items || []).includes(item)) return json({ answer: null });
      const answers = await rows(c, 'answers');
      const prior = answers.find(x => x.token === l.token && x.item === item);
      if (prior) return json({ answer: prior });
      if (l.state !== 'active') return json({ answer: null });
      if (!d.items) d.items = mkItems(d);
      const at = iso(), rec = { token: l.token, at, item, ...ans };
      await put(c, 'answers', `${l.token}:${item}`, { ...rec, dealId: d.id });
      const it = d.items[item];
      const sub = (await rows(c, 'submissions')).filter(x => x.item === item).sort((x, y) => y.v - x.v)[0];
      const iv = sub ? sub.v : it.v || 1;
      if (ans.type === 'approve') {
        if (sub) { Object.assign(sub, { state: 'approved', approvedBy: ans.name, approvedAt: at }); await put(c, 'submissions', sub.id, sub); }
        d.items[item] = { ...it, state: 'approved', v: iv, by: ans.name, at };
        const all = Object.values(d.items).every((x: J) => x.state === 'approved');
        await event(c, { actor: 'brand', tone: 'positive', title: `${item} v${iv} approved by ${ans.name}`, detail: 'Verified by code sent to ' + mask(d.email) + (all ? ' · all items approved' : '') });
      } else {
        if (sub) { Object.assign(sub, { state: 'revision', feedback: ans.note }); await put(c, 'submissions', sub.id, sub); }
        d.items[item] = { ...it, state: 'revision', v: iv, revs: (it.revs || 0) + 1, feedback: { note: ans.note, at, by: d.contact, v: iv } };
        d.notes = ans.note;
        await event(c, { actor: 'brand', tone: 'warning', title: `Revision requested on ${item} v${iv}`, detail: `“${ans.note}”` });
      }
      const answered = new Set([...answers.filter(x => x.token === l.token).map(x => x.item), item]);
      if (l.items.every((n: string) => answered.has(n))) { l.state = 'answered'; await saveLink(c); }
      recalc(d); await saveDeal(c);
      return json({ answer: rec });
    }
  }
  return json({ error: 'Unknown action' }, 400);
});
