// @ts-nocheck
// Generated from "AlgoStudio Deals Redesign.dc.html" by scripts/dc-convert.js. Inline styles and logic are kept as in the prototype so it renders the same.
import React from 'react';
import { DCLogic, DCHost, sty, T, S, L, R, hostPos, XImport } from '@/dc/runtime';
import DealsV2Screen from './DealsV2Screen';

const CSS = `
@font-face{font-family:'Satoshi';src:url('/assets/Satoshi-Variable.woff2') format('woff2');font-weight:300 900;font-style:normal;font-display:swap}
html,body{margin:0;padding:0;background:#E4E5E5}
body{font-family:'Satoshi',ui-sans-serif,system-ui,sans-serif;color:#111111;-webkit-font-smoothing:antialiased}
a{color:#076645;text-decoration:none}
a:hover{color:#064F37}
*{box-sizing:border-box}

`;
const LINKS = [];

class Component extends DCLogic {}

export default class DealsRedesign extends Component {
  render() {
    const v = { ...this.props, ...(this.renderVals() || {}) };
    return (
      <DCHost id="DealsRedesign" css={CSS} links={LINKS} hostStyle={this.props.__hostStyle}>
        <section data-screen-label="Turn 1 · Deals redesign" style={{"padding":"64px","display":"flex","flexDirection":"column","gap":"32px"}}>{"\n  "}<div style={{"display":"flex","flexDirection":"column","gap":"6px","maxWidth":"760px"}}>{"\n    "}<h1 style={{"margin":"0","fontSize":"28px","fontWeight":"700","letterSpacing":"-0.02em"}}>Deals redesign</h1>{"\n    "}<p style={{"margin":"0","fontSize":"15px","fontWeight":"500","lineHeight":"1.5","color":"#4A4A52"}}>Answers two questions first: who owes me money, and what do I do today. All four boards are clickable. Tap a deal row for its timeline, or the green button to act. Today is 7 Oct 2026.</p>{"\n  "}</div>{"\n  "}<div style={{"display":"flex","flexWrap":"wrap","gap":"56px","alignItems":"flex-start"}}>{"\n    "}<div id="1a" style={{"display":"flex","flexDirection":"column","gap":"12px"}}>{"\n      "}<div style={{"display":"flex","alignItems":"center","gap":"10px"}}><span style={{"height":"24px","padding":"0 9px","borderRadius":"999px","background":"#111111","color":"#FFFFFF","fontSize":"12px","fontWeight":"700","display":"flex","alignItems":"center"}}>1a</span><span style={{"fontSize":"15px","fontWeight":"600"}}>Mobile · default</span></div>{"\n      "}<div style={{"width":"375px","borderRadius":"32px","overflow":"hidden","boxShadow":"0 0 0 1px rgba(0,0,0,.08),0 30px 60px -30px rgba(0,0,0,.35)"}}>{"\n        "}<DealsV2Screen device="mobile" height={1720} />{"\n      "}</div>{"\n    "}</div>{"\n    "}<div id="1c" style={{"display":"flex","flexDirection":"column","gap":"12px"}}>{"\n      "}<div style={{"display":"flex","alignItems":"center","gap":"10px"}}><span style={{"height":"24px","padding":"0 9px","borderRadius":"999px","background":"#111111","color":"#FFFFFF","fontSize":"12px","fontWeight":"700","display":"flex","alignItems":"center"}}>1c</span><span style={{"fontSize":"15px","fontWeight":"600"}}>Mobile · full timeline sheet</span></div>{"\n      "}<div style={{"width":"375px","borderRadius":"32px","overflow":"hidden","boxShadow":"0 0 0 1px rgba(0,0,0,.08),0 30px 60px -30px rgba(0,0,0,.35)"}}>{"\n        "}<DealsV2Screen device="mobile" openTimeline={true} height={812} />{"\n      "}</div>{"\n    "}</div>{"\n    "}<div id="1d" style={{"display":"flex","flexDirection":"column","gap":"12px"}}>{"\n      "}<div style={{"display":"flex","alignItems":"center","gap":"10px"}}><span style={{"height":"24px","padding":"0 9px","borderRadius":"999px","background":"#111111","color":"#FFFFFF","fontSize":"12px","fontWeight":"700","display":"flex","alignItems":"center"}}>1d</span><span style={{"fontSize":"15px","fontWeight":"600"}}>Mobile · no deals yet</span></div>{"\n      "}<div style={{"width":"375px","borderRadius":"32px","overflow":"hidden","boxShadow":"0 0 0 1px rgba(0,0,0,.08),0 30px 60px -30px rgba(0,0,0,.35)"}}>{"\n        "}<DealsV2Screen device="mobile" empty={true} height={812} />{"\n      "}</div>{"\n    "}</div>{"\n  "}</div>{"\n  "}<div id="1b" style={{"display":"flex","flexDirection":"column","gap":"12px"}}>{"\n    "}<div style={{"display":"flex","alignItems":"center","gap":"10px"}}><span style={{"height":"24px","padding":"0 9px","borderRadius":"999px","background":"#111111","color":"#FFFFFF","fontSize":"12px","fontWeight":"700","display":"flex","alignItems":"center"}}>1b</span><span style={{"fontSize":"15px","fontWeight":"600"}}>Desktop · 1280 · timeline opens as a side panel</span></div>{"\n    "}<div style={{"width":"1280px","borderRadius":"20px","overflow":"hidden","boxShadow":"0 0 0 1px rgba(0,0,0,.08),0 30px 60px -30px rgba(0,0,0,.35)"}}>{"\n      "}<DealsV2Screen device="desktop" height={1240} />{"\n    "}</div>{"\n  "}</div></section>
      </DCHost>
    );
  }
}
