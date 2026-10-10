// Converts the AlgoStudio Design Component files (*.dc.html) into React screens in src/screens.
// Runs in a browser context (needs DOMParser). Inputs: `files` [{file, src}]. Returns [{name, code}].
// Semantics mirror the prototype runtime: {{ path }} holes, sc-for / sc-if, dc-import, x-import,
// style-hover/active/focus pseudo states (static CSS classes), helmet <style>/<link>.
function dcConvert(files) {
  const comp = n => { let s = n.replace(/^AlgoStudio /, '').replace(/[^A-Za-z0-9]+(.)?/g, (_, c) => c ? c.toUpperCase() : ''); return /^\d/.test(s) ? 'S' + s : s; };
  const ROUTES = { 'AlgoStudio Website.dc.html': '/', 'AlgoStudio Desktop App.dc.html': '/app', 'AlgoStudio Login.dc.html': '/', 'AlgoStudio Mobile Web App.dc.html': '/m', 'AlgoStudio Mobile App.dc.html': '/m', 'AlgoStudio Create Deal.dc.html': '/app#create' };
  const routeOf = p => { const [file, rest = ''] = p.split(/(?=[?#])/); return (ROUTES[file] || '/app') + rest; };
  const EVENT_MAP = { onclick: "onClick", onchange: "onChange", oninput: "onInput", onsubmit: "onSubmit", onkeydown: "onKeyDown", onkeyup: "onKeyUp", onkeypress: "onKeyPress", onmousedown: "onMouseDown", onmouseup: "onMouseUp", onmouseenter: "onMouseEnter", onmouseleave: "onMouseLeave", onfocus: "onFocus", onblur: "onBlur", ondoubleclick: "onDoubleClick", oncontextmenu: "onContextMenu", onmousemove: "onMouseMove", onmouseover: "onMouseOver", onmouseout: "onMouseOut", onpointerdown: "onPointerDown", onpointerup: "onPointerUp", onpointermove: "onPointerMove", onpointerenter: "onPointerEnter", onpointerleave: "onPointerLeave", onpointercancel: "onPointerCancel", ontouchstart: "onTouchStart", ontouchend: "onTouchEnd", ontouchmove: "onTouchMove", ondragstart: "onDragStart", ondragend: "onDragEnd", ondragover: "onDragOver", ondrop: "onDrop", onanimationend: "onAnimationEnd", ontransitionend: "onTransitionEnd", onscroll: "onScroll", onwheel: "onWheel" };
  const ATTR_FIX = { tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength', minlength: 'minLength', autocomplete: 'autoComplete', autofocus: 'autoFocus', inputmode: 'inputMode', enterkeyhint: 'enterKeyHint', spellcheck: 'spellCheck', crossorigin: 'crossOrigin', colspan: 'colSpan', rowspan: 'rowSpan', srcset: 'srcSet', contenteditable: 'contentEditable', 'xlink:href': 'xlinkHref', viewbox: 'viewBox', novalidate: 'noValidate', datetime: 'dateTime', frameborder: 'frameBorder', allowfullscreen: 'allowFullScreen' };
  const VOID = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
  const RAW_WRAP = { select: "sc-raw-select", table: "sc-raw-table", tbody: "sc-raw-tbody", thead: "sc-raw-thead", tfoot: "sc-raw-tfoot", tr: "sc-raw-tr", td: "sc-raw-td", th: "sc-raw-th", caption: "sc-raw-caption" };
  const RAW_UNWRAP = Object.fromEntries(Object.entries(RAW_WRAP).map(([k, v]) => [v, k]));
  const ATTRS = `(?:[^>"']|"[^"]*"|'[^']*')*`;
  function encodeCase(html) {
    html = html.replace(new RegExp("<(x-import|dc-import)(" + ATTRS + ")/>", "gi"), (_, t, a) => "<" + t + a + "></" + t + ">");
    html = html.replace(/<helmet(\s|>)/gi, "<sc-helmet$1").replace(/<\/helmet\s*>/gi, "</sc-helmet>");
    html = html.replace(/(\s)([a-z]+[A-Z][A-Za-z0-9]*)(\s*=)/g, (_, sp, name, eq) => sp + "sc-camel-" + name.replace(/[A-Z]/g, c => "-" + c.toLowerCase()) + eq);
    for (const [real, alias] of Object.entries(RAW_WRAP)) html = html.replace(new RegExp("(</?)" + real + "(?=[\\s>])", "gi"), "$1" + alias);
    return html;
  }
  const k2c = s => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  function scanUnquotedUrl(css, i) { if (css[i] !== "u" && css[i] !== "U" || css.slice(i, i + 4).toLowerCase() !== "url(" || /[a-z0-9_-]/i.test(css[i - 1] ?? "")) return -1; let j = i + 4; while (j < css.length && /\s/.test(css[j])) j++; if (css[j] === '"' || css[j] === "'") return -1; while (j < css.length && css[j] !== ")") { if (css[j] === "\\") j++; j++; } return j < css.length ? j + 1 : css.length; }
  function importantify(css) { const decls = []; let start = 0, depth = 0, quote = ""; for (let i = 0; i < css.length; i++) { const c = css[i]; if (quote) { if (c === "\\") i++; else if (c === quote) quote = ""; } else if (c === "'" || c === '"') quote = c; else if (c === "(") depth++; else if (c === ")") depth = Math.max(0, depth - 1); else if (c === ";" && depth === 0) { decls.push(css.slice(start, i)); start = i + 1; } else { const end = scanUnquotedUrl(css, i); if (end !== -1) i = end - 1; } } decls.push(css.slice(start)); return decls.map(d => d.trim()).filter(Boolean).map(d => /!\s*important$/i.test(d) ? d : d + " !important").join(";"); }
  const assetFix = s => s.replace(/(^|[\s'"(,])assets\//g, '$1/assets/');
  const navFix = s => s.replace(/(['"])([^'"\n]*?\.dc\.html(?:[?#][^'"\n]*)?)\1/g, (m, q, p) => /^AlgoStudio |^Create Deal/.test(p) ? q + routeOf(p) + q : m)
    .replace(/a\[href\*="Create Deal"\]/g, 'a[href$="#create"]');
  const lit = s => JSON.stringify(s);
  const tl = s => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

  function convert(file, src) {
    const name = comp(file.replace('.dc.html', ''));
    const tpl = src.slice(src.indexOf('<x-dc>') + 6, src.lastIndexOf('</x-dc>'));
    const si = src.indexOf('data-dc-script');
    let js = si < 0 ? '' : src.slice(src.indexOf('>', si) + 1, src.lastIndexOf('</script>')).trim();
    if (!/class Component\s+extends\s+DCLogic/.test(js)) js = 'class Component extends DCLogic {}';
    const doc = new DOMParser().parseFromString('<!doctype html><html><body>' + encodeCase(tpl) + '</body></html>', 'text/html');
    let css = '', links = [], pn = 0; const pseudo = new Map(); const imports = new Set();
    const pcls = (ps, val) => { const k = ps + '|' + val; if (pseudo.has(k)) return pseudo.get(k); const c = 'p-' + name.toLowerCase() + '-' + (pn++).toString(36); pseudo.set(k, c); css += '.' + c + ':' + ps + '{' + assetFix(importantify(val)) + '}\n'; return c; };
    const ex = (raw, sc) => { const e = raw.trim(); if (/^(true|false|null|undefined|-?\d+(\.\d+)?)$/.test(e)) return e; if (/^(["']).*\1$/.test(e)) return lit(e.slice(1, -1));
      if (/^[A-Za-z_$][\w$]*(\.[\w$]+)*$/.test(e)) { const p = e.split('.'); return sc + '.' + p[0] + p.slice(1).map(x => /^\d+$/.test(x) ? '?.[' + x + ']' : '?.' + x).join(''); }
      return 'R(' + sc + ', ' + lit(e) + ')'; };
    const attrV = (raw, sc) => { const whole = raw.match(/^\s*\{\{([\s\S]+?)\}\}\s*$/); if (whole) return { expr: ex(whole[1], sc) }; if (raw.includes('{{')) { const parts = raw.split(/\{\{([\s\S]+?)\}\}/g); return { expr: '`' + parts.map((p, i) => i & 1 ? '${S(' + ex(p, sc) + ')}' : tl(p)).join('') + '`' }; } return { str: raw }; };
    const styleObj = s => { const o = {}; for (const decl of s.split(';')) { const i = decl.indexOf(':'); if (i < 0) continue; const p = decl.slice(0, i).trim(); o[p.startsWith('--') ? p : k2c(p)] = decl.slice(i + 1).trim(); } return o; };
    const text = (t, sc) => { if (!t.includes('{{')) { if (!t.trim() && !t.includes(' ')) return ''; if (/^[^{}<>&\n]+$/.test(t) && t === t.trim()) return t; return '{' + lit(t) + '}'; }
      return t.split(/\{\{([\s\S]+?)\}\}/g).map((p, i) => i & 1 ? '{T(' + ex(p, sc) + ')}' : (p ? '{' + lit(p) + '}' : '')).join(''); };
    let depth = 0;
    const kids = (el, sc) => [...el.childNodes].map(n => node(n, sc)).filter(Boolean).join('');
    function props(el, sc, kind) {
      const out = []; let cls = [], clsExpr = null;
      for (const { name: an, value } of [...el.attributes]) {
        let key = an; if (key.startsWith('sc-camel-')) key = k2c(key.slice(9));
        if (key === 'sc-name' || key === 'data-dc-tpl' || key.startsWith('hint-')) continue;
        if (kind === 'dom' && key.startsWith('style-')) { cls.push(pcls(key.slice(6), value)); continue; }
        if (kind !== 'dom') { if (key === 'name' || key === 'component' || key === 'component-from-global-scope' || key === 'from') continue; if (key.includes('-') && !(kind === 'x' && (key.startsWith('aria-') || key.startsWith('data-')))) key = k2c(key); }
        else { if (key === 'class') key = 'className'; else if (key === 'for') key = 'htmlFor'; else if (key.startsWith('on')) key = EVENT_MAP[key] || 'on' + key[2].toUpperCase() + key.slice(3); else if (ATTR_FIX[key]) key = ATTR_FIX[key]; else if (key.includes('-') && !key.startsWith('aria-') && !key.startsWith('data-')) key = k2c(key); }
        const v = attrV(assetFix(navFix(value)), sc);
        if (key === 'style') { if (kind !== 'dom') { out.push('__hostStyle={hostPos(' + (v.expr || lit(v.str)) + ')}'); continue; } out.push('style={' + (v.expr ? 'sty(' + v.expr + ')' : JSON.stringify(styleObj(v.str))) + '}'); continue; }
        if (key === 'className' && kind === 'dom') { if (v.expr) clsExpr = v.expr; else cls.unshift(v.str); continue; }
        if (key === 'dcProps') { out.push('{...(' + (v.expr || '{}') + ')}'); continue; }
        if ((key === 'value' || key === 'checked') && v.expr) { out.push(key + '={(' + v.expr + ') ?? ' + (key === 'checked' ? 'false' : "''") + '}'); continue; }
        out.push(key + '=' + (v.expr ? '{' + v.expr + '}' : lit(v.str)));
      }
      if (cls.length || clsExpr) out.push('className=' + (clsExpr ? '{[' + clsExpr + ',' + cls.map(lit).join(',') + '].filter(Boolean).join(" ")}' : lit(cls.join(' '))));
      return out.length ? ' ' + out.join(' ') : '';
    }
    function node(n, sc) {
      if (n.nodeType === 3) return text(n.nodeValue, sc);
      if (n.nodeType !== 1) return '';
      const tag = n.localName;
      if (tag === 'sc-helmet') { for (const c of n.children) { if (c.localName === 'style') css = assetFix(c.textContent) + '\n' + css; else if (c.localName === 'link' && c.getAttribute('rel') === 'stylesheet') links.push(c.getAttribute('href')); } return ''; }
      if (tag === 'sc-for') { depth++; const d = depth, vn = 'v' + d; const as = n.getAttribute('as') || 'item'; const l = attrV(n.getAttribute('list') || '', sc); const body = kids(n, vn); depth--;
        return '{L(' + (l.expr || lit(l.str)) + ').map(($it' + d + ', $i' + d + ') => { const ' + vn + ' = { ...' + sc + ', ' + (/^[A-Za-z_$][\w$]*$/.test(as) ? as : lit(as)) + ': $it' + d + ', $index: $i' + d + ' }; return (<React.Fragment key={$i' + d + '}>' + body + '</React.Fragment>); })}'; }
      if (tag === 'sc-if') { const c = attrV(n.getAttribute('value') || '', sc); return '{(' + (c.expr || lit(c.str)) + ') ? (<>' + kids(n, sc) + '</>) : null}'; }
      if (tag === 'dc-import') { const cn = comp(n.getAttribute('name') || n.getAttribute('component')); imports.add(cn); const k = kids(n, sc); return '<' + cn + props(n, sc, 'dc') + (k ? '>' + k + '</' + cn + '>' : ' />'); }
      if (tag === 'x-import') { const g = n.getAttribute('component-from-global-scope') || n.getAttribute('component') || ''; const k = kids(n, sc); return '<XImport name=' + lit(g) + props(n, sc, 'x') + (k ? '>' + k + '</XImport>' : ' />'); }
      const real = RAW_UNWRAP[tag] || tag;
      if (VOID.has(real)) return '<' + real + props(n, sc, 'dom') + ' />';
      return '<' + real + props(n, sc, 'dom') + '>' + kids(n, sc) + '</' + real + '>';
    }
    const body = kids(doc.body, 'v');
    js = assetFix(navFix(js));
    const code = `// @ts-nocheck
// Generated from "${file}" by scripts/dc-convert.js. Inline styles and logic are kept as in the prototype so it renders the same.
import React from 'react';
import { DCLogic, DCHost, sty, T, S, L, R, hostPos, XImport } from '@/dc/runtime';
${[...imports].filter(i => i !== name).map(i => `import ${i} from './${i}';`).join('\n')}

const CSS = \`${tl(css)}\`;
const LINKS = ${JSON.stringify(links)};

${js}

export default class ${name} extends Component {
  render() {
    const v = { ...this.props, ...(this.renderVals() || {}) };
    return (
      <DCHost id="${name}" css={CSS} links={LINKS} hostStyle={this.props.__hostStyle}>
        ${body}
      </DCHost>
    );
  }
}
`;
    return { name, code };
  }
  return files.map(f => convert(f.file, f.src));
}
if (typeof module !== 'undefined') module.exports = { dcConvert };
