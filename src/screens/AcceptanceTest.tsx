// @ts-nocheck
// Generated from "AlgoStudio Acceptance Test.dc.html" by scripts/dc-convert.js. Inline styles and logic are kept as in the prototype so it renders the same.
import React from 'react';
import { DCLogic, DCHost, sty, T, S, L, R, hostPos, XImport } from '@/dc/runtime';


const CSS = `
@font-face{font-family:'Satoshi';src:url('/assets/Satoshi-Variable.woff2') format('woff2');font-weight:300 900;font-style:normal;font-display:swap}
html,body{margin:0;padding:0;background:#F7F7F9}
body{font-family:'Satoshi',ui-sans-serif,system-ui,sans-serif;color:#2E2E33;-webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
a{color:#076645;text-decoration:underline;text-underline-offset:2px}
a:hover{color:#064F37}
*{box-sizing:border-box}

`;
const LINKS = ["https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap"];

const R={fixed:['Fixed · re-check','#E9F7F0','#076645'],pass:['Pass','#EFF6E5','#3E7420'],partial:['Partial','#FFF0E3','#B4560F'],fail:['Fail','#FDE8E8','#B42318'],device:['Needs device / backend','#EEF2FF','#2F45C4']};
const APP='app/AlgoStudio%20App.html';
const S=[
['Slice 2 · Submit work → approve or revise',[
['D §1','Deal stage comes from deliverables: In progress → Submitted → Revision requested → Approved','pass','Store test: 3 items moved through wip → submitted → revision → due in that order.','','#/deals/bloom'],
['D §2','Row copy: not submitted / due soon / late / draft / sent / replaced / waiting / revision / approved','pass','All row strings follow the spec table; version tag pill shows once a version or draft exists.','','#/deals/kora'],
['D §2','Progress bar (emerald approved, emerald-300 sent, grey rest) and summary "{sent} of {n} sent · {approved} approved"','pass','','',''],
['D §3','Primary by situation: Submit work / Submit {late item} / Send approval reminder / Upload revised work','pass','Revision state uses the newer Revision to Approval copy (Upload revised work + Ask a question).','',''],
['D §4','Row tap opens the deliverable sheet: details, versions newest first, Send a new version, Copy approval link','pass','','',''],
['D §5','Submit sheet: link field, Paste button, site tag, caption, note, Send v{n} for approval, Save as draft','pass','Drafts aren\u2019t shown to the brand and aren\u2019t recorded.','',''],
['D §5','One approval link covers every item waiting, and replaces the previous approval link','pass','Store test: the 3rd submission\u2019s link listed all 3 items; earlier links became "replaced".','',''],
['D §5','Multi-item summary sheet "Send 2 items for approval" with channels','partial','Items are sent one at a time; the shared link still covers all waiting items. No combined summary sheet yet.','',''],
['D §5','File upload as a second option','partial','Not built. Connection Audit decision 4 says links only in V1; the Deliverables spec says file upload is in V1. Needs your call.','',''],
['D §6.11','Sending v2 before review: "{brand} hasn\u2019t reviewed v1 yet." and the record says "v2 replaced v1 before review"','pass','','',''],
['D §6.11b','Approved versions are locked','pass','Store refuses a new version of an approved item; the sheet shows the spec line.','',''],
['RtA §2','Revision: brand\u2019s note pinned in the sheet; "What you changed" shown to the brand as "{creator} replied"','pass','','',''],
['RtA §2','Ask a question: prefilled with the brand\u2019s note, WhatsApp/Email, noted in activity, doesn\u2019t use a revision','pass','','','#/deals/kora'],
['RtA §4','Approved: alert "{brand} approved all {n} items.", Approved work list, Approved by card','pass','','',''],
['RtA §5','Activity oldest first, last 8 with "Show N earlier", latest tagged','pass','','',''],
['A §1','Approval link opens on the item list; each item is ?item= on the same route','pass','','',''],
['A §1','Item view: header with version and "k of n", link preview card with Open link, From creator, What changed, What was agreed, versions','pass','','',''],
['A §1','Answer bar: Approve final work (emerald) and Request revision (grey), full width, same order','pass','Sticky on mobile, in the page on desktop.','',''],
['A §2','Code once per deal per device; confirming terms on the same device counts','pass','','',''],
['A §3','Older versions are watch-only with "Back to v{n}"','pass','','',''],
['A §4','Approve / revision sheets and receipts use the spec copy; revision needs 10+ characters; over-limit line doesn\u2019t block','pass','','',''],
['A §4','Each item answered once; a retry returns the same answer','pass','Store test: a second answer on the same item returned the first.','',''],
['A §5','Expiry for approval links','partial','Approval links don\u2019t expire (IA decision 2). Open question from the spec: add a limit such as 14 days?','',''],
]],
['Slice 2 · Payments',[
['P §1','Four figures: Received this month · Still to receive · Overdue · Due soon (unclear excluded)','pass','','','#/payments'],
['P §2','Filters All · Due soon · Overdue · Paid · No due date with counts; search by brand','pass','','',''],
['P §2','Order: overdue (most late first), unclear, due soon, no due date, later, pending, paid','pass','','',''],
['P §3–4','Row: exact status sentence, due, approval state, last step, one next action; desktop table','pass','','',''],
['P §5','Reminder: built from confirmed terms + Settings payment link; WhatsApp / Copy / Email; recorded with the text','pass','Store test: event detail holds channel and message.','',''],
['P §5','Mark as paid: prefilled amount/date, optional ref; less than agreed → Unclear; Undo for 10 s','pass','Undo writes a correction event, since events are append-only.','',''],
['P §5','Something not right? → Unclear with reason and private note; Update status offers Mark as paid / Back to unpaid / Send reminder','pass','','',''],
['P §7','Paid history grouped by month with totals','pass','','',''],
['RtA §4','Add posting date: due date from "days after posting", usage end date shown','pass','Store test: posted 01 Oct + 30 days → due 31 Oct.','','#/deals/urban'],
['P §1','Other currencies listed separately','partial','The app only has ₹ deals; no currency field yet.','',''],
]],
['Slice 2 · Paste a brand\u2019s message',[
['Paste','Rules read amount (25k, ₹18,000, 1.2L), deliverables, platform, email, dates, payment timing, usage, revisions, contact and brand','pass','Tested on 3 sample messages: 4, 10 and 6 terms filled.','','#/deals/new?m=paste'],
['Paste','Vague dates ("end of month") are never turned into a date; the field shows a warning','pass','','',''],
['Paste','Each filled field shows where it came from; the original message is kept with the deal and the record','pass','','',''],
]],
['§6 End-to-end (13 steps)',[
['§6.1','Start manually, fill needed terms, see "Draft · saved HH:MM" within 2 s','pass','Status shows "Saving…" then "Draft · saved HH:MM".','','#/deals/new?m=manual'],
['§6.2','Save draft lands on Draft detail with the alert; deal in Deals under Needs you','pass','','','#/deals/mitti'],
['§6.3','One needed term missing → Send disabled and names it','fixed','Now names up to 2 items, else the count.','','#/deals/mitti'],
['§6.4','Send → Copy link copies a working link; deal shows Sent; record has "Terms v1 sent"','fixed','Event renamed. URL is the prototype address, not algostudio.in.','',''],
['§6.5','No account: all terms + three equal answer buttons','fixed','"Your answer" card with three full-width buttons; mobile bar is "Go to your answer" and hides when the card is on screen.','',''],
['§6.6','Creator page shows "Opened"; one "Link opened" record','pass','','',''],
['§6.7','Code check; wrong codes show tries left; right code → Step 2','fixed','The code is sent when the sheet opens; Step 1 / Step 2 labels; 6th digit submits.','',''],
['§6.8','Receipt; reload keeps it; second tab can\u2019t answer','pass','','',''],
['§6.9','Creator page → In progress with alert and confirmer line; timeline events 2–6','fixed','Moves to In progress on confirm; no creation event.','','#/deals/tara'],
['§6.10','Request changes path','pass','','',''],
['§6.11','Made-up token → Invalid, 404, indistinguishable','device','Body identical; status and timing need a server.','',''],
['§6.12','360 / 390 / 1280: no horizontal scroll, 44 px targets, bar never covers last row','device','','',''],
['§6.13','Offline: creator edits and saves; brand reads but can\u2019t answer; both see the message','fixed','Offline alerts on create, deal, brand, approval and payments; sends and answers disabled with the reason.','',''],
]],
['Slice 1 · Creator screens C1–C8',[
['C1','"Use a template" absent at 0 templates; "Paste a brand\u2019s message" + "Fastest"','fixed','','',''],
['C1','Start manually focuses Brand name','fixed','','','#/deals/new?m=manual'],
['C2','No record event for draft edits or creation','fixed','','',''],
['C2','On-blur validation (email, past dates, due before deadline, amount 0)','fixed','Spec strings; never while typing.','',''],
['C2','Offline edits; status "Saved on this device"','fixed','Saves locally either way.','',''],
['C2','Save failed state "Couldn\u2019t save your last change."','partial','Not built: the local store can\u2019t fail in the prototype. Needed once there\u2019s a server.','',''],
['C2','"Needed to send" / "Recommended"; recommended open one at a time on mobile, all open on desktop','fixed','','',''],
['C3','Tapping a readiness row scrolls to and focuses the field','fixed','','',''],
['C3','Primary "Send confirmation link"; ?step=review pushed so Back returns to the form','fixed','','',''],
['C4','Undo toast lasts 10 s','fixed','','',''],
['C4','"Add missing terms" edits the same draft; readiness rows come from the draft','fixed','','','#/deals/mitti'],
['C5','"Your name" asked on first send only (2–60 chars); masked-email note; "Send from your email"','fixed','Shows for accounts without a name.','',''],
['C5','Double tap creates one link','fixed','Guarded per sheet open.','',''],
['C5','Opaque tokens (128 bits)','fixed','22-char random tokens; no deal id or version.','',''],
['C6','Desktop panel facts read from the deal','fixed','','','#/deals/glow'],
['C6','Alert per channel; Replace link in More; copy failure toast; "Opened by {contact} today at HH:MM."','fixed','','',''],
['C7','In progress chip; "Confirmed by {brand}" card with code checked and version locked','fixed','','','#/deals/tara'],
['C8','Chip "Sent to brand" + "Your turn"; primary only','fixed','','',''],
]],
['Slice 1 · Brand screens and record',[
['B2','Wrong-code, expired-code and rate-limit copy; exact retry time','fixed','Rate limit after 3 codes in a session (prototype).','',''],
['B3','Name 2–80 chars; "You are confirming · Version n" summary; receipt heading gets focus','fixed','','',''],
['B4','4 spec areas; "Your note to {creator}" up to 1,000 chars; verify first, then the form','fixed','','',''],
['B5','"Open the latest link" only for a verified device','fixed','','',''],
['B5','Invalid token indistinguishable by status and timing','device','','',''],
['§5','Event names follow §5 ("Terms v1 sent", "Link opened", "Changes requested: …")','fixed','','',''],
['§5.9','Reminder events store channel + message text','fixed','','',''],
['§5','Actor shown on Deal detail and Record timelines','fixed','','',''],
['§5','Seed deals use real logged events only','fixed','No generated timelines or fixed dates.','','#/deals/kora/record'],
]],
];
class Component extends DCLogic{
  state={marks:{},filter:'all'};
  componentDidMount(){try{this.setState({marks:JSON.parse(localStorage.getItem('as.acceptance.run2')||'{}')})}catch(e){}}
  mark(k,v){this.setState(s=>{const m=Object.assign({},s.marks);m[k]=m[k]===v?undefined:v;try{localStorage.setItem('as.acceptance.run2',JSON.stringify(m))}catch(e){}return {marks:m};});}
  renderVals(){
    const {marks,filter}=this.state;const all=S.flatMap(s=>s[1]);
    const cnt=r=>all.filter(x=>x[2]===r).length;
    const pick=f=>()=>this.setState(s=>({filter:s.filter===f?'all':f}));
    const summary=['fixed','pass','partial','fail','device'].map(r=>({n:cnt(r),label:R[r][0],bg:R[r][1],fg:R[r][2],ring:filter===r?'2px solid '+R[r][2]:'none',pick:pick(r)}));
    const sections=S.map(([title,items],si)=>{const its=items.map((x,i)=>({x,k:si+'-'+i})).filter(o=>filter==='all'||o.x[2]===filter).map(({x,k})=>{const m=marks[k];return {ref:x[0],check:x[1],label:R[x[2]][0],bg:R[x[2]][1],fg:R[x[2]][2],note:x[3],fix:x[4],hasFix:!!x[4],hasRoute:!!x[5],href:APP+x[5],
      pBg:m==='pass'?'#3E7420':'transparent',pFg:m==='pass'?'#FFFFFF':'#5E5E66',fBg:m==='fail'?'#B42318':'transparent',fFg:m==='fail'?'#FFFFFF':'#5E5E66',markPass:()=>this.mark(k,'pass'),markFail:()=>this.mark(k,'fail')};});
      const mine=items.map((_,i)=>marks[si+'-'+i]).filter(Boolean).length;
      return {title,items:its,empty:its.length===0,emptyText:'No checks with this result.',meta:items.length+' checks · '+mine+' marked by you'};});
    return {summary,sections};
  }
}

