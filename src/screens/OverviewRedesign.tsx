// @ts-nocheck
// Generated from "AlgoStudio Overview Redesign.dc.html" by scripts/dc-convert.js. Inline styles and logic are kept as in the prototype so it renders the same.
import React from 'react';
import { DCLogic, DCHost, sty, T, S, L, R, hostPos, XImport } from '@/dc/runtime';


const CSS = `
@font-face{font-family:'Satoshi';src:url('/assets/Satoshi-Variable.woff2') format('woff2');font-weight:300 900;font-display:swap}
html,body{margin:0;background:#E4E5E5;font-family:'Satoshi',system-ui,sans-serif;color:#111111}
a{color:#076645}
a:hover{color:#064F37}

`;
const LINKS = [];

class Component extends DCLogic {}

export default class OverviewRedesign extends Component {
  render() {
    const v = { ...this.props, ...(this.renderVals() || {}) };
    return (
      <DCHost id="OverviewRedesign" css={CSS} links={LINKS} hostStyle={this.props.__hostStyle}>
        <section data-screen-label="Overview redesign" style={{"padding":"56px","display":"flex","flexDirection":"column","gap":"28px"}}>{"\n  "}<div style={{"display":"flex","flexDirection":"column","gap":"6px","maxWidth":"760px"}}>{"\n    "}<h1 style={{"margin":"0","fontSize":"28px","fontWeight":"700","letterSpacing":"-0.02em"}}>Overview redesign</h1>{"\n    "}<p style={{"margin":"0","fontSize":"15px","lineHeight":"1.55","color":"#5E5E66"}}>Same component at 375 px and 1440 px. Order from the top: money at risk, insight, needs your action, due this week, funnel and earned, then three stat cards. The period selector drives every card.</p>{"\n  "}</div>{"\n  "}<div style={{"display":"flex","gap":"40px","alignItems":"flex-start"}}>{"\n    "}<div id="mobile" style={{"flex":"none","display":"flex","flexDirection":"column","gap":"10px"}}>{"\n      "}<span style={{"alignSelf":"flex-start","height":"24px","padding":"0 10px","borderRadius":"999px","background":"#111111","color":"#FFFFFF","fontSize":"12px","fontWeight":"700","display":"flex","alignItems":"center"}}>Mobile · 375</span>{"\n      "}<div style={{"width":"375px","height":"3400px","borderRadius":"28px","overflow":"hidden","background":"#F1F2F2","boxShadow":"0 0 0 8px #111111,0 30px 60px -20px rgba(0,0,0,.35)"}}>{"\n        "}<iframe src="AlgoStudio Home v3.dc.html" title="Overview mobile" style={{"width":"375px","height":"3400px","border":"0","display":"block"}}></iframe>{"\n      "}</div>{"\n    "}</div>{"\n    "}<div id="desktop" style={{"flex":"none","display":"flex","flexDirection":"column","gap":"10px"}}>{"\n      "}<span style={{"alignSelf":"flex-start","height":"24px","padding":"0 10px","borderRadius":"999px","background":"#111111","color":"#FFFFFF","fontSize":"12px","fontWeight":"700","display":"flex","alignItems":"center"}}>Desktop · 1440</span>{"\n      "}<div style={{"width":"1440px","height":"1760px","borderRadius":"18px","overflow":"hidden","background":"#F1F2F2","boxShadow":"0 0 0 1px rgba(0,0,0,.08),0 30px 60px -20px rgba(0,0,0,.25)"}}>{"\n        "}<iframe src="AlgoStudio Home v3.dc.html" title="Overview desktop" style={{"width":"1440px","height":"1760px","border":"0","display":"block"}}></iframe>{"\n      "}</div>{"\n    "}</div>{"\n  "}</div></section>
      </DCHost>
    );
  }
}
