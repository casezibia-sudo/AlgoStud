// @ts-nocheck
// Generated from "AlgoStudio Templates.dc.html" by scripts/dc-convert.js. Inline styles and logic are kept as in the prototype so it renders the same.
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
    const em = '#0A7F55', dis = '#76767E', red = '#B42318', orange = '#B4560F', muted = '#5E5E66', faint = '#86868E';
    const mk = (type, o = {}) => ({ mt: '0px', ...o, ['is' + type]: true });
    const H = (t, d) => mk('H', { t, d });
    const Sec = (t, d) => mk('Sec', { t, d, mt: '8px' });
    const Gh = (t, tag = '', tagC = muted) => mk('Gh', { t, tag, tagC, mt: '6px' });
    const Fd = (label, value, o = {}) => {
      const st = o.st || 'normal', ms = o.mst || st, has = !!value;
      return mk('Field', { label, value: has ? value : (o.ph || ''), vc: has ? '#111111' : faint, tag: o.tag || '', tagC: o.tagC || muted,
        prefix: o.prefix || '', icon: o.icon ? I(o.icon) : '', src: o.src || '', act: o.act || '', msg: o.msg || '',
        mw: ms === 'error' || ms === 'warning' ? 700 : 500, mc: ms === 'error' ? red : ms === 'warning' ? orange : muted,
        bg: st === 'error' ? '#FDE8E8' : st === 'focus' ? '#FFFFFF' : '#F2F3F5', bd: st === 'error' ? '#E5352B' : st === 'focus' ? em : 'transparent',
        ring: st === 'focus' ? '0 0 0 3px #CDEEDD' : 'none', h: o.tall ? o.tall + 'px' : '48px', pad: o.tall ? '12px 14px' : '0 14px', align: o.tall ? 'flex-start' : 'center' });
    };
    const Items = (items, add) => mk('Items', { items, add });
    const Radios = (label, opts, on) => mk('Radios', { label, opts: opts.map((t, i) => ({ t, ring: i === on ? '6px solid #111111' : '1.5px solid #B4B4BA' })) });
    const Col = rows => mk('Collapsed', { rows });
    const Menu = rows => mk('Menu', { rows: rows.map(r => ({ chip: '', c: '#111111', ...r, mask: I(r.icon) })) });
    const AT = { info: ['#EEF2FF', '#2F45C4', '#2F45C4', 'info'], warning: ['#FFF0E3', '#A34D0D', '#B4560F', 'circle-help'], critical: ['#FDE8E8', '#B42318', '#B42318', 'circle-alert'], positive: ['#EFF6E5', '#3E7420', '#3E7420', 'check'] };
    const Al = (tone, t, d, action = '') => { const [bg, badge, fg, ic] = AT[tone]; return mk('Alert', { t, d, action, bg, badge, fg, mask: I(ic) }); };
    const RS = { ok: ['check', '#3E7420'], missing: ['circle-alert', red], unclear: ['circle-help', orange], none: ['minus', faint] };
    const Ri = (label, value, s) => ({ label, value, mask: I(RS[s][0]), c: RS[s][1], vc: s === 'ok' ? muted : RS[s][1], vw: s === 'ok' ? 500 : 700 });
    const Risk = (t, d, items) => mk('Risk', { t, d, items });
    const Pr = items => mk('Prompts', { t: 'Things to check', d: "Practical checks based on common creator deals. This isn't legal advice.", items });
    const Note = (t, icon = 'info') => mk('Note', { t, mask: I(icon) });
    const Skel = () => mk('Skel');
    const Quote = (t, meta, toggle) => mk('Quote', { t, meta, toggle });
    const List = (t, items) => mk('List', { t, items: items.map((x, i) => ({ n: String(i + 1).padStart(2, '0'), t: x })) });
    const Act = o => mk('Actions', { reason: o.reason || '', context: o.context || '', primary: o.p, pBg: o.on ? em : dis, secondary: o.s });
    const Btns = items => mk('Btns', { items });
    const bar = o => ({ reason: o.reason || '', context: o.context || '', primary: o.p, pBg: o.grey ? '#F2F3F5' : o.on ? em : dis, pFg: o.grey ? '#111111' : '#FFFFFF', ghost: o.g || '' });
    const S = o => ({ ...o, mob: true, desk: false, w: '390px', hgt: '844px', r: '28px', pad: '16px', cols: 'minmax(0,1fr)', side: o.side || [], lMask: I(o.lIcon || 'chevron-left'), rMask: I(o.rIcon || 'ellipsis'), rShow: o.rIcon ? 'block' : 'none',
      hasBar: !!o.bar, bar: o.bar ? bar(o.bar) : {}, hasSheet: !!o.sheet, sheet: o.sheet || {}, hgt: o.hgt ? 'auto' : '844px' });
    const D = o => ({ ...S(o), mob: false, desk: true, w: '1280px', r: '12px', pad: '8px 32px 32px', cols: 'minmax(0,640px) 320px', hasBar: false });

    const green = '#076645';
    const DEF = 'Default';
    const tplNote = Note('Brand, amount and dates are never saved in a template. You add them on each deal.', 'lock');
    const listRows = [
      { t: 'Reel + Story bundle', chip: 'Used 4×', d: '1 Reel, 2 Stories · paid 30 days after approval · 2 revisions', icon: 'copy' },
      { t: 'Single Reel', d: '1 Reel · paid on approval · 1 revision', icon: 'copy' },
      { t: 'YouTube integration', d: '1 video · paid 15 days after posting · asks about paid ads', icon: 'copy' }
    ];
    const listBlocks = [H('Templates', 'Starting points for deals you make often. Only you see them.'), Menu(listRows), tplNote];
    const listBar = { p: 'New template', on: true };
    const formBlocks = (name, o = {}) => [
      Sec('Template', 'Only you see the name.'),
      Fd('Template name', name, o.nameF || {}),
      Sec('Defaults for new deals', 'Each value fills a new draft. You can change it there, and the brand confirms the final terms.'),
      Gh('Deliverables', DEF, green), Items([{ t: '1 Reel · Instagram', d: 'Content deadline set on each deal' }, { t: '2 Stories · Instagram', d: 'Content deadline set on each deal' }], 'Add deliverable'),
      Gh('Payment timing', DEF, green), Radios('When the brand pays', ['On a fixed date', 'Days after posting', 'Days after approval'], 2),
      Fd('Days after approval', o.days || '30', o.daysF || { icon: 'chevrons-up-down', msg: 'The amount is entered on each deal.' }),
      Gh('Revision limit', DEF, green), Fd('Revisions included', '2', { icon: 'chevron-down' }),
      Gh('Usage rights', 'Asks each time', muted), Radios('On a new deal', ['Ask me to choose', "Start with brand's own channels, 90 days"], 0),
      Gh('Exclusivity', 'Asks each time', muted), Radios('On a new deal', ['Ask me to choose', 'Start with no exclusivity'], 0),
      Gh('Reminders', DEF, green), Fd('Remind me to follow up', '2 days after sending, if not answered', { icon: 'chevron-down', msg: 'Reminders go through your own WhatsApp or email.' }),
      Gh('Notes for the brand', 'Optional', faint), Fd('Notes', "Raw footage isn't included.", { tall: 88, msg: 'Copied into the draft. Shown to the brand only if you send it.' })
    ];
    const editBar = d => ({ context: d, p: 'Save template', on: true, g: 'Cancel' });
    const sheetMenu = Menu([
      { t: 'Use template', d: 'Start a new draft from these defaults', icon: 'file-plus' },
      { t: 'Edit', d: 'Changes apply to new deals only', icon: 'file-pen-line' },
      { t: 'Duplicate', d: 'Make a copy to change separately', icon: 'copy' },
      { t: 'Delete', d: 'Deals made from it are not affected', icon: 'trash-2', c: red }
    ]);
    const draftBlocks = [
      Al('info', 'New draft from “Reel + Story bundle”.', 'These are your template defaults, not agreed terms. Changing them here doesn’t change the template.'),
      Sec('Needed to send', 'Add these for this deal.'),
      Gh('Brand', 'Add for this deal', orange), Fd('Brand name', '', { ph: 'Brand name', st: 'focus' }), Fd('Contact email', '', { ph: 'name@brand.com' }),
      Gh('Deliverables', 'From template', green), Items([{ t: '1 Reel · Instagram', d: 'Content deadline: add a date' }, { t: '2 Stories · Instagram', d: 'Content deadline: add a date' }], 'Add deliverable'),
      Gh('Payment', 'Amount: add for this deal', orange), Fd('Amount', '', { prefix: '₹', ph: 'Amount for this deal' }),
      Fd('When the brand pays', '30 days after approval', { icon: 'chevron-down', tag: 'From template', tagC: green }),
      Sec('Recommended', 'Filled from the template where it had a default.'),
      Col([
        { t: 'Revision limit', d: '2 revisions included', tag: 'From template', tagC: green },
        { t: 'Usage rights', d: 'Choose for this brand', tag: 'Not added', tagC: orange },
        { t: 'Exclusivity', d: 'Choose for this brand', tag: 'Not added', tagC: orange },
        { t: 'Notes for the brand', d: 'Raw footage isn’t included.', tag: 'From template', tagC: green }
      ])
    ];
    const draftBar = { reason: 'Add brand, amount and 3 content deadlines to send.', p: 'Review terms', on: false, g: 'Save draft' };

    const groups = [
      { id: 'L', t: 'L · Templates list', d: 'One row per template, summarising its defaults in plain words. Rows never show an amount, a brand or a date. Tapping a row opens its actions.', screens: [
        S({ id: 'L1', label: 'L1 · List', title: 'Templates', status: '3 templates', blocks: listBlocks, bar: listBar, lIcon: 'menu',
          note: '“Used 4×” counts drafts started from it. Sorted by last used. The count is only a count: those deals keep their own terms.' }),
        S({ id: 'L2', label: 'L2 · Row actions', title: 'Templates', status: '3 templates', blocks: listBlocks, bar: listBar, lIcon: 'menu', sheet: { t: 'Reel + Story bundle', blocks: [sheetMenu] },
          note: 'A short sheet on mobile, a menu on desktop. Use template is first because it is the common action.' })
      ] },
      { id: 'E', t: 'E · Empty state', d: 'Explains what a template holds and what it leaves out, with one action.', screens: [
        S({ id: 'E1', label: 'E1 · No templates yet', title: 'Templates', status: 'None yet', lIcon: 'menu', blocks: [
          H('No templates yet', 'Save the deliverables, payment timing and revisions you use often. Start a deal from them in one tap.'),
          List('A template can hold', ['Deliverables, without deadlines', 'When payment is due, without the amount', 'Revision limit', 'Prompts for usage and exclusivity', 'Reminder timing and notes']), tplNote],
          bar: { p: 'New template', on: true, g: 'Save one from an existing deal' },
          note: '“Save one from an existing deal” copies a deal’s structure into a new template and drops its brand, amount and dates.' })
      ] },
      { id: 'C', t: 'C · Create template', d: 'The Create deal form with the deal-specific fields removed. Group tags say whether a value is a default or a question asked on each deal.', screens: [
        S({ id: 'C1', label: 'C1 · New template (full scroll)', title: 'New template', status: 'Not saved', hgt: '1900px', blocks: formBlocks('Reel + Story bundle', { nameF: { st: 'focus' } }), bar: editBar('Saved to your templates only'),
          note: '“Default” fills the draft with that value. “Asks each time” leaves the term empty on the draft and adds it to Things to check. Deliverables have no deadline field.' }),
        S({ id: 'C2', label: 'C2 · Saved', title: 'Templates', status: '4 templates', lIcon: 'menu', blocks: [Al('positive', 'Template saved.', 'Use it from Create deal or from this list.', 'Use it now'), Menu([{ t: 'Reel + Story bundle', chip: 'New', d: '1 Reel, 2 Stories · paid 30 days after approval · 2 revisions', icon: 'copy' }, ...listRows.slice(1)])], bar: listBar,
          note: 'Returns to the list with the new row first.' })
      ] },
      { id: 'T', t: 'T · Edit template', d: 'Same form. A note at the top says edits reach new drafts only. Deals already started keep their values.', screens: [
        S({ id: 'T1', label: 'T1 · Editing', title: 'Edit template', status: 'Reel + Story bundle', hgt: '1100px', blocks: [
          Al('info', 'Changes apply to new deals only.', '4 deals started from this template keep their own terms.'),
          ...formBlocks('Reel + Story bundle', { days: '45', daysF: { icon: 'chevrons-up-down', st: 'focus', tag: 'Changed · was 30', tagC: orange } }).slice(0, 8)],
          bar: editBar('1 change'), note: 'Changed fields are marked until saved. Editing a deal never writes back to its template.' })
      ] },
      { id: 'U', t: 'U · Use template', d: 'Using a template creates a new draft that copies its defaults. After that the draft and the template are separate.', screens: [
        S({ id: 'U1', label: 'U1 · Before starting', title: 'Templates', status: '3 templates', lIcon: 'menu', blocks: listBlocks, bar: listBar, sheet: { t: 'Start a deal from “Reel + Story bundle”', blocks: [
          Risk('Filled in from the template', 'Defaults you can change on the draft', [Ri('Deliverables', '1 Reel, 2 Stories', 'ok'), Ri('Payment timing', '30 days after approval', 'ok'), Ri('Revision limit', '2 included', 'ok')]),
          Risk('You add for this deal', 'Never copied from a template', [Ri('Brand and contact', 'Empty', 'none'), Ri('Amount', 'Empty', 'none'), Ri('Content deadlines', 'Empty', 'none'), Ri('Usage and exclusivity', 'Asked on the draft', 'none')]),
          Btns([{ t: 'Start draft', bg: em, fg: '#FFFFFF', ring: 'none' }])] },
          note: 'Also reached from Create deal → Use a template. Start draft creates /deals/:id/edit and replaces this screen in history.' }),
        S({ id: 'U2', label: 'U2 · New draft (full scroll)', title: 'New deal', status: 'Draft · saved 11:02', hgt: '1500px', blocks: draftBlocks, bar: draftBar,
          note: '“From template” tags stay until the creator edits that field, then disappear. The deal record never names the template. The brand only sees the terms that were sent.' })
      ] },
      { id: 'K', t: 'K · Duplicate and delete', d: 'Confirmation sheets reuse the Create deal sheet pattern: one sentence of consequence, a safe default and the action.', screens: [
        S({ id: 'K1', label: 'K1 · Duplicate', title: 'Templates', status: '3 templates', lIcon: 'menu', blocks: listBlocks, bar: listBar, sheet: { t: 'Duplicate template', blocks: [
          Fd('Name of the copy', 'Reel + Story bundle (copy)', { st: 'focus', msg: 'The copy has the same defaults. Changing it won’t affect the original.' }),
          Btns([{ t: 'Duplicate', bg: em, fg: '#FFFFFF', ring: 'none' }, { t: 'Cancel', bg: '#F2F3F5', fg: '#111111', ring: 'none' }])] },
          note: 'After duplicating, the copy opens in Edit so it can be changed straight away.' }),
        S({ id: 'K2', label: 'K2 · Delete', title: 'Templates', status: '3 templates', lIcon: 'menu', blocks: listBlocks, bar: listBar, sheet: { t: 'Delete “Reel + Story bundle”?', blocks: [
          Note('It will be removed from your templates. The 4 deals started from it keep their terms and records.'),
          Btns([{ t: 'Keep template', bg: '#F2F3F5', fg: '#111111', ring: '0 0 0 3px #CDEEDD' }, { t: 'Delete template', bg: '#F2F3F5', fg: red, ring: 'none' }])] },
          note: 'Keep template has focus. After deleting, a toast offers Undo for 10 seconds.' })
      ] },
      { id: 'V', t: 'V · Unsaved changes and validation', d: 'Templates don’t autosave, because a half-edited template would change the next deal. Leaving with changes asks first. Errors show on Save.', screens: [
        S({ id: 'V1', label: 'V1 · Unsaved changes', title: 'Edit template', status: 'Reel + Story bundle', blocks: formBlocks('Reel + Story bundle', { days: '45' }).slice(0, 6), bar: editBar('1 change'), sheet: { t: 'Discard changes to this template?', blocks: [
          Note('Your change to payment timing won’t be saved. The template stays as it was.'),
          Btns([{ t: 'Keep editing', bg: '#F2F3F5', fg: '#111111', ring: '0 0 0 3px #CDEEDD' }, { t: 'Discard changes', bg: '#F2F3F5', fg: red, ring: 'none' }])] },
          note: 'Shown on Back, Cancel or closing the tab. On a new template the title reads “Discard this template?”.' }),
        S({ id: 'V2', label: 'V2 · Save tapped with errors', title: 'New template', status: 'Not saved', hgt: '1000px', blocks: [
          Al('critical', '3 things need attention before saving.', 'Template name · Deliverables · Days after approval', 'Go to the first one'),
          Fd('Template name', 'Single Reel', { st: 'error', msg: 'You already have a template called “Single Reel”. Pick another name.' }),
          Gh('Deliverables', DEF, green), Fd('Deliverables', '', { ph: 'No deliverables', st: 'error', msg: 'Add at least one deliverable.' }),
          Gh('Payment timing', DEF, green), Fd('Days after approval', '400', { st: 'error', msg: 'Enter between 0 and 180 days.' }),
          Fd('Notes', 'Fee ₹ 20,000 for Aster', { tall: 72, mst: 'warning', msg: 'This looks like an amount or brand name. Templates are reused, so add these on each deal instead. You can still save.' })
        ], bar: { reason: 'Fix 3 things to save.', p: 'Save template', on: false, g: 'Cancel' },
          note: 'The warning appears when notes or the name contain a currency amount, a date or a brand name already in your deals. It never blocks saving.' })
      ] },
      { id: 'X', t: 'X · Loading and errors', d: 'Same skeletons and alerts as the rest of the app.', screens: [
        S({ id: 'X1', label: 'X1 · Loading', title: 'Templates', status: 'Loading…', lIcon: 'menu', blocks: [H('Templates', 'Starting points for deals you make often.'), Skel(), Skel(), Skel()],
          note: 'Skeleton rows in the shape of the list. New template stays available while loading.', bar: listBar }),
        S({ id: 'X2', label: 'X2 · Couldn’t load', title: 'Templates', status: '', lIcon: 'menu', blocks: [Al('critical', 'Couldn’t load your templates.', 'Check your connection and try again. Your templates are safe.', 'Try again')],
          note: 'Create deal still works without templates.', bar: { p: 'Create deal without a template', on: true } }),
        S({ id: 'X3', label: 'X3 · Couldn’t save', title: 'Edit template', status: 'Reel + Story bundle', blocks: [Al('critical', 'Couldn’t save the template.', 'Your changes are still here. Try again.', 'Try again'), ...formBlocks('Reel + Story bundle', { days: '45' }).slice(0, 6)], bar: editBar('1 change'),
          note: 'The form keeps every value. Nothing is half-saved.' })
      ] },
      { id: 'W', t: 'Desktop ≥ 1024', d: 'The list sits in the 640 column with a 320 panel explaining how templates and deals stay separate. Editing uses the same two columns as Create deal.', screens: [
        D({ id: 'W1', label: 'W1 · Templates list (desktop)', crumb: 'Templates', title: 'Templates', status: '3 templates', hgt: '720px',
          blocks: [Menu(listRows), tplNote],
          side: [List('How templates work', ['Values are defaults for a new draft', 'Brand, amount and dates are added on each deal', 'The brand confirms the final terms', 'Editing a template never changes past deals']), Act({ p: 'New template', on: true, s: 'Save one from an existing deal' })],
          note: 'Hovering a row shows Use and a ⋯ menu with Edit, Duplicate and Delete.' }),
        D({ id: 'W2', label: 'W2 · Edit template (desktop)', crumb: 'Templates / Reel + Story bundle', title: 'Edit template', status: 'Changes apply to new deals only', hgt: '1500px',
          blocks: formBlocks('Reel + Story bundle', { days: '45', daysF: { icon: 'chevrons-up-down', st: 'focus', tag: 'Changed · was 30', tagC: orange } }),
          side: [Risk('This template fills in', 'Defaults only. Never sent as they are.', [Ri('Deliverables', '1 Reel, 2 Stories', 'ok'), Ri('Payment timing', '45 days after approval', 'ok'), Ri('Revision limit', '2 included', 'ok'), Ri('Usage and exclusivity', 'Asked each time', 'none'), Ri('Brand, amount, dates', 'Added on each deal', 'none')]), Act({ context: '1 change', p: 'Save template', on: true, s: 'Cancel' })],
          note: 'The panel summary updates as fields change.' })
      ] }
    ];
    const sideNav = [['Home', 'house', 0, ''], ['Deals', 'list', 0, '5'], ['Payments', 'wallet', 0, ''], ['Settings', 'settings', 1, '']]
      .map(([l, ic, on, c]) => ({ label: l, mask: I(ic), bg: on ? '#111111' : 'transparent', fg: on ? '#FFFFFF' : '#2E2E33', fw: on ? 700 : 500, count: c, cc: on ? '#FFFFFF' : red }));
    return { groups, sideNav };
  }
}

