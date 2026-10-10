// @ts-nocheck
// Generated from "AlgoStudio Deal Detail Draft.dc.html" by scripts/dc-convert.js. Inline styles and logic are kept as in the prototype so it renders the same.
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
    const em = '#0A7F55', dis = '#76767E', red = '#B42318', orange = '#B4560F', muted = '#5E5E66', faint = '#86868E', ink = '#111111';
    const mk = (type, o = {}) => ({ mt: '0px', ...o, ['is' + type]: true });
    const H = (t, d) => mk('H', { t, d });
    const Fd = (label, value, o = {}) => {
      const st = o.st || 'normal', ms = o.mst || st, has = !!value;
      return mk('Field', { label, value: has ? value : (o.ph || ''), vc: has ? ink : faint, tag: o.tag || '', tagC: o.tagC || muted,
        prefix: o.prefix || '', icon: o.icon ? I(o.icon) : '', src: o.src || '', act: o.act || '', msg: o.msg || '',
        mw: ms === 'error' || ms === 'warning' ? 700 : 500, mc: ms === 'error' ? red : ms === 'warning' ? orange : muted,
        bg: st === 'focus' ? '#FFFFFF' : '#F2F3F5', bd: st === 'focus' ? em : 'transparent', ring: st === 'focus' ? '0 0 0 3px #CDEEDD' : 'none',
        h: '48px', pad: '0 14px', align: 'center' });
    };
    const Col = rows => mk('Collapsed', { rows });
    const Menu = rows => mk('Menu', { rows: rows.map(r => ({ chip: '', c: ink, ...r, mask: I(r.icon) })) });
    const AT = { info: ['#EEF2FF', '#2F45C4', '#2F45C4', 'info'], critical: ['#FDE8E8', '#B42318', '#B42318', 'circle-alert'], positive: ['#EFF6E5', '#3E7420', '#3E7420', 'check'] };
    const Al = (tone, t, d, action = '') => { const [bg, badge, fg, ic] = AT[tone]; return mk('Alert', { t, d, action, bg, badge, fg, mask: I(ic) }); };
    const RS = { ok: ['check', '#3E7420'], missing: ['circle-alert', red], unclear: ['circle-help', orange], none: ['minus', faint] };
    const Ri = (label, value, s) => ({ label, value, mask: I(RS[s][0]), c: RS[s][1], vc: s === 'ok' ? muted : RS[s][1], vw: s === 'ok' ? 500 : 700 });
    const Risk = (t, d, items) => mk('Risk', { t, d, items });
    const Pr = items => mk('Prompts', { t: 'Things to check', d: "Practical checks based on common creator deals. This isn't legal advice.", items });
    const Note = (t, icon = 'info') => mk('Note', { t, mask: I(icon) });
    const Skel = () => mk('Skel');
    const Act = o => mk('Actions', { reason: o.reason || '', context: o.context || '', primary: o.p, pBg: o.on ? em : dis, secondary: o.s });
    const Btns = items => mk('Btns', { items });
    const Head = o => mk('Head', { chip: 'Draft', chipBg: '#EBECEF', chipFg: '#2E2E33', chipMask: I('file-pen-line'), turn: 'Your turn', chip2: '', ini: 'GI', brand: 'GlowSkin India', brandC: ink, title: 'Vitamin C serum launch', amount: '₹ 25,000', amountC: ink, amountS: '32px', deadline: 'First content due 10 Apr 2026', ...o });
    const steps = ['Draft', 'Sent', 'Confirmed', 'Submitted', 'Approved', 'Paid'];
    const Rail = () => mk('Rail', { aria: 'Step 1 of 6, Draft', steps: steps.map((t, i) => i === 0
      ? { t, bg: em, bd: '0 solid transparent', ring: '0 0 0 4px #CDEEDD', w: 700, c: ink }
      : { t, bg: '#FFFFFF', bd: '2px solid #D2D3D8', ring: 'none', w: 500, c: faint }) });
    const row = (k, v, s) => ({ k, v, vc: s === 'missing' ? red : s === 'none' ? faint : s === 'unclear' ? orange : ink, vw: s && s !== 'none' ? 700 : 500 });
    const Terms = (t, d, rows, action = '', more = '') => mk('Terms', { t, d, rows, action, more });
    const bar = o => ({ reason: o.reason || '', context: o.context || '', primary: o.p, pBg: o.on ? em : dis, pFg: '#FFFFFF', ghost: o.g || '' });
    const S = o => ({ ...o, mob: true, desk: false, w: '390px', hgt: '844px', r: '28px', pad: '16px', cols: 'minmax(0,1fr)', side: o.side || [], lMask: I('chevron-left'), rMask: I('ellipsis'), rShow: 'block',
      hasBar: !!o.bar, bar: o.bar ? bar(o.bar) : {}, hasSheet: !!o.sheet, sheet: o.sheet || {}, hgt: o.hgt ? 'auto' : '844px' });
    const D = o => ({ ...S(o), mob: false, desk: true, w: '1280px', r: '12px', pad: '8px 32px 32px', cols: 'minmax(0,640px) 320px', hasBar: false });

    const termsMissing = Terms('Terms', 'What GlowSkin India will read and confirm', [
      row('Deliverables', '1 Reel and 3 Stories on Instagram'),
      row('Payment', '₹ 25,000 · due date not added', 'missing'),
      row('Dates', 'Content due 10 Apr 2026'),
      row('Usage rights', 'Brand can repost on its own channels for 90 days after posting.'),
      row('Exclusivity', 'Not added', 'none'),
      row('Revision limit', 'Not added', 'none')
    ], 'Edit terms');
    const termsReady = Terms('Terms', 'What GlowSkin India will read and confirm', [
      row('Deliverables', '1 Reel and 3 Stories on Instagram'),
      row('Payment', '₹ 25,000 · due 30 Apr 2026'),
      row('Dates', 'Content due 10 Apr 2026 · payment due 30 Apr 2026'),
      row('Usage rights', 'Brand can repost on its own channels for 90 days after posting.'),
      row('Exclusivity', 'Not added', 'none'),
      row('Revision limit', '2 revisions included')
    ], 'Edit terms');
    const dels = Terms('Deliverables', '4 items · all due 10 Apr 2026', [
      row('Reel 1', 'Instagram · due 10 Apr 2026'), row('Story 1', 'Instagram · due 10 Apr 2026'),
      row('Story 2', 'Instagram · due 10 Apr 2026'), row('Story 3', 'Instagram · due 10 Apr 2026')], 'Add');
    const later = Col([
      { t: 'Payment', d: '₹ 25,000 · tracking starts when GlowSkin India confirms', tag: '', tagC: muted },
      { t: 'Activity', d: 'Created 02 Apr, 10:14 from an Instagram message · last edited 10:21', tag: '', tagC: muted },
      { t: 'Record', d: 'Starts when you send. Your original message will be the first item.', tag: 'Not started', tagC: faint }
    ]);
    const nextMissing = Risk('Add 2 terms to send', 'Then send a confirmation link to Priya at GlowSkin India. Nothing has been sent yet.', [Ri('Contact email', 'Missing', 'missing'), Ri('Payment due date', 'Missing', 'missing')]);
    const prompts = Pr([
      { t: "Exclusivity isn't added.", d: "If GlowSkin India expects you to avoid other skincare brands, add it so it's part of what they confirm.", a: 'Add exclusivity' },
      { t: 'No revision limit.', d: "The terms don't say how many rounds of changes are included.", a: 'Add revision limit' }
    ]);
    const m1Blocks = [Head({}), Rail(), nextMissing, prompts, termsMissing, dels, later];
    const m1Bar = { context: '2 terms missing: contact email, payment due date', p: 'Complete deal', on: true };

    const groups = [
      { id: 'M', t: 'Mobile', d: 'Order: header, stage rail, next step, things to check, terms, deliverables, then one-line rows for payment, activity and record. The sticky bar holds the one primary.', screens: [
        S({ id: 'M1', label: 'M1 · Draft with missing terms (full scroll)', title: 'GlowSkin India', status: 'Draft. Add 2 terms to send.', hgt: '1900px', blocks: m1Blocks, bar: m1Bar,
          note: '“Complete deal” opens a short sheet with only the missing terms (M10). Edit terms opens the full form.' }),
        S({ id: 'M2', label: 'M2 · Draft ready to send', title: 'GlowSkin India', status: 'Draft. Ready to send.', hgt: '1740px', blocks: [
          Head({}), Rail(),
          Risk('Ready to send', 'Priya at GlowSkin India gets a link to read and confirm these terms.', [Ri('All needed terms are added', '', 'ok')]),
          Pr([{ t: "Exclusivity isn't added.", d: "If GlowSkin India expects you to avoid other skincare brands, add it so it's part of what they confirm.", a: 'Add exclusivity' }]),
          termsReady, dels, later], bar: { context: 'The link works for 7 days after you send it.', p: 'Send confirmation link', on: true, g: 'Edit terms' },
          note: 'The same page, with the primary switched. Recommended terms still show as prompts but never block sending.' })
      ] },
      { id: 'X', t: 'Edit, delete and unsaved changes', d: 'Draft actions live in the More menu. Deleting is confirmed in a sheet. Quick edits happen in a sheet that asks before discarding typed changes.', screens: [
        S({ id: 'M3', label: 'M3 · More menu', title: 'GlowSkin India', status: 'Draft. Add 2 terms to send.', blocks: m1Blocks.slice(0, 3), bar: m1Bar, sheet: { t: 'GlowSkin India · Draft', blocks: [
          Menu([
            { t: 'Edit terms', d: 'Open the full form', icon: 'file-pen-line' },
            { t: 'Preview what the brand sees', d: 'The page Priya will open', icon: 'eye' },
            { t: 'Save as template', d: 'Reuse these terms for other brands', icon: 'copy' },
            { t: 'Delete draft', d: "It hasn't been sent, so nothing is recorded", icon: 'trash-2', c: red }
          ])] }, note: 'Items that only apply after sending (Copy link, Cancel deal) are hidden, not disabled.' }),
        S({ id: 'M4', label: 'M4 · Delete draft confirmation', title: 'GlowSkin India', status: 'Draft. Add 2 terms to send.', blocks: m1Blocks.slice(0, 3), bar: m1Bar, sheet: { t: 'Delete this draft?', blocks: [
          Note("It hasn't been sent, so GlowSkin India hasn't seen it and nothing is recorded. You can undo for 10 seconds."),
          Btns([{ t: 'Keep draft', bg: '#F2F3F5', fg: ink, ring: '0 0 0 3px #CDEEDD' }, { t: 'Delete draft', bg: '#F2F3F5', fg: red, ring: 'none' }])] },
          note: 'Keep draft has focus. After deleting: back to Deals with a Toast, “Draft deleted.” and Undo for 10 s. Only never-sent drafts can be deleted.' }),
        S({ id: 'M10', label: 'M10 · Complete deal sheet', title: 'GlowSkin India', status: 'Draft. Add 2 terms to send.', blocks: m1Blocks.slice(0, 3), bar: m1Bar, sheet: { t: 'Add 2 terms to send', blocks: [
          Fd('Contact email', 'priya@glowskin.in', { st: 'focus', msg: 'Priya gets a 6-digit code here when she answers your link.' }),
          Fd('Payment due date', '30 Apr 2026', { icon: 'calendar' }),
          Btns([{ t: 'Save', bg: em, fg: '#FFFFFF', ring: 'none' }]),
          Note('Need to change something else? Edit terms opens the full form.')] },
          note: 'Only the missing needed terms, in the order the review lists them. Save closes the sheet, and the page switches to M2.' }),
        S({ id: 'M11', label: 'M11 · Unsaved changes', title: 'GlowSkin India', status: 'Draft. Add 2 terms to send.', blocks: m1Blocks.slice(0, 3), bar: m1Bar, sheet: { t: 'Discard these changes?', blocks: [
          Note("The contact email and payment due date you typed haven't been saved."),
          Btns([{ t: 'Keep editing', bg: '#F2F3F5', fg: ink, ring: '0 0 0 3px #CDEEDD' }, { t: 'Discard changes', bg: '#F2F3F5', fg: red, ring: 'none' }])] },
          note: 'Shown when a quick-edit sheet with typed values is closed by swipe, scrim tap, Esc or Back. The full form autosaves, so it never asks.' })
      ] },
      { id: 'E', t: 'Edge cases', d: 'Long lists collapse. Missing brand or amount is said in the header itself. An empty draft shows no sections at all.', screens: [
        S({ id: 'M5', label: 'M5 · Long deliverable list', title: 'Tara Studio', status: 'Draft. Ready to send.', blocks: [
          Head({ ini: 'TS', brand: 'Tara Studio', title: 'Festive collection', amount: '₹ 1,20,000', deadline: 'First due 10 Apr · last due 30 Apr' }), Rail(),
          Terms('Deliverables', '8 items · 3 Reels, 5 Stories', [row('Reel 1', 'Instagram · due 10 Apr 2026'), row('Reel 2', 'Instagram · due 17 Apr 2026'), row('Reel 3', 'Instagram · due 24 Apr 2026')], 'Add', 'Show 5 more')
        ], bar: { context: 'The link works for 7 days after you send it.', p: 'Send confirmation link', on: true, g: 'Edit terms' },
          note: 'The first 3 items by due date are shown, then “Show 5 more”. In Terms it becomes one line: “3 Reels and 5 Stories on Instagram, due 10–30 Apr 2026”. Desktop shows up to 6.' }),
        S({ id: 'M6', label: 'M6 · Missing brand name and amount', title: 'New deal', status: 'Draft. Add brand name and amount.', hgt: '900px', blocks: [
          Head({ ini: '?', brand: 'Brand not added', brandC: orange, title: 'Untitled deal', amount: 'Amount not added', amountC: orange, amountS: '18px', deadline: 'No deadline yet' }), Rail(),
          Risk('Add 4 terms to send', 'Start with the brand. Nothing has been sent yet.', [Ri('Brand name', 'Missing', 'missing'), Ri('Contact email', 'Missing', 'missing'), Ri('Amount', 'Missing', 'missing'), Ri('Payment due date', 'Missing', 'missing')]),
          Terms('Terms', 'What the brand will read and confirm', [row('Deliverables', '1 Reel on Instagram'), row('Payment', 'Not added', 'missing'), row('Dates', 'Content due 20 Apr 2026')], 'Edit terms')
        ], bar: { context: '4 terms missing', p: 'Complete deal', on: true },
          note: 'The header never goes blank: “Brand not added” and “Amount not added” in orange. Lists show this draft as “New deal · Brand not added”.' }),
        S({ id: 'M7', label: 'M7 · Empty draft', title: 'New deal', status: 'Draft · nothing added yet', blocks: [
          H('This draft is empty.', 'Add the brand and terms, or delete it if you started it by mistake.')],
          bar: { p: 'Complete deal', on: true, g: 'Delete draft' },
          note: 'No terms, no rail and no empty cards. Delete draft is offered directly because there is nothing to lose.' })
      ] },
      { id: 'L', t: 'Loading and error', d: 'Skeletons in the final layout. A failed load never shows an empty-looking deal.', screens: [
        S({ id: 'M8', label: 'M8 · Loading', title: 'Deal', status: 'Loading', rIcon: '', blocks: [Skel(), Skel(), Skel(), Skel()], bar: { p: 'Complete deal', on: false },
          note: 'Header and bar render at once. The primary is disabled, with no reason, until the deal loads. Cached deals show at once.' }),
        S({ id: 'M9', label: 'M9 · Error', title: 'Deal', status: '', blocks: [
          Al('critical', "Couldn't load this deal.", 'Your data is safe. Nothing has changed.', 'Try again')],
          note: 'If the deal was deleted or belongs to another account, this becomes Not Found: “This deal isn’t available.” · Back to deals.' })
      ] },
      { id: 'W', t: 'Desktop ≥ 1024', d: 'Left 640: rail, things to check, terms, deliverables, one-line rows. Right 320 summary panel, in view while scrolling: header facts, next step, primary, Edit terms, key dates. More menu (… in the header) holds Preview, Save as template and Delete draft.', screens: [
        D({ id: 'W1', label: 'W1 · Draft with missing terms', crumb: 'Deals / GlowSkin India', title: 'GlowSkin India', status: 'Draft · saved 10:21', hgt: '1300px',
          blocks: [Rail(), prompts, termsMissing, dels, later],
          side: [Head({}), nextMissing, Act({ context: '2 terms missing', p: 'Complete deal', on: true, s: 'Edit terms' }),
            Terms('Key dates', '', [row('Created', '02 Apr 2026, 10:14'), row('First due', '10 Apr 2026'), row('Payment due', 'Not added', 'missing')])],
          note: 'On desktop, Complete deal opens the same content as a 480 dialog. Delete draft confirmation is a dialog with the same copy as M4.' })
      ] }
    ];
    const sideNav = [['Home', 'house', 0, ''], ['Deals', 'list', 1, '5'], ['Payments', 'wallet', 0, ''], ['Settings', 'settings', 0, '']]
      .map(([l, ic, on, c]) => ({ label: l, mask: I(ic), bg: on ? '#111111' : 'transparent', fg: on ? '#FFFFFF' : '#2E2E33', fw: on ? 700 : 500, count: c, cc: on ? '#FFFFFF' : red }));
    return { groups, sideNav };
  }
}

