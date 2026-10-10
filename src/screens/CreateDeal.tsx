// @ts-nocheck
// Generated from "AlgoStudio Create Deal.dc.html" by scripts/dc-convert.js. Inline styles and logic are kept as in the prototype so it renders the same.
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

    const MSG = "Hi Ananya, loved your skincare Reels. We're launching our Vitamin C serum on 15 Apr. Could you do 1 Reel + 3 Stories? Budget is 25k, payment by end of month. Usage as discussed.\n\nThanks,\nPriya\nGlowSkin India";
    const privacy = "We read the message to fill in the terms for you to check. It's kept with this deal so you can see what the brand wrote. It isn't shown to the brand.";

    const c1Blocks = [
      H('Deal terms', 'Fill in what you know. You can save a draft at any point.'),
      Sec('Needed to send', "The brand can't confirm a deal without these."),
      Gh('Brand'), Fd('Brand name', 'Aster Skincare', { st: 'focus' }), Fd('Contact name', 'Meera'),
      Fd('Contact email', '', { ph: 'name@brand.com', msg: 'Meera gets a 6-digit code here when she answers your link.' }),
      Gh('Deliverables', '1 added'), Items([{ t: '1 Reel · Instagram', d: 'Content deadline 20 Apr 2026' }], 'Add deliverable'),
      Gh('Payment'), Fd('Currency', '₹ Indian rupee (INR)', { icon: 'chevron-down' }), Fd('Amount', '35,000', { prefix: '₹' }),
      Radios('When the brand pays', ['On a fixed date', 'Days after posting', 'Days after approval'], 0),
      Fd('Payment due date', '', { ph: 'Pick a date', icon: 'calendar' }),
      Sec('Recommended', 'Not needed to send, but they prevent most disagreements later.'),
      Col([
        { t: 'Deal title', d: "We'll use “1 Reel · Aster Skincare”", tag: 'Optional', tagC: faint },
        { t: 'Usage rights', d: 'Where and for how long the brand can use your content', tag: 'Not added', tagC: orange },
        { t: 'Exclusivity', d: 'Brands you agree not to work with, and for how long', tag: 'Not added', tagC: orange },
        { t: 'Revision limit', d: 'How many rounds of changes are included', tag: 'Not added', tagC: orange },
        { t: 'Notes for the brand', d: 'Anything else they should agree to', tag: 'Optional', tagC: faint }
      ])
    ];
    const c1Bar = { context: 'Draft saved 14:32', p: 'Review terms', on: true, g: 'Save draft' };
    const b2Blocks = [H("Paste the brand's message", 'From Instagram, WhatsApp or email.'), Fd("Brand's message", MSG, { tall: 280, st: 'focus', tag: 'Clear', tagC: '#076645' }), Note(privacy, 'lock')];
    const neededD1 = [Ri('Brand and contact', 'GlowSkin India · Priya', 'ok'), Ri('Contact email', 'Missing', 'missing'), Ri('Deliverables', '1 Reel, 3 Stories', 'ok'), Ri('Content deadline', 'Unclear', 'unclear'), Ri('Amount', '₹ 25,000', 'ok'), Ri('Payment due date', 'Unclear', 'unclear')];
    const dueField = Fd('Payment due date', '', { ph: 'Pick a date', icon: 'calendar', st: 'focus', mst: 'warning', src: 'From message: “payment by end of month”', msg: '“End of month” could mean this month or the month you post. Pick an exact date.', act: 'Use 30 Apr 2026' });
    const deadField = Fd('Content deadline', '15 Apr 2026', { icon: 'calendar', mst: 'warning', src: 'From message: “launching our Vitamin C serum on 15 Apr”', msg: '15 Apr is the launch date. Is that when the content is due, or when it goes live?', act: 'Yes, this is the content deadline' });
    const recD1 = Risk('Recommended terms', '1 of 4 is clear', [Ri('Deal title', 'Vitamin C serum launch', 'ok'), Ri('Usage rights', 'Unclear', 'unclear'), Ri('Exclusivity', 'Not mentioned', 'none'), Ri('Revision limit', 'Not mentioned', 'none')]);
    const promptsD1 = Pr([
      { t: 'Usage rights are vague.', d: '“Usage as discussed” doesn\'t say where or for how long GlowSkin India can use your content.', a: 'Add usage rights' },
      { t: 'No revision limit.', d: "Without one, the terms don't say how many rounds of changes are included.", a: 'Add revision limit' },
      { t: "Exclusivity isn't mentioned.", d: "If the brand expects you to avoid other skincare brands, add it so it's part of what they confirm.", a: 'Add exclusivity' }
    ]);
    const d2Blocks = [
      Risk('Ready to send', 'All needed terms are clear. 1 recommended term is not added.', [Ri('Brand and contact', 'GlowSkin India · priya@glowskin.in', 'ok'), Ri('Deliverables', '1 Reel, 3 Stories', 'ok'), Ri('Content deadline', '10 Apr 2026', 'ok'), Ri('Amount', '₹ 25,000', 'ok'), Ri('Payment due date', '30 Apr 2026', 'ok')]),
      Risk('Recommended terms', '3 of 4 added', [Ri('Usage rights', 'Own channels · 90 days', 'ok'), Ri('Revision limit', '2 included', 'ok'), Ri('Deal title', 'Vitamin C serum launch', 'ok'), Ri('Exclusivity', 'Not mentioned', 'none')]),
      Pr([{ t: "Exclusivity isn't mentioned.", d: "If GlowSkin India expects you to avoid other skincare brands, add it so it's part of what they confirm.", a: 'Add exclusivity' }]),
      Col([{ t: 'What GlowSkin India will see', d: 'The terms in plain sentences, as the brand will read them', tag: 'Preview', tagC: '#076645' }])
    ];
    const d2Bar = { context: 'Priya will get a link to read and confirm these terms.', p: 'Send confirmation link', on: true, g: 'Save draft' };

    const groups = [
      { id: 'A', t: 'A · Entry', d: "Shown when /deals/new is opened directly. The Create deal sheet skips it by passing the mode, so most creators start at B, C or the template list.", screens: [
        S({ id: 'A1', label: 'A1 · Choose how to start', title: 'New deal', status: 'Not saved yet', blocks: [
          H('Start a new deal', 'Nothing is sent to a brand until you choose to send it.'),
          Menu([
            { t: "Paste a brand's message", chip: 'Fastest', d: "We'll fill in the terms for you to check.", icon: 'clipboard-paste' },
            { t: 'Start manually', d: 'Fill in the brand, deliverables and payment yourself.', icon: 'file-pen-line' },
            { t: 'Use a template', d: '3 saved · start from terms you use often.', icon: 'copy' }
          ])], note: 'Use a template is hidden when there are no templates. Nothing is created until a choice is made.' }),
        S({ id: 'A2', label: 'A2 · Use a template', title: 'Use a template', status: 'New deal', blocks: [
          Menu([
            { t: 'Reel + Story bundle', d: '1 Reel, 2 Stories · paid 30 days after approval · 2 revisions', icon: 'copy' },
            { t: 'Single Reel', d: '1 Reel · paid on approval · 1 revision', icon: 'copy' },
            { t: 'YouTube integration', d: '1 video · paid 15 days after posting · asks about paid ads', icon: 'copy' }
          ]),
          Note('A template fills in default deliverables, payment timing, revisions and notes. You add the brand, the amount and the dates.')],
          note: 'Picking one opens the confirm sheet in AlgoStudio Templates (U1), then C with defaults tagged “From template”. Brand, amount and dates are always empty.' })
      ] },
      { id: 'B', t: 'B · Paste a message', d: 'One large field, a plain note on what happens to the text, and a way out to manual entry at every step.', screens: [
        S({ id: 'B1', label: 'B1 · Empty', title: 'Paste message', status: 'New deal · not saved yet', blocks: [
          H("Paste the brand's message", 'From Instagram, WhatsApp or email.'),
          Fd("Brand's message", '', { ph: 'Paste the whole message, including names, amounts and dates.', tall: 280, st: 'focus', tag: 'Paste from clipboard', tagC: '#076645' }),
          Note(privacy, 'lock')], bar: { reason: 'Paste a message to continue.', p: 'Read message', on: false, g: 'Start manually instead' },
          note: 'The field is focused on load. “Paste from clipboard” appears only when the browser allows it.' }),
        S({ id: 'B2', label: 'B2 · Message pasted', title: 'Paste message', status: 'New deal · not saved yet', blocks: b2Blocks, bar: { p: 'Read message', on: true, g: 'Start manually instead' },
          note: 'Clear empties the field (with Undo in a toast). Leaving now asks before discarding (G2).' }),
        S({ id: 'B3', label: 'B3 · Reading', title: 'Reading message', status: 'New deal', blocks: [
          H('Reading the message…', 'Looking for the brand, deliverables, amount and dates. This usually takes a few seconds.'), Skel(), Skel(), Skel()],
          bar: { context: 'Your message is kept even if you cancel.', p: 'Cancel', grey: true },
          note: 'Static skeletons in the shape of the form. A draft is created here, and /deals/new becomes /deals/:id/edit.' }),
        S({ id: 'B4', label: "B4 · Couldn't read it", title: 'New deal', status: 'Draft · saved 10:14', blocks: [
          Al('warning', "Couldn't read the terms from this message.", 'Your message is saved with the draft. Fill in the terms yourself. The message stays at the top of the form so you can copy from it.'),
          Quote(MSG, 'Instagram DM · pasted 10:14', 'Hide')], bar: { p: 'Continue manually', on: true, g: 'Try again' },
          note: 'Also shown if reading takes longer than 15 seconds. Nothing is lost. If only some terms were found, the creator goes to D instead.' })
      ] },
      { id: 'C', t: 'C · Manual entry', d: 'Needed-to-send groups are open. Recommended groups are collapsed to one line each and open on tap. Each recommended choice becomes the plain sentence the brand will confirm.', screens: [
        S({ id: 'C1', label: 'C1 · Needed to send (full scroll)', title: 'New deal', status: 'Draft · saved 14:32', hgt: '1660px', blocks: c1Blocks, bar: c1Bar,
          note: 'Autosaves 1 second after each change. Currency defaults to ₹ INR. Amounts in other currencies are never converted.' }),
        S({ id: 'C2', label: 'C2 · Recommended, opened', title: 'New deal', status: 'Draft · saved 14:35', hgt: '1660px', blocks: [
          Sec('Recommended', 'Not needed to send, but they prevent most disagreements later.'),
          Gh('Deal title', 'Optional', faint), Fd('Deal title', 'Summer sunscreen launch', { msg: 'Only you and the brand see this.' }),
          Gh('Usage rights'), Radios('Where the brand can use your content', ['Only on your account', "Brand's own channels", "Brand's channels and paid ads"], 1),
          Fd('For how long', '90 days after posting', { icon: 'chevron-down', msg: 'Brand can repost on its own channels for 90 days after posting.' }),
          Gh('Exclusivity'), Radios('Can you work with similar brands?', ['Yes, no limits', 'Not with competing brands'], 1),
          Fd('Which brands', 'Other sunscreen brands'), Fd('For how long', '30 days after posting', { icon: 'chevron-down', msg: "You won't post for other sunscreen brands for 30 days after posting." }),
          Gh('Revision limit'), Fd('Revisions included', '2', { icon: 'chevron-down', msg: 'More revisions would need a new agreement.' }),
          Gh('Notes for the brand', 'Optional', faint), Fd('Notes', "Raw footage isn't included. The brand licenses any music used in ads.", { tall: 96, msg: 'Shown to the brand with the terms.' })
        ], bar: { context: 'Draft saved 14:35', p: 'Review terms', on: true, g: 'Save draft' },
          note: 'The grey line under each choice is exactly what the brand reads and confirms. No legal wording.' }),
        S({ id: 'C3', label: 'C3 · Add deliverable (sheet)', title: 'New deal', status: 'Draft · saved 14:32', blocks: c1Blocks.slice(0, 6), bar: c1Bar, sheet: { t: 'Add deliverable', blocks: [
          Fd('Type', 'Story', { icon: 'chevron-down' }), Fd('Platform', 'Instagram', { icon: 'chevron-down' }), Fd('How many', '3', { icon: 'chevrons-up-down' }),
          Fd('Content deadline', '', { ph: 'Pick a date', icon: 'calendar', st: 'focus', msg: 'The date you send the work to the brand for approval.' }),
          Btns([{ t: 'Add deliverable', bg: em, fg: '#FFFFFF', ring: 'none' }])] },
          note: 'A short sheet, not a page. Each deliverable becomes one line in the terms: “3 Stories · Instagram · due 18 Apr 2026”.' })
      ] },
      { id: 'D', t: 'D · Review', d: 'Every term with its source and state. Needed terms first, then recommended terms, then practical prompts. Tapping any row opens its field in place.', screens: [
        S({ id: 'D1', label: 'D1 · Missing and unclear (from a message)', title: 'Review terms', status: 'Draft · saved 10:15', hgt: '2060px', blocks: [
          Al('info', 'We filled in 9 terms from the message.', "Check each one. We leave a term empty rather than guess it."),
          Risk('3 terms needed to send', '3 of 6 needed terms are clear', neededD1),
          Gh('Payment due date', 'Unclear', orange), dueField,
          Gh('Content deadline', 'Unclear', orange), deadField,
          recD1, promptsD1, Quote(MSG, 'Original message · Instagram DM · 10:14', 'Hide')
        ], bar: { reason: 'Add contact email and confirm 2 dates to send.', p: 'Send confirmation link', on: false, g: 'Save draft' },
          note: '“From message” shows the words each value came from. Unclear: found, but it can be read two ways. Not mentioned: not in the message. An unclear needed term blocks sending until it is confirmed or changed. There are no confidence percentages.' }),
        S({ id: 'D2', label: 'D2 · Ready to send', title: 'Review terms', status: 'Draft · saved 10:21', hgt: '1160px', blocks: d2Blocks, bar: d2Bar,
          note: 'Recommended terms never block sending. The prompt stays until the term is added or the deal is sent.' })
      ] },
      { id: 'E', t: 'E · Save draft', d: 'Save draft works with anything filled in. It leaves the form, opens the deal and says nothing was sent.', screens: [
        S({ id: 'E1', label: 'E1 · Draft saved', title: 'Aster Skincare', status: 'Draft. Add payment due date to send.', rIcon: 'ellipsis', blocks: [
          Al('positive', 'Draft saved.', "It's in Deals under Needs you. Nothing was sent to Aster Skincare."),
          Risk('1 term needed to send', '5 of 6 needed terms are clear', [Ri('Payment due date', 'Missing', 'missing')]),
          Col([{ t: 'Terms', d: 'Aster Skincare · 1 Reel · ₹ 35,000', tag: '', tagC: muted }, { t: 'Recommended', d: 'Usage, exclusivity and revisions', tag: '3 to add', tagC: orange }])
        ], bar: { reason: 'Add payment due date to send.', p: 'Send confirmation link', on: false, g: 'Edit terms' },
          note: 'Changes also autosave while typing, so Save draft never loses or overwrites anything. It means “I’m done for now”.' })
      ] },
      { id: 'F', t: 'F · Send confirmation link', d: 'Choosing a channel is the send. The first send also asks for the name brands will see.', screens: [
        S({ id: 'F1', label: 'F1 · Send sheet (first send)', title: 'Review terms', status: 'Draft · saved 10:21', blocks: d2Blocks.slice(0, 1), bar: d2Bar, sheet: { t: 'Send confirmation link to Priya, GlowSkin India', blocks: [
          Fd('Your name', 'Ananya Rao', { msg: 'Shown to GlowSkin India on the link. You only add this once.' }),
          Menu([
            { t: 'Share on WhatsApp', d: 'Opens WhatsApp with the link and a short message you can edit', icon: 'message-circle' },
            { t: 'Copy link', d: 'Paste it into Instagram or anywhere else', icon: 'copy' },
            { t: 'Send from your email', d: 'Opens your email app with the link', icon: 'mail' }
          ]),
          Note('Priya confirms with a code sent to p•••@glowskin.in. The link works for 7 days.')] },
          note: 'The deal becomes Sent only when a channel is picked. Closing the sheet keeps the draft as it was.' }),
        S({ id: 'F2', label: 'F2 · Link sent', title: 'GlowSkin India', status: 'Waiting for GlowSkin India to confirm terms.', rIcon: 'ellipsis', blocks: [
          Al('positive', 'Link shared on WhatsApp.', "We'll show Priya's answer here. The link expires on 09 Apr 2026.", 'Copy link again'),
          Col([{ t: 'Terms', d: 'Version 1 · sent 02 Apr 2026, 10:24', tag: '', tagC: muted }, { t: 'Record', d: 'Terms v1 sent on WhatsApp', tag: '', tagC: muted }])
        ], bar: { context: 'Sent today · link expires 09 Apr', p: 'Send reminder to GlowSkin India', on: true, g: 'Copy link' },
          note: 'The form is replaced in history, so Back from here goes to Deals, not to the form.' })
      ] },
      { id: 'G', t: 'G · Validation and recovery', d: 'Errors only after Send is tapped, or for impossible values. Warnings never block. The only unsaved-changes prompt is for a pasted message that was never read.', screens: [
        S({ id: 'G1', label: 'G1 · Send tapped with errors', title: 'Review terms', status: 'Draft · saved 10:18', hgt: '1000px', blocks: [
          Al('critical', '3 terms need attention before sending.', 'Contact email · Amount · Content deadline', 'Go to the first one'),
          Gh('Brand'), Fd('Contact email', 'priya@glowskin', { st: 'error', msg: 'Enter a full email, like priya@glowskin.in.' }),
          Gh('Deliverables'), Fd('Content deadline', '28 Mar 2026', { icon: 'calendar', st: 'error', msg: 'This date has passed. Pick today or later.' }),
          Gh('Payment'), Fd('Amount', '0', { prefix: '₹', st: 'error', msg: 'Enter the amount the brand will pay, like 25,000.' }),
          Fd('Payment due date', '05 Apr 2026', { icon: 'calendar', mst: 'warning', msg: "This is before the content deadline. Check it's right. You can still send." })
        ], bar: { reason: 'Fix 3 terms to send.', p: 'Send confirmation link', on: false, g: 'Save draft' },
          note: 'Focus moves to the alert. Each name in it is a link to its field. Errors clear as soon as the value is valid.' }),
        S({ id: 'G2', label: 'G2 · Leaving with an unread message', title: 'Paste message', status: 'New deal · not saved yet', blocks: b2Blocks, bar: { p: 'Read message', on: true, g: 'Start manually instead' }, sheet: { t: 'Discard this message?', blocks: [
          Note("You haven't read it into a draft yet, so it isn't saved anywhere."),
          Btns([{ t: 'Keep editing', bg: '#F2F3F5', fg: '#111111', ring: '0 0 0 3px #CDEEDD' }, { t: 'Discard message', bg: '#F2F3F5', fg: red, ring: 'none' }])] },
          note: 'This is the only point where work can be lost. Once a draft exists, everything autosaves and Back leaves without asking.' }),
        S({ id: 'G3', label: 'G3 · Offline', title: 'New deal', status: 'Saved on this device', blocks: [
          Al('info', "You're offline.", "Your draft is saved on this device and will sync when you're back. You can keep editing."),
          Gh('Payment'), Fd('Amount', '35,000', { prefix: '₹' }), Fd('Payment due date', '30 Apr 2026', { icon: 'calendar' })
        ], bar: { reason: 'Connect to the internet to send.', p: 'Send confirmation link', on: false, g: 'Save draft' },
          note: 'Editing and Save draft still work offline. Reading a message and sending need a connection.' })
      ] },
      { id: 'W', t: 'Desktop ≥ 1024', d: 'Same states and words. The form sits in a 640 column. The 320 panel holds the readiness check and the two final actions, so there is no sticky bar.', screens: [
        D({ id: 'W1', label: 'W1 · Paste (desktop)', crumb: 'Deals / New deal', title: "Paste the brand's message", status: 'Not saved yet', hgt: '720px',
          blocks: [Fd("Brand's message", MSG, { tall: 300, st: 'focus', tag: 'Clear', tagC: '#076645' }), Note(privacy, 'lock')],
          side: [List('What we look for', ['Brand name and contact', 'Deliverables and content deadlines', "Amount and when it's paid", 'Usage rights, exclusivity and revisions']), Act({ p: 'Read message', on: true, s: 'Start manually instead' })],
          note: 'Enter adds a line. ⌘/Ctrl + Enter reads the message.' }),
        D({ id: 'W2', label: 'W2 · Review (desktop)', crumb: 'Deals / New deal', title: 'Review terms', status: 'Draft · saved 10:15', hgt: '1500px',
          blocks: [Al('info', 'We filled in 9 terms from the message.', 'Check each one. We leave a term empty rather than guess it.'), Quote(MSG, 'Original message · Instagram DM · 10:14', 'Hide'),
            Gh('Payment due date', 'Unclear', orange), dueField, Gh('Content deadline', 'Unclear', orange), deadField, recD1, promptsD1],
          side: [Risk('3 terms needed to send', '3 of 6 needed terms are clear', neededD1), Act({ reason: 'Add contact email and confirm 2 dates to send.', p: 'Send confirmation link', on: false, s: 'Save draft' })],
          note: 'The panel stays in view while scrolling. Clicking a row in the panel scrolls to its field and focuses it.' })
      ] }
    ];
    const sideNav = [['Home', 'house', 0, ''], ['Deals', 'list', 1, '5'], ['Payments', 'wallet', 0, ''], ['Settings', 'settings', 0, '']]
      .map(([l, ic, on, c]) => ({ label: l, mask: I(ic), bg: on ? '#111111' : 'transparent', fg: on ? '#FFFFFF' : '#2E2E33', fw: on ? 700 : 500, count: c, cc: on ? '#FFFFFF' : red }));
    return { groups, sideNav };
  }
}

