// @ts-nocheck
// Generated from "AlgoStudio Deal Record v2.dc.html" by scripts/dc-convert.js. Inline styles and logic are kept as in the prototype so it renders the same.
import React from 'react';
import { DCLogic, DCHost, sty, T, S, L, R, hostPos, XImport } from '@/dc/runtime';


const CSS = `
@font-face{font-family:'Satoshi';src:url('/assets/Satoshi-Variable.woff2') format('woff2');font-weight:300 900;font-style:normal;font-display:swap}
html,body{margin:0;padding:0;background:#F7F7F9}
body{font-family:'Satoshi',ui-sans-serif,system-ui,sans-serif;color:#2E2E33;-webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
a{color:#076645;text-decoration:none}
a:hover{color:#064F37}
*{box-sizing:border-box}
@keyframes rowIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

.p-dealrecordv2-0:hover{background:#F7F7F8 !important}
.p-dealrecordv2-1:hover{background:#E4E4E8 !important}
.p-dealrecordv2-2:hover{background:#076645 !important}
.p-dealrecordv2-3:hover{color:#064F37 !important}
`;
const LINKS = ["https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap"];

class Component extends DCLogic {
  state = { filter: { A: 'all', B: 'all' }, open: {}, dl: {}, copied: {} };

  ic(n) { return 'https://unpkg.com/lucide-static@0.460.0/icons/' + n + '.svg'; }

  base() {
    return [
      { id: 'created', type: 'terms', actor: 'Creator', tone: 'neutral', icon: 'file-plus', title: 'Deal created', time: '7 Oct 2026, 6:30 PM', desc: 'Creator created this deal as a draft.', note: 'Initial terms saved.' },
      { id: 'edited', type: 'terms', actor: 'Creator', tone: 'neutral', icon: 'pencil-line', title: 'Deal terms updated', time: '7 Oct 2026, 6:35 PM', desc: 'Creator edited payment, deadlines, and usage rights.', detailLabel: 'View changes',
        rows: [{ k: 'Payment', from: '$350', to: '$400' }, { k: 'Final delivery due', from: '30 Nov 2026', to: '25 Nov 2026' }, { k: 'Usage rights', from: 'Organic only, 30 days', to: 'Organic only, 90 days' }] },
      { id: 'sent', type: 'terms', actor: 'Creator', tone: 'neutral', icon: 'send', title: 'Sent to brand', time: '7 Oct 2026, 6:40 PM', desc: 'Creator sent the deal to the brand for confirmation.', note: 'Confirmation link generated.' },
      { id: 'viewed', type: 'terms', actor: 'Brand', tone: 'brand', icon: 'eye', title: 'Brand viewed confirmation link', time: '8 Oct 2026, 10:10 AM', desc: 'Brand opened the confirmation link.' },
      { id: 'confirmed', type: 'terms', actor: 'Brand', tone: 'emerald', icon: 'badge-check', title: 'Deal confirmed by brand', time: '8 Oct 2026, 10:15 AM', desc: 'Brand confirmed the deal terms as agreed.', detailLabel: 'View terms at this time',
        rows: [{ k: 'Deliverables', to: '1 Reel and 3 Stories on Instagram' }, { k: 'Payment', to: '$400' }, { k: 'Final delivery due', to: '25 Nov 2026' }, { k: 'Usage rights', to: 'Organic only, 90 days' }] },
      { id: 'sub1', type: 'deliverables', actor: 'Creator', tone: 'emerald', icon: 'upload', title: 'Deliverable submitted', time: '18 Nov 2026, 8:00 PM', desc: 'Creator submitted first draft for review.', detailLabel: 'View submission', file: ['Reel · first draft', 'drive.google.com/…/reel-v1'] },
      { id: 'rev', type: 'deliverables', actor: 'Brand', tone: 'warn', icon: 'rotate-ccw', title: 'Revision requested', time: '19 Nov 2026, 11:30 AM', desc: 'Brand requested changes to the deliverable.', detailLabel: 'View revision notes', quote: 'Please show the product in the first 3 seconds and move the discount code to the end.', meta: '1 of 2 included revisions used.' },
      { id: 'sub2', type: 'deliverables', actor: 'Creator', tone: 'emerald', icon: 'upload', title: 'Revised deliverable submitted', time: '19 Nov 2026, 7:45 PM', desc: 'Creator submitted the revised draft for review.', detailLabel: 'View submission', file: ['Reel · revised draft', 'drive.google.com/…/reel-v2'] }
    ];
  }

