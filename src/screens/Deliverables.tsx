// @ts-nocheck
// Generated from "AlgoStudio Deliverables.dc.html" by scripts/dc-convert.js. Inline styles and logic are kept as in the prototype so it renders the same.
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
    const em = '#0A7F55', dis = '#76767E', red = '#B42318', orange = '#B4560F', muted = '#5E5E66', faint = '#86868E', ink = '#111111', blue = '#2F45C4';
    const mk = (type, o = {}) => ({ mt: '0px', ...o, ['is' + type]: true });
    const Fd = (label, value, o = {}) => {
      const st = o.st || 'normal', has = !!value;
      return mk('Field', { label, value: has ? value : (o.ph || ''), vc: has ? ink : faint, tag: o.tag || '', tagC: o.tagC || muted,
        prefix: '', icon: o.icon ? I(o.icon) : '', src: '', act: '', msg: o.msg || '', mw: st === 'error' ? 700 : 500, mc: st === 'error' ? red : muted,
        bg: st === 'error' ? '#FDE8E8' : st === 'focus' ? '#FFFFFF' : '#F2F3F5', bd: st === 'error' ? '#E5352B' : st === 'focus' ? em : 'transparent', ring: st === 'focus' ? '0 0 0 3px #CDEEDD' : 'none',
        h: o.tall ? o.tall + 'px' : '48px', pad: o.tall ? '12px 14px' : '0 14px', align: o.tall ? 'flex-start' : 'center' });
    };
    const Col = rows => mk('Collapsed', { rows });
    const Menu = rows => mk('Menu', { rows: rows.map(r => ({ chip: '', c: ink, ...r, mask: I(r.icon) })) });
    const AT = { info: ['#EEF2FF', '#2F45C4', blue, 'info'], warning: ['#FFF0E3', '#A34D0D', orange, 'circle-alert'], positive: ['#EFF6E5', '#3E7420', '#3E7420', 'check'] };
    const Al = (tone, t, d, action = '') => { const [bg, badge, fg, ic] = AT[tone]; return mk('Alert', { t, d, action, bg, badge, fg, mask: I(ic) }); };
    const RS = { ok: ['check', '#3E7420'], wait: ['clock', blue] };
    const Ri = (label, value, s) => ({ label, value, mask: I(RS[s][0]), c: RS[s][1], vc: s === 'ok' ? muted : RS[s][1], vw: s === 'ok' ? 500 : 700 });
    const Risk = (t, d, items) => mk('Risk', { t, d, items });
    const Note = (t, icon = 'info') => mk('Note', { t, mask: I(icon) });
    const Txt = t => mk('Txt', { t, c: muted, w: 500, align: 'left' });
    const Act = o => mk('Actions', { reason: '', context: o.context || '', primary: o.p, pBg: em, secondary: o.s });
    const Btns = items => mk('Btns', { items });
    const btn = (t, kind, focus) => ({ t, bg: kind === 'primary' ? em : kind === 'off' ? dis : '#F2F3F5', fg: kind === 'primary' || kind === 'off' ? '#FFFFFF' : kind === 'danger' ? red : ink, ring: focus ? '0 0 0 3px #CDEEDD' : 'none' });
    const CH = { wip: ['In progress', '#EBECEF', '#2E2E33', 'circle-dashed', 'Your turn'], submitted: ['Submitted', '#EEF2FF', blue, 'inbox', "Brand's turn"] };
    const Head = (st, o = {}) => mk('Head', { chip: CH[st][0], chipBg: CH[st][1], chipFg: CH[st][2], chipMask: I(CH[st][3]), turn: CH[st][4], chip2: '',
      ini: 'GI', brand: 'GlowSkin India', brandC: ink, title: 'Vitamin C serum launch', amount: '₹ 25,000', amountC: ink, amountS: '32px', deadline: 'All items due 10 Apr 2026', ...o });
    const steps = ['Draft', 'Sent', 'Confirmed', 'Submitted', 'Approved', 'Paid'];
    const Rail = cur => mk('Rail', { aria: `Step ${cur + 1} of 6, ${steps[cur]}`, steps: steps.map((t, i) => i < cur
      ? { t, bg: em, bd: '0 solid transparent', ring: 'none', w: 500, c: muted }
      : i === cur ? { t, bg: em, bd: '0 solid transparent', ring: '0 0 0 4px #CDEEDD', w: 700, c: ink }
      : { t, bg: '#FFFFFF', bd: '2px solid #D2D3D8', ring: 'none', w: 500, c: faint }) });
    const row = (k, v, s) => ({ k, v, vc: s === 'blue' ? blue : s === 'none' ? faint : ink, vw: s === 'blue' ? 700 : 500 });
    const Terms = (t, d, rows, action = '', more = '') => mk('Terms', { t, d, rows, action, more });
    const DS = {
      todo: ['circle-dashed', '#B4B4BA', muted, '#E4E4E8'], soon: ['clock', '#F08A3E', orange, '#E4E4E8'], late: ['circle-alert', red, red, '#E4E4E8'],
      draft: ['file-pen-line', muted, '#2E2E33', '#D2D3D8'], sent: ['send', '#4361EE', blue, '#62C597'], revision: ['rotate-ccw', '#F08A3E', orange, '#E4E4E8'], approved: ['circle-check', '#3E7420', '#3E7420', em]
    };
    const dv = (name, meta, st, status, v = '', hl = false) => ({ name, meta, status, v, mask: I(DS[st][0]), c: DS[st][1], sc: DS[st][2], bar: DS[st][3], ring: hl ? '0 0 0 2px #0A7F55' : 'none' });
    const Deliv = (d, items, add = 'Add deliverable') => mk('Deliv', { t: 'Deliverables', d, items, add });
    const Seg = on => mk('Seg', { opts: [['Paste a link', 'link'], ['Upload a file', 'upload']].map(([t, ic], i) => ({ t, mask: I(ic), bg: i === on ? '#111111' : 'transparent', fg: i === on ? '#FFFFFF' : '#2E2E33', w: i === on ? 700 : 500 })) });
    const File = o => mk('File', { bg: '#F2F3F5', bd: 'transparent', mask: I(o.icon || 'film'), ac: '#076645', showBar: false, pct: '0%', barC: em, msg: '', mc: red, ...o });
    const bar = o => ({ reason: '', context: o.context || '', primary: o.p, pBg: em, pFg: '#FFFFFF', ghost: o.g || '' });
    const S = o => ({ ...o, mob: true, desk: false, w: '390px', r: '28px', pad: '16px', cols: 'minmax(0,1fr)', side: o.side || [], lMask: I('chevron-left'), rMask: I('ellipsis'), rShow: 'block',
      hasBar: !!o.bar, bar: o.bar ? bar(o.bar) : {}, hasSheet: !!o.sheet, sheet: o.sheet || {}, hgt: o.hgt ? 'auto' : '844px' });
    const D = o => ({ ...S(o), mob: false, desk: true, w: '1280px', r: '12px', pad: '8px 32px 32px', cols: 'minmax(0,640px) 320px', hasBar: false });

    const IG = 'Instagram · ', R = 'Reel', ST = 'Story';
    const wipItems = (hl) => [
      dv('Reel 1', IG + R + ' · due 10 Apr', 'sent', 'Sent for approval · 07 Apr, 18:20', 'v1'),
      dv('Story 1', IG + ST + ' · due 10 Apr', 'draft', 'Draft · not sent yet', 'v1', hl === 1),
      dv('Story 2', IG + ST + ' · due 10 Apr', 'soon', 'Not submitted · due in 2 days'),
      dv('Story 3', IG + ST + ' · due 10 Apr', 'soon', 'Not submitted · due in 2 days')
    ];
    const later = Col([
      { t: 'Payment', d: '₹ 25,000 · due 30 Apr 2026', tag: '', tagC: muted },
      { t: 'Record', d: '8 events · every version is kept', tag: 'View', tagC: '#076645' }]);
    const wipBlocks = [Head('wip'), Rail(2), Deliv('1 of 4 sent · 0 approved · due in 2 days', wipItems()), later];
    const wipBar = { context: 'Story 1 is next · due 10 Apr', p: 'Submit work' };
    const submitLink = (name, v = 'v1') => [Seg(0),
      Fd('Link to your work', '', { ph: 'Instagram, Drive, Dropbox or YouTube link', st: 'focus', tag: 'Paste', tagC: '#076645', msg: 'Check that anyone with the link can view it. GlowSkin India opens it from their approval page.' }),
      Fd('Caption (optional)', '', { ph: 'The caption you plan to post', tall: 64 }),
      Btns([btn(`Send ${v} for approval`, 'off'), btn('Save as draft', 'grey')])];

    const groups = [
      { id: 'P', t: 'Work in progress', d: 'The checklist is the main content of the page while work is in progress. A segmented bar shows progress (approved, sent, left), and each row has one status line. The primary always points at the next item.', screens: [
        S({ id: 'D1', label: '1 · Work in progress', title: 'GlowSkin India', status: 'In progress. 3 items due in 2 days.', hgt: '1080px', blocks: wipBlocks, bar: wipBar,
          note: 'Submit work opens the submit sheet for the most urgent unsent item (a draft first, then the earliest deadline). Rows open their own sheet.' }),
        S({ id: 'D2', label: '2 · Deliverable checklist: one item opened', title: 'GlowSkin India', status: 'In progress. 3 items due in 2 days.', blocks: wipBlocks.slice(0, 3), bar: wipBar, sheet: { t: 'Reel 1', blocks: [
          Terms('Details', '', [row('Platform', 'Instagram'), row('Format', 'Reel, 30–60 seconds'), row('Deadline', '10 Apr 2026'), row('Status', 'v1 sent for approval · waiting for GlowSkin India', 'blue')]),
          Terms('Versions', '', [row('v1', 'Sent 07 Apr, 18:20 · drive.google.com/…/reel1-v1')]),
          Terms('Notes', '', [row('Caption', '“Glow starts here.”'), row('Note to brand', "Music is from GlowSkin India's library.")]),
          Btns([btn('Send a new version', 'grey'), btn('Copy approval link', 'grey')])] },
          note: 'Everything one deliverable holds: name, platform, format, deadline, status, link per version, submitted time and notes.' }),
        S({ id: 'D3', label: '3 · Add deliverable', title: 'GlowSkin India', status: 'In progress. 3 items due in 2 days.', blocks: wipBlocks.slice(0, 3), bar: wipBar, sheet: { t: 'Add deliverable', blocks: [
          Al('warning', 'This changes the confirmed terms.', 'Adding a deliverable creates version 3 of the terms. GlowSkin India confirms it again, and version 2 stays agreed until then.'),
          Fd('Type', 'Story', { icon: 'chevron-down' }), Fd('Platform', 'Instagram', { icon: 'chevron-down' }), Fd('Deadline', '', { ph: 'Pick a date', icon: 'calendar' }),
          Btns([btn('Continue to version 3', 'primary'), btn('Cancel', 'grey', true)])] },
          note: 'Before confirmation, Add deliverable just edits the draft. After confirmation, it goes through the new-version flow.' })
      ] },
      { id: 'U', t: 'Submit: link (V1), file after V1', d: 'A short sheet. Paste a link is selected by default. Upload a file is one tab away, for a single file. There are no folders, file lists or storage meters.', screens: [
        S({ id: 'D4', label: '4 · Paste a link', title: 'GlowSkin India', status: 'In progress. 3 items due in 2 days.', blocks: wipBlocks.slice(0, 3), bar: wipBar, sheet: { t: 'Submit Story 1', blocks: submitLink('Story 1') },
          note: 'Paste reads the clipboard. The link is checked when it’s pasted: Instagram, Drive, Dropbox, YouTube and others show their site name. “Send v1 for approval” turns on once there’s a link or a file.' }),
        S({ id: 'D4b', label: '4 · Upload a file (after V1)', title: 'GlowSkin India', status: 'In progress. 3 items due in 2 days.', blocks: wipBlocks.slice(0, 3), bar: wipBar, sheet: { t: 'Submit Story 1', blocks: [Seg(1),
          File({ name: 'story1_final.mp4', meta: '18.4 MB · uploading 64%', action: 'Cancel', showBar: true, pct: '64%' }),
          Txt('Video or image, up to 200 MB. One file per version. For bigger files, paste a link instead.'),
          Btns([btn('Send v1 for approval', 'off'), btn('Save as draft', 'grey')])] },
          note: 'Opens the phone’s photo and file picker. The upload keeps going if the sheet is closed, and the row shows “Uploading 64%”.' }),
        S({ id: 'D5', label: '5 · Draft submission', title: 'GlowSkin India', status: 'In progress. 3 items due in 2 days.', blocks: [Head('wip'), Rail(2), Deliv('1 of 4 sent · 0 approved · due in 2 days', wipItems(1))], bar: wipBar, sheet: { t: 'Story 1 · draft v1', blocks: [
          Note("GlowSkin India can't see drafts. Send it when it's ready."),
          File({ icon: 'link', name: 'instagram.com/stories/draft/8841…', meta: 'Link · saved 07 Apr, 21:10', action: 'Edit' }),
          Btns([btn('Send v1 for approval', 'primary'), btn('Delete draft', 'danger')])] },
          note: '“Save as draft” keeps the link or file without telling the brand. Drafts aren’t in the record until they’re sent.' })
      ] },
      { id: 'S', t: 'Sending and success', d: 'Everything ready can go together on one approval link. Each item is still approved or sent back on its own.', screens: [
        S({ id: 'D6', label: '6 · Submitted for approval', title: 'GlowSkin India', status: 'In progress. 3 items due in 2 days.', blocks: wipBlocks.slice(0, 3), bar: wipBar, sheet: { t: 'Send 2 items for approval', blocks: [
          Terms('Sending to GlowSkin India', 'One approval link for both', [row('Story 1', 'v1 · instagram.com/stories/draft/8841…'), row('Story 2', 'v1 · story2_final.mp4')]),
          Menu([{ t: 'Share on WhatsApp', d: 'Opens WhatsApp with the approval link', icon: 'message-circle' }, { t: 'Copy link', d: 'Paste it anywhere', icon: 'copy' }, { t: 'Send from your email', d: 'Opens your email app', icon: 'mail' }])] },
          note: 'Opens after “Send v1 for approval” when other items are also ready. The approval link already sent for Reel 1 is replaced by one covering all 3.' }),
        S({ id: 'D7', label: '7 · Submission success', title: 'GlowSkin India', status: 'In progress. Story 3 due in 2 days.', hgt: '1160px', blocks: [
          Al('positive', 'Story 1 and Story 2 sent for approval.', "We'll show GlowSkin India's answer here. The approval link was shared on WhatsApp.", 'Copy approval link'),
          Head('wip'), Rail(2),
          Deliv('3 of 4 sent · 0 approved · due in 2 days', [
            dv('Reel 1', IG + R + ' · due 10 Apr', 'sent', 'Sent for approval · 07 Apr, 18:20', 'v1'),
            dv('Story 1', IG + ST + ' · due 10 Apr', 'sent', 'Sent for approval · 08 Apr, 11:42', 'v1'),
            dv('Story 2', IG + ST + ' · due 10 Apr', 'sent', 'Sent for approval · 08 Apr, 11:42', 'v1'),
            dv('Story 3', IG + ST + ' · due 10 Apr', 'soon', 'Not submitted · due in 2 days')]), later],
          bar: { context: 'Story 3 is next · due 10 Apr', p: 'Submit work' },
          note: 'Recorded per item: “Story 1 v1 sent for approval · link”. The deal moves to Submitted only when every item has been sent.' })
      ] },
      { id: 'E', t: 'Errors and edge cases', d: 'Say what is safe first. Offer a link as the way out of every file problem.', screens: [
        S({ id: 'D8', label: '8 · Failed upload (after V1)', title: 'GlowSkin India', status: 'In progress. Story 3 due in 2 days.', blocks: wipBlocks.slice(0, 3), bar: wipBar, sheet: { t: 'Submit Story 3', blocks: [Seg(1),
          File({ name: 'story3_final.mp4', meta: '42 MB · stopped at 64%', action: 'Try again', showBar: true, pct: '64%', barC: '#E5352B', bg: '#FDE8E8', bd: '#E5352B',
            msg: 'Upload stopped. Your file is still on this phone. Check your connection and try again.' }),
          Btns([btn('Paste a link instead', 'grey')])] },
          note: 'Nothing is sent and nothing is recorded. If the sheet was closed, the row says “Upload stopped. Tap to try again.”' }),
        S({ id: 'D9', label: '9 · Unsupported file (after V1)', title: 'GlowSkin India', status: 'In progress. Story 3 due in 2 days.', blocks: wipBlocks.slice(0, 3), bar: wipBar, sheet: { t: 'Submit Story 3', blocks: [Seg(1),
          File({ icon: 'file-x', name: 'story3_project.zip', meta: 'ZIP · 640 MB', action: 'Choose another', bg: '#FDE8E8', bd: '#E5352B',
            msg: "This file can't be sent. Send a video (MP4, MOV) or an image (JPG, PNG, HEIC) up to 200 MB, or paste a link instead." }),
          Btns([btn('Paste a link instead', 'grey')])] },
          note: 'Too big: “This file is 1.2 GB. Files can be up to 200 MB. Paste a link to it instead.”' }),
        S({ id: 'D10', label: '10 · Missing required deliverable', title: 'GlowSkin India', status: 'In progress. Story 3 is 1 day late.', hgt: '1030px', blocks: [
          Head('wip', { deadline: 'Story 3 was due 10 Apr 2026' }), Rail(2),
          Deliv('3 of 4 sent · 1 approved · 1 late', [
            dv('Reel 1', IG + R, 'approved', 'Approved · v1 · 10 Apr', 'v1'),
            dv('Story 1', IG + ST, 'sent', 'Waiting for review · sent 08 Apr', 'v1'),
            dv('Story 2', IG + ST, 'sent', 'Waiting for review · sent 08 Apr', 'v1'),
            dv('Story 3', IG + ST, 'late', '1 day late · was due 10 Apr')]), later],
          bar: { context: 'Story 3 was due 10 Apr', p: 'Submit Story 3' },
          note: 'The late item is named in the header, the status and the primary. The deal can’t move to Approved until every item is approved.' }),
        S({ id: 'D10b', label: '10 · Sending with no link', title: 'GlowSkin India', status: 'In progress. Story 3 is 1 day late.', blocks: wipBlocks.slice(0, 3), bar: wipBar, sheet: { t: 'Submit Story 3', blocks: [Seg(0),
          Fd('Link to your work', '', { st: 'error', ph: 'Instagram, Drive, Dropbox or YouTube link', msg: 'Add a link to send Story 3.' }),
          Btns([btn('Send v1 for approval', 'primary'), btn('Save as draft', 'grey')])] },
          note: 'Shown if Send is pressed with an empty field (for example by keyboard). Not-a-link text: “This doesn’t look like a link. Links start with https://.”' }),
        S({ id: 'D11', label: '11 · Edited before approval', title: 'GlowSkin India', status: 'In progress. Story 3 due in 2 days.', blocks: wipBlocks.slice(0, 3), bar: wipBar, sheet: { t: 'Send Reel 1 v2', blocks: [
          Al('info', "GlowSkin India hasn't reviewed v1 yet.", "Sending v2 replaces it on Priya's approval page. v1 stays in the record."),
          Seg(0), Fd('Link to your work', 'drive.google.com/file/d/reel1-v2', { st: 'focus', tag: 'Google Drive', tagC: muted }),
          Btns([btn('Send v2 for approval', 'primary'), btn('Keep v1', 'grey', true)])] },
          note: 'A sent version is never edited. A change is always a new version number. After sending, the row reads “Sent for approval · v2 replaces v1”.' }),
        S({ id: 'D12', label: '12 · Brand has not yet reviewed', title: 'GlowSkin India', status: 'Waiting for GlowSkin India to review 4 items.', hgt: '1300px', blocks: [
          Head('submitted'), Rail(3),
          Risk('Waiting for Priya at GlowSkin India', 'Sent 09 Apr, 18:20. Priya opened the approval link on 10 Apr but hasn’t answered yet.', [Ri('Sent for approval', '09 Apr, 18:20', 'ok'), Ri('Opened by Priya', '10 Apr, 09:05', 'ok'), Ri('Answer', 'Waiting · 2 days', 'wait')]),
          Deliv('4 of 4 sent · 0 approved', [
            dv('Reel 1', IG + R, 'sent', 'Waiting for review · sent 2 days ago', 'v2'),
            dv('Story 1', IG + ST, 'sent', 'Waiting for review · sent 2 days ago', 'v1'),
            dv('Story 2', IG + ST, 'sent', 'Waiting for review · sent 2 days ago', 'v1'),
            dv('Story 3', IG + ST, 'sent', 'Waiting for review · sent 2 days ago', 'v1')], ''), later],
          bar: { context: 'Sent 2 days ago', p: 'Send approval reminder', g: 'Copy approval link' },
          note: 'The deal is Submitted once every item has been sent. The reminder quotes the items and the date they were sent.' })
      ] },
      { id: 'W', t: 'Desktop ≥ 1024', d: 'The checklist sits in the left column. Clicking a row opens its details in the right panel instead of a sheet. The primary stays at the top of the panel.', screens: [
        D({ id: 'W1', label: 'W1 · Work in progress, Reel 1 selected', crumb: 'Deals / GlowSkin India', title: 'GlowSkin India', status: 'In progress · version 2 terms', hgt: '980px',
          blocks: [Rail(2), Deliv('1 of 4 sent · 0 approved · due in 2 days', wipItems(1)), later],
          side: [Head('wip'), Act({ context: 'Story 1 is next · due 10 Apr', p: 'Submit work', s: 'Copy approval link' }),
            Terms('Reel 1', 'v1 sent for approval', [row('Format', 'Reel, 30–60 seconds'), row('Deadline', '10 Apr 2026'), row('Link', 'drive.google.com/…/reel1-v1'), row('Sent', '07 Apr 2026, 18:20')], 'Send v2')],
          note: 'Submissions are links in V1. File upload and drop-to-submit come after V1.' })
      ] }
    ];
    const sideNav = [['Home', 'house', 0, ''], ['Deals', 'list', 1, '5'], ['Payments', 'wallet', 0, ''], ['Settings', 'settings', 0, '']]
      .map(([l, ic, on, c]) => ({ label: l, mask: I(ic), bg: on ? '#111111' : 'transparent', fg: on ? '#FFFFFF' : '#2E2E33', fw: on ? 700 : 500, count: c, cc: on ? '#FFFFFF' : red }));
    return { groups, sideNav };
  }
}

