import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ToastProvider } from './components/ui';

// No global CSS here: the prototype screens bring their own styles.
// Tailwind (src/index.css) loads only with the brand-link pages.
createRoot(document.getElementById('root')!).render(
  // No StrictMode: the prototype logic decorates the DOM once on mount.
  <ToastProvider>
    <RouterProvider router={router} />
  </ToastProvider>,
);
