// @ts-nocheck
// Generated from "AlgoStudio Desktop App.dc.html" by scripts/dc-convert.js. Inline styles and logic are kept as in the prototype so it renders the same.
import React from 'react';
import { DCLogic, DCHost, sty, T, S, L, R, hostPos, XImport } from '@/dc/runtime';
import HomeDesktopV2 from './HomeDesktopV2';
import DealsV2Screen from './DealsV2Screen';
import PaymentsDesktop from './PaymentsDesktop';
import DeliverablesDesktop from './DeliverablesDesktop';
import TemplatesDesktop from './TemplatesDesktop';
import BrandsDesktop from './BrandsDesktop';
import ReportsDesktop from './ReportsDesktop';
import SettingsDesktop from './SettingsDesktop';
import DealDetailDraftDesktop from './DealDetailDraftDesktop';
import DealDetailSentDesktop from './DealDetailSentDesktop';
import RevisionToApprovalV2 from './RevisionToApprovalV2';
import DealRecordV2 from './DealRecordV2';
import CreateDealModal from './CreateDealModal';

const CSS = `
html,body{margin:0;padding:0;background:#ECEDEE}
a{color:#076645;text-decoration:none}
a:hover{color:#064F37}
@media (prefers-reduced-motion: reduce){[data-as-screen],[data-as-fx]{transition:none !important}}

`;
const LINKS = [];

const EASE = 'cubic-bezier(.23,1,.32,1)';
const INK = 'rgb(17, 17, 17)';

