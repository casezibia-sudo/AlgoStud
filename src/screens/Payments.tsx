// @ts-nocheck
// Generated from "AlgoStudio Payments.dc.html" by scripts/dc-convert.js. Inline styles and logic are kept as in the prototype so it renders the same.
import React from 'react';
import { DCLogic, DCHost, sty, T, S, L, R, hostPos, XImport } from '@/dc/runtime';
import CreateDealBlock from './CreateDealBlock';

const CSS = `
@font-face{font-family:'Satoshi';src:url('/assets/Satoshi-Variable.woff2') format('woff2');font-weight:300 900;font-style:normal;font-display:swap}
html,body{margin:0;padding:0;background:#F7F7F9}
body{font-family:'Satoshi',ui-sans-serif,system-ui,sans-serif;color:#2E2E33;-webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
a{color:#076645;text-decoration:none}
a:hover{color:#064F37}
*{box-sizing:border-box}

`;
const LINKS = ["https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Oi&family=Geist+Mono:wght@400;500&display=swap"];

class Component extends DCLogic {
  renderVals() {
    const I = n => `url(https://unpkg.com/lucide-static@0.460.0/icons/${n}.svg) center/contain no-repeat`;
    const em = '#0A7F55', red = '#B42318', orange = '#B4560F', muted = '#5E5E66', faint = '#86868E', ink = '#111111', green = '#3E7420';
    const mk = (type, o = {}) => ({ mt: '0px', ...o, ['is' + type]: true });
    const H = (t, d) => mk('H', { t, d });
    const Fd = (label, value, o = {}) => {
      const st = o.st || 'normal', has = !!value;
      return mk('Field', { label, value: has ? value : (o.ph || ''), vc: has ? ink : faint, tag: '', tagC: muted, prefix: o.prefix || '', icon: o.icon ? I(o.icon) : '', src: '', act: '', msg: o.msg || '', mw: 500, mc: muted,
        bg: st === 'focus' ? '#FFFFFF' : '#F2F3F5', bd: st === 'focus' ? em : 'transparent', ring: st === 'focus' ? '0 0 0 3px #CDEEDD' : 'none',
        h: o.tall ? o.tall + 'px' : '48px', pad: o.tall ? '12px 14px' : '0 14px', align: o.tall ? 'flex-start' : 'center' });
    };
    const Menu = rows => mk('Menu', { rows: rows.map(r => ({ chip: '', c: ink, ...r, mask: I(r.icon) })) });
    const AT = { info: ['#EEF2FF', '#2F45C4', '#2F45C4', 'info'], critical: ['#FDE8E8', '#B42318', red, 'circle-alert'], positive: ['#EFF6E5', '#3E7420', green, 'check'] };
    const Al = (tone, t, d, action = '') => { const [bg, badge, fg, ic] = AT[tone]; return mk('Alert', { t, d, action, bg, badge, fg, mask: I(ic) }); };
    const Txt = t => mk('Txt', { t, c: muted, w: 500, align: 'left' });
    const Skel = () => mk('Skel');
    const Btns = items => mk('Btns', { items });
    const btn = (t, kind) => ({ t, bg: kind === 'primary' ? em : '#F2F3F5', fg: kind === 'primary' ? '#FFFFFF' : ink, ring: 'none' });
    const Radios = (label, opts, on) => mk('Radios', { label, opts: opts.map((t, i) => ({ t, ring: i === on ? '6px solid #111111' : '1.5px solid #B4B4BA' })) });
    const row = (k, v, s) => ({ k, v, vc: s === 'ok' ? green : ink, vw: s === 'ok' ? 700 : 500 });
    const Terms = (t, d, rows) => mk('Terms', { t, d, rows, action: '', more: '' });
    const hint = "Amounts are as agreed, before tax. AlgoStudio tracks what you're owed. It doesn't collect or check payments.";
    const Money = (cols) => mk('Money', { cols, hint, items: [
      { label: 'Received this month', amount: '₹ 18,000', sub: '1 deal · May 2026', c: green },
      { label: 'Still to receive', amount: '₹ 95,000', sub: '5 deals · + $ 400 from 1 deal', c: ink },
      { label: 'Overdue', amount: '₹ 25,000', sub: '1 deal', c: red },
      { label: 'Due soon', amount: '₹ 12,000', sub: '1 deal · next 7 days', c: orange }] });
    const FL = [['All', '7'], ['Due soon', '1'], ['Overdue', '1'], ['Paid', '1'], ['No due date', '1']];
    const Chips = on => mk('Chips', { opts: FL.map(([t, n], i) => ({ t, n, bg: i === on ? ink : 'transparent', fg: i === on ? '#FFFFFF' : '#2E2E33', w: i === on ? 700 : 500, cc: i === on ? '#FFFFFF' : (t === 'Overdue' ? red : faint) })) });
    const P = {
      hearth: { brand: 'Hearth Coffee', title: 'Café menu Reels', amount: '₹ 25,000', cur: 'INR', due: '30 Apr 2026', dueShort: '30 Apr', status: 'Payment overdue by 5 days.', statusShort: 'Overdue by 5 days', sc: red, appr: 'All 3 items approved · 22 Apr', last: 'Reminder sent 02 May on WhatsApp', action: 'Send reminder' },
      lumen: { brand: 'Lumen Skincare', title: 'Everyday sunscreen', amount: '$ 400', cur: 'USD', due: '25 Apr 2026', dueShort: '25 Apr', status: 'Unclear. Lumen Skincare says they paid on 26 Apr. Not received yet.', statusShort: 'Unclear: brand says paid', sc: orange, appr: 'Approved · 18 Apr', last: 'Marked unclear 03 May', action: 'Update status' },
      veda: { brand: 'Veda Wellness', title: 'Ashwagandha Story set', amount: '₹ 12,000', cur: 'INR', due: '07 May 2026', dueShort: '07 May', status: 'Payment due in 2 days.', statusShort: 'Due in 2 days', sc: orange, appr: 'Approved · 28 Apr', last: '', action: 'Send reminder' },
      kora: { brand: 'Kora Living', title: 'Monsoon home edit', amount: '₹ 18,000', cur: 'INR', due: '30 days after posting', dueShort: 'No date', status: 'No due date yet. Payment is due 30 days after posting. Add the posting date.', statusShort: 'Add posting date', sc: '#2E2E33', appr: 'Approved · 03 May', last: '', action: 'Add posting date' },
      glow: { brand: 'GlowSkin India', title: 'Vitamin C serum launch', amount: '₹ 25,000', cur: 'INR', due: '13 May 2026', dueShort: '13 May', status: 'Due in 8 days.', statusShort: 'Due in 8 days', sc: '#2E2E33', appr: 'All 4 items approved · 12 Apr', last: '', action: 'Mark as paid' },
      nila: { brand: 'Nila Foods', title: 'Millet snacks unboxing', amount: '₹ 15,000', cur: 'INR', due: '20 May 2026', dueShort: '20 May', status: 'Not due yet. Due 20 May.', statusShort: 'Not due yet', sc: muted, appr: 'Waiting for approval of Reel 1', last: '', action: '' },
      saffron: { brand: 'Saffron Tea', title: 'Monsoon chai Reels', amount: '₹ 18,000', cur: 'INR', due: '28 Apr 2026', dueShort: '28 Apr', status: 'Paid ₹ 18,000 on 01 May 2026.', statusShort: 'Paid 01 May', sc: green, appr: 'All 2 items approved · 20 Apr', last: 'Marked paid by you · ref UTR 4521…', action: 'Download record' }
    };
    const card = (k, o = {}) => ({ ring: 'none', ...P[k], ...o });
    const Cards = list => mk('PayCards', { items: list });
    const allOrder = ['hearth', 'lumen', 'veda', 'kora', 'glow', 'nila', 'saffron'];
    const tCols = 'minmax(0,1.4fr) 110px 80px minmax(0,1.1fr) minmax(0,1.2fr) 150px';
    const Table = keys => mk('Table', { cols: tCols, head: [['Deal', 'left'], ['Amount', 'right'], ['Due', 'left'], ['Status', 'left'], ['Approval', 'left'], ['', 'right']].map(([t, a]) => ({ t, a })),
      rows: keys.map(k => ({ ...P[k], btnShow: P[k].action ? 'inline-flex' : 'none' })) });
    const remMsg = 'Hi Rohan, a reminder that ₹ 25,000 for the Café menu Reels was due on 30 Apr 2026. All 3 Reels were approved on 22 Apr. You can pay here: upi://pay?pa=ananya@okhdfc\n\nThanks, Ananya';
    const S = o => ({ ...o, mob: true, desk: false, w: '390px', r: '28px', hpad: '12px 16px 0', pad: '12px 16px 16px', hasSheet: !!o.sheet, sheet: o.sheet || {}, hgt: o.hgt ? 'auto' : '844px' });
    const D = o => ({ ...S(o), mob: false, desk: true, w: '1280px', r: '12px', hpad: '28px 32px 0', pad: '16px 32px 32px' });

    const groups = [
      { id: 'O', t: 'Overview', d: 'Four figures, never converted between currencies. Filters below. Rows sorted by what needs following up first: overdue, unclear, due soon, no due date, then by due date. Paid sits at the end.', screens: [
        S({ id: 'P1', label: 'Mobile · All (full scroll)', hgt: '2440px', blocks: [Money('1fr 1fr'), Chips(0), Cards(allOrder.map(k => card(k)))],
          note: 'Each card keeps every field from the desktop row: brand, deal title, amount + currency, exact status, due date, approval state, last follow-up and one next action. Tapping the card opens the deal at its Payment section.' }),
        S({ id: 'P2', label: '1 · No payments yet', blocks: [
          H('No payments to track yet.', "Amounts show up here once a brand confirms your terms. AlgoStudio tracks what you're owed and helps you follow up. It doesn't collect payments.")],
          note: 'No figures and no filters until there’s something to count. Create deal stays in the nav.' }),
        S({ id: 'P12', label: '10 · Loading', blocks: [Skel(), Skel(), Skel(), Skel()], note: 'The header and filters render first. Figures and rows are static skeletons in their final shape.' }),
        S({ id: 'P13', label: '10 · Error', blocks: [Al('critical', "Couldn't load payments.", 'Your records are safe. Nothing has changed.', 'Try again')],
          note: 'Figures are hidden on error, so a failed load never reads as “₹ 0 to receive”.' })
      ] },
      { id: 'F', t: 'Filters and row states', d: 'Each filter shows only its rows. The figures above don’t change, because they’re totals.', screens: [
        S({ id: 'P3', label: '2 · Due soon', blocks: [Chips(1), Cards([card('veda')])], note: 'Due soon means due within 7 days and not paid. Exact copy: “Payment due today.” / “Payment due tomorrow.” / “Payment due in 2 days.”' }),
        S({ id: 'P4', label: '3 · Overdue', blocks: [Chips(2), Cards([card('hearth')])], note: 'Exact copy: “Payment overdue by 1 day.” / “Payment overdue by 5 days.” The last reminder is shown so the creator doesn’t send too many.' }),
        S({ id: 'P9', label: '5 · No due date', blocks: [Chips(4), Cards([card('kora')])],
          note: 'Shown when payment depends on posting and no posting date is added, or the terms have no date. Fixed-date deals never appear here.' }),
        S({ id: 'P10', label: '6 · Disputed or unclear', blocks: [Chips(0), Cards([card('lumen')])],
          note: 'The creator marks it as unclear. AlgoStudio never decides. It stays out of Overdue so automatic urgency doesn’t pile on while it’s being sorted out.' })
      ] },
      { id: 'R', t: 'Follow-up actions', d: 'Every action is a sheet over the list. Reminders are written from the confirmed terms, can be edited, and are sent from the creator’s own channel.', screens: [
        S({ id: 'P5', label: '7 · Reminder being prepared', blocks: [Chips(2), Cards([card('hearth')])], sheet: { t: 'Payment reminder to Rohan, Hearth Coffee', blocks: [
          Fd('Message', remMsg, { tall: 168, st: 'focus' }),
          Txt('Built from the confirmed terms. Edit anything before sending. The payment link comes from Settings.'),
          Menu([{ t: 'Share on WhatsApp', d: 'Opens WhatsApp with this message', icon: 'message-circle' }, { t: 'Copy message', d: 'Paste it anywhere', icon: 'copy' }, { t: 'Send from your email', d: 'Opens your email app', icon: 'mail' }])] },
          note: 'Tone follows the status. Due soon: “a reminder that ₹ 12,000 is due on 07 May”. Overdue: “was due on 30 Apr”. It never says “late fee” or “legal”.' }),
        S({ id: 'P6', label: '8 · Reminder sent', blocks: [
          Al('positive', 'Reminder sent to Hearth Coffee on WhatsApp.', "We'll keep this as overdue until you mark it as paid.", 'Mark as paid'),
          Chips(2), Cards([card('hearth', { last: 'Reminder sent today on WhatsApp · 2nd reminder' })])],
          note: 'Recorded in the deal: “Payment reminder sent · WhatsApp” with the message text. AlgoStudio can’t see whether it was delivered.' }),
        S({ id: 'P7', label: '4 · Mark as received', blocks: [Chips(2), Cards([card('hearth')])], sheet: { t: 'Mark payment as received', blocks: [
          Fd('Amount received', '25,000', { prefix: '₹' }), Fd('Date received', '05 May 2026', { icon: 'calendar' }), Fd('Reference (optional)', '', { ph: 'UTR, cheque number or a note' }),
          Txt("This is your record. AlgoStudio doesn't check payments."),
          Btns([btn('Mark as paid', 'primary')])] },
          note: 'If the amount is less than agreed, the sheet says “₹ 10,000 less than agreed. This will be marked as unclear so you can follow up.”' }),
        S({ id: 'P8', label: '4 · Marked as received', blocks: [
          Al('positive', 'Marked as paid.', '₹ 25,000 from Hearth Coffee on 05 May 2026. Saved in the deal record.', 'Undo'),
          Chips(3), Cards([card('hearth', { amount: '₹ 25,000', status: 'Paid ₹ 25,000 on 05 May 2026.', sc: green, last: 'Marked paid by you · ref UTR 9917…', action: 'Download record' }), card('saffron')])],
          note: 'Wording is always “Paid … on …”, recorded as “You marked ₹ 25,000 as paid”. Undo for 10 seconds, then a correction is a new event.' }),
        S({ id: 'P11', label: '6 · Mark as unclear', blocks: [Chips(0), Cards([card('lumen')])], sheet: { t: 'Something not right?', blocks: [
          Radios('What’s happening?', ['Brand says it’s paid, but it hasn’t arrived', 'A different amount arrived', 'Brand disagrees with the amount', 'Something else'], 0),
          Fd('Note for yourself (optional)', 'They sent a screenshot on 26 Apr. Bank shows nothing yet.', { tall: 72 }),
          Btns([btn('Mark as unclear', 'primary')])] },
          note: 'Private to the creator. Nothing is sent to the brand. From an unclear row, Update status offers: Mark as paid · Back to unpaid · Send reminder.' })
      ] },
      { id: 'H', t: 'Payment history', d: 'The Paid filter groups payments by month with a total for each, newest month first. Each row shows what was marked and when.', screens: [
        S({ id: 'P14', label: '9 · Payment history', hgt: '1000px', blocks: [Chips(3),
          Terms('May 2026', '₹ 18,000 received · 1 deal', [row('Saffron Tea', '₹ 18,000 · paid 01 May · ref UTR 4521…', 'ok')]),
          Terms('April 2026', '₹ 72,000 received · 3 deals', [row('Tara Studio', '₹ 22,000 · paid 24 Apr', 'ok'), row('Pebble Audio', '₹ 12,000 · paid 15 Apr', 'ok'), row('Mitti Naturals', '₹ 38,000 · paid 03 Apr · ref 0091…', 'ok')]),
          Txt('Totals add up what you marked as paid. Other currencies are listed on their own line.')],
          note: 'Rows open the deal record. Archived deals still count in history.' })
      ] },
      { id: 'W', t: 'Desktop ≥ 1024', d: 'A compact table with the same columns. Status wording is shortened, and the full sentence shows on hover and in the deal. One secondary action per row. Create deal is primary because this page has no primary of its own.', screens: [
        D({ id: 'W1', label: 'Payments · All', hgt: '900px', blocks: [Money('repeat(4,1fr)'), Chips(0), Table(allOrder)],
          note: 'Table semantics with column headers. The amount is right-aligned in tabular figures. Clicking a row opens the deal’s Payment section. Row buttons open the same sheets as dialogs.' })
      ] }
    ];
    const sideNav = [['Home', 'house', 0, ''], ['Deals', 'list', 0, '5'], ['Payments', 'wallet', 1, ''], ['Settings', 'settings', 0, '']]
      .map(([l, ic, on, c]) => ({ label: l, mask: I(ic), bg: on ? ink : 'transparent', fg: on ? '#FFFFFF' : '#2E2E33', fw: on ? 700 : 500, count: c, cc: red }));
    const tabs = [['home', 'house', 'Home'], ['deals', 'list', 'Deals'], ['payments', 'wallet', 'Payments'], ['settings', 'settings', 'Settings']]
      .map(([id, ic, l]) => ({ label: l, mask: I(ic), fg: id === 'payments' ? ink : faint, fw: id === 'payments' ? 700 : 500 }));
    return { groups, sideNav, tabsL: tabs.slice(0, 2), tabsR: tabs.slice(2) };
  }
}