  data() {
    const b = this.base();
    return {
      A: b.concat([
        { id: 'await', type: 'deliverables', actor: 'Brand', upcoming: true, icon: 'hourglass', title: 'Awaiting brand approval', time: 'Next', desc: 'Approval link sent with the revised draft.' },
        { id: 'due', type: 'payments', actor: 'System', upcoming: true, icon: 'calendar-clock', title: 'Payment due', time: '25 Nov 2026', desc: 'Payment of $400 due by this date.' }
      ]),
      B: b.concat([
        { id: 'appr', type: 'deliverables', actor: 'Brand', tone: 'emerald', icon: 'check-check', title: 'Deliverable approved', time: '20 Nov 2026, 3:00 PM', desc: 'Brand approved the final deliverable.' },
        { id: 'due', type: 'payments', actor: 'System', tone: 'money', icon: 'calendar-clock', title: 'Payment due', time: '25 Nov 2026', desc: 'Payment of $400 due by this date.' },
        { id: 'paid', type: 'payments', actor: 'Creator', tone: 'money', icon: 'banknote', title: 'Payment received', time: '26 Nov 2026, 2:10 PM', desc: 'Creator marked $400 as received.' }
      ]),
      C: [
        { id: 'chg', type: 'terms', actor: 'Brand', tone: 'warn', icon: 'message-square-diff', title: 'Changes requested by brand', time: '8 Oct 2026, 10:15 AM', desc: 'Brand requested changes to the terms.', detailLabel: 'View requested changes', quote: 'Can we move final delivery to 28 Nov and add one more Story?' },
        { id: 'dec', type: 'terms', actor: 'Brand', tone: 'danger', icon: 'circle-x', title: 'Deal declined by brand', time: '8 Oct 2026, 10:15 AM', desc: 'Brand declined this deal.', note: 'Reason: Budget for this campaign was cut.' },
        { id: 'over', type: 'payments', actor: 'System', tone: 'warn', icon: 'triangle-alert', title: 'Payment overdue', time: '2 Dec 2026', desc: 'Payment of $400 is overdue.', warnText: true },
        { id: 'canc', type: 'terms', actor: 'Creator', tone: 'danger', icon: 'ban', title: 'Deal cancelled', time: '3 Dec 2026, 9:00 AM', desc: 'Creator cancelled this deal.', note: 'Reason: Brand stopped responding after delivery.' }
      ]
    };
  }

  tones = {
    neutral: ['#F2F3F5', '#2E2E33'], brand: ['#EEF2FF', '#2F45C4'], emerald: ['#E9F7F0', '#076645'],
    money: ['#EFF6E5', '#3E7420'], warn: ['#FFF0E3', '#9A4A0C'], danger: ['#FDE8E8', '#B42318']
  };

  actorStyle(a) {
    if (a === 'Brand') return ['#EEF2FF', '#2F45C4', '1px solid #EEF2FF'];
    if (a === 'System') return ['transparent', '#5E5E66', '1px dashed #86868E'];
    return ['transparent', '#111111', '1px solid #111111'];
  }

  mapEvents(key, list) {
    return list.map((e, i) => {
      const k = key + '-' + e.id, open = !!this.state.open[k];
      const [bg, fg] = e.upcoming ? ['#FFFFFF', '#86868E'] : this.tones[e.tone];
      const [aBg, aFg, aB] = this.actorStyle(e.actor);
      const last = i === list.length - 1, nextUp = !last && list[i + 1].upcoming;
      return {
        ...e, icon: this.ic(e.icon), delay: (i * 40) + 'ms',
        nodeBg: bg, nodeFg: fg, nodeBorder: e.upcoming ? '1.5px dashed #B4B4BA' : '1.5px solid ' + bg,
        lineColor: last ? 'transparent' : '#E4E4E8', lineStyle: nextUp || e.upcoming ? 'dashed' : 'solid',
        titleFg: e.upcoming ? '#5E5E66' : (e.warnText ? '#B4560F' : '#111111'),
        descFg: e.upcoming ? '#86868E' : '#2E2E33',
        actorBg: aBg, actorFg: aFg, actorBorder: aB,
        hasNote: !!e.note, hasDetail: !!e.detailLabel, open, chev: open ? '180deg' : '0deg',
        toggle: () => this.setState(s => ({ open: { ...s.open, [k]: !s.open[k] } })),
        hasRows: !!e.rows, rows: (e.rows || []).map(r => ({ ...r, hasFrom: !!r.from })),
        hasQuote: !!e.quote, hasFile: !!e.file, fileName: e.file && e.file[0], fileLink: e.file && e.file[1],
        hasMeta: !!e.meta
      };
    });
  }

