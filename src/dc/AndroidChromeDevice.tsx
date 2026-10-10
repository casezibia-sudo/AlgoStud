// @ts-nocheck
// Phone frame used by the mobile web app on desktop screens. On a real phone it is skipped.
import React from 'react';

  const ink = '#1F1F1F', sub = '#444746', field = '#EDEFF1';
  const Icon = ({ d, size = 20, fill = 'none', stroke = sub, sw = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
  );
  function StatusBar() {
    return (
      <div style={{ height: 40, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', position: 'relative', background: '#FFFFFF', fontFamily: 'Roboto, system-ui, sans-serif' }}>
        <span style={{ fontSize: 14, letterSpacing: 0.25, color: ink }}>9:30</span>
        <div style={{ position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)', width: 24, height: 24, borderRadius: 100, background: '#2E2E2E' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 13.3L.67 5.97a10.37 10.37 0 0114.66 0L8 13.3z" fill={ink} /></svg>
          <svg width="16" height="16" viewBox="0 0 16 16"><path d="M14.67 14.67V1.33L1.33 14.67h13.34z" fill={ink} /></svg>
          <svg width="16" height="16" viewBox="0 0 16 16"><rect x="3.75" y="2" width="8.5" height="13" rx="1.5" fill={ink} /><rect x="5.5" y="0.9" width="5" height="2" rx="0.5" fill={ink} /></svg>
        </div>
      </div>
    );
  }
  function ChromeBar({ url }) {
    const btn = { width: 40, height: 40, flex: 'none', display: 'grid', placeItems: 'center', borderRadius: 999 };
    return (
      <div role="presentation" style={{ height: 56, flex: 'none', display: 'flex', alignItems: 'center', gap: 2, padding: '0 4px 0 6px', background: '#FFFFFF', borderBottom: '1px solid #E3E3E3', boxSizing: 'border-box', fontFamily: 'Roboto, system-ui, sans-serif' }}>
        <div style={btn}><Icon d={<><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>} /></div>
        <div style={{ flex: 1, minWidth: 0, height: 40, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', borderRadius: 999, background: field }}>
          <Icon size={16} d={<><path d="M4 7h10" /><path d="M18 7h2" /><circle cx="16" cy="7" r="2" /><path d="M4 17h2" /><path d="M10 17h10" /><circle cx="8" cy="17" r="2" /></>} />
          <span style={{ flex: 1, minWidth: 0, fontSize: 15, color: ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{url}</span>
        </div>
        <div style={btn}><div style={{ width: 18, height: 18, border: `2px solid ${sub}`, borderRadius: 4, boxSizing: 'border-box', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700, color: sub, lineHeight: 1 }}>1</div></div>
        <div style={btn}><Icon fill={sub} stroke="none" d={<><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></>} /></div>
      </div>
    );
  }
  function AndroidChromeDevice({ children, url = 'app.algostudio.in', width = 412, height = 892 }) {
    return (
      <div data-om-starter="android-frame" style={{ width, height, borderRadius: 18, overflow: 'hidden', background: '#FFFFFF', border: '8px solid rgba(116,119,117,0.5)', boxShadow: '0 30px 80px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        <StatusBar />
        <ChromeBar url={url} />
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
        <div style={{ height: 24, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF' }}>
          <div style={{ width: 108, height: 4, borderRadius: 2, background: ink, opacity: 0.4 }} />
        </div>
      </div>
    );
  }

export function DeviceOrFullscreen(props) {
  const [small, setSmall] = React.useState(() => window.matchMedia('(max-width: 600px)').matches);
  React.useEffect(() => { const m = window.matchMedia('(max-width: 600px)'); const f = () => setSmall(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  if (small) return <div style={{ height: '100dvh', overflow: 'auto', background: '#FFFFFF' }}>{props.children}</div>;
  return <AndroidChromeDevice {...props} />;
}
