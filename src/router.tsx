import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStore } from './api';
import { AppShell } from './layouts/AppShell';
import Website from './pages/website/Website';
import Login from './pages/Login';
import Home from './pages/app/Home';
import Deals from './pages/app/Deals';
import DealDetail from './pages/app/DealDetail';
import DealRecord from './pages/app/DealRecord';
import CreateDeal from './pages/app/CreateDeal';
import Payments from './pages/app/Payments';
import Deliverables from './pages/app/Deliverables';
import Reports from './pages/app/Reports';
import Brands from './pages/app/Brands';
import Templates from './pages/app/Templates';
import Settings from './pages/app/Settings';
import TermsLink from './pages/brand/TermsLink';
import ApprovalLink from './pages/brand/ApprovalLink';
import NotFound from './pages/NotFound';

// Guards in spec order: deletion pending → signed out → not found (handled per page).
function RequireAuth() {
  const { session, account } = useStore();
  const loc = useLocation();
  if (!session || !account) return <Navigate to={'/login?next=' + encodeURIComponent(loc.pathname)} replace />;
  if (account.creator.deletion && loc.pathname !== '/app/settings') return <Navigate to="/app/settings" replace />;
  return <Outlet />;
}

export const router = createBrowserRouter([
  { path: '/', element: <Website /> },
  { path: '/login', element: <Login /> },
  { path: '/d/:token', element: <TermsLink /> },
  { path: '/a/:token', element: <ApprovalLink /> },
  {
    element: <RequireAuth />,
    children: [{
      path: '/app',
      element: <AppShell />,
      children: [
        { index: true, element: <Home /> },
        { path: 'deals', element: <Deals /> },
        { path: 'deals/new', element: <CreateDeal /> },
        { path: 'deals/:id', element: <DealDetail /> },
        { path: 'deals/:id/edit', element: <CreateDeal /> },
        { path: 'deals/:id/record', element: <DealRecord /> },
        { path: 'brands', element: <Brands /> },
        { path: 'payments', element: <Payments /> },
        { path: 'deliverables', element: <Deliverables /> },
        { path: 'reports', element: <Reports /> },
        { path: 'templates', element: <Templates /> },
        { path: 'settings', element: <Settings /> },
      ],
    }],
  },
  { path: '*', element: <NotFound /> },
]);