export default class Templates extends Component {
  render() {
    const v = { ...this.props, ...(this.renderVals() || {}) };
    return (
      <DCHost id="Templates" css={CSS} links={LINKS} hostStyle={this.props.__hostStyle}>
        <section style={{"padding":"64px 64px 16px","display":"flex","flexDirection":"column","gap":"8px","maxWidth":"1000px"}}>{"\n  "}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"11px","letterSpacing":"0.06em","textTransform":"uppercase","color":"#5E5E66"}}>AlgoStudio · /templates · v0.1</span>{"\n  "}<h1 style={{"margin":"0","fontFamily":"'Jost',sans-serif","fontWeight":"500","fontSize":"40px","lineHeight":"1.1","letterSpacing":"-0.02em","color":"#111111"}}>Deal templates</h1>{"\n  "}<p style={{"margin":"0","fontSize":"15px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66","maxWidth":"760px","textWrap":"pretty"}}>A template stores the shape of a deal the creator makes often: deliverables, how payment is timed, revisions, usage and exclusivity choices, reminders and notes. It never stores a brand, an amount or a date. Every value in a template is a default that fills a new draft. Nothing becomes a term until the brand confirms it. Using a template copies it into a new, independent draft, and the template and its drafts never change each other. Built from the Create deal form, cards and sheets. Note: IA v0.3 leaves Templates out of V1.</p></section>{L(v.groups).map(($it1, $i1) => { const v1 = { ...v, g: $it1, $index: $i1 }; return (<React.Fragment key={$i1}>{"\n  "}<section id={v1.g?.id} style={{"padding":"40px 64px 24px","display":"flex","flexDirection":"column","gap":"16px"}}>{"\n    "}<div style={{"display":"flex","flexDirection":"column","gap":"4px","maxWidth":"760px"}}>{"\n      "}<span style={{"fontSize":"20px","fontWeight":"700","color":"#111111"}}>{T(v1.g?.t)}</span>{"\n      "}<span style={{"fontSize":"14px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66"}}>{T(v1.g?.d)}</span>{"\n    "}</div>{"\n    "}<div style={{"display":"flex","flexWrap":"wrap","gap":"40px","alignItems":"flex-start"}}>{"\n      "}{L(v1.g?.screens).map(($it2, $i2) => { const v2 = { ...v1, s: $it2, $index: $i2 }; return (<React.Fragment key={$i2}>{"\n        "}<div id={v2.s?.id} style={sty(`display:flex;flex-direction:column;gap:10px;width:${S(v2.s?.w)}`)}>{"\n          "}<span style={{"fontSize":"13px","fontWeight":"700","color":"#111111"}}>{T(v2.s?.label)}</span>{"\n          "}<div style={sty(`width:${S(v2.s?.w)};height:${S(v2.s?.hgt)};background:#FFFFFF;border-radius:${S(v2.s?.r)};overflow:hidden;box-shadow:0 4px 16px rgba(17,17,17,.06);display:flex;position:relative`)}>{"\n            "}{(v2.s?.desk) ? (<>{"\n              "}<aside style={{"width":"240px","flex":"none","borderRight":"1px solid #E4E4E8","display":"flex","flexDirection":"column","padding":"20px 12px 12px","gap":"4px"}}>{"\n                "}<div style={{"display":"flex","alignItems":"center","gap":"8px","padding":"0 8px","height":"32px","marginBottom":"12px"}}><img src="/assets/logo-mark.png" alt="" style={{"width":"22px","display":"block"}} /><span style={{"fontFamily":"'Oi',sans-serif","fontSize":"13px","color":"#111111"}}>ALGOSTUDIO</span></div>{"\n                "}{L(v2.sideNav).map(($it3, $i3) => { const v3 = { ...v2, n: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                  "}<div style={sty(`display:flex;align-items:center;gap:10px;height:40px;padding:0 12px;border-radius:12px;background:${S(v3.n?.bg)};color:${S(v3.n?.fg)};font-size:14px;font-weight:${S(v3.n?.fw)}`)}><span style={sty(`width:17px;height:17px;flex:none;background:currentColor;-webkit-mask:${S(v3.n?.mask)};mask:${S(v3.n?.mask)}`)}></span><span style={{"flex":"1"}}>{T(v3.n?.label)}</span><span style={sty(`font-size:12px;font-weight:700;color:${S(v3.n?.cc)}`)}>{T(v3.n?.count)}</span></div>{"\n                "}</React.Fragment>); })}{"\n              "}</aside>{"\n            "}</>) : null}{"\n            "}<div style={{"flex":"1","minWidth":"0","display":"flex","flexDirection":"column"}}>{"\n              "}{(v2.s?.mob) ? (<>{"\n                "}<header style={{"height":"56px","flex":"none","display":"grid","gridTemplateColumns":"44px minmax(0,1fr) 44px","alignItems":"center","padding":"0 8px","borderBottom":"1px solid #E4E4E8"}}>{"\n                  "}<span style={{"width":"44px","height":"44px","display":"flex","alignItems":"center","justifyContent":"center","color":"#111111"}}><span style={sty(`width:22px;height:22px;background:currentColor;-webkit-mask:${S(v2.s?.lMask)};mask:${S(v2.s?.lMask)}`)}></span></span>{"\n                  "}<div style={{"textAlign":"center","display":"flex","flexDirection":"column","gap":"2px","minWidth":"0"}}><span style={{"fontSize":"16px","fontWeight":"700","color":"#111111","whiteSpace":"nowrap","overflow":"hidden","textOverflow":"ellipsis"}}>{T(v2.s?.title)}</span><span style={{"fontSize":"12px","fontWeight":"500","color":"#5E5E66","whiteSpace":"nowrap","overflow":"hidden","textOverflow":"ellipsis"}}>{T(v2.s?.status)}</span></div>{"\n                  "}<span style={{"width":"44px","height":"44px","display":"flex","alignItems":"center","justifyContent":"center","color":"#111111"}}><span style={sty(`width:20px;height:20px;background:currentColor;-webkit-mask:${S(v2.s?.rMask)};mask:${S(v2.s?.rMask)};display:${S(v2.s?.rShow)}`)}></span></span>{"\n                "}</header>{"\n              "}</>) : null}{"\n              "}{(v2.s?.desk) ? (<>{"\n                "}<header style={{"minHeight":"88px","flex":"none","display":"flex","alignItems":"center","gap":"12px","padding":"16px 32px 8px"}}>{"\n                  "}<div style={{"flex":"1","display":"flex","flexDirection":"column","gap":"4px"}}>{"\n                    "}<span style={{"fontSize":"12px","fontWeight":"500","color":"#5E5E66"}}>{T(v2.s?.crumb)}</span>{"\n                    "}<span style={{"fontSize":"22px","fontWeight":"700","color":"#111111"}}>{T(v2.s?.title)}</span>{"\n                  "}</div>{"\n                  "}<span style={{"fontSize":"12px","fontWeight":"500","color":"#5E5E66","whiteSpace":"nowrap"}}>{T(v2.s?.status)}</span>{"\n                "}</header>{"\n              "}</>) : null}{"\n              "}<div style={sty(`flex:1;min-height:0;overflow:hidden;padding:${S(v2.s?.pad)};display:grid;grid-template-columns:${S(v2.s?.cols)};gap:32px;align-items:start`)}>{"\n                "}<div style={{"display":"flex","flexDirection":"column","gap":"16px","minWidth":"0"}}>{"\n                  "}{L(v2.s?.blocks).map(($it3, $i3) => { const v3 = { ...v2, b: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                    "}<CreateDealBlock b={v3.b} />{"\n                  "}</React.Fragment>); })}{"\n                "}</div>{"\n                "}{(v2.s?.desk) ? (<>{"\n                  "}<div style={{"display":"flex","flexDirection":"column","gap":"16px","minWidth":"0"}}>{"\n                    "}{L(v2.s?.side).map(($it3, $i3) => { const v3 = { ...v2, b: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                      "}<CreateDealBlock b={v3.b} />{"\n                    "}</React.Fragment>); })}{"\n                  "}</div>{"\n                "}</>) : null}{"\n              "}</div>{"\n              "}{(v2.s?.hasBar) ? (<>{"\n                "}<div style={{"flex":"none","borderTop":"1px solid #E4E4E8","padding":"10px 16px 14px","display":"flex","flexDirection":"column","gap":"8px","background":"#FFFFFF"}}>{"\n                  "}{(v2.s?.bar?.reason) ? (<><span style={{"textAlign":"center","fontSize":"12px","fontWeight":"700","color":"#B4560F"}}>{T(v2.s?.bar?.reason)}</span></>) : null}{"\n                  "}{(v2.s?.bar?.context) ? (<><span style={{"textAlign":"center","fontSize":"12px","fontWeight":"500","color":"#5E5E66"}}>{T(v2.s?.bar?.context)}</span></>) : null}{"\n                  "}<span style={sty(`display:flex;align-items:center;justify-content:center;height:48px;border-radius:12px;background:${S(v2.s?.bar?.pBg)};color:${S(v2.s?.bar?.pFg)};font-size:15px;font-weight:700`)}>{T(v2.s?.bar?.primary)}</span>{"\n                  "}{(v2.s?.bar?.ghost) ? (<><span style={{"display":"flex","alignItems":"center","justifyContent":"center","height":"44px","borderRadius":"12px","color":"#111111","fontSize":"14px","fontWeight":"700"}}>{T(v2.s?.bar?.ghost)}</span></>) : null}{"\n                "}</div>{"\n              "}</>) : null}{"\n            "}</div>{"\n            "}{(v2.s?.hasSheet) ? (<>{"\n              "}<div style={{"position":"absolute","inset":"0","background":"rgba(17,17,17,.32)"}}></div>{"\n              "}<div style={{"position":"absolute","left":"0","right":"0","bottom":"0","background":"#FFFFFF","borderRadius":"24px 24px 0 0","boxShadow":"0 -8px 40px rgba(17,17,17,.12)","padding":"10px 16px 24px","display":"flex","flexDirection":"column","gap":"14px"}}>{"\n                "}<span style={{"alignSelf":"center","width":"36px","height":"4px","borderRadius":"999px","background":"#D2D3D8"}}></span>{"\n                "}<span style={{"fontSize":"18px","fontWeight":"700","lineHeight":"1.3","color":"#111111"}}>{T(v2.s?.sheet?.t)}</span>{"\n                "}{L(v2.s?.sheet?.blocks).map(($it3, $i3) => { const v3 = { ...v2, b: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                  "}<CreateDealBlock b={v3.b} />{"\n                "}</React.Fragment>); })}{"\n              "}</div>{"\n            "}</>) : null}{"\n          "}</div>{"\n          "}<span style={{"fontSize":"13px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66","textWrap":"pretty"}}>{T(v2.s?.note)}</span>{"\n        "}</div>{"\n      "}</React.Fragment>); })}{"\n    "}</div>{"\n  "}</section></React.Fragment>); })}<div style={{"height":"96px"}}></div>
      </DCHost>
    );
  }
}
