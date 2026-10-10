// @ts-nocheck
// Generated from "AlgoStudio Website Login.dc.html" by scripts/dc-convert.js. Inline styles and logic are kept as in the prototype so it renders the same.
import React from 'react';
import { DCLogic, DCHost, sty, T, S, L, R, hostPos, XImport } from '@/dc/runtime';


const CSS = `
@font-face{font-family:'Satoshi';src:url('/assets/Satoshi-Variable.woff2') format('woff2');font-weight:300 900;font-style:normal;font-display:swap}
html,body{margin:0;padding:0;background:#FFFFFF}
body{font-family:'Satoshi',ui-sans-serif,system-ui,sans-serif;color:#2E2E33;-webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
a{color:#076645;text-decoration:none}
a:hover{color:#064F37}
*{box-sizing:border-box}
input::placeholder{color:#B4B4BA}
@keyframes lgDriftA{0%{transform:translate3d(0,0,0) rotate(0deg) scale(1)}100%{transform:translate3d(-4%,3%,0) rotate(-3deg) scale(1.05)}}
@keyframes lgDriftB{0%{transform:translate3d(2%,-2%,0) rotate(1.5deg) scale(1.03)}100%{transform:translate3d(-2%,2%,0) rotate(-1deg) scale(.98)}}
@keyframes lgDriftC{0%{transform:translate3d(0,0,0) rotate(0deg) scale(1)}100%{transform:translate3d(3%,-1.5%,0) rotate(2deg) scale(1.04)}}
@keyframes lgStepIn{from{opacity:0;filter:blur(4px);transform:translateY(8px)}to{opacity:1;filter:blur(0);transform:none}}
@keyframes lgRise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes lgShake{0%,100%{transform:none}20%{transform:translateX(-5px)}40%{transform:translateX(4px)}60%{transform:translateX(-3px)}80%{transform:translateX(2px)}}
@keyframes lgShake2{0%,100%{transform:none}20%{transform:translateX(-5px)}40%{transform:translateX(4px)}60%{transform:translateX(-3px)}80%{transform:translateX(2px)}}
@keyframes lgPop{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.08)}100%{transform:scale(1)}}
@keyframes lgCaret{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes lgFill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes lgSpin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion: reduce){*{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}}

.p-websitelogin-0:hover{background:#F2F3F5 !important;color:#111111 !important}
.p-websitelogin-1:hover{background:#076645 !important}
.p-websitelogin-2:active{transform:scale(.97) !important}
.p-websitelogin-3:hover{background:#E9F7F0 !important}
`;
const LINKS = ["https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Oi&family=Geist+Mono:wght@400;500&display=swap"];

class Component extends DCLogic {
  static CODE = '482913';
  phoneRef = React.createRef();
  codeRef = React.createRef();
  state = { step: 'phone', phone: '', phoneErr: false, phoneFocus: false, code: '', codeFocus: false, busy: false,
    tries: 3, codeErr: '', locked: false, shakeN: 0, timer: 0, toast: '', wide: true,
    still: typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches };

  componentDidMount() {
    this._rs = () => this.setState({ wide: window.innerWidth >= 960 });
    this._rs(); window.addEventListener('resize', this._rs);
    this._iv = setInterval(() => { if (this.state.timer > 0) this.setState(s => ({ timer: s.timer - 1 })); }, 1000);
    setTimeout(() => this.phoneRef.current && this.phoneRef.current.focus(), 300);
  }
  componentWillUnmount() { window.removeEventListener('resize', this._rs); clearInterval(this._iv); clearTimeout(this._b); clearTimeout(this._t); clearTimeout(this._go); }

  fmt(v) {
    let d = v.replace(/\D/g, '');
    if (d.length > 10 && d.startsWith('91')) d = d.slice(2);
    if (d.startsWith('0')) d = d.slice(1);
    d = d.slice(0, 10);
    return d.length > 5 ? d.slice(0, 5) + ' ' + d.slice(5) : d;
  }
  toast(t) { clearTimeout(this._t); this.setState({ toast: t }); this._t = setTimeout(() => this.setState({ toast: '' }), 2600); }
  shake() { this.setState(s => ({ shakeN: s.shakeN + 1 })); }