export default class CreateDeal extends Component {
  render() {
    const v = { ...this.props, ...(this.renderVals() || {}) };
    return (
      <DCHost id="CreateDeal" css={CSS} links={LINKS} hostStyle={this.props.__hostStyle}>
        <section style={{"padding":"64px 64px 16px","display":"flex","flexDirection":"column","gap":"8px","maxWidth":"1000px"}}>{"\n  "}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"11px","letterSpacing":"0.06em","textTransform":"uppercase","color":"#5E5E66"}}>AlgoStudio · /deals/new · v0.1</span>{"\n  "}<h1 style={{"margin":"0","fontFamily":"'Jost',sans-serif","fontWeight":"500","fontSize":"40px","lineHeight":"1.1","letterSpacing":"-0.02em","color":"#111111"}}>Create deal</h1>{"\n  "}<p style={{"margin":"0","fontSize":"15px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66","maxWidth":"760px","textWrap":"pretty"}}>Three ways in (paste, manual, template), one terms form, one review. Terms are split into Needed to send and Recommended. A draft can be saved with anything filled in. The review names every missing or unclear term before the creator can send. The two final actions are Save draft and Send confirmation link. Full rules are in AlgoStudio Create Deal Spec v0.1.md.</p></section>{L(v.groups).map(($it1, $i1) => { const v1 = { ...v, g: $it1, $index: $i1 }; return (<React.Fragment key={$i1}>{"\n  "}<section id={v1.g?.id} style={{"padding":"40px 64px 24px","display":"flex","flexDirection":"column","gap":"16px"}}>{"\n    "}<div style={{"display":"flex","flexDirection":"column","gap":"4px","maxWidth":"760px"}}>{"\n      "}<span style={{"fontSize":"20px","fontWeight":"700","color":"#111111"}}>{T(v1.g?.t)}</span>{"\n      "}<span style={{"fontSize":"14px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66"}}>{T(v1.g?.d)}</span>{"\n    "}</div>{"\n    "}<div style={{"display":"flex","flexWrap":"wrap","gap":"40px","alignItems":"flex-start"}}>{"\n      "}{L(v1.g?.screens).map(($it2, $i2) => { const v2 = { ...v1, s: $it2, $index: $i2 }; return (<React.Fragment key={$i2}>{"\n        "}<div id={v2.s?.id} style={sty(`display:flex;flex-direction:column;gap:10px;width:${S(v2.s?.w)}`)}>{"\n          "}<span style={{"fontSize":"13px","fontWeight":"700","color":"#111111"}}>{T(v2.s?.label)}</span>{"\n          "}<div style={sty(`width:${S(v2.s?.w)};height:${S(v2.s?.hgt)};background:#FFFFFF;border-radius:${S(v2.s?.r)};overflow:hidden;box-shadow:0 4px 16px rgba(17,17,17,.06);display:flex;position:relative`)}>{"\n            "}{(v2.s?.desk) ? (<>{"\n              "}<aside style={{"width":"240px","flex":"none","borderRight":"1px solid #E4E4E8","display":"flex","flexDirection":"column","padding":"20px 12px 12px","gap":"4px"}}>{"\n                "}<div style={{"display":"flex","alignItems":"center","gap":"8px","padding":"0 8px","height":"32px","marginBottom":"12px"}}><img src="/assets/logo-mark.png" alt="" style={{"width":"22px","display":"block"}} /><span style={{"fontFamily":"'Oi',sans-serif","fontSize":"13px","color":"#111111"}}>ALGOSTUDIO</span></div>{"\n                "}{L(v2.sideNav).map(($it3, $i3) => { const v3 = { ...v2, n: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                  "}<div style={sty(`display:flex;align-items:center;gap:10px;height:40px;padding:0 12px;border-radius:12px;background:${S(v3.n?.bg)};color:${S(v3.n?.fg)};font-size:14px;font-weight:${S(v3.n?.fw)}`)}><span style={sty(`width:17px;height:17px;flex:none;background:currentColor;-webkit-mask:${S(v3.n?.mask)};mask:${S(v3.n?.mask)}`)}></span><span style={{"flex":"1"}}>{T(v3.n?.label)}</span><span style={sty(`font-size:12px;font-weight:700;color:${S(v3.n?.cc)}`)}>{T(v3.n?.count)}</span></div>{"\n                "}</React.Fragment>); })}{"\n              "}</aside>{"\n            "}</>) : null}{"\n            "}<div style={{"flex":"1","minWidth":"0","display":"flex","flexDirection":"column"}}>{"\n              "}{(v2.s?.mob) ? (<>{"\n                "}<header style={{"height":"56px","flex":"none","display":"grid","gridTemplateColumns":"44px minmax(0,1fr) 44px","alignItems":"center","padding":"0 8px","borderBottom":"1px solid #E4E4E8"}}>{"\n                  "}<span style={{"width":"44px","height":"44px","display":"flex","alignItems":"center","justifyContent":"center","color":"#111111"}}><span style={sty(`width:22px;height:22px;background:currentColor;-webkit-mask:${S(v2.s?.lMask)};mask:${S(v2.s?.lMask)}`)}></span></span>{"\n                  "}<div style={{"textAlign":"center","display":"flex","flexDirection":"column","gap":"2px","minWidth":"0"}}><span style={{"fontSize":"16px","fontWeight":"700","color":"#111111","whiteSpace":"nowrap","overflow":"hidden","textOverflow":"ellipsis"}}>{T(v2.s?.title)}</span><span style={{"fontSize":"12px","fontWeight":"500","color":"#5E5E66","whiteSpace":"nowrap","overflow":"hidden","textOverflow":"ellipsis"}}>{T(v2.s?.status)}</span></div>{"\n                  "}<span style={{"width":"44px","height":"44px","display":"flex","alignItems":"center","justifyContent":"center","color":"#111111"}}><span style={sty(`width:20px;height:20px;background:currentColor;-webkit-mask:${S(v2.s?.rMask)};mask:${S(v2.s?.rMask)};display:${S(v2.s?.rShow)}`)}></span></span>{"\n                "}</header>{"\n              "}</>) : null}{"\n              "}{(v2.s?.desk) ? (<>{"\n                "}<header style={{"minHeight":"88px","flex":"none","display":"flex","alignItems":"center","gap":"12px","padding":"16px 32px 8px"}}>{"\n                  "}<div style={{"flex":"1","display":"flex","flexDirection":"column","gap":"4px"}}>{"\n                    "}<span style={{"fontSize":"12px","fontWeight":"500","color":"#5E5E66"}}>{T(v2.s?.crumb)}</span>{"\n                    "}<span style={{"fontSize":"22px","fontWeight":"700","color":"#111111"}}>{T(v2.s?.title)}</span>{"\n                  "}</div>{"\n                  "}<span style={{"fontSize":"12px","fontWeight":"500","color":"#5E5E66","whiteSpace":"nowrap"}}>{T(v2.s?.status)}</span>{"\n                "}</header>{"\n              "}</>) : null}{"\n              "}<div style={sty(`flex:1;min-height:0;overflow:hidden;padding:${S(v2.s?.pad)};display:grid;grid-template-columns:${S(v2.s?.cols)};gap:32px;align-items:start`)}>{"\n                "}<div style={{"display":"flex","flexDirection":"column","gap":"16px","minWidth":"0"}}>{"\n                  "}{L(v2.s?.blocks).map(($it3, $i3) => { const v3 = { ...v2, b: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                    "}<CreateDealBlock b={v3.b} />{"\n                  "}</React.Fragment>); })}{"\n                "}</div>{"\n                "}{(v2.s?.desk) ? (<>{"\n                  "}<div style={{"display":"flex","flexDirection":"column","gap":"16px","minWidth":"0"}}>{"\n                    "}{L(v2.s?.side).map(($it3, $i3) => { const v3 = { ...v2, b: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                      "}<CreateDealBlock b={v3.b} />{"\n                    "}</React.Fragment>); })}{"\n                  "}</div>{"\n                "}</>) : null}{"\n              "}</div>{"\n              "}{(v2.s?.hasBar) ? (<>{"\n                "}<div style={{"flex":"none","borderTop":"1px solid #E4E4E8","padding":"10px 16px 14px","display":"flex","flexDirection":"column","gap":"8px","background":"#FFFFFF"}}>{"\n                  "}{(v2.s?.bar?.reason) ? (<><span style={{"textAlign":"center","fontSize":"12px","fontWeight":"700","color":"#B4560F"}}>{T(v2.s?.bar?.reason)}</span></>) : null}{"\n                  "}{(v2.s?.bar?.context) ? (<><span style={{"textAlign":"center","fontSize":"12px","fontWeight":"500","color":"#5E5E66"}}>{T(v2.s?.bar?.context)}</span></>) : null}{"\n                  "}<span style={sty(`display:flex;align-items:center;justify-content:center;height:48px;border-radius:12px;background:${S(v2.s?.bar?.pBg)};color:${S(v2.s?.bar?.pFg)};font-size:15px;font-weight:700`)}>{T(v2.s?.bar?.primary)}</span>{"\n                  "}{(v2.s?.bar?.ghost) ? (<><span style={{"display":"flex","alignItems":"center","justifyContent":"center","height":"44px","borderRadius":"12px","color":"#111111","fontSize":"14px","fontWeight":"700"}}>{T(v2.s?.bar?.ghost)}</span></>) : null}{"\n                "}</div>{"\n              "}</>) : null}{"\n            "}</div>{"\n            "}{(v2.s?.hasSheet) ? (<>{"\n              "}<div style={{"position":"absolute","inset":"0","background":"rgba(17,17,17,.32)"}}></div>{"\n              "}<div style={{"position":"absolute","left":"0","right":"0","bottom":"0","background":"#FFFFFF","borderRadius":"24px 24px 0 0","boxShadow":"0 -8px 40px rgba(17,17,17,.12)","padding":"10px 16px 24px","display":"flex","flexDirection":"column","gap":"14px"}}>{"\n                "}<span style={{"alignSelf":"center","width":"36px","height":"4px","borderRadius":"999px","background":"#D2D3D8"}}></span>{"\n                "}<span style={{"fontSize":"18px","fontWeight":"700","lineHeight":"1.3","color":"#111111"}}>{T(v2.s?.sheet?.t)}</span>{"\n                "}{L(v2.s?.sheet?.blocks).map(($it3, $i3) => { const v3 = { ...v2, b: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                  "}<CreateDealBlock b={v3.b} />{"\n                "}</React.Fragment>); })}{"\n              "}</div>{"\n            "}</>) : null}{"\n          "}</div>{"\n          "}<span style={{"fontSize":"13px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66","textWrap":"pretty"}}>{T(v2.s?.note)}</span>{"\n        "}</div>{"\n      "}</React.Fragment>); })}{"\n    "}</div>{"\n  "}</section></React.Fragment>); })}<div style={{"height":"96px"}}></div>
      </DCHost>
    );
  }
}