  steps(key) {
    const labels = ['Draft', 'Sent', 'Confirmed', 'Delivered', 'Approved', 'Paid'];
    const dates = key === 'A' ? ['7 Oct', '7 Oct', '8 Oct', '19 Nov', '—', '—'] : ['7 Oct', '7 Oct', '8 Oct', '19 Nov', '20 Nov', '26 Nov'];
    const cur = key === 'A' ? 3 : 5;
    return labels.map((l, i) => ({
      label: l, date: dates[i],
      bar: i < cur ? '#2FAE77' : i === cur ? '#076645' : '#E4E4E8',
      bg: i === cur ? '#E9F7F0' : '#FFFFFF',
      fg: i <= cur ? '#111111' : '#5E5E66'
    }));
  }

  download(key) {
    if (this.state.dl[key]) return;
    const set = v => this.setState(s => ({ dl: { ...s.dl, [key]: v } }));
    set('busy');
    setTimeout(() => set('done'), 1200);
    setTimeout(() => set(null), 3200);
  }

  copy(key) {
    try { navigator.clipboard && navigator.clipboard.writeText('https://algostudio.in/r/DL-1042'); } catch (e) {}
    this.setState(s => ({ copied: { ...s.copied, [key]: true } }));
    setTimeout(() => this.setState(s => ({ copied: { ...s.copied, [key]: false } })), 2000);
  }

  board(key, meta) {
    const all = this.data()[key];
    const f = this.state.filter[key] || 'all';
    const list = f === 'all' ? all : all.filter(e => e.type === f);
    const tabDefs = [['all', 'All events'], ['terms', 'Terms & confirmations'], ['deliverables', 'Deliverables'], ['payments', 'Payments']];
    const tabs = tabDefs.map(([k, label]) => {
      const on = f === k;
      return {
        label, count: k === 'all' ? all.length : all.filter(e => e.type === k).length,
        bg: on ? '#FFFFFF' : 'transparent', fg: on ? '#111111' : '#5E5E66',
        shadow: on ? '0 1px 3px rgba(17,17,17,.10)' : 'none',
        onClick: () => this.setState(s => ({ filter: { ...s.filter, [key]: k } }))
      };
    });
    const dl = this.state.dl[key];
    const done = list.filter(e => !e.upcoming).length;
    return {
      ...meta, full: true, sideW: '300px',
      events: this.mapEvents(key, list), empty: list.length === 0, tabs,
      countLabel: done + ' recorded' + (list.length > done ? ' · ' + (list.length - done) + ' upcoming' : '') + ' · oldest first',
      steps: this.steps(key),
      dlLabel: dl === 'busy' ? 'Preparing PDF…' : dl === 'done' ? 'PDF downloaded' : 'Download record (PDF)',
      dlIcon: this.ic(dl === 'busy' ? 'loader' : dl === 'done' ? 'check' : 'download'),
      dlOpacity: dl === 'busy' ? 0.75 : 1,
      onDownload: () => this.download(key),
      copyLabel: this.state.copied[key] ? 'Link copied' : 'Copy shareable link',
      copyIcon: this.ic(this.state.copied[key] ? 'check' : 'link'),
      onCopy: () => this.copy(key)
    };
  }