  sendCode(e) {
    e && e.preventDefault();
    if (this.state.busy) return;
    if (this.state.phone.replace(/\D/g, '').length !== 10) { this.setState({ phoneErr: true }); this.shake(); this.phoneRef.current && this.phoneRef.current.focus(); return; }
    this.setState({ busy: true });
    this._b = setTimeout(() => {
      this.setState({ busy: false, step: 'code', code: '', codeErr: '', tries: 3, locked: false, timer: 30 });
      setTimeout(() => this.codeRef.current && this.codeRef.current.focus(), 60);
    }, 900);
  }
  check() {
    const s = this.state;
    if (s.busy || s.locked || s.code.length !== 6) return;
    this.setState({ busy: true });
    this._b = setTimeout(() => {
      if (this.state.code === Component.CODE) {
        this.setState({ busy: false, step: 'done' });
        this._go = setTimeout(() => { window.location.href = '/app'; }, 1700);
        return;
      }
      const tries = this.state.tries - 1;
      this.setState({ busy: false, tries, locked: tries <= 0, replace: true,
        codeErr: tries <= 0 ? 'That code has stopped working. Tap Resend code for a new one.' : `That code doesn't match. ${tries} ${tries === 1 ? 'try' : 'tries'} left.` });
      this.shake();
      setTimeout(() => { const el = this.codeRef.current; if (el && tries > 0) { el.focus(); el.select(); } }, 30);
    }, 700);
  }
  onCode(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (this.state.replace && v.length > this.state.code.length) v = v.slice(this.state.code.length);
    v = v.slice(0, 6);
    this.setState({ code: v, codeErr: '', replace: false }, () => { if (v.length === 6) this.check(); });
  }
  resend() {
    this.setState({ code: '', codeErr: '', tries: 3, locked: false, timer: 30, replace: false });
    this.toast('New code sent.');
    setTimeout(() => this.codeRef.current && this.codeRef.current.focus(), 30);
  }

