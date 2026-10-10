// @ts-nocheck
// Generated from "AlgoStudio Profile Menu.dc.html" by scripts/dc-convert.js. Inline styles and logic are kept as in the prototype so it renders the same.
import React from 'react';
import { DCLogic, DCHost, sty, T, S, L, R, hostPos, XImport } from '@/dc/runtime';


const CSS = `.p-profilemenu-0:hover{background:#FFFFFF !important}
.p-profilemenu-1:active{transform:scale(.97) !important}
.p-profilemenu-2:hover{background:#F2F3F5 !important}
`;
const LINKS = [];

class Component extends DCLogic {
  state = { open: false, copied: false, filled: false };
  componentDidMount() {
    this._f = setTimeout(() => this.setState({ filled: true }), 120);
    this._doc = e => { if (this.state.open && this._root && !this._root.contains(e.target)) this.setState({ open: false }); };
    this._key = e => { if (e.key === 'Escape' && this.state.open) this.setState({ open: false }); };
    document.addEventListener('mousedown', this._doc); document.addEventListener('keydown', this._key);
  }
  componentWillUnmount() { document.removeEventListener('mousedown', this._doc); document.removeEventListener('keydown', this._key); clearTimeout(this._c); clearTimeout(this._f); }
  progress() {
    const closed = this.props.dealsClosed ?? 7, onTime = this.props.paidOnTime ?? 5, paid = Math.max(this.props.paidTotal ?? 6, onTime);
    const steps = [1, 5, 10, 25, 50, 100], next = steps.find(n => n > closed) || closed + 1, prev = [...steps].reverse().find(n => n <= closed) || 0;
    const pct = Math.min(1, (closed - prev) / Math.max(1, next - prev));
    const all = [
      { label: 'First deal', on: closed >= 1, icon: 'handshake' },
      { label: '5 deals closed', on: closed >= 5, icon: 'award' },
      { label: 'On-time payer', on: paid > 0 && onTime / paid >= 0.8, icon: 'badge-check' },
      { label: '10 deals closed', on: closed >= 10, icon: 'trophy' }
    ];
    return { closed, onTime, paid, next, pct, all };
  }
  go(label, file) { this.setState({ open: false }); if (this.props.onNav) this.props.onNav(label); else location.href = file; }
  renderVals() {
    const s = this.state, icon = n => `url(https://unpkg.com/lucide-static@0.460.0/icons/${n}.svg) center/contain no-repeat`;
    return {
      rootRef: el => { this._root = el; },
      name: this.props.name || 'Ananya Rao',
      ...(() => {
        const p = this.progress(), nm = this.props.name || 'Ananya Rao', left = p.next - p.closed, earned = p.all.filter(b => b.on).length;
        return {
          initials: nm.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase(),
          ringOffset: 110 - 110 * (s.filled ? p.pct : 0),
          barWidth: (s.filled ? p.pct * 100 : 0) + '%',
          ringTitle: `${p.closed} deals closed · ${left} to the next milestone`,
          badgeCount: earned,
          nextLabel: `${p.next} deals closed`,
          nextLeft: `${left} to go`,
          dealsClosed: p.closed,
          onTimeText: `${p.onTime} of ${p.paid}`,
          badges: p.all.map(b => ({ label: b.label, mask: icon(b.on ? b.icon : 'lock'), bg: b.on ? '#EEF6F2' : '#FFFFFF', fg: b.on ? '#076645' : '#5E5E66', ring: b.on ? 'none' : 'inset 0 0 0 1px #E4E5E8' }))
        };
      })(),
      expanded: s.open ? 'true' : 'false', btnBg: s.open ? '#FFFFFF' : '#F7F7F8', chev: s.open ? '180deg' : '0deg',
      sc: s.open ? 1 : 0.96, ty: s.open ? '0px' : '-4px', op: s.open ? 1 : 0, pe: s.open ? 'auto' : 'none',
      toggle: () => this.setState({ open: !s.open }),
      items: [
        { label: 'Settings', mask: icon('settings'), fg: '#0E0E10', note: '', act: () => this.go('Settings', '/app') },
        { label: 'Brands', mask: icon('users'), fg: '#0E0E10', note: '', act: () => this.go('Brands', '/app') },
        { label: 'Manage templates', mask: icon('copy'), fg: '#0E0E10', note: '', act: () => this.go('Templates', '/app') },
        { label: 'Copy my profile link', mask: icon(s.copied ? 'check' : 'link'), fg: '#0E0E10', note: s.copied ? 'Copied' : '', act: () => { try { navigator.clipboard && navigator.clipboard.writeText('algostudio.in/@ananya.creates'); } catch (e) {} clearTimeout(this._c); this.setState({ copied: true }); this._c = setTimeout(() => this.setState({ copied: false }), 1800); } },
        { label: 'Sign out', mask: icon('log-out'), fg: '#B42318', note: '', act: () => { location.href = '/'; } }
      ]
    };
  }
}