class Component extends DCLogic {
  static PAGES = [['Home', 'AlgoStudio Home Desktop v2'], ['Deals', 'AlgoStudio Deals v2 Screen'], ['Payments', 'AlgoStudio Payments Desktop'], ['Deliverables', 'AlgoStudio Deliverables Desktop'], ['Templates', 'AlgoStudio Templates Desktop'], ['Brands', 'AlgoStudio Brands Desktop'], ['Reports', 'AlgoStudio Reports Desktop'], ['Settings', 'AlgoStudio Settings Desktop']];
  static HIDDEN = ['Templates', 'Brands', 'Settings'];
  constructor(p) {
    super(p);
    const h = decodeURIComponent((location.hash || '').slice(1)).toLowerCase();
    const hit = Component.PAGES.find(([l]) => l.toLowerCase() === h);
    const view = hit ? hit[0] : 'Home';
    this.state = { view, prev: null, entering: false, seen: [view] };
  }
  componentDidMount() {
    this._h = () => { const h = decodeURIComponent(location.hash.slice(1)).toLowerCase(); const m = Component.PAGES.find(([l]) => l.toLowerCase() === h); if (m) this.open(m[0], false); };
    window.addEventListener('hashchange', this._h);
    // Preload screens one at a time when the browser is idle, so clicks never wait on a mount
    const idle = window.requestIdleCallback ? cb => requestIdleCallback(cb, { timeout: 600 }) : cb => setTimeout(cb, 120);
    const next = () => { const l = Component.PAGES.map(([x]) => x).find(x => !this.state.seen.includes(x)); if (!l) return; this.setState(s => ({ seen: [...s.seen, l] }), () => requestAnimationFrame(() => { this.decorateAll(); idle(next); })); };
    setTimeout(() => idle(next), 300);
    // Nav decoration: hover-follow highlight + emerald active marker
    this._over = e => { const a = e.target.closest && e.target.closest('header nav a'); if (a) this.hoverTo(a); };
    this._out = e => { const n = e.target.closest && e.target.closest('header nav'); if (n && !n.contains(e.relatedTarget)) this.hoverOff(n); };
    document.addEventListener('mouseover', this._over);
    document.addEventListener('mouseout', this._out);
    this._rs = () => this.placeMarker(this.activeNav(), false);
    window.addEventListener('resize', this._rs);
    this._deco = setInterval(() => this.decorateAll(), 400);
    this._clk = e => { const a = e.target.closest && e.target.closest('a[href$="#create"]'); if (a && a.closest('[data-as-screen]')) { e.preventDefault(); e.stopPropagation(); this.openCreate(); } };
    document.addEventListener('click', this._clk, true);
    this._esc = e => { if (e.key === 'Escape' && this.state.cOpen) this.closeCreate(); };
    document.addEventListener('keydown', this._esc);
  }
  fab() {
    if (this._fab) return this._fab;
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('data-as-fx', ''); b.setAttribute('aria-label', 'Close create deal');
    Object.assign(b.style, { position: 'fixed', zIndex: '70', appearance: 'none', border: '0', cursor: 'pointer', width: '34px', height: '34px', borderRadius: '10px', background: '#0A7F55', display: 'none', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 4px rgba(255,255,255,.9), 0 10px 24px -8px rgba(0,0,0,.5)', transition: `background 220ms ease, transform 160ms ${EASE}` });
    const i = document.createElement('span');
    const mask = 'url(https://unpkg.com/lucide-static@0.460.0/icons/plus.svg) center/contain no-repeat';
    Object.assign(i.style, { width: '17px', height: '17px', background: '#FFFFFF', WebkitMask: mask, mask, transition: `transform 380ms ${EASE}` });
    b.appendChild(i);
    b.addEventListener('mousedown', () => { b.style.transform = 'scale(.92)'; });
    b.addEventListener('mouseup', () => { b.style.transform = 'none'; });
    b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); this.closeCreate(); });
    document.body.appendChild(b);
    this._fab = { b, i };
    return this._fab;
  }
  // Fab morph: "+" (green, 34px square) <-> "×" (light circle, 36px), flown between the nav and the modal's close button
  fabAt(r, asX, animate) {
    const { b, i } = this.fab(), T = `520ms ${EASE}`;
    b.style.transition = animate ? `left ${T}, top ${T}, width ${T}, height ${T}, border-radius ${T}, background 400ms ease, box-shadow 400ms ease` : 'none';
    i.style.transition = animate ? `transform ${T}, background 400ms ease` : 'none';
    Object.assign(b.style, { display: 'flex', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: asX ? '999px' : '10px', background: asX ? '#F4F5F6' : '#0A7F55', boxShadow: asX ? '0 0 0 1px rgba(0,0,0,.04)' : '0 10px 24px -8px rgba(10,127,85,.6)' });
    Object.assign(i.style, { transform: asX ? 'rotate(135deg)' : 'rotate(0deg)', background: asX ? '#3A3A40' : '#FFFFFF' });
    if (!animate) b.getBoundingClientRect();
  }
  openCreate() {
    const nav = this.activeNav(), src = nav && nav.querySelector('[data-as-plus]');
    clearTimeout(this._fabT);
    if (src) { this.fabAt(src.getBoundingClientRect(), false, false); src.style.visibility = 'hidden'; this._src = src; }
    this.setState({ cm: true }, () => requestAnimationFrame(() => requestAnimationFrame(() => this.setState({ cOpen: true }, () => requestAnimationFrame(() => {
      const x = document.querySelector('[data-cd-close]');
      if (!src || !x) return;
      x.style.visibility = 'hidden';
      this.fabAt(x.getBoundingClientRect(), true, true);
      this._fabT = setTimeout(() => { this._fab.b.style.display = 'none'; x.style.visibility = ''; }, 540);
    })))));
  }
  openDraft(deal) {
    clearTimeout(this._dT);
    this.setState({ deal, dOpen: true, dIn: false, dView: 'draft' }, () => requestAnimationFrame(() => requestAnimationFrame(() => this.setState({ dIn: true }))));
  }
  swapDeal(deal, view) {
    clearTimeout(this._dT);
    this.setState({ dIn: false });
    this._dT = setTimeout(() => {
      this.setState({ deal, dView: view }, () => { const el = document.querySelector('[data-screen-label="Deal Detail · Draft"]'); if (el) el.scrollTop = 0; requestAnimationFrame(() => requestAnimationFrame(() => this.setState({ dIn: true }))); });
    }, 220);
  }
  openRecord() {
    clearTimeout(this._rT);
    this.setState({ rOpen: true, rIn: false }, () => requestAnimationFrame(() => requestAnimationFrame(() => this.setState({ rIn: true }))));
  }
  openDeliver() {
    clearTimeout(this._vT);
    this.setState({ vOpen: true, vIn: false }, () => requestAnimationFrame(() => requestAnimationFrame(() => this.setState({ vIn: true }))));
  }
  closeDeliver() {
    this.setState({ vIn: false });
    clearTimeout(this._vT); this._vT = setTimeout(() => this.setState({ vOpen: false }), 260);
  }
  closeRecord() {
    this.setState({ rIn: false });
    clearTimeout(this._rT); this._rT = setTimeout(() => this.setState({ rOpen: false }), 260);
  }
  closeDraft() {
    this.open('Deals');
    this.setState({ dIn: false });
    clearTimeout(this._dT); this._dT = setTimeout(() => this.setState({ dOpen: false }), 260);
  }
  closeCreate() {
    const x = document.querySelector('[data-cd-close]'), src = this._src;
    clearTimeout(this._fabT);
    if (x && src) {
      this.fabAt(x.getBoundingClientRect(), true, false);
      x.style.visibility = 'hidden';
      requestAnimationFrame(() => this.fabAt(src.getBoundingClientRect(), false, true));
      this._fabT = setTimeout(() => { this._fab.b.style.display = 'none'; src.style.visibility = ''; x.style.visibility = ''; this._src = null; }, 540);
    } else {
      if (this._fab) {
        const b = this._fab.b;
        if (src && b.style.display !== 'none') {
          this.fabAt(src.getBoundingClientRect(), false, true);
          this._fabT = setTimeout(() => { b.style.display = 'none'; src.style.visibility = ''; this._src = null; }, 540);
        } else { b.style.display = 'none'; if (src) { src.style.visibility = ''; this._src = null; } }
      } else if (src) { src.style.visibility = ''; this._src = null; }
    }
    this.setState({ cOpen: false });
  }
  addPlus(nav) {
    if (nav.querySelector('[data-as-plus]')) return;
    const sep = document.createElement('span');
    sep.setAttribute('data-as-fx', ''); sep.setAttribute('aria-hidden', 'true');
    Object.assign(sep.style, { width: '1px', height: '20px', background: 'rgba(0,0,0,.08)', margin: '0 4px', flex: 'none', alignSelf: 'center', position: 'relative', zIndex: '1' });
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('data-as-plus', ''); b.setAttribute('aria-label', 'Create deal'); b.title = 'Create deal';
    Object.assign(b.style, { appearance: 'none', border: '0', cursor: 'pointer', position: 'relative', zIndex: '1', flex: 'none', width: '34px', height: '34px', borderRadius: '10px', background: '#0A7F55', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.22), 0 6px 14px -6px rgba(10,127,85,.7)', transition: `background 140ms ease, transform 160ms ${EASE}` });
    const i = document.createElement('span');
    const mask = 'url(https://unpkg.com/lucide-static@0.460.0/icons/plus.svg) center/contain no-repeat';
    Object.assign(i.style, { width: '17px', height: '17px', background: '#FFFFFF', WebkitMask: mask, mask, transition: `transform 320ms ${EASE}` });
    b.appendChild(i);
    b.addEventListener('mouseenter', () => { b.style.background = '#076645'; i.style.transform = 'rotate(90deg)'; });
    b.addEventListener('mouseleave', () => { b.style.background = '#0A7F55'; i.style.transform = 'none'; b.style.transform = 'none'; });
    b.addEventListener('mousedown', () => { b.style.transform = 'scale(.92)'; });
    b.addEventListener('mouseup', () => { b.style.transform = 'none'; });
    b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); this.openCreate(); });
    nav.appendChild(sep); nav.appendChild(b);
  }
  componentWillUnmount() {
    window.removeEventListener('hashchange', this._h);
    document.removeEventListener('mouseover', this._over);
    document.removeEventListener('mouseout', this._out);
    window.removeEventListener('resize', this._rs);
    clearInterval(this._deco);
    document.removeEventListener('click', this._clk, true);
    document.removeEventListener('keydown', this._esc);
    clearTimeout(this._fabT); if (this._fab) this._fab.b.remove();
  }

  screenEl(label) { return document.querySelector(`[data-as-screen="${label}"]`); }
  navOf(label) { const s = this.screenEl(label); return s ? s.querySelector('header nav') : null; }
  activeNav() { return this.navOf(this.state.view); }
  activeLink(nav) { if (!nav) return null; return [...nav.querySelectorAll('a')].find(a => a.getAttribute('aria-current') === 'page' || getComputedStyle(a).backgroundColor === INK) || null; }

  decorate(nav) {
    if (!nav || nav._as) return nav && nav._as;
    Object.assign(nav.style, { position: 'relative', isolation: 'isolate', padding: '4px', borderRadius: '14px', background: 'linear-gradient(180deg,rgba(255,255,255,.78),rgba(255,255,255,.5))', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06), inset 0 1px 0 #FFFFFF, 0 1px 2px rgba(17,17,17,.04), 0 8px 24px -12px rgba(10,127,85,.25)' });
    nav.querySelectorAll('a').forEach(a => { a.style.position = 'relative'; a.style.zIndex = '1'; if (Component.HIDDEN.includes(a.textContent.trim())) a.style.display = 'none'; });
    const mk = css => { const d = document.createElement('span'); d.setAttribute('data-as-fx', ''); d.setAttribute('aria-hidden', 'true'); Object.assign(d.style, { position: 'absolute', pointerEvents: 'none', zIndex: '0' }, css); nav.appendChild(d); return d; };
    const hover = mk({ top: '4px', height: '34px', left: '0', width: '0', borderRadius: '10px', background: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,.05), 0 2px 6px rgba(17,17,17,.06)', opacity: '0', transition: `left 280ms ${EASE}, width 280ms ${EASE}, top 280ms ${EASE}, height 280ms ${EASE}, opacity 160ms ease` });
    const marker = mk({ bottom: '-1px', height: '3px', width: '18px', left: '0', borderRadius: '999px', background: '#0A7F55', boxShadow: '0 0 10px rgba(18,149,100,.7)', zIndex: '2', opacity: '0', transition: `left 280ms ${EASE}, width 280ms ${EASE}, opacity 200ms ease` });
    nav._as = { hover, marker };
    this.addPlus(nav);
    this.placeMarker(nav, false);
    return nav._as;
  }
  decorateAll() { document.querySelectorAll('[data-as-screen] header nav').forEach(n => { if (!n._as) this.decorate(n); else if (!n._as.placed) this.placeMarker(n, false); }); }
  rel(nav, r) { const n = nav.getBoundingClientRect(); return { left: r.left - n.left, top: r.top - n.top, width: r.width, height: r.height }; }
  hoverTo(a) {
    const nav = a.closest('nav'); const fx = this.decorate(nav); if (!fx) return;
    const r = this.rel(nav, a.getBoundingClientRect());
    const fresh = fx.hover.style.opacity === '0';
    if (fresh) { fx.hover.style.transition = 'opacity 160ms ease'; }
    Object.assign(fx.hover.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', opacity: '1' });
    if (fresh) requestAnimationFrame(() => { fx.hover.style.transition = `left 280ms ${EASE}, width 280ms ${EASE}, top 280ms ${EASE}, height 280ms ${EASE}, opacity 160ms ease`; });
  }
  hoverOff(nav) { if (nav._as) nav._as.hover.style.opacity = '0'; }
  placeMarker(nav, animate, fromRect) {
    const fx = this.decorate(nav); if (!fx) return;
    const a = this.activeLink(nav); if (!a) return;
    const r = this.rel(nav, a.getBoundingClientRect());
    const m = fx.marker;
    if (fromRect) {
      const f = this.rel(nav, fromRect);
      m.style.transition = 'none';
      Object.assign(m.style, { left: f.left + f.width / 2 - 9 + 'px', opacity: '1' });
      m.getBoundingClientRect();
      m.style.transition = `left 280ms ${EASE}, width 280ms ${EASE}, opacity 200ms ease`;
    } else if (!animate) m.style.transition = 'opacity 200ms ease';
    Object.assign(m.style, { left: r.left + r.width / 2 - 9 + 'px', opacity: '1' });
    fx.placed = true;
  }
  fly(nav, fromRect) {
    const a = this.activeLink(nav); if (!a || !fromRect) return;
    this.decorate(nav);
    const to = this.rel(nav, a.getBoundingClientRect()), from = this.rel(nav, fromRect);
    if (Math.abs(to.left - from.left) < 2) return;
    const pill = document.createElement('span');
    pill.setAttribute('data-as-fx', ''); pill.setAttribute('aria-hidden', 'true');
    Object.assign(pill.style, { position: 'absolute', zIndex: '0', pointerEvents: 'none', borderRadius: '10px', background: '#111111', boxShadow: '0 6px 16px -6px rgba(17,17,17,.5)', left: from.left + 'px', top: to.top + 'px', width: from.width + 'px', height: to.height + 'px' });
    nav.appendChild(pill);
    const bg = a.style.background, fg = a.style.color, tr = a.style.transition;
    Object.assign(a.style, { transition: 'none', background: 'transparent', color: '#1A1A1C' });
    pill.getBoundingClientRect();
    pill.style.transition = `left 260ms ${EASE}, width 260ms ${EASE}`;
    Object.assign(pill.style, { left: to.left + 'px', width: to.width + 'px' });
    a.getBoundingClientRect();
    a.style.transition = 'color 160ms ease 100ms';
    a.style.color = fg || '#FFFFFF';
    setTimeout(() => { a.style.transition = 'none'; a.style.background = bg; a.getBoundingClientRect(); a.style.transition = tr; pill.remove(); }, 280);
  }

  open(label, push = true) {
    if (!Component.PAGES.some(([l]) => l === label) || label === this.state.view) return;
    const oldA = this.activeLink(this.activeNav());
    const navTop = oldA ? oldA.getBoundingClientRect() : null;
    this._want = label;
    const show = () => {
      if (this._want !== label) return;
      this.decorateAll();
      const el = this.screenEl(label); if (el) el.scrollTop = 0;
      this.setState(s => ({ prev: s.view, view: label }), () => requestAnimationFrame(() => {
        const nav = this.activeNav();
        this.fly(nav, navTop);
        this.placeMarker(nav, true, navTop);
      }));
    };
    // Mount hidden first if never visited, then reveal once laid out and decorated
    if (this.state.seen.includes(label)) show();
    else this.setState(s => ({ seen: [...s.seen, label] }), () => requestAnimationFrame(() => requestAnimationFrame(show)));
    if (push && location.hash.slice(1).toLowerCase() !== label.toLowerCase()) history.replaceState(null, '', '#' + label.toLowerCase());
  }

  dir() {
    const i = l => Component.PAGES.findIndex(([x]) => x === l);
    const { view, prev } = this.state;
    return prev && i(view) < i(prev) ? -1 : 1;
  }
  styleFor(l) {
    // Every screen is its own fixed-size scroll layer: no layout swap, no scrollbar jump, scroll kept per screen
    const b = 'position:absolute;inset:0;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;contain:layout paint;' + (l === 'Deals' ? '' : 'scrollbar-gutter:stable;');
    if (l === this.state.view) return b + 'z-index:2;opacity:1;visibility:visible;transition:opacity 180ms ease';
    return b + 'z-index:0;opacity:0;visibility:hidden;pointer-events:none;transition:opacity 120ms ease, visibility 0s linear 120ms';
  }
  styleForOld(l) {
    const { view, prev, entering } = this.state;
    const base = 'top:0;left:0;right:0;';
    if (l === view) {
      return entering
        ? base + 'position:relative;z-index:2;opacity:0;transform:translateX(' + this.dir() * 28 + 'px) scale(.985);transform-origin:50% 0;transition:none;visibility:visible'
        : base + `position:relative;z-index:2;opacity:1;transform:none;transform-origin:50% 0;visibility:visible;transition:opacity 320ms ease, transform 520ms ${EASE}`;
    }
    if (l === prev) return base + `position:absolute;z-index:1;height:100vh;overflow:hidden;opacity:0;transform:translateX(${this.dir() * -28}px) scale(.985);transform-origin:50% 0;visibility:visible;pointer-events:none;transition:opacity 280ms ease, transform 460ms ${EASE}`;
    return base + 'position:absolute;z-index:0;height:100vh;overflow:hidden;opacity:0;visibility:hidden;pointer-events:none';
  }

  renderVals() {
    const s = this.state;
    const css = str => Object.fromEntries(str.split(';').filter(Boolean).map(d => { const i = d.indexOf(':'); return [d.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()), d.slice(i + 1).trim()]; }));
    return {
      go: label => this.open(label),
      cm: !!s.cm, cOpen: !!s.cOpen, closeCreate: () => this.closeCreate(),
      dOpen: !!s.dOpen, deal: s.deal || null, openDraft: d => this.openDraft(d), closeDraft: () => this.closeDraft(),
      dDraft: s.dView !== 'sent', dSent: s.dView === 'sent',
      toSent: d => this.swapDeal(d, 'sent'), toDraft: d => this.swapDeal({ ...(s.deal || {}), ...d }, 'draft'),
      vOpen: !!s.vOpen, openDeliver: () => this.openDeliver(), closeDeliver: () => this.closeDeliver(),
      toDeliverables: () => { this.closeDeliver(); this.setState({ dIn: false }); setTimeout(() => this.setState({ dOpen: false }), 260); this.open('Deliverables'); },
      vSt: { position: 'absolute', inset: 0, zIndex: 35, overflowY: 'auto', background: '#ECEDEE', opacity: s.vIn ? 1 : 0, transform: s.vIn ? 'none' : 'translateY(18px)', transition: `opacity 240ms ease, transform 420ms ${EASE}` },
      rOpen: !!s.rOpen, openRecord: () => this.openRecord(), closeRecord: () => this.closeRecord(),
      rSt: { position: 'absolute', inset: 0, zIndex: 40, overflowY: 'auto', background: '#ECEDEE', opacity: s.rIn ? 1 : 0, transform: s.rIn ? 'none' : 'translateY(18px)', transition: `opacity 240ms ease, transform 420ms ${EASE}` },
      dSt: { position: 'absolute', inset: 0, zIndex: 30, overflowY: 'auto', background: '#ECEDEE', opacity: s.dIn ? 1 : 0, transform: s.dIn ? 'none' : 'translateY(18px)', transition: `opacity 240ms ease, transform 420ms ${EASE}` },
      ovSt: { position: 'absolute', inset: 0, zIndex: 50, overflowY: 'auto', opacity: s.cOpen ? 1 : 0, visibility: s.cOpen ? 'visible' : 'hidden', pointerEvents: s.cOpen ? 'auto' : 'none', transition: s.cOpen ? 'opacity 200ms ease' : 'opacity 180ms ease, visibility 0s linear 180ms' },
      st: Object.fromEntries(Component.PAGES.map(([l]) => [l.toLowerCase(), css(this.styleFor(l))])),
      m: Object.fromEntries(Component.PAGES.map(([l]) => [l.toLowerCase(), s.seen.includes(l)]))
    };
  }
}

export default class DesktopApp extends Component {
  render() {
    const v = { ...this.props, ...(this.renderVals() || {}) };
    return (
      <DCHost id="DesktopApp" css={CSS} links={LINKS} hostStyle={this.props.__hostStyle}>
        <div data-screen-label="AlgoStudio Desktop App" style={{"position":"relative","height":"100vh","overflow":"hidden","background":"#ECEDEE"}}>{"\n  "}<div data-as-screen="Home" data-screen-label="Home" style={sty(v.st?.home)}>{"\n    "}{(v.m?.home) ? (<>{"\n      "}<HomeDesktopV2 onNav={v.go} />{"\n    "}</>) : null}{"\n  "}</div>{"\n  "}<div data-as-screen="Deals" data-screen-label="Deals" style={sty(v.st?.deals)}>{"\n    "}{(v.m?.deals) ? (<>{"\n      "}<DealsV2Screen device="desktop" sectionTabs={true} onNav={v.go} />{"\n    "}</>) : null}{"\n  "}</div>{"\n  "}<div data-as-screen="Payments" data-screen-label="Payments" style={sty(v.st?.payments)}>{"\n    "}{(v.m?.payments) ? (<>{"\n      "}<PaymentsDesktop onNav={v.go} />{"\n    "}</>) : null}{"\n  "}</div>{"\n  "}<div data-as-screen="Deliverables" data-screen-label="Deliverables" style={sty(v.st?.deliverables)}>{"\n    "}{(v.m?.deliverables) ? (<>{"\n      "}<DeliverablesDesktop onNav={v.go} />{"\n    "}</>) : null}{"\n  "}</div>{"\n  "}<div data-as-screen="Templates" data-screen-label="Templates" style={sty(v.st?.templates)}>{"\n    "}{(v.m?.templates) ? (<>{"\n      "}<TemplatesDesktop onNav={v.go} />{"\n    "}</>) : null}{"\n  "}</div>{"\n  "}<div data-as-screen="Brands" data-screen-label="Brands" style={sty(v.st?.brands)}>{"\n    "}{(v.m?.brands) ? (<>{"\n      "}<BrandsDesktop sectionTabs={true} activeNav="Deals" onNav={v.go} />{"\n    "}</>) : null}{"\n  "}</div>{"\n  "}<div data-as-screen="Reports" data-screen-label="Reports" style={sty(v.st?.reports)}>{"\n    "}{(v.m?.reports) ? (<>{"\n      "}<ReportsDesktop onNav={v.go} />{"\n    "}</>) : null}{"\n  "}</div>{"\n  "}<div data-as-screen="Settings" data-screen-label="Settings" style={sty(v.st?.settings)}>{"\n    "}{(v.m?.settings) ? (<>{"\n      "}<SettingsDesktop onNav={v.go} />{"\n    "}</>) : null}{"\n  "}</div>{"\n  "}{(v.dOpen) ? (<>{"\n    "}<div data-screen-label="Deal Detail · Draft" style={sty(v.dSt)}>{"\n      "}{(v.dDraft) ? (<>{"\n        "}<DealDetailDraftDesktop embedded={true} deal={v.deal} onBack={v.closeDraft} onSent={v.toSent} />{"\n      "}</>) : null}{"\n      "}{(v.dSent) ? (<>{"\n        "}<DealDetailSentDesktop embedded={true} status="Sent" deal={v.deal} onBack={v.closeDraft} onEdit={v.toDraft} onRecord={v.openRecord} onDeliver={v.openDeliver} />{"\n      "}</>) : null}{"\n    "}</div>{"\n  "}</>) : null}{"\n  "}{(v.vOpen) ? (<>{"\n    "}<div data-screen-label="Revision to Approval" style={sty(v.vSt)}>{"\n      "}<RevisionToApprovalV2 embedded={true} stage="Submit" onBack={v.closeDeliver} onRecord={v.openRecord} onDeliverables={v.toDeliverables} />{"\n    "}</div>{"\n  "}</>) : null}{"\n  "}{(v.rOpen) ? (<>{"\n    "}<div data-screen-label="Deal Record" style={sty(v.rSt)}>{"\n      "}<DealRecordV2 embedded={true} variant="active" onBack={v.closeRecord} />{"\n    "}</div>{"\n  "}</>) : null}{"\n  "}{(v.cm) ? (<>{"\n    "}<div data-screen-label="Create Deal" style={sty(v.ovSt)}>{"\n      "}<CreateDealModal embedded={true} shown={v.cOpen} templates={true} onClose={v.closeCreate} onCreated={v.openDraft} />{"\n    "}</div>{"\n  "}</>) : null}</div>
      </DCHost>
    );
  }
}
