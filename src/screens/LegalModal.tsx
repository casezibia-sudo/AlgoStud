import { Fragment, useEffect, useRef, type CSSProperties } from 'react';
import { LEGAL, type LegalDoc } from './legalContent';

// Inline styles on purpose: the homepage does not load the app's Tailwind CSS.
const FOCUSABLE = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';
const font = "'Satoshi','Jost',system-ui,sans-serif";
const chip: CSSProperties = { display: 'inline-flex', alignItems: 'center', height: 26, padding: '0 10px', borderRadius: 999, background: '#FBF0D6', color: '#8A5A0C', fontSize: 12, fontWeight: 700 };

/** [PLACEHOLDER] text is highlighted so nobody publishes it by accident. */
const withMarks = (text: string) => text.split(/(\[[^\]]+\])/g).map((part, i) =>
  /^\[[^\]]+\]$/.test(part) ? <mark key={i} style={{ background: '#FFF1B8', color: '#3A2D00', padding: '0 3px', borderRadius: 4 }}>{part}</mark> : <Fragment key={i}>{part}</Fragment>);

/** The Privacy / Terms pop-up on the homepage. Escape or the close button closes it; Tab stays inside; focus goes back to the link. */
export function LegalModal({ doc, onClose, onSwitch }: { doc: LegalDoc; onClose: () => void; onSwitch: (d: LegalDoc) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const d = LEGAL[doc];

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const root = document.documentElement, was = root.style.overflow;
    root.style.overflow = 'hidden';
    ref.current?.querySelector<HTMLElement>('[data-close]')?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
      if (e.key !== 'Tab' || !ref.current) return;
      const els = [...ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!ref.current.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', key, true);
    return () => { document.removeEventListener('keydown', key, true); root.style.overflow = was; prev?.focus?.(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const tab = (k: LegalDoc, label: string) => (
    <a href={`/${k}`} aria-current={doc === k ? 'page' : undefined} onClick={e => { e.preventDefault(); onSwitch(k); }}
      style={{ fontSize: 14, fontWeight: 600, color: doc === k ? '#111' : '#5E5E66', textDecoration: 'none', padding: '6px 2px', borderBottom: `2px solid ${doc === k ? '#0A7F55' : 'transparent'}` }}>{label}</a>
  );

  return (
    <div onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(17,17,17,.45)', display: 'grid', placeItems: 'center', padding: 16, fontFamily: font }}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="legal-title" style={{ width: '100%', maxWidth: 720, maxHeight: 'min(86vh, 820px)', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 20, boxShadow: '0 24px 64px -12px rgba(0,0,0,.35)', color: '#111' }}>
        <div style={{ padding: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <nav aria-label="Legal" style={{ display: 'flex', gap: 20 }}>{tab('privacy', 'Privacy')}{tab('terms', 'Terms')}</nav>
            <button type="button" data-close aria-label="Close" onClick={onClose} style={{ width: 36, height: 36, borderRadius: 999, border: 0, background: '#F1F2F2', cursor: 'pointer', fontSize: 18, lineHeight: 1, color: '#111' }}>×</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
            <h2 id="legal-title" style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>{d.title}</h2>
            <span style={chip}>Draft, pending legal review</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#5E5E66' }}>{withMarks(d.updated)}</p>
        </div>
        <div tabIndex={0} aria-label={`${d.title} text`} style={{ overflowY: 'auto', padding: '14px 24px 24px', fontSize: 14.5, lineHeight: 1.6, fontWeight: 500, color: '#2E2E33' }}>
          <p style={{ margin: '0 0 14px' }}>{withMarks(d.intro)}</p>
          {d.sections.map(s => (
            <section key={s.h} style={{ marginTop: 18 }}>
              <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 600, color: '#111' }}>{s.h}</h3>
              {s.p.map((t, i) => <p key={i} style={{ margin: '0 0 8px' }}>{withMarks(t)}</p>)}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