export default class DealDetailDraft extends Component {
  render() {
    const v = { ...this.props, ...(this.renderVals() || {}) };
    return (
      <DCHost id="DealDetailDraft" css={CSS} links={LINKS} hostStyle={this.props.__hostStyle}>
        <section style={{"padding":"64px 64px 16px","display":"flex","flexDirection":"column","gap":"8px","maxWidth":"1000px"}}>{"\n  "}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"11px","letterSpacing":"0.06em","textTransform":"uppercase","color":"#5E5E66"}}>AlgoStudio · /deals/:id · Draft stage · v0.1</span>{"\n  "}<h1 style={{"margin":"0","fontFamily":"'Jost',sans-serif","fontWeight":"500","fontSize":"40px","lineHeight":"1.1","letterSpacing":"-0.02em","color":"#111111"}}>Deal detail: Draft</h1>{"\n  "}<p style={{"margin":"0","fontSize":"15px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66","maxWidth":"760px","textWrap":"pretty"}}>The draft answers one question: what's left before the brand can confirm? Missing needed terms come first, with one action. Terms and deliverables are open. Payment, activity and record are one-line rows because nothing has happened yet. Rules are in AlgoStudio Deal Detail Draft Spec v0.1.md.</p></section>{L(v.groups).map(($it1, $i1) => { const v1 = { ...v, g: $it1, $index: $i1 }; return (<React.Fragment key={$i1}>{"\n  "}<section id={v1.g?.id} style={{"padding":"40px 64px 24px","display":"flex","flexDirection":"column","gap":"16px"}}>{"\n    "}<div style={{"display":"flex","flexDirection":"column","gap":"4px","maxWidth":"760px"}}>{"\n      "}<span style={{"fontSize":"20px","fontWeight":"700","color":"#111111"}}>{T(v1.g?.t)}</span>{"\n      "}<span style={{"fontSize":"14px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66"}}>{T(v1.g?.d)}</span>{"\n    "}</div>{"\n    "}<div style={{"display":"flex","flexWrap":"wrap","gap":"40px","alignItems":"flex-start"}}>{"\n      "}{L(v1.g?.screens).map(($it2, $i2) => { const v2 = { ...v1, s: $it2, $index: $i2 }; return (<React.Fragment key={$i2}>{"\n        "}<div id={v2.s?.id} style={sty(`display:flex;flex-direction:column;gap:10px;width:${S(v2.s?.w)}`)}>{"\n          "}<span style={{"fontSize":"13px","fontWeight":"700","color":"#111111"}}>{T(v2.s?.label)}</span>{"\n          "}<div style={sty(`width:${S(v2.s?.w)};height:${S(v2.s?.hgt)};background:#FFFFFF;border-radius:${S(v2.s?.r)};overflow:hidden;box-shadow:0 4px 16px rgba(17,17,17,.06);display:flex;position:relative`)}>{"\n            "}{(v2.s?.desk) ? (<>{"\n              "}<aside style={{"width":"240px","flex":"none","borderRight":"1px solid #E4E4E8","display":"flex","flexDirection":"column","padding":"20px 12px 12px","gap":"4px"}}>{"\n                "}<div style={{"display":"flex","alignItems":"center","gap":"8px","padding":"0 8px","height":"32px","marginBottom":"12px"}}><img src="/assets/logo-mark.png" alt="" style={{"width":"22px","display":"block"}} /><span style={{"fontFamily":"'Oi',sans-serif","fontSize":"13px","color":"#111111"}}>ALGOSTUDIO</span></div>{"\n                "}<div style={{"display":"flex","alignItems":"center","justifyContent":"center","gap":"8px","height":"44px","borderRadius":"12px","background":"#F2F3F5","color":"#111111","fontSize":"14px","fontWeight":"700","marginBottom":"12px"}}><span style={{"width":"16px","height":"16px","background":"currentColor","WebkitMask":"url(https://unpkg.com/lucide-static@0.460.0/icons/plus.svg) center/contain no-repeat","mask":"url(https://unpkg.com/lucide-static@0.460.0/icons/plus.svg) center/contain no-repeat"}}></span>Create deal</div>{"\n                "}{L(v2.sideNav).map(($it3, $i3) => { const v3 = { ...v2, n: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                  "}<div style={sty(`display:flex;align-items:center;gap:10px;height:40px;padding:0 12px;border-radius:12px;background:${S(v3.n?.bg)};color:${S(v3.n?.fg)};font-size:14px;font-weight:${S(v3.n?.fw)}`)}><span style={sty(`width:17px;height:17px;flex:none;background:currentColor;-webkit-mask:${S(v3.n?.mask)};mask:${S(v3.n?.mask)}`)}></span><span style={{"flex":"1"}}>{T(v3.n?.label)}</span><span style={sty(`font-size:12px;font-weight:700;color:${S(v3.n?.cc)}`)}>{T(v3.n?.count)}</span></div>{"\n                "}</React.Fragment>); })}{"\n              "}</aside>{"\n            "}</>) : null}{"\n            "}<div style={{"flex":"1","minWidth":"0","display":"flex","flexDirection":"column"}}>{"\n              "}{(v2.s?.mob) ? (<>{"\n                "}<header style={{"height":"56px","flex":"none","display":"grid","gridTemplateColumns":"44px minmax(0,1fr) 44px","alignItems":"center","padding":"0 8px","borderBottom":"1px solid #E4E4E8"}}>{"\n                  "}<span style={{"width":"44px","height":"44px","display":"flex","alignItems":"center","justifyContent":"center","color":"#111111"}}><span style={sty(`width:22px;height:22px;background:currentColor;-webkit-mask:${S(v2.s?.lMask)};mask:${S(v2.s?.lMask)}`)}></span></span>{"\n                  "}<div style={{"textAlign":"center","display":"flex","flexDirection":"column","gap":"2px","minWidth":"0"}}><span style={{"fontSize":"16px","fontWeight":"700","color":"#111111","whiteSpace":"nowrap","overflow":"hidden","textOverflow":"ellipsis"}}>{T(v2.s?.title)}</span><span style={{"fontSize":"12px","fontWeight":"500","color":"#5E5E66","whiteSpace":"nowrap","overflow":"hidden","textOverflow":"ellipsis"}}>{T(v2.s?.status)}</span></div>{"\n                  "}<span style={{"width":"44px","height":"44px","display":"flex","alignItems":"center","justifyContent":"center","color":"#111111"}}><span style={sty(`width:20px;height:20px;background:currentColor;-webkit-mask:${S(v2.s?.rMask)};mask:${S(v2.s?.rMask)};display:${S(v2.s?.rShow)}`)}></span></span>{"\n                "}</header>{"\n              "}</>) : null}{"\n              "}{(v2.s?.desk) ? (<>{"\n                "}<header style={{"minHeight":"88px","flex":"none","display":"flex","alignItems":"center","gap":"12px","padding":"16px 32px 8px"}}>{"\n                  "}<div style={{"flex":"1","display":"flex","flexDirection":"column","gap":"4px"}}>{"\n                    "}<span style={{"fontSize":"12px","fontWeight":"500","color":"#5E5E66"}}>{T(v2.s?.crumb)}</span>{"\n                    "}<span style={{"fontSize":"22px","fontWeight":"700","color":"#111111"}}>{T(v2.s?.title)}</span>{"\n                  "}</div>{"\n                  "}<span style={{"fontSize":"12px","fontWeight":"500","color":"#5E5E66","whiteSpace":"nowrap"}}>{T(v2.s?.status)}</span>{"\n                "}</header>{"\n              "}</>) : null}{"\n              "}<div style={sty(`flex:1;min-height:0;overflow:hidden;padding:${S(v2.s?.pad)};display:grid;grid-template-columns:${S(v2.s?.cols)};gap:32px;align-items:start`)}>{"\n                "}<div style={{"display":"flex","flexDirection":"column","gap":"16px","minWidth":"0"}}>{"\n                  "}{L(v2.s?.blocks).map(($it3, $i3) => { const v3 = { ...v2, b: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                    "}<CreateDealBlock b={v3.b} />{"\n                  "}</React.Fragment>); })}{"\n                "}</div>{"\n                "}{(v2.s?.desk) ? (<>{"\n                  "}<div style={{"display":"flex","flexDirection":"column","gap":"16px","minWidth":"0"}}>{"\n                    "}{L(v2.s?.side).map(($it3, $i3) => { const v3 = { ...v2, b: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                      "}<CreateDealBlock b={v3.b} />{"\n                    "}</React.Fragment>); })}{"\n                  "}</div>{"\n                "}</>) : null}{"\n              "}</div>{"\n              "}{(v2.s?.hasBar) ? (<>{"\n                "}<div style={{"flex":"none","borderTop":"1px solid #E4E4E8","padding":"10px 16px 14px","display":"flex","flexDirection":"column","gap":"8px","background":"#FFFFFF"}}>{"\n                  "}{(v2.s?.bar?.reason) ? (<><span style={{"textAlign":"center","fontSize":"12px","fontWeight":"700","color":"#B4560F"}}>{T(v2.s?.bar?.reason)}</span></>) : null}{"\n                  "}{(v2.s?.bar?.context) ? (<><span style={{"textAlign":"center","fontSize":"12px","fontWeight":"500","color":"#5E5E66"}}>{T(v2.s?.bar?.context)}</span></>) : null}{"\n                  "}<span style={sty(`display:flex;align-items:center;justify-content:center;height:48px;border-radius:12px;background:${S(v2.s?.bar?.pBg)};color:${S(v2.s?.bar?.pFg)};font-size:15px;font-weight:700`)}>{T(v2.s?.bar?.primary)}</span>{"\n                  "}{(v2.s?.bar?.ghost) ? (<><span style={{"display":"flex","alignItems":"center","justifyContent":"center","height":"44px","borderRadius":"12px","color":"#111111","fontSize":"14px","fontWeight":"700"}}>{T(v2.s?.bar?.ghost)}</span></>) : null}{"\n                "}</div>{"\n              "}</>) : null}{"\n            "}</div>{"\n            "}{(v2.s?.hasSheet) ? (<>{"\n              "}<div style={{"position":"absolute","inset":"0","background":"rgba(17,17,17,.32)"}}></div>{"\n              "}<div style={{"position":"absolute","left":"0","right":"0","bottom":"0","background":"#FFFFFF","borderRadius":"24px 24px 0 0","boxShadow":"0 -8px 40px rgba(17,17,17,.12)","padding":"10px 16px 24px","display":"flex","flexDirection":"column","gap":"14px"}}>{"\n                "}<span style={{"alignSelf":"center","width":"36px","height":"4px","borderRadius":"999px","background":"#D2D3D8"}}></span>{"\n                "}<span style={{"fontSize":"18px","fontWeight":"700","lineHeight":"1.3","color":"#111111"}}>{T(v2.s?.sheet?.t)}</span>{"\n                "}{L(v2.s?.sheet?.blocks).map(($it3, $i3) => { const v3 = { ...v2, b: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                  "}<CreateDealBlock b={v3.b} />{"\n                "}</React.Fragment>); })}{"\n              "}</div>{"\n            "}</>) : null}{"\n          "}</div>{"\n          "}<span style={{"fontSize":"13px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66","textWrap":"pretty"}}>{T(v2.s?.note)}</span>{"\n        "}</div>{"\n      "}</React.Fragment>); })}{"\n    "}</div>{"\n  "}</section></React.Fragment>); })}<div style={{"height":"96px"}}></div>
      </DCHost>
    );
  }
}
