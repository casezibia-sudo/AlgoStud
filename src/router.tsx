import { lazy, Suspense, type ComponentType } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { RequireCreator, RequireDeal } from './lib/guard';
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
  { path: '/m', element: screen(() => import('./screens/MobileWebApp'), { bare: true }) },
  { path: '/brand', element: screen(() => import('./screens/BrandView')) },

  // The homepage with the Privacy / Terms pop-up open (the footer links point here too).
  { path: '/privacy', element: screen(() => import('./screens/Website'), { legal: 'privacy' }) },
  { path: '/terms', element: screen(() => import('./screens/Website'), { legal: 'terms' }) },

  { path: '/login', element: <AuthProvider>{page(() => import('./pages/Login'))}</AuthProvider> },

  // Creator app. RequireCreator shows "Loading…" until the session is read, then checks: account being deleted,
  // signed out (-> /login), and RequireDeal on deal pages. It has its own AuthProvider so /login stays as it is.
  {
    element: <AuthProvider><RequireCreator /></AuthProvider>,
    children: [{
      path: '/app',
      element: page(() => import('./layouts/AppShell').then(m => ({ default: m.AppShell }))),
      children: [
        { index: true, element: page(() => import('./pages/app/Home')) },
        { path: 'deals', element: page(() => import('./pages/app/Deals')) },
        { path: 'deals/new', element: page(() => import('./pages/app/CreateDeal')) },
        {
          path: 'deals/:id',
          element: <RequireDeal />,
          children: [
            { index: true, element: page(() => import('./pages/app/DealDetail')) },
            { path: 'edit', element: page(() => import('./pages/app/CreateDeal')) },
            { path: 'record', element: page(() => import('./pages/app/DealRecord')) },
          ],
        },
        { path: 'brands', element: page(() => import('./pages/app/Brands')) },
        { path: 'payments', element: page(() => import('./pages/app/Payments')) },
        { path: 'deliverables', element: page(() => import('./pages/app/Deliverables')) },
        { path: 'reports', element: page(() => import('./pages/app/Reports')) },
        { path: 'templates', element: page(() => import('./pages/app/Templates')) },
        { path: 'settings', element: page(() => import('./pages/app/Settings')) },
        { path: '*', element: <Navigate to="/app" replace /> },
      ],
    }],
  },

  // Working brand links on the localStorage API (Tailwind styled)
  { path: '/d/:token', element: page(() => import('./pages/brand/TermsLink')) },
  { path: '/a/:token', element: page(() => import('./pages/brand/ApprovalLink')) },
  { path: '*', element: page(() => import('./pages/NotFound')) },
]);
