import { lazy, Suspense, type ComponentType } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { registerExternal } from './dc/runtime';
import { DeviceOrFullscreen } from './dc/AndroidChromeDevice';

registerExternal('AndroidChromeDevice', DeviceOrFullscreen);
registerExternal('AndroidDevice', DeviceOrFullscreen);

// Prototype screens, converted 1:1 from the design files (src/screens). Each loads on demand.
const screen = (load: () => Promise<{ default: ComponentType<any> }>, props: Record<string, unknown> = {}) => {
  const C = lazy(load);
  return <div id="dc-root"><Suspense fallback={null}><C {...props} /></Suspense></div>;
};
const page = (load: () => Promise<{ default: ComponentType<any> }>) => {
  const C = lazy(load);
  return <Suspense fallback={null}><C /></Suspense>;
};

export const router = createBrowserRouter([
  { path: '/', element: screen(() => import('./screens/Website')) },
  { path: '/app', element: screen(() => import('./screens/DesktopApp')) },
  { path: '/m', element: screen(() => import('./screens/MobileWebApp'), { bare: true }) },
  { path: '/brand', element: screen(() => import('./screens/BrandView')) },
  { path: '/login', element: <Navigate to="/" replace /> },
  // Working brand links on the localStorage API (Tailwind styled)
  { path: '/d/:token', element: page(() => import('./pages/brand/TermsLink')) },
  { path: '/a/:token', element: page(() => import('./pages/brand/ApprovalLink')) },
  { path: '*', element: page(() => import('./pages/NotFound')) },
]);