export default class AcceptanceTest extends Component {
  render() {
    const v = { ...this.props, ...(this.renderVals() || {}) };
    return (
      <DCHost id="AcceptanceTest" css={CSS} links={LINKS} hostStyle={this.props.__hostStyle}>
        <div style={{"maxWidth":"1080px","margin":"0 auto","padding":"48px 24px 96px","display":"grid","gap":"28px"}}>{"\n  "}<header style={{"display":"grid","gap":"10px"}}>{"\n    "}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"11px","letterSpacing":"0.06em","textTransform":"uppercase","color":"#5E5E66"}}>AlgoStudio · Acceptance test · Slice 1 + 2 · run 2 · 06 Oct 2026</span>{"\n    "}<h1 style={{"margin":"0","fontFamily":"'Jost',sans-serif","fontWeight":"500","fontSize":"40px","lineHeight":"1.1","letterSpacing":"-0.02em","color":"#111111"}}>Slice 1 + 2 acceptance</h1>{"\n    "}<p style={{"margin":"0","maxWidth":"680px","fontSize":"15px","lineHeight":"1.5","color":"#5E5E66","textWrap":"pretty"}}>Run 2, after the Slice 1 fixes and the Slice 2 build. Results come from store tests against the real code plus a read of each screen. “Fixed · re-check” items were failing in run 1. Mark your own result in the right column; it's saved on this device. Seed data was reset for this run.</p>{"\n    "}<div style={{"display":"flex","flexWrap":"wrap","gap":"8px","alignItems":"center"}}>{"\n      "}<a href="app/AlgoStudio%20App.html" target="_blank" style={{"fontSize":"14px","fontWeight":"700"}}>Open the app</a>{"\n    "}</div>{"\n  "}</header>{"\n\n  "}<div style={{"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(150px,1fr))","gap":"8px"}}>{"\n    "}{L(v.summary).map(($it1, $i1) => { const v1 = { ...v, s: $it1, $index: $i1 }; return (<React.Fragment key={$i1}>{"\n      "}<button onClick={v1.s?.pick} style={sty(`all:unset;cursor:pointer;background:${S(v1.s?.bg)};border-radius:12px;padding:14px 16px;display:grid;gap:2px;outline:${S(v1.s?.ring)}`)}>{"\n        "}<span style={sty(`font-family:'Jost',sans-serif;font-size:30px;font-weight:500;color:${S(v1.s?.fg)}`)}>{T(v1.s?.n)}</span>{"\n        "}<span style={sty(`font-size:13px;font-weight:500;color:${S(v1.s?.fg)}`)}>{T(v1.s?.label)}</span>{"\n      "}</button>{"\n    "}</React.Fragment>); })}{"\n  "}</div>{"\n\n  "}{L(v.sections).map(($it1, $i1) => { const v1 = { ...v, sec: $it1, $index: $i1 }; return (<React.Fragment key={$i1}>{"\n    "}<section style={{"display":"grid","gap":"8px"}}>{"\n      "}<div style={{"display":"flex","justifyContent":"space-between","alignItems":"baseline","gap":"12px","flexWrap":"wrap","padding":"0 4px"}}>{"\n        "}<h2 style={{"margin":"0","fontFamily":"'Jost',sans-serif","fontWeight":"500","fontSize":"22px","color":"#111111"}}>{T(v1.sec?.title)}</h2>{"\n        "}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"11px","letterSpacing":"0.04em","color":"#5E5E66"}}>{T(v1.sec?.meta)}</span>{"\n      "}</div>{"\n      "}{(v1.sec?.empty) ? (<>{"\n        "}<div style={{"background":"#FFFFFF","borderRadius":"12px","padding":"16px","fontSize":"14px","color":"#5E5E66"}}>{T(v1.sec?.emptyText)}</div>{"\n      "}</>) : null}{"\n      "}{L(v1.sec?.items).map(($it2, $i2) => { const v2 = { ...v1, it: $it2, $index: $i2 }; return (<React.Fragment key={$i2}>{"\n        "}<div style={{"background":"#FFFFFF","borderRadius":"12px","padding":"14px 16px","display":"grid","gridTemplateColumns":"minmax(0,1fr) auto","gap":"10px 20px","alignItems":"start"}}>{"\n          "}<div style={{"display":"grid","gap":"6px","minWidth":"0"}}>{"\n            "}<div style={{"display":"flex","gap":"8px","alignItems":"center","flexWrap":"wrap"}}>{"\n              "}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"11px","color":"#5E5E66"}}>{T(v2.it?.ref)}</span>{"\n              "}<span style={sty(`font-size:12px;font-weight:700;padding:2px 8px;border-radius:999px;background:${S(v2.it?.bg)};color:${S(v2.it?.fg)}`)}>{T(v2.it?.label)}</span>{"\n            "}</div>{"\n            "}<div style={{"fontSize":"15px","fontWeight":"700","lineHeight":"1.4","color":"#111111","textWrap":"pretty"}}>{T(v2.it?.check)}</div>{"\n            "}<div style={{"fontSize":"14px","lineHeight":"1.5","color":"#2E2E33","textWrap":"pretty"}}>{T(v2.it?.note)}</div>{"\n            "}{(v2.it?.hasFix) ? (<>{"\n              "}<div style={{"fontSize":"13px","lineHeight":"1.5","color":"#5E5E66"}}><b style={{"color":"#2E2E33"}}>Proposed fix:</b>{" "}{T(v2.it?.fix)}</div>{"\n            "}</>) : null}{"\n          "}</div>{"\n          "}<div style={{"display":"grid","gap":"6px","justifyItems":"end"}}>{"\n            "}<div style={{"display":"flex","gap":"4px","background":"#F2F3F5","borderRadius":"10px","padding":"3px"}}>{"\n              "}<button onClick={v2.it?.markPass} style={sty(`all:unset;cursor:pointer;font-size:13px;font-weight:700;padding:8px 12px;border-radius:8px;min-height:20px;background:${S(v2.it?.pBg)};color:${S(v2.it?.pFg)}`)}>Pass</button>{"\n              "}<button onClick={v2.it?.markFail} style={sty(`all:unset;cursor:pointer;font-size:13px;font-weight:700;padding:8px 12px;border-radius:8px;min-height:20px;background:${S(v2.it?.fBg)};color:${S(v2.it?.fFg)}`)}>Fail</button>{"\n            "}</div>{"\n            "}{(v2.it?.hasRoute) ? (<>{"\n              "}<a href={v2.it?.href} target="_blank" style={{"fontSize":"12px"}}>Open screen</a>{"\n            "}</>) : null}{"\n          "}</div>{"\n        "}</div>{"\n      "}</React.Fragment>); })}{"\n    "}</section>{"\n  "}</React.Fragment>); })}{"\n\n  "}<p style={{"margin":"0","fontSize":"12px","color":"#86868E"}}>Store-level tests run the actual seed, store and data code with an isolated in-memory store, so your demo data wasn't touched. Server-only checks (404 status, response timing, rate limits) can't be run in a browser prototype and are marked "Needs device / backend".</p></div>
      </DCHost>
    );
  }
}