export default class Deliverables extends Component {
  render() {
    const v = { ...this.props, ...(this.renderVals() || {}) };
    return (
      <DCHost id="Deliverables" css={CSS} links={LINKS} hostStyle={this.props.__hostStyle}>
        <section style={{"padding":"64px 64px 16px","display":"flex","flexDirection":"column","gap":"8px","maxWidth":"1000px"}}>{"\n  "}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"11px","letterSpacing":"0.06em","textTransform":"uppercase","color":"#5E5E66"}}>AlgoStudio · /deals/:id · Deliverables · v0.1</span>{"\n  "}<h1 style={{"margin":"0","fontFamily":"'Jost',sans-serif","fontWeight":"500","fontSize":"40px","lineHeight":"1.1","letterSpacing":"-0.02em","color":"#111111"}}>Deliverables and submissions</h1>{"\n  "}<p style={{"margin":"0","fontSize":"15px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66","maxWidth":"760px","textWrap":"pretty"}}>One checklist inside Deal detail. Each deliverable is one row with a status line and a version tag. Submitting is a short sheet. Pasting a link is the default, and upload is the second tab for a single file. Every send makes a new version (v1, v2…). Earlier versions stay in the record. Rules and status copy are in AlgoStudio Deliverables Spec v0.1.md.</p></section>{L(v.groups).map(($it1, $i1) => { const v1 = { ...v, g: $it1, $index: $i1 }; return (<React.Fragment key={$i1}>{"\n  "}<section id={v1.g?.id} style={{"padding":"40px 64px 24px","display":"flex","flexDirection":"column","gap":"16px"}}>{"\n    "}<div style={{"display":"flex","flexDirection":"column","gap":"4px","maxWidth":"760px"}}>{"\n      "}<span style={{"fontSize":"20px","fontWeight":"700","color":"#111111"}}>{T(v1.g?.t)}</span>{"\n      "}<span style={{"fontSize":"14px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66"}}>{T(v1.g?.d)}</span>{"\n    "}</div>{"\n    "}<div style={{"display":"flex","flexWrap":"wrap","gap":"40px","alignItems":"flex-start"}}>{"\n      "}{L(v1.g?.screens).map(($it2, $i2) => { const v2 = { ...v1, s: $it2, $index: $i2 }; return (<React.Fragment key={$i2}>{"\n        "}<div id={v2.s?.id} style={sty(`display:flex;flex-direction:column;gap:10px;width:${S(v2.s?.w)}`)}>{"\n          "}<span style={{"fontSize":"13px","fontWeight":"700","color":"#111111"}}>{T(v2.s?.label)}</span>{"\n          "}<div style={sty(`width:${S(v2.s?.w)};height:${S(v2.s?.hgt)};background:#FFFFFF;border-radius:${S(v2.s?.r)};overflow:hidden;box-shadow:0 4px 16px rgba(17,17,17,.06);display:flex;position:relative`)}>{"\n            "}{(v2.s?.desk) ? (<>{"\n              "}<aside style={{"width":"240px","flex":"none","borderRight":"1px solid #E4E4E8","display":"flex","flexDirection":"column","padding":"20px 12px 12px","gap":"4px"}}>{"\n                "}<div style={{"display":"flex","alignItems":"center","gap":"8px","padding":"0 8px","height":"32px","marginBottom":"12px"}}><img src="/assets/logo-mark.png" alt="" style={{"width":"22px","display":"block"}} /><span style={{"fontFamily":"'Oi',sans-serif","fontSize":"13px","color":"#111111"}}>ALGOSTUDIO</span></div>{"\n                "}<div style={{"display":"flex","alignItems":"center","justifyContent":"center","gap":"8px","height":"44px","borderRadius":"12px","background":"#F2F3F5","color":"#111111","fontSize":"14px","fontWeight":"700","marginBottom":"12px"}}><span style={{"width":"16px","height":"16px","background":"currentColor","WebkitMask":"url(https://unpkg.com/lucide-static@0.460.0/icons/plus.svg) center/contain no-repeat","mask":"url(https://unpkg.com/lucide-static@0.460.0/icons/plus.svg) center/contain no-repeat"}}></span>Create deal</div>{"\n                "}{L(v2.sideNav).map(($it3, $i3) => { const v3 = { ...v2, n: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                  "}<div style={sty(`display:flex;align-items:center;gap:10px;height:40px;padding:0 12px;border-radius:12px;background:${S(v3.n?.bg)};color:${S(v3.n?.fg)};font-size:14px;font-weight:${S(v3.n?.fw)}`)}><span style={sty(`width:17px;height:17px;flex:none;background:currentColor;-webkit-mask:${S(v3.n?.mask)};mask:${S(v3.n?.mask)}`)}></span><span style={{"flex":"1"}}>{T(v3.n?.label)}</span><span style={sty(`font-size:12px;font-weight:700;color:${S(v3.n?.cc)}`)}>{T(v3.n?.count)}</span></div>{"\n                "}</React.Fragment>); })}{"\n              "}</aside>{"\n            "}</>) : null}{"\n            "}<div style={{"flex":"1","minWidth":"0","display":"flex","flexDirection":"column"}}>{"\n              "}{(v2.s?.mob) ? (<>{"\n                "}<header style={{"height":"56px","flex":"none","display":"grid","gridTemplateColumns":"44px minmax(0,1fr) 44px","alignItems":"center","padding":"0 8px","borderBottom":"1px solid #E4E4E8"}}>{"\n                  "}<span style={{"width":"44px","height":"44px","display":"flex","alignItems":"center","justifyContent":"center","color":"#111111"}}><span style={sty(`width:22px;height:22px;background:currentColor;-webkit-mask:${S(v2.s?.lMask)};mask:${S(v2.s?.lMask)}`)}></span></span>{"\n                  "}<div style={{"textAlign":"center","display":"flex","flexDirection":"column","gap":"2px","minWidth":"0"}}><span style={{"fontSize":"16px","fontWeight":"700","color":"#111111","whiteSpace":"nowrap","overflow":"hidden","textOverflow":"ellipsis"}}>{T(v2.s?.title)}</span><span style={{"fontSize":"12px","fontWeight":"500","color":"#5E5E66","whiteSpace":"nowrap","overflow":"hidden","textOverflow":"ellipsis"}}>{T(v2.s?.status)}</span></div>{"\n                  "}<span style={{"width":"44px","height":"44px","display":"flex","alignItems":"center","justifyContent":"center","color":"#111111"}}><span style={sty(`width:20px;height:20px;background:currentColor;-webkit-mask:${S(v2.s?.rMask)};mask:${S(v2.s?.rMask)};display:${S(v2.s?.rShow)}`)}></span></span>{"\n                "}</header>{"\n              "}</>) : null}{"\n              "}{(v2.s?.desk) ? (<>{"\n                "}<header style={{"minHeight":"88px","flex":"none","display":"flex","alignItems":"center","gap":"12px","padding":"16px 32px 8px"}}>{"\n                  "}<div style={{"flex":"1","display":"flex","flexDirection":"column","gap":"4px"}}>{"\n                    "}<span style={{"fontSize":"12px","fontWeight":"500","color":"#5E5E66"}}>{T(v2.s?.crumb)}</span>{"\n                    "}<span style={{"fontSize":"22px","fontWeight":"700","color":"#111111"}}>{T(v2.s?.title)}</span>{"\n                  "}</div>{"\n                  "}<span style={{"fontSize":"12px","fontWeight":"500","color":"#5E5E66","whiteSpace":"nowrap"}}>{T(v2.s?.status)}</span>{"\n                "}</header>{"\n              "}</>) : null}{"\n              "}<div style={sty(`flex:1;min-height:0;overflow:hidden;padding:${S(v2.s?.pad)};display:grid;grid-template-columns:${S(v2.s?.cols)};gap:32px;align-items:start`)}>{"\n                "}<div style={{"display":"flex","flexDirection":"column","gap":"16px","minWidth":"0"}}>{"\n                  "}{L(v2.s?.blocks).map(($it3, $i3) => { const v3 = { ...v2, b: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                    "}<CreateDealBlock b={v3.b} />{"\n                  "}</React.Fragment>); })}{"\n                "}</div>{"\n                "}{(v2.s?.desk) ? (<>{"\n                  "}<div style={{"display":"flex","flexDirection":"column","gap":"16px","minWidth":"0"}}>{"\n                    "}{L(v2.s?.side).map(($it3, $i3) => { const v3 = { ...v2, b: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                      "}<CreateDealBlock b={v3.b} />{"\n                    "}</React.Fragment>); })}{"\n                  "}</div>{"\n                "}</>) : null}{"\n              "}</div>{"\n              "}{(v2.s?.hasBar) ? (<>{"\n                "}<div style={{"flex":"none","borderTop":"1px solid #E4E4E8","padding":"10px 16px 14px","display":"flex","flexDirection":"column","gap":"8px","background":"#FFFFFF"}}>{"\n                  "}{(v2.s?.bar?.reason) ? (<><span style={{"textAlign":"center","fontSize":"12px","fontWeight":"700","color":"#B4560F"}}>{T(v2.s?.bar?.reason)}</span></>) : null}{"\n                  "}{(v2.s?.bar?.context) ? (<><span style={{"textAlign":"center","fontSize":"12px","fontWeight":"500","color":"#5E5E66"}}>{T(v2.s?.bar?.context)}</span></>) : null}{"\n                  "}<span style={sty(`display:flex;align-items:center;justify-content:center;height:48px;border-radius:12px;background:${S(v2.s?.bar?.pBg)};color:${S(v2.s?.bar?.pFg)};font-size:15px;font-weight:700`)}>{T(v2.s?.bar?.primary)}</span>{"\n                  "}{(v2.s?.bar?.ghost) ? (<><span style={{"display":"flex","alignItems":"center","justifyContent":"center","height":"44px","borderRadius":"12px","color":"#111111","fontSize":"14px","fontWeight":"700"}}>{T(v2.s?.bar?.ghost)}</span></>) : null}{"\n                "}</div>{"\n              "}</>) : null}{"\n            "}</div>{"\n            "}{(v2.s?.hasSheet) ? (<>{"\n              "}<div style={{"position":"absolute","inset":"0","background":"rgba(17,17,17,.32)"}}></div>{"\n              "}<div style={{"position":"absolute","left":"0","right":"0","bottom":"0","background":"#FFFFFF","borderRadius":"24px 24px 0 0","boxShadow":"0 -8px 40px rgba(17,17,17,.12)","padding":"10px 16px 24px","display":"flex","flexDirection":"column","gap":"14px"}}>{"\n                "}<span style={{"alignSelf":"center","width":"36px","height":"4px","borderRadius":"999px","background":"#D2D3D8"}}></span>{"\n                "}<span style={{"fontSize":"18px","fontWeight":"700","lineHeight":"1.3","color":"#111111"}}>{T(v2.s?.sheet?.t)}</span>{"\n                "}{L(v2.s?.sheet?.blocks).map(($it3, $i3) => { const v3 = { ...v2, b: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                  "}<CreateDealBlock b={v3.b} />{"\n                "}</React.Fragment>); })}{"\n              "}</div>{"\n            "}</>) : null}{"\n          "}</div>{"\n          "}<span style={{"fontSize":"13px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66","textWrap":"pretty"}}>{T(v2.s?.note)}</span>{"\n        "}</div>{"\n      "}</React.Fragment>); })}{"\n    "}</div>{"\n  "}</section></React.Fragment>); })}<div style={{"height":"96px"}}></div>
      </DCHost>
    );
  }
}