  renderVals() {
    const A = this.board('A', {
      id: '1a', label: 'Active deal · Delivered',
      note: 'Revised draft is with the brand. Upcoming steps sit at the end of the timeline with dashed markers until they happen.',
      status: 'Delivered', pillBg: '#E9F7F0', pillFg: '#076645',
      summary: [
        { k: 'Current status', v: 'Delivered', fg: '#076645' }, { k: 'Created', v: '7 Oct 2026', fg: '#111111' },
        { k: 'Confirmed', v: '8 Oct 2026', fg: '#111111' }, { k: 'Final delivery due', v: '25 Nov 2026', fg: '#111111' },
        { k: 'Payment', v: '$400 – Due 25 Nov', fg: '#B4560F' }
      ]
    });
    const B = this.board('B', {
      id: '1b', label: 'Completed deal · Paid',
      note: 'Full lifecycle: Draft → Sent → Confirmed → Delivered → Approved → Paid.',
      status: 'Paid', pillBg: '#076645', pillFg: '#FFFFFF',
      summary: [
        { k: 'Current status', v: 'Paid', fg: '#076645' }, { k: 'Created', v: '7 Oct 2026', fg: '#111111' },
        { k: 'Confirmed', v: '8 Oct 2026', fg: '#111111' }, { k: 'Final delivery due', v: '25 Nov 2026', fg: '#111111' },
        { k: 'Payment', v: '$400 – Received', fg: '#3E7420' }
      ]
    });
    const C = {
      id: '1c', label: 'Other event types', full: false, sideW: '0px',
      note: 'Entries the same timeline uses when a deal takes a different path: changes requested, declined, overdue payment and cancellation.',
      events: this.mapEvents('C', this.data().C), empty: false, tabs: [], steps: [], summary: []
    };
    const emb = !!this.props.embedded;
    const boards = emb ? [this.props.variant === 'paid' ? B : A] : [A, B, C];
    boards.forEach(b => Object.assign(b, {
      embedded: emb, showMeta: !emb, align: emb ? 'center' : 'flex-start',
      pad: emb ? '32px 40px 48px' : '40px 64px 24px',
      back: () => this.props.onBack && this.props.onBack()
    }));
    return { boards, showIntro: !emb };
  }
}