export default class Payments extends Component {
  render() {
    const v = { ...this.props, ...(this.renderVals() || {}) };
    return (
      <DCHost id="Payments" css={CSS} links={LINKS} hostStyle={this.props.__hostStyle}>
        <section style={{"padding":"64px 64px 16px","display":"flex","flexDirection":"column","gap":"8px","maxWidth":"1000px"}}>{"\n  "}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"11px","letterSpacing":"0.06em","textTransform":"uppercase","color":"#5E5E66"}}>AlgoStudio · /payments · v0.1</span>{"\n  "}<h1 style={{"margin":"0","fontFamily":"'Jost',sans-serif","fontWeight":"500","fontSize":"40px","lineHeight":"1.1","letterSpacing":"-0.02em","color":"#111111"}}>Payments</h1>{"\n  "}<p style={{"margin":"0","fontSize":"15px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66","maxWidth":"760px","textWrap":"pretty"}}>A follow-up list, not a payments product. Four figures sit at the top, then filters, then one row per deal with the exact status, its approval state and one next action. Reminders are written from the confirmed terms and edited before sending. “Paid” is always something the creator marks. Rules are in AlgoStudio Payments Spec v0.1.md.</p></section>{L(v.groups).map(($it1, $i1) => { const v1 = { ...v, g: $it1, $index: $i1 }; return (<React.Fragment key={$i1}>{"\n  "}<section style={{"padding":"40px 64px 24px","display":"flex","flexDirection":"column","gap":"16px"}}>{"\n    "}<div style={{"display":"flex","flexDirection":"column","gap":"4px","maxWidth":"760px"}}>{"\n      "}<span style={{"fontSize":"20px","fontWeight":"700","color":"#111111"}}>{T(v1.g?.t)}</span>{"\n      "}<span style={{"fontSize":"14px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66"}}>{T(v1.g?.d)}</span>{"\n    "}</div>{"\n    "}<div style={{"display":"flex","flexWrap":"wrap","gap":"40px","alignItems":"flex-start"}}>{"\n      "}{L(v1.g?.screens).map(($it2, $i2) => { const v2 = { ...v1, s: $it2, $index: $i2 }; return (<React.Fragment key={$i2}>{"\n        "}<div id={v2.s?.id} style={sty(`display:flex;flex-direction:column;gap:10px;width:${S(v2.s?.w)}`)}>{"\n          "}<span style={{"fontSize":"13px","fontWeight":"700","color":"#111111"}}>{T(v2.s?.label)}</span>{"\n          "}<div style={sty(`width:${S(v2.s?.w)};height:${S(v2.s?.hgt)};background:#FFFFFF;border-radius:${S(v2.s?.r)};overflow:hidden;box-shadow:0 4px 16px rgba(17,17,17,.06);display:flex;position:relative`)}>{"\n            "}{(v2.s?.desk) ? (<>{"\n              "}<aside style={{"width":"240px","flex":"none","borderRight":"1px solid #E4E4E8","display":"flex","flexDirection":"column","padding":"20px 12px 12px","gap":"4px"}}>{"\n                "}<div style={{"display":"flex","alignItems":"center","gap":"8px","padding":"0 8px","height":"32px","marginBottom":"12px"}}><img src="/assets/logo-mark.png" alt="" style={{"width":"22px","display":"block"}} /><span style={{"fontFamily":"'Oi',sans-serif","fontSize":"13px","color":"#111111"}}>ALGOSTUDIO</span></div>{"\n                "}<div style={{"display":"flex","alignItems":"center","justifyContent":"center","gap":"8px","height":"44px","borderRadius":"12px","background":"#0A7F55","color":"#FFFFFF","fontSize":"14px","fontWeight":"700","marginBottom":"12px"}}><span style={{"width":"16px","height":"16px","background":"currentColor","WebkitMask":"url(https://unpkg.com/lucide-static@0.460.0/icons/plus.svg) center/contain no-repeat","mask":"url(https://unpkg.com/lucide-static@0.460.0/icons/plus.svg) center/contain no-repeat"}}></span>Create deal</div>{"\n                "}{L(v2.sideNav).map(($it3, $i3) => { const v3 = { ...v2, n: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                  "}<div style={sty(`display:flex;align-items:center;gap:10px;height:40px;padding:0 12px;border-radius:12px;background:${S(v3.n?.bg)};color:${S(v3.n?.fg)};font-size:14px;font-weight:${S(v3.n?.fw)}`)}><span style={sty(`width:17px;height:17px;flex:none;background:currentColor;-webkit-mask:${S(v3.n?.mask)};mask:${S(v3.n?.mask)}`)}></span><span style={{"flex":"1"}}>{T(v3.n?.label)}</span><span style={sty(`font-size:12px;font-weight:700;color:${S(v3.n?.cc)}`)}>{T(v3.n?.count)}</span></div>{"\n                "}</React.Fragment>); })}{"\n              "}</aside>{"\n            "}</>) : null}{"\n            "}<div style={{"flex":"1","minWidth":"0","display":"flex","flexDirection":"column"}}>{"\n              "}<header style={sty(`flex:none;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:${S(v2.s?.hpad)}`)}>{"\n                "}<h2 style={{"margin":"0","fontSize":"26px","fontWeight":"700","letterSpacing":"-0.02em","color":"#111111"}}>Payments</h2>{"\n                "}<span style={{"width":"40px","height":"40px","borderRadius":"12px","display":"flex","alignItems":"center","justifyContent":"center","color":"#111111"}}><span style={{"width":"20px","height":"20px","background":"currentColor","WebkitMask":"url(https://unpkg.com/lucide-static@0.460.0/icons/search.svg) center/contain no-repeat","mask":"url(https://unpkg.com/lucide-static@0.460.0/icons/search.svg) center/contain no-repeat"}}></span></span>{"\n              "}</header>{"\n              "}<div style={sty(`flex:1;min-height:0;overflow:hidden;padding:${S(v2.s?.pad)};display:flex;flex-direction:column;gap:16px`)}>{"\n                "}{L(v2.s?.blocks).map(($it3, $i3) => { const v3 = { ...v2, b: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                  "}<CreateDealBlock b={v3.b} />{"\n                "}</React.Fragment>); })}{"\n              "}</div>{"\n              "}{(v2.s?.mob) ? (<>{"\n                "}<nav style={{"height":"64px","flex":"none","display":"grid","gridTemplateColumns":"repeat(5,1fr)","alignItems":"center","borderTop":"1px solid #E4E4E8","background":"#FFFFFF"}}>{"\n                  "}{L(v2.tabsL).map(($it3, $i3) => { const v3 = { ...v2, t: $it3, $index: $i3 }; return (<React.Fragment key={$i3}><span style={sty(`display:flex;flex-direction:column;align-items:center;gap:4px;color:${S(v3.t?.fg)};font-size:10px;font-weight:${S(v3.t?.fw)}`)}><span style={sty(`width:20px;height:20px;background:currentColor;-webkit-mask:${S(v3.t?.mask)};mask:${S(v3.t?.mask)}`)}></span>{T(v3.t?.label)}</span></React.Fragment>); })}{"\n                  "}<span style={{"display":"flex","justifyContent":"center"}}><span style={{"width":"52px","height":"52px","marginTop":"-14px","borderRadius":"999px","background":"#0A7F55","color":"#FFFFFF","display":"flex","alignItems":"center","justifyContent":"center","boxShadow":"0 6px 20px rgba(10,127,85,.32)"}}><span style={{"width":"24px","height":"24px","background":"currentColor","WebkitMask":"url(https://unpkg.com/lucide-static@0.460.0/icons/plus.svg) center/contain no-repeat","mask":"url(https://unpkg.com/lucide-static@0.460.0/icons/plus.svg) center/contain no-repeat"}}></span></span></span>{"\n                  "}{L(v2.tabsR).map(($it3, $i3) => { const v3 = { ...v2, t: $it3, $index: $i3 }; return (<React.Fragment key={$i3}><span style={sty(`display:flex;flex-direction:column;align-items:center;gap:4px;color:${S(v3.t?.fg)};font-size:10px;font-weight:${S(v3.t?.fw)}`)}><span style={sty(`width:20px;height:20px;background:currentColor;-webkit-mask:${S(v3.t?.mask)};mask:${S(v3.t?.mask)}`)}></span>{T(v3.t?.label)}</span></React.Fragment>); })}{"\n                "}</nav>{"\n              "}</>) : null}{"\n            "}</div>{"\n            "}{(v2.s?.hasSheet) ? (<>{"\n              "}<div style={{"position":"absolute","inset":"0","background":"rgba(17,17,17,.32)"}}></div>{"\n              "}<div style={{"position":"absolute","left":"0","right":"0","bottom":"0","background":"#FFFFFF","borderRadius":"24px 24px 0 0","boxShadow":"0 -8px 40px rgba(17,17,17,.12)","padding":"10px 16px 24px","display":"flex","flexDirection":"column","gap":"14px"}}>{"\n                "}<span style={{"alignSelf":"center","width":"36px","height":"4px","borderRadius":"999px","background":"#D2D3D8"}}></span>{"\n                "}<span style={{"fontSize":"18px","fontWeight":"700","lineHeight":"1.3","color":"#111111"}}>{T(v2.s?.sheet?.t)}</span>{"\n                "}{L(v2.s?.sheet?.blocks).map(($it3, $i3) => { const v3 = { ...v2, b: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                  "}<CreateDealBlock b={v3.b} />{"\n                "}</React.Fragment>); })}{"\n              "}</div>{"\n            "}</>) : null}{"\n          "}</div>{"\n          "}<span style={{"fontSize":"13px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66","textWrap":"pretty"}}>{T(v2.s?.note)}</span>{"\n        "}</div>{"\n      "}</React.Fragment>); })}{"\n    "}</div>{"\n  "}</section></React.Fragment>); })}<div style={{"height":"96px"}}></div>
      </DCHost>
    );
  }
}
