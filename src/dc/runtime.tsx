// Minimal runtime for screens converted from the AlgoStudio Design Components.
// Mirrors the prototype runtime's semantics so the screens render the same.
import React, { useInsertionEffect } from 'react';

/** Logic base class. Generated screens extend it, so lifecycle and setState are plain React. */
export class DCLogic<P = any, S = any> extends React.Component<P, S> {
  renderVals(): Record<string, any> { return {}; }
}

/** style="a:b;c:d" → React style object (same naive split as the prototype runtime). */
export function sty(css: any): React.CSSProperties | undefined {
  if (css == null || css === '') return undefined;
  if (typeof css === 'object') return css;
  const o: Record<string, string> = {};
  for (const decl of String(css).split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    o[prop.startsWith('--') ? prop : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = decl.slice(i + 1).trim();
  }
  return o as React.CSSProperties;
}

/** Text hole: same output rules as the prototype ({{ x }} in text). */
export function T(v: any): React.ReactNode {
  if (v === undefined || v === null || typeof v === 'boolean') return null;
  if (React.isValidElement(v) || Array.isArray(v)) return v as React.ReactNode;
  return <span className="sc-interp">{String(v)}</span>;
}
/** Interpolated attribute part. */
export const S = (v: any) => (v ?? '') + '';
/** sc-for list. */
export const L = (v: any): any[] => (Array.isArray(v) ? v : []);

const HOST_STYLE_PROPS = new Set(['position', 'left', 'top', 'right', 'bottom', 'inset', 'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height', 'z-index', 'transform', 'flex', 'flex-grow', 'flex-shrink', 'flex-basis', 'align-self', 'justify-self', 'grid-column', 'grid-row', 'grid-area', 'margin', 'order']);
export function hostPos(style: any) {
  const all = sty(style) as Record<string, any> | undefined;
  if (!all) return undefined;
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(all)) if (HOST_STYLE_PROPS.has(k.replace(/[A-Z]/g, c => '-' + c.toLowerCase()))) out[k] = v;
  return Object.keys(out).length ? out : undefined;
}

// ---- Expression fallback (for holes that aren't plain dotted paths)
const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*/;
export function R(vals: any, src: string): any {
  const expr = String(src).trim();
  if (!expr) return undefined;
  if (expr[0] === '!') return !R(vals, expr.slice(1));
  const eq = expr.match(/^(.+?)\s*(===|!==|==|!=)\s*(.+)$/);
  if (eq) { const a = R(vals, eq[1]), b = R(vals, eq[3]); return eq[2] === '===' ? a === b : eq[2] === '!==' ? a !== b : eq[2] === '==' ? a == b : a != b; }
  if (expr === 'true') return true;
  if (expr === 'false') return false;
  if (expr === 'null') return null;
  if (expr === 'undefined') return undefined;
  if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
  if (expr.length >= 2 && (expr[0] === '"' || expr[0] === "'") && expr[expr.length - 1] === expr[0]) return expr.slice(1, -1);
  const head = expr.match(IDENT_RE);
  if (!head) return undefined;
  let cur = vals?.[head[0]];
  let i = head[0].length;
  while (i < expr.length) {
    if (expr[i] === '.') {
      const m = expr.slice(i + 1).match(IDENT_RE) || expr.slice(i + 1).match(/^\d+/);
      if (!m) return undefined;
      cur = cur?.[m[0]]; i += 1 + m[0].length;
    } else if (expr[i] === '[') {
      const j = expr.indexOf(']', i);
      cur = cur?.[R(vals, expr.slice(i + 1, j))]; i = j + 1;
    } else return undefined;
  }
  return cur;
}

// ---- Head injection (fonts, @keyframes, page resets, pseudo-state rules), ref-counted per screen
const counts = new Map<string, { n: number; els: HTMLElement[] }>();
function mountHead(id: string, css: string, links: string[]) {
  const hit = counts.get(id);
  if (hit) { hit.n++; return; }
  const els: HTMLElement[] = [];
  for (const href of links) {
    if (document.head.querySelector(`link[href="${CSS.escape(href)}"]`)) continue;
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l); els.push(l);
  }
  if (css) { const s = document.createElement('style'); s.dataset.screen = id; s.textContent = css; document.head.appendChild(s); els.push(s); }
  counts.set(id, { n: 1, els });
}
function unmountHead(id: string) {
  const hit = counts.get(id); if (!hit) return;
  if (--hit.n <= 0) { hit.els.forEach(e => e.remove()); counts.delete(id); }
}

export function DCHost({ id, css, links, hostStyle, children }: { id: string; css: string; links: string[]; hostStyle?: React.CSSProperties; children?: React.ReactNode }) {
  useInsertionEffect(() => { mountHead(id, css, links); return () => unmountHead(id); }, [id]);
  return <div className="sc-host" data-sc-name={id} style={hostStyle}>{children}</div>;
}

// ---- x-import registry: external components the prototypes loaded from .jsx/.js files
const registry: Record<string, React.ComponentType<any>> = {};
export function registerExternal(name: string, C: React.ComponentType<any>) { registry[name] = C; }
export function XImport({ name, children, ...props }: { name: string; children?: React.ReactNode } & Record<string, any>) {
  const C = registry[name];
  if (!C) return <>{children}</>;
  return <C {...props}>{children}</C>;
}
