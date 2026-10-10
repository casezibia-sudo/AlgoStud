// @ts-nocheck
// Generated from "AlgoStudio Deal Detail Sent and Confirmed.dc.html" by scripts/dc-convert.js. Inline styles and logic are kept as in the prototype so it renders the same.
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
    const em = '#0A7F55', dis = '#76767E', red = '#B42318', orange = '#B4560F', muted = '#5E5E66', faint = '#86868E', ink = '#111111', blue = '#4361EE', grey = '#B4B4BA';
    const mk = (type, o = {}) => ({ mt: '0px', ...o, ['is' + type]: true });
    const H = (t, d) => mk('H', { t, d });
    const Fd = (label, value, o = {}) => {
      const st = o.st || 'normal', has = !!value;
      return mk('Field', { label, value: has ? value : (o.ph || ''), vc: has ? ink : faint, tag: o.tag || '', tagC: o.tagC || muted,
        prefix: o.prefix || '', icon: o.icon ? I(o.icon) : '', src: o.src || '', act: '', msg: o.msg || '', mw: 500, mc: muted,
        bg: st === 'focus' ? '#FFFFFF' : '#F2F3F5', bd: st === 'focus' ? em : 'transparent', ring: st === 'focus' ? '0 0 0 3px #CDEEDD' : 'none',
        h: o.tall ? o.tall + 'px' : '48px', pad: o.tall ? '12px 14px' : '0 14px', align: o.tall ? 'flex-start' : 'center' });
    };
    const Col = rows => mk('Collapsed', { rows });
    const Menu = rows => mk('Menu', { rows: rows.map(r => ({ chip: '', c: ink, ...r, mask: I(r.icon) })) });
    const AT = { info: ['#EEF2FF', blue, '#2F45C4', 'info'], warning: ['#FFF0E3', '#A34D0D', orange, 'clock'], positive: ['#EFF6E5', '#3E7420', '#3E7420', 'check'] };
    const Al = (tone, t, d, action = '') => { const [bg, badge, fg, ic] = AT[tone]; return mk('Alert', { t, d, action, bg, badge, fg, mask: I(ic) }); };
    const RS = { ok: ['check', '#3E7420'], missing: ['circle-alert', red], wait: ['clock', '#2F45C4'], none: ['circle-dashed', faint] };
    const Ri = (label, value, s) => ({ label, value, mask: I(RS[s][0]), c: RS[s][1], vc: s === 'ok' ? muted : RS[s][1], vw: s === 'ok' ? 500 : 700 });
    const Risk = (t, d, items) => mk('Risk', { t, d, items });
    const Pr = (t, d, items) => mk('Prompts', { t, d, items });
    const Note = (t, icon = 'info') => mk('Note', { t, mask: I(icon) });
    const List = (t, items) => mk('List', { t, items: items.map((x, i) => ({ n: String(i + 1).padStart(2, '0'), t: x })) });
    const Act = o => mk('Actions', { reason: o.reason || '', context: o.context || '', primary: o.p, pBg: o.on ? em : dis, secondary: o.s });
    const Btns = items => mk('Btns', { items });
    const btn = (t, kind, focus) => ({ t, bg: kind === 'primary' ? em : '#F2F3F5', fg: kind === 'primary' ? '#FFFFFF' : kind === 'danger' ? red : ink, ring: focus ? '0 0 0 3px #CDEEDD' : 'none' });
    const CH = {
      sent: ['Sent to brand', '#EEF2FF', '#2F45C4', 'send', "Brand's turn"],
      expired: ['Link expired', '#FFF0E3', orange, 'clock', 'Your turn'],
      confirmed: ['Confirmed', '#EFF6E5', '#3E7420', 'shield-check', 'Your turn']
    };
    const Head = (st, o = {}) => mk('Head', { chip: CH[st][0], chipBg: CH[st][1], chipFg: CH[st][2], chipMask: I(CH[st][3]), turn: CH[st][4], chip2: '',
      ini: 'GI', brand: 'GlowSkin India', brandC: ink, title: 'Vitamin C serum launch', amount: '₹ 25,000', amountC: ink, amountS: '32px', deadline: 'Content due 10 Apr 2026', ...o });
    const steps = ['Draft', 'Sent', 'Confirmed', 'Submitted', 'Approved', 'Paid'];
    const Rail = cur => mk('Rail', { aria: `Step ${cur + 1} of 6, ${steps[cur]}`, steps: steps.map((t, i) => i < cur
      ? { t, bg: em, bd: '0 solid transparent', ring: 'none', w: 500, c: muted }
      : i === cur ? { t, bg: em, bd: '0 solid transparent', ring: '0 0 0 4px #CDEEDD', w: 700, c: ink }
      : { t, bg: '#FFFFFF', bd: '2px solid #D2D3D8', ring: 'none', w: 500, c: faint }) });
    const row = (k, v, s) => ({ k, v, vc: s === 'changed' ? orange : s === 'none' ? faint : s === 'lock' ? '#3E7420' : ink, vw: s === 'changed' || s === 'lock' ? 700 : 500 });
    const Terms = (t, d, rows, action = '', more = '') => mk('Terms', { t, d, rows, action, more });
    const TL = (t, items, action = 'View record') => mk('Timeline', { t, action, items: items.map(([t, time, who]) => ({ t, time, dot: who === 'b' ? blue : who === 'c' ? em : grey })) });
    const bar = o => ({ reason: o.reason || '', context: o.context || '', primary: o.p, pBg: o.on === false ? dis : em, pFg: '#FFFFFF', ghost: o.g || '' });
    const S = o => ({ ...o, mob: true, desk: false, w: '390px', r: '28px', pad: '16px', cols: 'minmax(0,1fr)', side: o.side || [], lMask: I('chevron-left'), rMask: I('ellipsis'), rShow: 'block',
      hasBar: !!o.bar, bar: o.bar ? bar(o.bar) : {}, hasSheet: !!o.sheet, sheet: o.sheet || {}, hgt: o.hgt ? 'auto' : '844px' });
    const D = o => ({ ...S(o), mob: false, desk: true, w: '1280px', r: '12px', pad: '8px 32px 32px', cols: 'minmax(0,640px) 320px', hasBar: false });

    const termsV2 = (title, d, action) => Terms(title, d, [
      row('Deliverables', '1 Reel and 3 Stories on Instagram'), row('Payment', '₹ 25,000 · due 30 Apr 2026'),
      row('Dates', 'Content due 10 Apr 2026'), row('Usage rights', 'Own channels for 90 days after posting. No paid ads.'),
      row('Exclusivity', 'Not included', 'none'), row('Revision limit', '2 revisions included')], action, 'Version 1 · replaced 02 Apr');
    const sentTL = [
      ['Priya opened version 2', '03 Apr 2026, 09:12 IST', 'b'],
      ['You sent version 2 on WhatsApp', '02 Apr 2026, 10:24 IST', 'c'],
      ['Priya requested changes: “Can payment be a fixed date?”', '01 Apr 2026, 18:40 IST', 'b'],
      ['You sent version 1 on WhatsApp', '31 Mar 2026, 11:05 IST', 'c']
    ];
    const linkCard = Terms('Confirmation link', 'Version 2', [row('Link', 'algostudio.in/d/k3P9-x7Qm'), row('Sent', '02 Apr 2026, 10:24 on WhatsApp'), row('Expires', '09 Apr 2026 · in 6 days')]);
    const linkBtns = Btns([btn('Copy link', 'grey'), btn('Share link', 'grey')]);
    const later = d => Col([
      { t: 'Deliverables', d: '4 items · all due 10 Apr 2026', tag: '', tagC: muted },
      { t: 'Payment', d: '₹ 25,000 · tracking starts when GlowSkin India confirms', tag: '', tagC: muted },
      { t: 'Record', d, tag: 'View', tagC: '#076645' }]);
    const waitOpened = Risk('Waiting for Priya at GlowSkin India', 'Priya opened the link today at 09:12. She hasn’t answered yet.', [Ri('Link sent', '02 Apr, 10:24', 'ok'), Ri('Opened by Priya', '03 Apr, 09:12', 'ok'), Ri('Answer', 'Waiting', 'wait')]);
    const sentBlocks = [Head('sent'), Rail(1), waitOpened, linkCard, linkBtns, termsV2('Terms sent', 'Version 2 · sent 02 Apr 2026 · read-only while waiting', 'Change terms'), later('5 events · version 1 and 2 kept'), TL('Activity', sentTL)];
    const sentBar = { context: 'Link expires 09 Apr 2026', p: 'Send reminder to GlowSkin India', g: 'Copy link' };

    const confTL = [
      ['Priya Nair confirmed version 2', '03 Apr 2026, 14:32 IST · code sent to p•••@glowskin.in checked', 'b'],
      ['Priya opened version 2', '03 Apr 2026, 09:12 IST', 'b'],
      ['You sent version 2 on WhatsApp', '02 Apr 2026, 10:24 IST', 'c'],
      ['Priya requested changes', '01 Apr 2026, 18:40 IST', 'b'],
      ['You sent version 1 on WhatsApp', '31 Mar 2026, 11:05 IST', 'c']
    ];
    const confirmedBy = Terms('Confirmed by GlowSkin India', '', [row('Name', 'Priya Nair (typed when confirming)'), row('Email', 'p•••@glowskin.in · 6-digit code checked'), row('Time', '03 Apr 2026, 14:32 IST'), row('Version', 'Version 2 · locked', 'lock')]);
    const checklist = Risk('Submit Reel 1 by 10 Apr 2026', '7 days left. Send each item for GlowSkin India’s approval when it’s ready.', [Ri('Reel 1 · Instagram', 'Due 10 Apr', 'none'), Ri('Story 1 · Instagram', 'Due 10 Apr', 'none'), Ri('Story 2 · Instagram', 'Due 10 Apr', 'none'), Ri('Story 3 · Instagram', 'Due 10 Apr', 'none')]);
    const payment = Terms('Payment', 'Not due yet', [row('Amount', '₹ 25,000, before any tax'), row('Due', '30 Apr 2026 · 27 days from today'), row('Payment link', 'Added from Settings to reminders')]);
    const keep = Pr('Things to keep in mind', 'Practical checks based on common creator deals. This isn’t legal advice.', [
      { t: '2 revisions are included.', d: 'A third round would need new terms. We’ll show the count when GlowSkin India asks for changes.', a: 'View revision terms' },
      { t: 'Usage ends 90 days after posting.', d: 'Add the posting date when the content goes live, so the end date is known.', a: 'How posting dates work' }
    ]);
    const lockedTerms = termsV2('Confirmed terms', 'Version 2 · locked 03 Apr 2026 · changing them creates version 3', 'Change terms');
    const confBlocks = [Head('confirmed'), Rail(2), checklist, confirmedBy, lockedTerms, payment, keep,
      Col([{ t: 'Record', d: '6 events · confirmed version 2 saved with the code check', tag: 'View record', tagC: '#076645' }]), TL('Activity', confTL)];
    const confBar = { context: 'Reel 1 due 10 Apr 2026', p: 'Submit work', g: 'View confirmed terms' };

    const groups = [
      { id: 'S', t: 'Sent to brand', d: 'The next step card says who it is waiting for and what they have done: sent, opened, answered. The link and its expiry are visible, and copy and share are one tap away. Terms are read-only while waiting. Changing them sends a new version.', screens: [
        S({ id: 'S1', label: 'S1 · Sent, opened (full scroll)', title: 'GlowSkin India', status: 'Waiting for GlowSkin India to confirm terms.', hgt: '2040px', blocks: sentBlocks, bar: sentBar,
          note: 'Before Priya opens it, the card reads: “Sent 02 Apr, 10:24 on WhatsApp. Not opened yet.” “Opened” is the first open of this version only.' }),
        S({ id: 'S2', label: 'S2 · Send reminder', title: 'GlowSkin India', status: 'Waiting for GlowSkin India to confirm terms.', blocks: sentBlocks.slice(0, 3), bar: sentBar, sheet: { t: 'Send reminder to Priya', blocks: [
          Fd('Message', 'Hi Priya, a reminder that the terms for 1 Reel and 3 Stories (₹ 25,000, content by 10 Apr) are waiting for your confirmation: algostudio.in/d/k3P9-x7Qm. The link works until 09 Apr.', { tall: 132, st: 'focus' }),
          Menu([{ t: 'Share on WhatsApp', d: 'Opens WhatsApp with this message', icon: 'message-circle' }, { t: 'Copy message', d: 'Paste it anywhere', icon: 'copy' }, { t: 'Send from your email', d: 'Opens your email app', icon: 'mail' }])] },
          note: 'The message quotes the agreed terms and dates, and the creator can edit it. Picking a channel records “Reminder sent” with the text. AlgoStudio never messages the brand by itself.' }),
        S({ id: 'S3', label: 'S3 · More menu (sent)', title: 'GlowSkin India', status: 'Waiting for GlowSkin India to confirm terms.', blocks: sentBlocks.slice(0, 3), bar: sentBar, sheet: { t: 'GlowSkin India · Sent', blocks: [
          Menu([{ t: 'Change terms', d: 'Send version 3. Version 2’s link will show it was replaced', icon: 'file-pen-line' },
            { t: 'Replace link', d: 'Same terms, a new link. Use it if the link went to the wrong person', icon: 'refresh-cw' },
            { t: 'View record', d: '5 events', icon: 'file-text' },
            { t: 'Cancel deal', d: 'The link stops working. The record is kept', icon: 'ban', c: red }])] },
          note: 'Copy link and Share link are on the page, so they aren’t repeated here.' }),
        S({ id: 'S4', label: 'S4 · Replace link', title: 'GlowSkin India', status: 'Waiting for GlowSkin India to confirm terms.', blocks: sentBlocks.slice(0, 3), bar: sentBar, sheet: { t: 'Replace this link?', blocks: [
          Note('The current link will stop working and say it was replaced. The terms stay the same (version 2), and the new link works for 7 days.'),
          Btns([btn('Replace link', 'primary'), btn('Keep current link', 'grey', true)])] },
          note: 'After replacing, the Send sheet opens with the new link. Recorded: “Link for version 2 replaced.”' }),
        S({ id: 'S5', label: 'S5 · Link expired', title: 'GlowSkin India', status: 'Your link expired on 09 Apr. GlowSkin India didn’t answer.', hgt: '1220px', blocks: [
          Head('expired'), Rail(1),
          Risk('Send a new link', 'Same terms, version 2. Priya opened the old link on 03 Apr but didn’t answer.', [Ri('Link expired', '09 Apr 2026', 'missing'), Ri('Terms', 'Version 2, unchanged', 'ok')]),
          termsV2('Terms sent', 'Version 2 · sent 02 Apr 2026', 'Change terms'),
          TL('Activity', [['Link for version 2 expired', '09 Apr 2026, 10:24 IST', 'g'], ...sentTL.slice(0, 2)])
        ], bar: { context: 'The new link works for 7 days.', p: 'Send new link', g: 'Change terms first' },
          note: 'Shown in Needs you on Home for 7 days, then in Closed. Send new link reissues version 2 and doesn’t make a new version.' }),
        S({ id: 'S6', label: 'S6 · Viewing a replaced version', title: 'GlowSkin India', status: 'Waiting for GlowSkin India to confirm terms.', blocks: sentBlocks.slice(0, 3), bar: sentBar, sheet: { t: 'Version 1', blocks: [
          Al('info', 'Replaced by version 2 on 02 Apr 2026.', 'Its link now tells the brand it was replaced and points to version 2.'),
          Terms('Version 1 terms', 'Sent 31 Mar 2026 · not confirmed', [row('Payment', '₹ 25,000 · due “end of month”', 'changed'), row('Revision limit', '1 revision included', 'changed'), row('Deliverables', '1 Reel and 3 Stories on Instagram')]),
          Btns([btn('Back to version 2', 'grey', true)])] },
          note: 'Opened from “Version 1 · replaced 02 Apr” under Terms. Rows that differ from the current version are marked.' })
      ] },
      { id: 'C', t: 'Confirmed', d: 'Same sections. The next step becomes the deliverable checklist, the confirmer’s identity and the time are shown, and the terms are locked. Confirmed moves to In progress automatically, so the action is Submit work.', screens: [
        S({ id: 'C1', label: 'C1 · Confirmed (full scroll)', title: 'GlowSkin India', status: 'Confirmed. Reel 1 due in 7 days.', hgt: '2380px', blocks: [Al('positive', 'Your deal has been confirmed.', 'Priya Nair confirmed version 2 on 03 Apr 2026, 14:32 IST.'), ...confBlocks], bar: confBar,
          note: 'The success alert shows until the creator leaves the page. Each item in the checklist opens Submit work for that item. The record link opens /deals/:id/record.' })
      ] },
      { id: 'V', t: 'Changing confirmed terms', d: 'Version 2 is never edited. Changing terms makes version 3, shows exactly what changed, and sends it for confirmation. Until the brand confirms, version 2 stays agreed and the deal keeps its stage.', screens: [
        S({ id: 'V1', label: 'V1 · Explain before editing', title: 'GlowSkin India', status: 'Confirmed. Reel 1 due in 7 days.', blocks: confBlocks.slice(0, 3), bar: confBar, sheet: { t: 'Change confirmed terms?', blocks: [
          mk('Txt', { t: 'Priya confirmed version 2 on 03 Apr. Changing anything creates version 3, which she has to confirm again.', c: '#2E2E33', w: 500, align: 'left' }),
          List('What happens', ['Version 2 stays the agreed terms, and stays in the record.', 'You edit and send version 3. Changed terms are marked for Priya.', 'If Priya confirms, version 3 becomes the agreed terms. If she declines, version 2 stays.']),
          Btns([btn('Continue to version 3', 'primary'), btn('Keep version 2', 'grey', true)])] },
          note: 'Opened from Change terms (Terms card, More menu, or View confirmed terms). Keep version 2 gets focus.' }),
        S({ id: 'V2', label: 'V2 · Editing version 3', title: 'Version 3', status: 'Not sent · version 2 is still agreed', hgt: '1080px', blocks: [
          Al('info', 'You’re editing version 3.', 'Version 2 stays agreed until Priya confirms this one. Changes save as you type.'),
          Fd('Content deadline', '08 Apr 2026', { icon: 'calendar', tag: 'Changed · was 10 Apr', tagC: orange }),
          Fd('Amount', '28,000', { prefix: '₹', st: 'focus', tag: 'Changed · was ₹ 25,000', tagC: orange }),
          Fd('Payment due date', '30 Apr 2026', { icon: 'calendar' }),
          Fd('Usage rights', 'Own channels · 90 days after posting', { icon: 'chevron-down' }),
          Fd('Revisions included', '2', { icon: 'chevron-down' })
        ], bar: { context: '2 changes', p: 'Review changes', g: 'Discard version 3' },
          note: 'The same form as Create deal in version mode. Unchanged terms stay editable. Discard version 3 asks: “Discard version 3? Version 2 stays agreed with GlowSkin India.”' }),
        S({ id: 'V3', label: 'V3 · Review changes', title: 'Version 3', status: 'Not sent · version 2 is still agreed', blocks: [
          Terms('Changes in version 3', 'Compared with version 2, confirmed 03 Apr', [row('Content deadline', '10 Apr 2026 → 08 Apr 2026', 'changed'), row('Amount', '₹ 25,000 → ₹ 28,000', 'changed')]),
          Note('Priya will see these 2 changes marked, and confirms the whole of version 3, not just the changes.'),
          Fd('Note to Priya (optional)', 'Moving the deadline up as you asked, with the rush fee we discussed.', { tall: 88 })
        ], bar: { context: 'Version 2 stays agreed until Priya confirms.', p: 'Send version 3 for confirmation', g: 'Back to edit' },
          note: 'Opens the same Send sheet (WhatsApp, Copy link, Email). The note shows above the terms on the brand’s page.' }),
        S({ id: 'V4', label: 'V4 · Version 3 waiting', title: 'GlowSkin India', status: 'Confirmed · version 3 waiting for GlowSkin India', hgt: '1500px', blocks: [
          Head('confirmed', { chip2: 'Version 3 sent' }), Rail(2),
          Al('info', 'Version 3 sent to Priya.', 'Version 2 is still the agreed terms until she confirms. If she declines the change, version 2 stays and the deal carries on.', 'Copy version 3 link'),
          checklist,
          Terms('Agreed terms', 'Version 2 · confirmed 03 Apr 2026', [row('Content deadline', '10 Apr 2026'), row('Amount', '₹ 25,000'), row('Version 3', 'Sent 04 Apr · changes deadline and amount · waiting', 'changed')], 'Compare'),
          TL('Activity', [['You sent version 3 on WhatsApp', '04 Apr 2026, 11:02 IST', 'c'], ['Priya Nair confirmed version 2', '03 Apr 2026, 14:32 IST', 'b']])
        ], bar: { context: 'Reel 1 due 10 Apr 2026 (version 2)', p: 'Submit work', g: 'Send reminder about version 3' },
          note: 'The stage stays Confirmed. The deal is never sent back to Sent. Dates and amounts everywhere (Home, Payments, reminders) use version 2 until version 3 is confirmed.' })
      ] },
      { id: 'X', t: 'Cancel deal', d: 'Cancelling is final. One sentence of consequence, Keep deal focused, Cancel deal in red. Same sheet pattern as Delete draft.', screens: [
        S({ id: 'X1', label: 'X1 · Cancel deal', title: 'GlowSkin India', status: 'Waiting for GlowSkin India to confirm terms.', blocks: sentBlocks.slice(0, 3), bar: sentBar, sheet: { t: 'Cancel your deal with GlowSkin India?', blocks: [
          Note('The link stops working and tells Priya the deal was cancelled. The record is kept. You can’t undo this.'),
          Btns([btn('Keep deal', 'grey', true), { t: 'Cancel deal', bg: '#F2F3F5', fg: red, ring: 'none' }])] },
          note: 'Opened from More → Cancel deal. Recorded: “Deal cancelled”. Toast: “Deal cancelled.” with no Undo, because the brand has already been told.' })
      ] },
      { id: 'W', t: 'Desktop ≥ 1024', d: 'Left 640: rail, then the stage content. Right 320 panel, in view while scrolling: header facts, next step, primary + secondary, key dates.', screens: [
        D({ id: 'W1', label: 'W1 · Sent to brand', crumb: 'Deals / GlowSkin India', title: 'GlowSkin India', status: 'Version 2 · sent 02 Apr', hgt: '1500px',
          blocks: [Rail(1), linkCard, linkBtns, termsV2('Terms sent', 'Version 2 · read-only while waiting', 'Change terms'), TL('Activity', sentTL)],
          side: [Head('sent'), waitOpened, Act({ context: 'Link expires 09 Apr 2026', p: 'Send reminder to GlowSkin India', on: true, s: 'Copy link' })],
          note: 'Share link on desktop opens the Send sheet as a dialog (WhatsApp Web, Copy link, Email).' }),
        D({ id: 'W2', label: 'W2 · Confirmed', crumb: 'Deals / GlowSkin India', title: 'GlowSkin India', status: 'Version 2 · confirmed 03 Apr', hgt: '1900px',
          blocks: [Rail(2), confirmedBy, lockedTerms, payment, keep, TL('Activity', confTL)],
          side: [Head('confirmed'), checklist, Act({ context: 'Reel 1 due 10 Apr 2026', p: 'Submit work', on: true, s: 'View confirmed terms' }),
            Terms('Key dates', '', [row('Confirmed', '03 Apr 2026, 14:32'), row('Content due', '10 Apr 2026'), row('Payment due', '30 Apr 2026')])],
          note: 'The checklist lives in the panel on desktop, next to the primary.' })
      ] }
    ];
    const sideNav = [['Home', 'house', 0, ''], ['Deals', 'list', 1, '5'], ['Payments', 'wallet', 0, ''], ['Settings', 'settings', 0, '']]
      .map(([l, ic, on, c]) => ({ label: l, mask: I(ic), bg: on ? '#111111' : 'transparent', fg: on ? '#FFFFFF' : '#2E2E33', fw: on ? 700 : 500, count: c, cc: on ? '#FFFFFF' : red }));
    return { groups, sideNav };
  }
}