export default class ProfileMenu extends Component {
  render() {
    const v = { ...this.props, ...(this.renderVals() || {}) };
    return (
      <DCHost id="ProfileMenu" css={CSS} links={LINKS} hostStyle={this.props.__hostStyle}>
        <div ref={v.rootRef} style={{"position":"relative","flex":"none"}}>{"\n  "}<button type="button" onClick={v.toggle} aria-haspopup="menu" aria-expanded={v.expanded} style={sty(`appearance:none;border:0;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:10px;height:46px;padding:0 12px 0 4px;border-radius:999px;background:${S(v.btnBg)};box-shadow:0 0 0 1px rgba(0,0,0,.06);transition:background 140ms ease, transform 140ms ease-out`)} className="p-profilemenu-0 p-profilemenu-1">{"\n    "}<span title={v.ringTitle} style={{"position":"relative","width":"38px","height":"38px","flex":"none","display":"flex","alignItems":"center","justifyContent":"center"}}>{"\n      "}<svg width="38" height="38" viewBox="0 0 38 38" style={{"position":"absolute","inset":"0","transform":"rotate(-90deg)"}}><circle cx="19" cy="19" r="17.5" fill="none" stroke="#E2E7E5" strokeWidth="2"></circle><circle cx="19" cy="19" r="17.5" fill="none" stroke="#0A7F55" strokeWidth="2" strokeLinecap="round" strokeDasharray="110" strokeDashoffset={v.ringOffset} style={{"transition":"stroke-dashoffset 900ms cubic-bezier(.23,1,.32,1)"}}></circle></svg>{"\n      "}<span style={{"width":"30px","height":"30px","borderRadius":"999px","background":"#EEF6F2","display":"flex","alignItems":"center","justifyContent":"center","fontSize":"11px","fontWeight":"700","color":"#076645"}}>{T(v.initials)}</span>{"\n      "}<span aria-hidden="true" style={{"position":"absolute","right":"-1px","bottom":"-1px","minWidth":"14px","height":"14px","padding":"0 3px","borderRadius":"999px","background":"#FFFFFF","boxShadow":"0 0 0 1px rgba(0,0,0,.08)","display":"flex","alignItems":"center","justifyContent":"center","fontSize":"8.5px","fontWeight":"700","color":"#076645"}}>{T(v.badgeCount)}</span>{"\n    "}</span>{"\n    "}<span style={{"display":"flex","flexDirection":"column","alignItems":"flex-start","lineHeight":"1.15"}}><span style={{"fontSize":"13px","fontWeight":"600","color":"#0E0E10","whiteSpace":"nowrap"}}>{T(v.name)}</span><span style={{"fontSize":"10px","fontWeight":"500","color":"#6E6E76"}}>Creator</span></span>{"\n    "}<span style={sty(`width:14px;height:14px;background:#5E5E66;transform:rotate(${S(v.chev)});transition:transform 200ms cubic-bezier(.23,1,.32,1);-webkit-mask:url(https://unpkg.com/lucide-static@0.460.0/icons/chevron-down.svg) center/contain no-repeat;mask:url(https://unpkg.com/lucide-static@0.460.0/icons/chevron-down.svg) center/contain no-repeat`)}></span>{"\n  "}</button>{"\n  "}<div role="menu" aria-label="Profile" style={sty(`position:absolute;right:0;top:calc(100% + 8px);z-index:60;width:272px;border-radius:16px;background:#FFFFFF;box-shadow:0 0 0 1px rgba(0,0,0,.07),0 18px 40px -12px rgba(0,0,0,.28);padding:6px;transform-origin:top right;transform:scale(${S(v.sc)}) translateY(${S(v.ty)});opacity:${S(v.op)};pointer-events:${S(v.pe)};transition:transform 180ms cubic-bezier(.23,1,.32,1), opacity 140ms ease`)}>{"\n    "}<div style={{"display":"flex","alignItems":"center","gap":"10px","padding":"10px 10px 12px","borderBottom":"1px solid #EEEFF1","marginBottom":"4px"}}>{"\n      "}<span style={{"width":"36px","height":"36px","flex":"none","borderRadius":"999px","background":"#EEF6F2","display":"flex","alignItems":"center","justifyContent":"center","fontSize":"11px","fontWeight":"700","color":"#076645"}}>{T(v.initials)}</span>{"\n      "}<span style={{"display":"flex","flexDirection":"column","gap":"1px","minWidth":"0"}}><span style={{"fontSize":"13px","fontWeight":"600","color":"#0E0E10"}}>{T(v.name)}</span><span style={{"fontSize":"12px","fontWeight":"500","color":"#6E6E76"}}>@ananya.creates</span></span>{"\n    "}</div>{"\n    "}<div style={{"display":"flex","flexDirection":"column","gap":"10px","padding":"8px 10px 12px","borderBottom":"1px solid #EEEFF1","marginBottom":"4px"}}>{"\n      "}<div style={{"display":"flex","flexDirection":"column","gap":"6px"}}>{"\n        "}<div style={{"display":"flex","alignItems":"baseline","justifyContent":"space-between","gap":"8px"}}><span style={{"fontSize":"11px","fontWeight":"600","color":"#6E6E76","textTransform":"uppercase","letterSpacing":".04em"}}>Next milestone</span><span style={{"fontSize":"11px","fontWeight":"600","color":"#076645"}}>{T(v.nextLeft)}</span></div>{"\n        "}<span style={{"fontSize":"13px","fontWeight":"600","color":"#0E0E10"}}>{T(v.nextLabel)}</span>{"\n        "}<span style={{"height":"4px","borderRadius":"999px","background":"#EEF0EF","overflow":"hidden"}}><span style={sty(`display:block;height:100%;width:${S(v.barWidth)};border-radius:999px;background:#0A7F55;transition:width 900ms cubic-bezier(.23,1,.32,1)`)}></span></span>{"\n      "}</div>{"\n      "}<div style={{"display":"grid","gridTemplateColumns":"1fr 1fr","gap":"6px"}}>{"\n        "}<div style={{"display":"flex","flexDirection":"column","gap":"2px","padding":"8px 10px","borderRadius":"10px","background":"#F7F7F8"}}><span style={{"fontSize":"15px","fontWeight":"600","color":"#0E0E10"}}>{T(v.dealsClosed)}</span><span style={{"fontSize":"11px","fontWeight":"500","color":"#6E6E76"}}>Deals closed</span></div>{"\n        "}<div style={{"display":"flex","flexDirection":"column","gap":"2px","padding":"8px 10px","borderRadius":"10px","background":"#F7F7F8"}}><span style={{"fontSize":"15px","fontWeight":"600","color":"#0E0E10"}}>{T(v.onTimeText)}</span><span style={{"fontSize":"11px","fontWeight":"500","color":"#6E6E76"}}>Paid on time</span></div>{"\n      "}</div>{"\n      "}<div style={{"display":"flex","flexWrap":"wrap","gap":"4px"}}>{"\n        "}{L(v.badges).map(($it1, $i1) => { const v1 = { ...v, b: $it1, $index: $i1 }; return (<React.Fragment key={$i1}>{"\n          "}<span style={sty(`display:flex;align-items:center;gap:4px;height:22px;padding:0 8px;border-radius:999px;white-space:nowrap;font-size:11px;font-weight:500;background:${S(v1.b?.bg)};color:${S(v1.b?.fg)};box-shadow:${S(v1.b?.ring)}`)}><span style={sty(`width:11px;height:11px;background:currentColor;-webkit-mask:${S(v1.b?.mask)};mask:${S(v1.b?.mask)}`)}></span>{T(v1.b?.label)}</span>{"\n        "}</React.Fragment>); })}{"\n      "}</div>{"\n    "}</div>{"\n    "}{L(v.items).map(($it1, $i1) => { const v1 = { ...v, i: $it1, $index: $i1 }; return (<React.Fragment key={$i1}>{"\n      "}<button type="button" role="menuitem" onClick={v1.i?.act} style={sty(`appearance:none;border:0;cursor:pointer;font-family:inherit;width:100%;display:flex;align-items:center;gap:10px;height:40px;padding:0 10px;border-radius:10px;background:transparent;color:${S(v1.i?.fg)};font-size:13px;font-weight:500;text-align:left;transition:background 120ms ease`)} className="p-profilemenu-2">{"\n        "}<span style={sty(`width:15px;height:15px;background:currentColor;-webkit-mask:${S(v1.i?.mask)};mask:${S(v1.i?.mask)}`)}></span><span style={{"flex":"1"}}>{T(v1.i?.label)}</span><span style={{"fontSize":"11px","fontWeight":"600","color":"#0A7F55"}}>{T(v1.i?.note)}</span>{"\n      "}</button>{"\n    "}</React.Fragment>); })}{"\n  "}</div></div>
      </DCHost>
    );
  }
}