export default class DealRecordV2 extends Component {
  render() {
    const v = { ...this.props, ...(this.renderVals() || {}) };
    return (
      <DCHost id="DealRecordV2" css={CSS} links={LINKS} hostStyle={this.props.__hostStyle}>
        {(v.showIntro) ? (<><section style={{"padding":"64px 64px 8px","display":"flex","flexDirection":"column","gap":"8px","maxWidth":"1000px"}}>{"\n  "}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"11px","letterSpacing":"0.06em","textTransform":"uppercase","color":"#5E5E66"}}>AlgoStudio · /deals/:id/record · v0.2</span>{"\n  "}<h1 style={{"margin":"0","fontFamily":"'Jost',sans-serif","fontWeight":"500","fontSize":"40px","lineHeight":"1.1","letterSpacing":"-0.02em","color":"#111111"}}>Deal record</h1>{"\n  "}<p style={{"margin":"0","fontSize":"15px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66","maxWidth":"760px","textWrap":"pretty"}}>A timestamped history of one deal, from draft to paid. Oldest event at the top. Filters, expandable details, Download and Copy link work in both states.</p></section></>) : null}{L(v.boards).map(($it1, $i1) => { const v1 = { ...v, b: $it1, $index: $i1 }; return (<React.Fragment key={$i1}><section id={v1.b?.id} style={sty(`padding:${S(v1.b?.pad)};display:flex;flex-direction:column;gap:14px;align-items:${S(v1.b?.align)}`)}>{"\n  "}{(v1.b?.embedded) ? (<>{"\n  "}<div style={{"width":"1200px","flex":"none"}}><button type="button" onClick={v1.b?.back} style={{"appearance":"none","border":"0","cursor":"pointer","fontFamily":"inherit","display":"flex","alignItems":"center","gap":"6px","height":"32px","padding":"0 12px 0 8px","borderRadius":"999px","background":"#FFFFFF","boxShadow":"0 0 0 1px rgba(0,0,0,.07)","fontSize":"13px","fontWeight":"600","color":"#3A3A40"}} className="p-dealrecordv2-0"><span style={{"width":"15px","height":"15px","background":"currentColor","WebkitMask":"url(https://unpkg.com/lucide-static@0.460.0/icons/arrow-left.svg) center/contain no-repeat","mask":"url(https://unpkg.com/lucide-static@0.460.0/icons/arrow-left.svg) center/contain no-repeat"}}></span>Deal</button></div>{"\n  "}</>) : null}{"\n  "}{(v1.b?.showMeta) ? (<>{"\n  "}<div style={{"display":"flex","alignItems":"center","gap":"10px"}}>{"\n    "}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"11px","fontWeight":"500","padding":"3px 8px","borderRadius":"6px","background":"#111111","color":"#FFFFFF"}}>{T(v1.b?.id)}</span>{"\n    "}<span style={{"fontSize":"20px","fontWeight":"700","color":"#111111"}}>{T(v1.b?.label)}</span>{"\n  "}</div>{"\n  "}<span style={{"fontSize":"14px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66","maxWidth":"760px"}}>{T(v1.b?.note)}</span>{"\n  "}</>) : null}{"\n\n  "}<div style={{"width":"1200px","flex":"none","background":"#FFFFFF","borderRadius":"16px","boxShadow":"0 4px 16px rgba(17,17,17,.06)","padding":"40px","display":"flex","flexDirection":"column","gap":"32px"}}>{"\n\n    "}{(v1.b?.full) ? (<>{"\n    "}<div style={{"display":"flex","flexWrap":"wrap","alignItems":"flex-start","justifyContent":"space-between","gap":"24px"}}>{"\n      "}<div style={{"display":"flex","flexDirection":"column","gap":"10px","minWidth":"0"}}>{"\n        "}<h2 style={{"margin":"0","fontFamily":"'Jost',sans-serif","fontWeight":"500","fontSize":"32px","lineHeight":"1.15","letterSpacing":"-0.01em","color":"#111111"}}>Deal record: Glow Skin Co.</h2>{"\n        "}<div style={{"display":"flex","flexWrap":"wrap","alignItems":"center","gap":"8px 16px","fontSize":"14px","fontWeight":"500","color":"#5E5E66"}}>{"\n          "}<span>{"Deal ID: "}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"13px","color":"#111111","whiteSpace":"nowrap"}}>#DL-1042</span></span>{"\n          "}<span style={{"width":"4px","height":"4px","borderRadius":"999px","background":"#B4B4BA"}}></span>{"\n          "}<span style={{"display":"flex","alignItems":"center","gap":"8px"}}>{"Current status: "}<span style={sty(`font-size:13px;font-weight:700;padding:3px 10px;border-radius:999px;background:${S(v1.b?.pillBg)};color:${S(v1.b?.pillFg)}`)}>{T(v1.b?.status)}</span></span>{"\n        "}</div>{"\n      "}</div>{"\n      "}<div style={{"display":"flex","flexDirection":"column","alignItems":"flex-end","gap":"8px","maxWidth":"420px"}}>{"\n        "}<div style={{"display":"flex","gap":"8px"}}>{"\n          "}<button onClick={v1.b?.onCopy} style={{"height":"44px","padding":"0 16px","border":"none","borderRadius":"12px","background":"#F2F3F5","font":"inherit","fontSize":"14px","fontWeight":"700","color":"#111111","display":"flex","alignItems":"center","gap":"8px","cursor":"pointer","transition":"background .15s"}} className="p-dealrecordv2-1"><span style={sty(`width:16px;height:16px;background:currentColor;-webkit-mask:url(${S(v1.b?.copyIcon)}) center/contain no-repeat;mask:url(${S(v1.b?.copyIcon)}) center/contain no-repeat`)}></span>{T(v1.b?.copyLabel)}</button>{"\n          "}<button onClick={v1.b?.onDownload} style={sty(`height:44px;padding:0 18px;border:none;border-radius:12px;background:#0A7F55;font:inherit;font-size:14px;font-weight:700;color:#FFFFFF;display:flex;align-items:center;gap:8px;cursor:pointer;opacity:${S(v1.b?.dlOpacity)};transition:background .15s,opacity .15s`)} className="p-dealrecordv2-2"><span style={sty(`width:16px;height:16px;background:currentColor;-webkit-mask:url(${S(v1.b?.dlIcon)}) center/contain no-repeat;mask:url(${S(v1.b?.dlIcon)}) center/contain no-repeat`)}></span>{T(v1.b?.dlLabel)}</button>{"\n        "}</div>{"\n        "}<span style={{"fontSize":"12px","fontWeight":"500","lineHeight":"1.45","color":"#5E5E66","textAlign":"right","textWrap":"pretty"}}>This record is timestamped and can be used as evidence of your agreement and workflow.</span>{"\n      "}</div>{"\n    "}</div>{"\n\n    "}<div style={{"display":"grid","gridTemplateColumns":"repeat(6,minmax(0,1fr))","border":"1px solid #E4E4E8","borderRadius":"12px","overflow":"hidden"}}>{"\n      "}{L(v1.b?.steps).map(($it2, $i2) => { const v2 = { ...v1, s: $it2, $index: $i2 }; return (<React.Fragment key={$i2}>{"\n        "}<div style={sty(`padding:12px 14px;display:flex;flex-direction:column;gap:8px;background:${S(v2.s?.bg)};border-right:1px solid #E4E4E8`)}>{"\n          "}<span style={sty(`height:4px;border-radius:999px;background:${S(v2.s?.bar)}`)}></span>{"\n          "}<div style={{"display":"flex","alignItems":"center","gap":"6px"}}><span style={sty(`font-size:13px;font-weight:700;color:${S(v2.s?.fg)}`)}>{T(v2.s?.label)}</span></div>{"\n          "}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"11px","color":"#5E5E66"}}>{T(v2.s?.date)}</span>{"\n        "}</div>{"\n      "}</React.Fragment>); })}{"\n    "}</div>{"\n    "}</>) : null}{"\n\n    "}<div style={sty(`display:grid;grid-template-columns:minmax(0,1fr) ${S(v1.b?.sideW)};gap:40px;align-items:start`)}>{"\n      "}<div style={{"display":"flex","flexDirection":"column","gap":"20px","minWidth":"0"}}>{"\n        "}{(v1.b?.full) ? (<>{"\n        "}<div style={{"display":"flex","flexWrap":"wrap","alignItems":"center","justifyContent":"space-between","gap":"12px"}}>{"\n          "}<div style={{"display":"flex","gap":"4px","padding":"4px","borderRadius":"12px","background":"#F2F3F5"}}>{"\n            "}{L(v1.b?.tabs).map(($it2, $i2) => { const v2 = { ...v1, t: $it2, $index: $i2 }; return (<React.Fragment key={$i2}>{"\n              "}<button onClick={v2.t?.onClick} style={sty(`height:36px;padding:0 14px;border:none;border-radius:9px;font:inherit;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;white-space:nowrap;background:${S(v2.t?.bg)};color:${S(v2.t?.fg)};box-shadow:${S(v2.t?.shadow)};transition:background .15s,color .15s`)}>{T(v2.t?.label)}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"11px","fontWeight":"500","color":"#5E5E66"}}>{T(v2.t?.count)}</span></button>{"\n            "}</React.Fragment>); })}{"\n          "}</div>{"\n          "}<span style={{"fontSize":"12px","fontWeight":"500","color":"#5E5E66"}}>{T(v1.b?.countLabel)}</span>{"\n        "}</div>{"\n        "}</>) : null}{"\n\n        "}<div style={{"display":"flex","flexDirection":"column"}}>{"\n          "}{L(v1.b?.events).map(($it2, $i2) => { const v2 = { ...v1, e: $it2, $index: $i2 }; return (<React.Fragment key={$i2}>{"\n            "}<div style={sty(`display:grid;grid-template-columns:40px minmax(0,1fr);column-gap:16px;animation:rowIn .35s cubic-bezier(.2,.8,.2,1) both;animation-delay:${S(v2.e?.delay)}`)}>{"\n              "}<div style={{"display":"flex","flexDirection":"column","alignItems":"center"}}>{"\n                "}<span style={sty(`width:40px;height:40px;flex:none;border-radius:999px;display:flex;align-items:center;justify-content:center;background:${S(v2.e?.nodeBg)};color:${S(v2.e?.nodeFg)};border:${S(v2.e?.nodeBorder)}`)}><span style={sty(`width:18px;height:18px;background:currentColor;-webkit-mask:url(${S(v2.e?.icon)}) center/contain no-repeat;mask:url(${S(v2.e?.icon)}) center/contain no-repeat`)}></span></span>{"\n                "}<span style={sty(`flex:1;width:0;min-height:16px;border-left:2px ${S(v2.e?.lineStyle)} ${S(v2.e?.lineColor)}`)}></span>{"\n              "}</div>{"\n              "}<div style={{"display":"flex","flexDirection":"column","gap":"6px","padding":"8px 0 28px","minWidth":"0"}}>{"\n                "}<div style={{"display":"flex","flexWrap":"wrap","alignItems":"center","gap":"6px 10px"}}>{"\n                  "}<span style={sty(`font-size:16px;font-weight:700;color:${S(v2.e?.titleFg)}`)}>{T(v2.e?.title)}</span>{"\n                  "}<span style={sty(`flex:none;white-space:nowrap;font-family:'Geist Mono',monospace;font-size:10px;letter-spacing:0.06em;text-transform:uppercase;padding:2px 6px;border-radius:4px;background:${S(v2.e?.actorBg)};color:${S(v2.e?.actorFg)};border:${S(v2.e?.actorBorder)}`)}>{T(v2.e?.actor)}</span>{"\n                  "}<span style={{"flex":"1"}}></span>{"\n                  "}<span style={{"flex":"none","whiteSpace":"nowrap","fontFamily":"'Geist Mono',monospace","fontSize":"12.5px","color":"#2E2E33"}}>{T(v2.e?.time)}</span>{"\n                "}</div>{"\n                "}<span style={sty(`font-size:14px;font-weight:500;line-height:1.5;color:${S(v2.e?.descFg)}`)}>{T(v2.e?.desc)}</span>{"\n                "}{(v2.e?.hasNote) ? (<>{"\n                  "}<span style={{"fontSize":"13px","fontWeight":"500","color":"#5E5E66"}}>{T(v2.e?.note)}</span>{"\n                "}</>) : null}{"\n                "}{(v2.e?.hasDetail) ? (<>{"\n                  "}<button onClick={v2.e?.toggle} style={{"alignSelf":"flex-start","marginTop":"2px","padding":"0","border":"none","background":"none","font":"inherit","fontSize":"13px","fontWeight":"700","color":"#076645","display":"flex","alignItems":"center","gap":"4px","cursor":"pointer","whiteSpace":"nowrap","textAlign":"left"}} className="p-dealrecordv2-3">{T(v2.e?.detailLabel)}<span style={sty(`width:14px;height:14px;background:currentColor;-webkit-mask:url(https://unpkg.com/lucide-static@0.460.0/icons/chevron-down.svg) center/contain no-repeat;mask:url(https://unpkg.com/lucide-static@0.460.0/icons/chevron-down.svg) center/contain no-repeat;transform:rotate(${S(v2.e?.chev)});transition:transform .2s cubic-bezier(.2,.8,.2,1)`)}></span></button>{"\n                "}</>) : null}{"\n                "}{(v2.e?.open) ? (<>{"\n                  "}<div style={{"marginTop":"4px","border":"1px solid #E4E4E8","borderRadius":"12px","background":"#F7F7F9","padding":"14px 16px","display":"flex","flexDirection":"column","gap":"10px","animation":"rowIn .25s cubic-bezier(.2,.8,.2,1) both"}}>{"\n                    "}{(v2.e?.hasRows) ? (<>{"\n                      "}<div style={{"display":"grid","gridTemplateColumns":"160px minmax(0,1fr)","fontSize":"13px","lineHeight":"1.45"}}>{"\n                        "}{L(v2.e?.rows).map(($it3, $i3) => { const v3 = { ...v2, r: $it3, $index: $i3 }; return (<React.Fragment key={$i3}>{"\n                          "}<span style={{"padding":"6px 0","borderBottom":"1px solid #E4E4E8","fontWeight":"700","color":"#5E5E66"}}>{T(v3.r?.k)}</span>{"\n                          "}<span style={{"padding":"6px 0","borderBottom":"1px solid #E4E4E8","fontWeight":"500","color":"#111111","display":"flex","flexWrap":"wrap","gap":"6px"}}>{(v3.r?.hasFrom) ? (<><s style={{"color":"#5E5E66"}}>{T(v3.r?.from)}</s><span style={{"color":"#5E5E66"}}>→</span></>) : null}<span>{T(v3.r?.to)}</span></span>{"\n                        "}</React.Fragment>); })}{"\n                      "}</div>{"\n                    "}</>) : null}{"\n                    "}{(v2.e?.hasQuote) ? (<>{"\n                      "}<span style={{"fontSize":"14px","fontWeight":"500","lineHeight":"1.5","color":"#2E2E33","paddingLeft":"12px","borderLeft":"2px solid #111111"}}>{"“"}{T(v2.e?.quote)}{"”"}</span>{"\n                    "}</>) : null}{"\n                    "}{(v2.e?.hasFile) ? (<>{"\n                      "}<div style={{"display":"flex","alignItems":"center","gap":"12px"}}>{"\n                        "}<span style={{"width":"56px","height":"72px","flex":"none","borderRadius":"8px","background":"#E4E4E8","display":"flex","alignItems":"center","justifyContent":"center","color":"#5E5E66"}}><span style={{"width":"20px","height":"20px","background":"currentColor","WebkitMask":"url(https://unpkg.com/lucide-static@0.460.0/icons/film.svg) center/contain no-repeat","mask":"url(https://unpkg.com/lucide-static@0.460.0/icons/film.svg) center/contain no-repeat"}}></span></span>{"\n                        "}<div style={{"display":"flex","flexDirection":"column","gap":"2px","minWidth":"0"}}><span style={{"fontSize":"14px","fontWeight":"700","color":"#111111"}}>{T(v2.e?.fileName)}</span><span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"12px","color":"#5E5E66"}}>{T(v2.e?.fileLink)}</span></div>{"\n                      "}</div>{"\n                    "}</>) : null}{"\n                    "}{(v2.e?.hasMeta) ? (<>{"\n                      "}<span style={{"fontSize":"12px","fontWeight":"500","color":"#5E5E66"}}>{T(v2.e?.meta)}</span>{"\n                    "}</>) : null}{"\n                  "}</div>{"\n                "}</>) : null}{"\n              "}</div>{"\n            "}</div>{"\n          "}</React.Fragment>); })}{"\n          "}{(v1.b?.empty) ? (<>{"\n            "}<div style={{"border":"1px dashed #B4B4BA","borderRadius":"12px","padding":"24px","textAlign":"center","fontSize":"14px","fontWeight":"500","color":"#5E5E66"}}>No events of this type yet.</div>{"\n          "}</>) : null}{"\n        "}</div>{"\n      "}</div>{"\n\n      "}{(v1.b?.full) ? (<>{"\n      "}<aside style={{"position":"sticky","top":"24px","border":"1px solid #E4E4E8","borderRadius":"16px","padding":"20px","display":"flex","flexDirection":"column","gap":"14px"}}>{"\n        "}<span style={{"fontSize":"15px","fontWeight":"700","color":"#111111"}}>Deal status</span>{"\n        "}<div style={{"display":"flex","flexDirection":"column"}}>{"\n          "}{L(v1.b?.summary).map(($it2, $i2) => { const v2 = { ...v1, m: $it2, $index: $i2 }; return (<React.Fragment key={$i2}>{"\n            "}<div style={{"display":"flex","justifyContent":"space-between","alignItems":"baseline","gap":"12px","padding":"10px 0","borderTop":"1px solid #E4E4E8"}}>{"\n              "}<span style={{"fontSize":"13px","fontWeight":"700","color":"#5E5E66","whiteSpace":"nowrap"}}>{T(v2.m?.k)}</span>{"\n              "}<span style={sty(`font-size:14px;font-weight:700;color:${S(v2.m?.fg)};text-align:right`)}>{T(v2.m?.v)}</span>{"\n            "}</div>{"\n          "}</React.Fragment>); })}{"\n        "}</div>{"\n        "}<div style={{"display":"flex","flexDirection":"column","gap":"8px","paddingTop":"12px","borderTop":"1px solid #E4E4E8"}}>{"\n          "}<span style={{"fontSize":"12px","fontWeight":"700","color":"#5E5E66"}}>Who did what</span>{"\n          "}<div style={{"display":"flex","flexWrap":"wrap","gap":"6px"}}>{"\n            "}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"10px","letterSpacing":"0.06em","padding":"2px 6px","borderRadius":"4px","border":"1px solid #111111","color":"#111111"}}>CREATOR</span>{"\n            "}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"10px","letterSpacing":"0.06em","padding":"2px 6px","borderRadius":"4px","border":"1px solid #EEF2FF","background":"#EEF2FF","color":"#2F45C4"}}>BRAND</span>{"\n            "}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"10px","letterSpacing":"0.06em","padding":"2px 6px","borderRadius":"4px","border":"1px dashed #86868E","color":"#5E5E66"}}>SYSTEM</span>{"\n          "}</div>{"\n        "}</div>{"\n      "}</aside>{"\n      "}</>) : null}{"\n    "}</div>{"\n  "}</div></section></React.Fragment>); })}<div style={{"height":"80px"}}></div>
      </DCHost>
    );
  }
}