export default class DealDetailSentAndConfirmed extends Component {
  render() {
    const v = { ...this.props, ...(this.renderVals() || {}) };
    return (
      <DCHost id="DealDetailSentAndConfirmed" css={CSS} links={LINKS} hostStyle={this.props.__hostStyle}>
        <section style={{"padding":"64px 64px 16px","display":"flex","flexDirection":"column","gap":"8px","maxWidth":"1000px"}}>{"\n  "}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"11px","letterSpacing":"0.06em","textTransform":"uppercase","color":"#5E5E66"}}>AlgoStudio · /deals/:id · Sent and Confirmed · v0.1</span>{"\n  "}<h1 style={{"margin":"0","fontFamily":"'Jost',sans-serif","fontWeight":"500","fontSize":"40px","lineHeight":"1.1","letterSpacing":"-0.02em","color":"#111111"}}>Deal detail: Sent and Confirmed</h1>{"\n  "}<p style={{"margin":"0","fontSize":"15px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66","maxWidth":"760px","textWrap":"pretty"}}>Same structure as Draft: header, stage rail, next step, things to check, terms, deliverables, payment, activity, record. Only the content of each section changes with the stage. A confirmed version is never edited. Changing it creates a new version that the brand confirms again, while the confirmed one stays agreed. Rules are in AlgoStudio Deal Detail Sent and Confirmed Spec v0.1.md.</p></section>{L(v.groups).map(($it1, $i1) => { const v1 = { ...v, g: $it1, $index: $i1 }; return (<React.Fragment key={$i1}>{"\n  "}<section id={v1.g?.id} style={{"padding":"40px 64px 24px","display":"flex","flexDirection":"column","gap":"16px"}}>{"\n    "}<div style={{"display":"flex","flexDirection":"column","gap":"4px","maxWidth":"760px"}}>{"\n      "}<span style={{"fontSize":"20px","fontWeight":"700","color":"#111111"}}>{T(v1.g?.t)}</span>{"\n      "}<span style={{"fontSize":"14px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66"}}>{T(v1.g?.d)}</span>{"\n    "}</div>{"\n    "}<div style={{"display":"flex","flexWrap":"wrap","gap":"40px","alignItems":"flex-start"}}>{"\n      "}{L(v1.g?.screens).map(($it2, $i2) => { const v2 = { ...v1, s: $it2, $index: $i2 }; return (<React.Fragment key={$i2}>{"\n        "}<div id={v2.s?.id} style={sty(`display:flex;flex-direction:column;gap:10px;width:${S(v2.s?.w)}`)}>{"\n          "}<span style={{"fontSize":"13px","fontWeight":"700","color":"#111111"}}>{T(v2.s?.label)}</span>{"\n          "}<div style={sty(`width:${S(v2.s?.w)};height:${S(v2.s?.hgt)};background:#FFFFFF;border-radius:${S(v2.s?.r)};overflow:hidden;box-shadow:0 4px 16px rgba(17,17,17,.06);display:flex;position:relative`)}>{"\n            "}{(v2.s?.desk) ? (<>{"\n              "}<aside style={{"width":"240px","flex":"none","borderRight":"1px solid #E4E4E8","display":"flex","flexDirection":"column","padding":"20px 12px 12px","gap":"4px"}}>{"\n                "}<div style={{"display":"flex","alignItems":"center","gap":"8px","padding":"0 8px","height":"32px","marginBottom":"12px"}}><img src="/assets/logo-mark.png" alt="" style={{"width":"22px","display":"block"}} /><span style={{"fontFamily":"'Oi',sans-serif","fontSize":"13px","color":"#111111"}}>ALGOSTUDIO</span></div>{"\n                "}<div style={{"display":"flex","alignItems":"center","justifyContent":"center","gap":"8px","height":"44px","borderRadius":"12px","background":"#F2F3F5","color":"#111111","fontSize":"14px","fontWeight":"700","marginBottom":"12px"}}><span style={{"width":"16px","height":"16px","background":"currentColor","WebkitMask":"url(https://unpkg.com/lucide-static@0.460.0/icons/plus.svg) center/contain no-repeat","mask":"url(https://unpkg.com/lucide-static@0.460.0/icons/plus.svg) center/contain no-repeat"}}></span>Create deal</div>{"\n                "}{L(v2.sideNav).map(($it3, $i3) => { const v3 = { ...v2, n: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                  "}<div style={sty(`display:flex;align-items:center;gap:10px;height:40px;padding:0 12px;border-radius:12px;background:${S(v3.n?.bg)};color:${S(v3.n?.fg)};font-size:14px;font-weight:${S(v3.n?.fw)}`)}><span style={sty(`width:17px;height:17px;flex:none;background:currentColor;-webkit-mask:${S(v3.n?.mask)};mask:${S(v3.n?.mask)}`)}></span><span style={{"flex":"1"}}>{T(v3.n?.label)}</span><span style={sty(`font-size:12px;font-weight:700;color:${S(v3.n?.cc)}`)}>{T(v3.n?.count)}</span></div>{"\n                "}</React.Fragment>); })}{"\n              "}</aside>{"\n            "}</>) : null}{"\n            "}<div style={{"flex":"1","minWidth":"0","display":"flex","flexDirection":"column"}}>{"\n              "}{(v2.s?.mob) ? (<>{"\n                "}<header style={{"height":"56px","flex":"none","display":"grid","gridTemplateColumns":"44px minmax(0,1fr) 44px","alignItems":"center","padding":"0 8px","borderBottom":"1px solid #E4E4E8"}}>{"\n                  "}<span style={{"width":"44px","height":"44px","display":"flex","alignItems":"center","justifyContent":"center","color":"#111111"}}><span style={sty(`width:22px;height:22px;background:currentColor;-webkit-mask:${S(v2.s?.lMask)};mask:${S(v2.s?.lMask)}`)}></span></span>{"\n                  "}<div style={{"textAlign":"center","display":"flex","flexDirection":"column","gap":"2px","minWidth":"0"}}><span style={{"fontSize":"16px","fontWeight":"700","color":"#111111","whiteSpace":"nowrap","overflow":"hidden","textOverflow":"ellipsis"}}>{T(v2.s?.title)}</span><span style={{"fontSize":"12px","fontWeight":"500","color":"#5E5E66","whiteSpace":"nowrap","overflow":"hidden","textOverflow":"ellipsis"}}>{T(v2.s?.status)}</span></div>{"\n                  "}<span style={{"width":"44px","height":"44px","display":"flex","alignItems":"center","justifyContent":"center","color":"#111111"}}><span style={sty(`width:20px;height:20px;background:currentColor;-webkit-mask:${S(v2.s?.rMask)};mask:${S(v2.s?.rMask)};display:${S(v2.s?.rShow)}`)}></span></span>{"\n                "}</header>{"\n              "}</>) : null}{"\n              "}{(v2.s?.desk) ? (<>{"\n                "}<header style={{"minHeight":"88px","flex":"none","display":"flex","alignItems":"center","gap":"12px","padding":"16px 32px 8px"}}>{"\n                  "}<div style={{"flex":"1","display":"flex","flexDirection":"column","gap":"4px"}}>{"\n                    "}<span style={{"fontSize":"12px","fontWeight":"500","color":"#5E5E66"}}>{T(v2.s?.crumb)}</span>{"\n                    "}<span style={{"fontSize":"22px","fontWeight":"700","color":"#111111"}}>{T(v2.s?.title)}</span>{"\n                  "}</div>{"\n                  "}<span style={{"fontSize":"12px","fontWeight":"500","color":"#5E5E66","whiteSpace":"nowrap"}}>{T(v2.s?.status)}</span>{"\n                "}</header>{"\n              "}</>) : null}{"\n              "}<div style={sty(`flex:1;min-height:0;overflow:hidden;padding:${S(v2.s?.pad)};display:grid;grid-template-columns:${S(v2.s?.cols)};gap:32px;align-items:start`)}>{"\n                "}<div style={{"display":"flex","flexDirection":"column","gap":"16px","minWidth":"0"}}>{"\n                  "}{L(v2.s?.blocks).map(($it3, $i3) => { const v3 = { ...v2, b: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                    "}<CreateDealBlock b={v3.b} />{"\n                  "}</React.Fragment>); })}{"\n                "}</div>{"\n                "}{(v2.s?.desk) ? (<>{"\n                  "}<div style={{"display":"flex","flexDirection":"column","gap":"16px","minWidth":"0"}}>{"\n                    "}{L(v2.s?.side).map(($it3, $i3) => { const v3 = { ...v2, b: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                      "}<CreateDealBlock b={v3.b} />{"\n                    "}</React.Fragment>); })}{"\n                  "}</div>{"\n                "}</>) : null}{"\n              "}</div>{"\n              "}{(v2.s?.hasBar) ? (<>{"\n                "}<div style={{"flex":"none","borderTop":"1px solid #E4E4E8","padding":"10px 16px 14px","display":"flex","flexDirection":"column","gap":"8px","background":"#FFFFFF"}}>{"\n                  "}{(v2.s?.bar?.reason) ? (<><span style={{"textAlign":"center","fontSize":"12px","fontWeight":"700","color":"#B4560F"}}>{T(v2.s?.bar?.reason)}</span></>) : null}{"\n                  "}{(v2.s?.bar?.context) ? (<><span style={{"textAlign":"center","fontSize":"12px","fontWeight":"500","color":"#5E5E66"}}>{T(v2.s?.bar?.context)}</span></>) : null}{"\n                  "}<span style={sty(`display:flex;align-items:center;justify-content:center;height:48px;border-radius:12px;background:${S(v2.s?.bar?.pBg)};color:${S(v2.s?.bar?.pFg)};font-size:15px;font-weight:700`)}>{T(v2.s?.bar?.primary)}</span>{"\n                  "}{(v2.s?.bar?.ghost) ? (<><span style={{"display":"flex","alignItems":"center","justifyContent":"center","height":"44px","borderRadius":"12px","color":"#111111","fontSize":"14px","fontWeight":"700"}}>{T(v2.s?.bar?.ghost)}</span></>) : null}{"\n                "}</div>{"\n              "}</>) : null}{"\n            "}</div>{"\n            "}{(v2.s?.hasSheet) ? (<>{"\n              "}<div style={{"position":"absolute","inset":"0","background":"rgba(17,17,17,.32)"}}></div>{"\n              "}<div style={{"position":"absolute","left":"0","right":"0","bottom":"0","background":"#FFFFFF","borderRadius":"24px 24px 0 0","boxShadow":"0 -8px 40px rgba(17,17,17,.12)","padding":"10px 16px 24px","display":"flex","flexDirection":"column","gap":"14px"}}>{"\n                "}<span style={{"alignSelf":"center","width":"36px","height":"4px","borderRadius":"999px","background":"#D2D3D8"}}></span>{"\n                "}<span style={{"fontSize":"18px","fontWeight":"700","lineHeight":"1.3","color":"#111111"}}>{T(v2.s?.sheet?.t)}</span>{"\n                "}{L(v2.s?.sheet?.blocks).map(($it3, $i3) => { const v3 = { ...v2, b: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                  "}<CreateDealBlock b={v3.b} />{"\n                "}</React.Fragment>); })}{"\n              "}</div>{"\n            "}</>) : null}{"\n          "}</div>{"\n          "}<span style={{"fontSize":"13px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66","textWrap":"pretty"}}>{T(v2.s?.note)}</span>{"\n        "}</div>{"\n      "}</React.Fragment>); })}{"\n    "}</div>{"\n  "}</section></React.Fragment>); })}<div style={{"height":"96px"}}></div>
      </DCHost>
    );
  }
}