  ribbons() {
    const h = React.createElement, still = this.state.still;
    const B = [
      { id: 'haze', blur: 40, op: .6, anim: 'lgDriftB', dur: 37, delay: -5, d: ['M250,-150 C460,180 640,500 1150,820 L1150,1150 C700,800 480,420 60,-150 Z'], g: [[0,'#E6FBF3',0],[.4,'#BDEFDC',.9],[1,'#7FD9C0',.6]] },
      { id: 'deep', blur: 22, op: .75, anim: 'lgDriftC', dur: 53, delay: -19, d: ['M760,-150 C820,180 920,470 1150,520 L1150,1150 C930,900 700,340 600,-150 Z', 'M780,-150 C800,220 950,440 1150,480 L1150,1150 C900,880 720,300 620,-150 Z'], md: 43, g: [[0,'#0A7F55',.15],[.4,'#0A7F55',1],[1,'#043B29',1]] },
      { id: 'main', blur: 14, op: .92, anim: 'lgDriftA', dur: 31, delay: -8, d: ['M400,-150 C540,180 700,430 1150,660 L1150,940 C760,680 560,380 240,-150 Z', 'M430,-150 C520,220 760,400 1150,620 L1150,900 C720,700 600,330 270,-150 Z'], md: 41, g: [[0,'#E9FBF3',0],[.18,'#B8F0D8',1],[.45,'#34C39A',1],[.75,'#0A7F55',1],[1,'#064F37',1]] },
      { id: 'teal', blur: 8, op: .7, anim: 'lgDriftB', dur: 23, delay: -3, d: ['M520,-150 C640,150 800,380 1150,540 L1150,640 C790,470 620,240 450,-150 Z', 'M540,-150 C620,190 830,350 1150,500 L1150,600 C800,450 600,280 470,-150 Z'], md: 33, g: [[0,'#DDF7F8',0],[.3,'#9BE7E0',1],[.7,'#14A39A',1],[1,'#0B6E68',1]] },
      { id: 'sheen', blur: 4, op: .85, anim: 'lgDriftA', dur: 31, delay: -8, d: ['M380,-150 C520,190 690,450 1150,690 L1150,715 C680,480 500,215 350,-150 Z', 'M410,-150 C500,230 750,420 1150,650 L1150,675 C740,450 480,255 380,-150 Z'], md: 41, g: [[0,'#FFFFFF',0],[.4,'#FFFFFF',1],[1,'#FFFFFF',.15]] }
    ];
    const spline = { calcMode: 'spline', keyTimes: '0;0.5;1', keySplines: '0.45 0 0.55 1;0.45 0 0.55 1', repeatCount: 'indefinite' };
    const kids = B.map(b => {
      const gid = 'lg-' + b.id;
      const pathKids = !still && b.d[1] ? [h('animate', { key: 'm', attributeName: 'd', dur: b.md + 's', begin: b.delay + 's', values: b.d[0] + ';' + b.d[1] + ';' + b.d[0], ...spline })] : [];
      return h('div', { key: b.id, style: { position: 'absolute', inset: 0, opacity: b.op, transformOrigin: '70% 25%', willChange: still ? 'auto' : 'transform', animation: still ? 'none' : `${b.anim} ${b.dur}s ease-in-out ${b.delay}s infinite alternate` } },
        h('svg', { viewBox: '0 0 1000 1000', preserveAspectRatio: 'none', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', filter: `blur(${b.blur}px)` } },
          h('defs', null, h('linearGradient', { id: gid, x1: 0, y1: 0, x2: 1, y2: 1 }, b.g.map((s, i) => h('stop', { key: i, offset: s[0], stopColor: s[1], stopOpacity: s[2] })))),
          h('path', { d: b.d[0], fill: `url(#${gid})` }, pathKids)));
    });
    return h('div', { style: { position: 'absolute', left: '-20%', right: '-30%', top: '-10%', bottom: '-10%' } }, kids);
  }

  renderVals() {
    const s = this.state, ic = n => 'https://unpkg.com/lucide-static@0.460.0/icons/' + n + '.svg';
    const shakeA = n => n ? `${n % 2 ? 'lgShake' : 'lgShake2'} 320ms cubic-bezier(.36,.07,.19,.97) both` : 'none';
    const phoneOk = s.phone.replace(/\D/g, '').length === 10;
    const pErr = s.phoneErr && !phoneOk;
    const focusI = s.code.length;
    const boxes = Array.from({ length: 6 }, (_, i) => {
      const d = s.code[i] || '', active = s.codeFocus && !s.locked && i === Math.min(focusI, 5) && focusI < 6;
      const err = !!s.codeErr;
      return { d, filled: !!d, caret: active && !d,
        border: err ? '#E5352B' : active ? '#0A7F55' : d ? '#62C597' : '#E4E4E8',
        bg: err ? '#FDE8E8' : s.locked ? '#F7F7F9' : '#FFFFFF',
        ring: active && !err ? '0 0 0 4px #CDEEDD' : 'none', fg: err ? '#B42318' : '#111111' };
    });
    const mm = t => '0:' + String(t).padStart(2, '0');
    return {
      isPhone: s.step === 'phone', isCode: s.step === 'code', isDone: s.step === 'done',
      phone: s.phone, phoneRef: this.phoneRef, codeRef: this.codeRef,
      onPhone: e => this.setState({ phone: this.fmt(e.target.value) }),
      phoneFocus: () => this.setState({ phoneFocus: true }), phoneBlur: () => this.setState({ phoneFocus: false }),
      phoneBorder: pErr ? '#E5352B' : s.phoneFocus ? '#0A7F55' : '#E4E4E8',
      phoneBg: pErr ? '#FDE8E8' : '#FFFFFF',
      phoneRing: s.phoneFocus && !pErr ? '0 0 0 4px #CDEEDD' : 'none',
      phoneShake: pErr ? shakeA(s.shakeN) : 'none', phoneInvalid: pErr,
      phoneHint: pErr ? 'Enter a 10-digit mobile number, like 98765 43210.' : 'We’ll send a 6-digit code by SMS.',
      phoneRole: pErr ? 'alert' : undefined, hintFg: pErr ? '#B42318' : '#5E5E66', hintW: pErr ? 700 : 500,
      onSendCode: e => this.sendCode(e), busy: s.busy, busyOp: s.busy ? 0.8 : 1,
      sendLabel: s.busy ? 'Sending code…' : 'Send code',
      changeNumber: () => { this.setState({ step: 'phone', code: '', codeErr: '' }); setTimeout(() => this.phoneRef.current && this.phoneRef.current.focus(), 60); },
      boxes, code: s.code, onCode: e => this.onCode(e),
      codeFocus: () => this.setState({ codeFocus: true }), codeBlur: () => this.setState({ codeFocus: false }),
      codeLocked: s.locked || s.busy, codeInvalid: !!s.codeErr,
      codeShake: s.codeErr ? shakeA(s.shakeN) : 'none',
      codeMsg: s.codeErr || (s.busy ? 'Checking code…' : 'The code logs you in as soon as all 6 digits are in.'),
      codeRole: s.codeErr ? 'alert' : undefined, codeMsgFg: s.codeErr ? '#B42318' : '#5E5E66', codeMsgW: s.codeErr ? 700 : 500,
      onLogin: e => { e.preventDefault(); this.check(); },
      loginDisabled: s.busy || s.locked || s.code.length !== 6, loginOp: s.busy || s.locked || s.code.length !== 6 ? 0.55 : 1,
      loginLabel: s.busy ? 'Checking code…' : 'Log in',
      canResend: s.timer === 0, counting: s.timer > 0, timer: mm(s.timer), resend: () => this.resend(),
      hasToast: !!s.toast, toast: s.toast,
      panelDisplay: s.wide ? 'block' : 'none',
      onBack: e => { if (this.props.onClose) { e.preventDefault(); this.props.onClose(); } },
      ribbons: this.ribbons(),
      steps: [
        { label: 'Deal confirmed by Glow Skin Co.', time: '10:15', icon: ic('badge-check'), bg: '#E9F7F0', fg: '#076645', delay: '420ms' },
        { label: 'Reel approved', time: '15:00', icon: ic('check-check'), bg: '#EEF2FF', fg: '#2F45C4', delay: '480ms' },
        { label: '$400 received', time: '14:10', icon: ic('banknote'), bg: '#EFF6E5', fg: '#3E7420', delay: '540ms' }
      ]
    };
  }
}

export default class WebsiteLogin extends Component {
  render() {
    const v = { ...this.props, ...(this.renderVals() || {}) };
    return (
      <DCHost id="WebsiteLogin" css={CSS} links={LINKS} hostStyle={this.props.__hostStyle}>
        <div data-screen-label="Website Login" style={{"minHeight":"100vh","display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(min(100%,460px),1fr))","background":"#FFFFFF"}}>{"\n\n  "}<div style={{"display":"flex","flexDirection":"column","minHeight":"100vh","padding":"24px clamp(20px,5vw,64px)"}}>{"\n    "}<header style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"12px","height":"48px"}}>{"\n      "}<a href="AlgoStudio Website.dc.html" onClick={v.onBack} aria-label="AlgoStudio home" style={{"display":"flex","alignItems":"center","gap":"10px"}}>{"\n        "}<img src="/assets/logo-mark.png" alt="" style={{"width":"30px","height":"auto","display":"block"}} />{"\n        "}<span style={{"fontFamily":"'Oi',sans-serif","fontSize":"17px","letterSpacing":"0.02em","color":"#111111"}}>ALGOSTUDIO</span>{"\n      "}</a>{"\n      "}<a href="AlgoStudio Website.dc.html" onClick={v.onBack} style={{"display":"flex","alignItems":"center","gap":"6px","height":"44px","padding":"0 14px","borderRadius":"12px","fontSize":"14px","fontWeight":"600","color":"#5E5E66","transition":"background 120ms ease-out,color 120ms ease-out"}} className="p-websitelogin-0"><span style={{"width":"15px","height":"15px","background":"currentColor","WebkitMask":"url(https://unpkg.com/lucide-static@0.460.0/icons/arrow-left.svg) center/contain no-repeat","mask":"url(https://unpkg.com/lucide-static@0.460.0/icons/arrow-left.svg) center/contain no-repeat"}}></span>Back to site</a>{"\n    "}</header>{"\n\n    "}<main style={{"flex":"1","display":"flex","alignItems":"center","justifyContent":"center","padding":"48px 0"}}>{"\n      "}<div style={{"width":"100%","maxWidth":"400px","display":"flex","flexDirection":"column","gap":"28px"}}>{"\n\n        "}{(v.isPhone) ? (<>{"\n          "}<form onSubmit={v.onSendCode} noValidate={true} style={{"display":"flex","flexDirection":"column","gap":"28px","animation":"lgStepIn 280ms cubic-bezier(.23,1,.32,1) both"}}>{"\n            "}<div style={{"display":"flex","flexDirection":"column","gap":"10px"}}>{"\n              "}<h1 style={{"margin":"0","fontFamily":"'Jost',sans-serif","fontWeight":"500","fontSize":"36px","lineHeight":"1.1","letterSpacing":"-0.02em","color":"#111111"}}>Log in or sign up</h1>{"\n              "}<p style={{"margin":"0","fontSize":"16px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66","textWrap":"pretty"}}>Use your mobile number. We'll text you a code, so there's no password to remember.</p>{"\n            "}</div>{"\n            "}<div style={{"display":"flex","flexDirection":"column","gap":"8px"}}>{"\n              "}<label htmlFor="lg-phone" style={{"fontSize":"14px","fontWeight":"700","color":"#111111"}}>Mobile number</label>{"\n              "}<div style={sty(`display:flex;align-items:center;height:56px;border-radius:14px;border:1.5px solid ${S(v.phoneBorder)};background:${S(v.phoneBg)};box-shadow:${S(v.phoneRing)};transition:border-color 150ms ease,box-shadow 150ms ease,background 150ms ease;animation:${S(v.phoneShake)}`)}>{"\n                "}<span style={{"flex":"none","padding":"0 12px 0 16px","height":"100%","display":"flex","alignItems":"center","fontSize":"17px","fontWeight":"600","color":"#5E5E66","borderRight":"1px solid #E4E4E8"}}>+91</span>{"\n                "}<input id="lg-phone" ref={v.phoneRef} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength="11" value={(v.phone) ?? ''} onChange={v.onPhone} onFocus={v.phoneFocus} onBlur={v.phoneBlur} placeholder="98765 43210" aria-describedby="lg-phone-hint" aria-invalid={v.phoneInvalid} style={{"flex":"1","minWidth":"0","height":"100%","padding":"0 16px","border":"0","outline":"none","background":"transparent","font":"inherit","fontSize":"17px","fontWeight":"600","letterSpacing":"0.02em","color":"#111111"}} />{"\n              "}</div>{"\n              "}<span id="lg-phone-hint" role={v.phoneRole} style={sty(`font-size:13px;font-weight:${S(v.hintW)};color:${S(v.hintFg)}`)}>{T(v.phoneHint)}</span>{"\n            "}</div>{"\n            "}<button type="submit" disabled={v.busy} style={sty(`appearance:none;border:0;cursor:pointer;font-family:inherit;height:56px;border-radius:14px;background:#0A7F55;color:#FFFFFF;font-size:16px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 10px 24px -12px rgba(10,127,85,.7);transition:background 150ms ease,transform 160ms cubic-bezier(.23,1,.32,1),opacity 150ms ease;opacity:${S(v.busyOp)}`)} className="p-websitelogin-1 p-websitelogin-2">{"\n              "}{(v.busy) ? (<><span style={{"width":"16px","height":"16px","borderRadius":"999px","border":"2px solid rgba(255,255,255,.35)","borderTopColor":"#FFFFFF","animation":"lgSpin 600ms linear infinite"}}></span></>) : null}{"\n              "}{T(v.sendLabel)}{"\n            "}</button>{"\n            "}<span style={{"fontSize":"12px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66"}}>{"By continuing you agree to the "}<a href="#terms" style={{"fontWeight":"700"}}>Terms of Use</a>{" and "}<a href="#privacy" style={{"fontWeight":"700"}}>Privacy Policy</a>.</span>{"\n          "}</form>{"\n        "}</>) : null}{"\n\n        "}{(v.isCode) ? (<>{"\n          "}<form onSubmit={v.onLogin} noValidate={true} style={{"display":"flex","flexDirection":"column","gap":"28px","animation":"lgStepIn 280ms cubic-bezier(.23,1,.32,1) both"}}>{"\n            "}<div style={{"display":"flex","flexDirection":"column","gap":"10px"}}>{"\n              "}<h1 style={{"margin":"0","fontFamily":"'Jost',sans-serif","fontWeight":"500","fontSize":"36px","lineHeight":"1.1","letterSpacing":"-0.02em","color":"#111111"}}>Enter the code</h1>{"\n              "}<p style={{"margin":"0","fontSize":"16px","fontWeight":"500","lineHeight":"1.5","color":"#5E5E66"}}>{"We sent a 6-digit code to "}<b style={{"color":"#111111","whiteSpace":"nowrap"}}>{"+91 "}{T(v.phone)}</b>.</p>{"\n              "}<button type="button" onClick={v.changeNumber} style={{"appearance":"none","border":"0","cursor":"pointer","fontFamily":"inherit","alignSelf":"flex-start","height":"44px","margin":"-6px 0 -8px -10px","padding":"0 10px","borderRadius":"10px","background":"transparent","fontSize":"14px","fontWeight":"700","color":"#076645","transition":"background 120ms ease-out"}} className="p-websitelogin-3">Change number</button>{"\n            "}</div>{"\n\n            "}<div style={{"display":"flex","flexDirection":"column","gap":"8px"}}>{"\n              "}<label htmlFor="lg-code" style={{"fontSize":"14px","fontWeight":"700","color":"#111111"}}>6-digit code</label>{"\n              "}<div style={sty(`position:relative;animation:${S(v.codeShake)}`)}>{"\n                "}<div aria-hidden="true" style={{"display":"grid","gridTemplateColumns":"repeat(6,minmax(0,1fr))","gap":"8px"}}>{"\n                  "}{L(v.boxes).map(($it1, $i1) => { const v1 = { ...v, b: $it1, $index: $i1 }; return (<React.Fragment key={$i1}>{"\n                    "}<span style={sty(`position:relative;height:60px;border-radius:14px;border:1.5px solid ${S(v1.b?.border)};background:${S(v1.b?.bg)};box-shadow:${S(v1.b?.ring)};display:flex;align-items:center;justify-content:center;font-family:'Geist Mono',monospace;font-size:24px;font-weight:500;color:${S(v1.b?.fg)};transition:border-color 150ms ease,box-shadow 150ms ease,background 150ms ease`)}>{"\n                      "}{(v1.b?.filled) ? (<><span style={{"animation":"lgPop 220ms cubic-bezier(.23,1,.32,1) both"}}>{T(v1.b?.d)}</span></>) : null}{"\n                      "}{(v1.b?.caret) ? (<><span style={{"width":"2px","height":"24px","borderRadius":"2px","background":"#0A7F55","animation":"lgCaret 1s steps(1) infinite"}}></span></>) : null}{"\n                    "}</span>{"\n                  "}</React.Fragment>); })}{"\n                "}</div>{"\n                "}<input id="lg-code" ref={v.codeRef} type="text" inputMode="numeric" autoComplete="one-time-code" pattern="\\d{6}" maxLength="6" value={(v.code) ?? ''} onChange={v.onCode} onFocus={v.codeFocus} onBlur={v.codeBlur} disabled={v.codeLocked} aria-describedby="lg-code-msg" aria-invalid={v.codeInvalid} style={{"position":"absolute","inset":"0","width":"100%","height":"100%","opacity":"0","border":"0","fontSize":"16px","cursor":"text"}} />{"\n              "}</div>{"\n              "}<span id="lg-code-msg" role={v.codeRole} style={sty(`font-size:13px;font-weight:${S(v.codeMsgW)};line-height:1.5;color:${S(v.codeMsgFg)}`)}>{T(v.codeMsg)}</span>{"\n            "}</div>{"\n\n            "}<div style={{"display":"flex","flexDirection":"column","gap":"10px"}}>{"\n              "}<button type="submit" disabled={v.loginDisabled} style={sty(`appearance:none;border:0;cursor:pointer;font-family:inherit;height:56px;border-radius:14px;background:#0A7F55;color:#FFFFFF;font-size:16px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 10px 24px -12px rgba(10,127,85,.7);transition:background 150ms ease,transform 160ms cubic-bezier(.23,1,.32,1),opacity 150ms ease;opacity:${S(v.loginOp)}`)} className="p-websitelogin-1 p-websitelogin-2">{"\n                "}{(v.busy) ? (<><span style={{"width":"16px","height":"16px","borderRadius":"999px","border":"2px solid rgba(255,255,255,.35)","borderTopColor":"#FFFFFF","animation":"lgSpin 600ms linear infinite"}}></span></>) : null}{"\n                "}{T(v.loginLabel)}{"\n              "}</button>{"\n              "}<div style={{"display":"flex","flexWrap":"wrap","alignItems":"center","justifyContent":"space-between","gap":"8px","minHeight":"44px"}}>{"\n                "}{(v.canResend) ? (<>{"\n                  "}<button type="button" onClick={v.resend} style={{"appearance":"none","border":"0","cursor":"pointer","fontFamily":"inherit","height":"44px","marginLeft":"-10px","padding":"0 10px","borderRadius":"10px","background":"transparent","fontSize":"14px","fontWeight":"700","color":"#076645","animation":"lgRise 220ms cubic-bezier(.23,1,.32,1) both","transition":"background 120ms ease-out"}} className="p-websitelogin-3">Resend code</button>{"\n                "}</>) : null}{"\n                "}{(v.counting) ? (<>{"\n                  "}<span style={{"fontSize":"14px","fontWeight":"500","color":"#5E5E66"}}>{"Resend code in "}<span style={{"fontFamily":"'Geist Mono',monospace","color":"#111111"}}>{T(v.timer)}</span></span>{"\n                "}</>) : null}{"\n                "}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"11px","color":"#5E5E66"}}>Demo code 482 913</span>{"\n              "}</div>{"\n            "}</div>{"\n          "}</form>{"\n        "}</>) : null}{"\n\n        "}{(v.isDone) ? (<>{"\n          "}<div role="status" style={{"display":"flex","flexDirection":"column","alignItems":"flex-start","gap":"18px","animation":"lgStepIn 280ms cubic-bezier(.23,1,.32,1) both"}}>{"\n            "}<span style={{"width":"64px","height":"64px","borderRadius":"999px","background":"#0A7F55","color":"#FFFFFF","display":"flex","alignItems":"center","justifyContent":"center","boxShadow":"0 14px 30px -14px rgba(10,127,85,.8)","animation":"lgPop 420ms cubic-bezier(.23,1,.32,1) 60ms both"}}><span style={{"width":"30px","height":"30px","background":"currentColor","WebkitMask":"url(https://unpkg.com/lucide-static@0.460.0/icons/check.svg) center/contain no-repeat","mask":"url(https://unpkg.com/lucide-static@0.460.0/icons/check.svg) center/contain no-repeat"}}></span></span>{"\n            "}<div style={{"display":"flex","flexDirection":"column","gap":"8px"}}>{"\n              "}<h1 style={{"margin":"0","fontFamily":"'Jost',sans-serif","fontWeight":"500","fontSize":"36px","lineHeight":"1.1","letterSpacing":"-0.02em","color":"#111111"}}>You're logged in.</h1>{"\n              "}<p style={{"margin":"0","fontSize":"16px","fontWeight":"500","color":"#5E5E66"}}>Opening your deals.</p>{"\n            "}</div>{"\n            "}<span style={{"width":"100%","height":"4px","borderRadius":"999px","background":"#E9F7F0","overflow":"hidden"}}><span style={{"display":"block","height":"100%","background":"#0A7F55","transformOrigin":"0 50%","animation":"lgFill 1400ms cubic-bezier(.65,0,.35,1) both"}}></span></span>{"\n            "}<a href="AlgoStudio Desktop App.dc.html" style={{"fontSize":"14px","fontWeight":"700"}}>Open now</a>{"\n          "}</div>{"\n        "}</>) : null}{"\n      "}</div>{"\n    "}</main>{"\n\n    "}<footer style={{"display":"flex","flexWrap":"wrap","gap":"8px 16px","fontSize":"12px","fontWeight":"500","color":"#5E5E66"}}>{"\n      "}<span>© 2026 AlgoStudio</span>{"\n      "}<a href="#privacy" style={{"color":"#5E5E66"}}>Privacy</a>{"\n      "}<a href="#terms" style={{"color":"#5E5E66"}}>Terms</a>{"\n    "}</footer>{"\n  "}</div>{"\n\n  "}<aside aria-hidden="true" style={sty(`position:relative;overflow:hidden;min-height:100vh;background:#F3FBF7;display:${S(v.panelDisplay)}`)}>{"\n    "}<div style={{"position":"absolute","inset":"0"}}>{T(v.ribbons)}</div>{"\n    "}<div style={{"position":"absolute","inset":"0","background":"linear-gradient(180deg,rgba(255,255,255,0) 45%,rgba(255,255,255,.75) 100%)"}}></div>{"\n    "}<div style={{"position":"absolute","left":"clamp(28px,5vw,64px)","right":"clamp(28px,5vw,64px)","bottom":"clamp(32px,6vh,64px)","display":"flex","flexDirection":"column","gap":"18px","animation":"lgRise 600ms cubic-bezier(.23,1,.32,1) 200ms both"}}>{"\n      "}<p style={{"margin":"0","maxWidth":"520px","fontFamily":"'Jost',sans-serif","fontWeight":"500","fontSize":"clamp(28px,2.6vw,40px)","lineHeight":"1.12","letterSpacing":"-0.02em","color":"#0B1F17","textWrap":"balance"}}>Turn a brand's DM into a deal you can track to payment.</p>{"\n      "}<div style={{"display":"flex","flexDirection":"column","gap":"8px","maxWidth":"360px"}}>{"\n        "}{L(v.steps).map(($it1, $i1) => { const v1 = { ...v, s: $it1, $index: $i1 }; return (<React.Fragment key={$i1}>{"\n          "}<div style={sty(`display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:0 0 0 1px rgba(10,127,85,.08),0 8px 24px -16px rgba(4,59,41,.35);animation:lgRise 500ms cubic-bezier(.23,1,.32,1) both;animation-delay:${S(v1.s?.delay)}`)}>{"\n            "}<span style={sty(`width:32px;height:32px;flex:none;border-radius:10px;background:${S(v1.s?.bg)};color:${S(v1.s?.fg)};display:flex;align-items:center;justify-content:center`)}><span style={sty(`width:16px;height:16px;background:currentColor;-webkit-mask:url(${S(v1.s?.icon)}) center/contain no-repeat;mask:url(${S(v1.s?.icon)}) center/contain no-repeat`)}></span></span>{"\n            "}<span style={{"flex":"1","fontSize":"14px","fontWeight":"700","color":"#111111"}}>{T(v1.s?.label)}</span>{"\n            "}<span style={{"fontFamily":"'Geist Mono',monospace","fontSize":"11px","color":"#5E5E66"}}>{T(v1.s?.time)}</span>{"\n          "}</div>{"\n        "}</React.Fragment>); })}{"\n      "}</div>{"\n    "}</div>{"\n  "}</aside>{"\n\n  "}{(v.hasToast) ? (<>{"\n    "}<div role="status" style={{"position":"fixed","left":"50%","bottom":"28px","transform":"translateX(-50%)","zIndex":"20","padding":"12px 18px","borderRadius":"12px","background":"#111111","color":"#FFFFFF","fontSize":"14px","fontWeight":"600","boxShadow":"0 12px 32px -12px rgba(0,0,0,.5)","animation":"lgRise 220ms cubic-bezier(.23,1,.32,1) both"}}>{T(v.toast)}</div>{"\n  "}</>) : null}</div>
      </DCHost>
    );
  }
}
