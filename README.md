# AlgoStudio (Vite)

React 19 + TypeScript + React Router 7, built from the AlgoStudio design files.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/
npm run typecheck  # optional; not part of the build
```

## Routes

- `/`: marketing website, with the login modal
- `/login`: creator login (6-digit email code, Supabase Auth)
- `/app/*`: the real creator app (`src/pages/app`). Needs a login: `RequireCreator` checks account-being-deleted, then signed-out (redirects to `/login`), then deal ownership on `/app/deals/:id`
- `/preview`: the design prototype of the desktop app, to compare with `/app`. Also `/preview/m`, `/preview/brand`, `/preview/login`. Open these with a full page load, because the real app loads Tailwind
- `/m`: mobile web app. On phones it fills the screen; on desktop it shows inside a phone frame
- `/brand`: the brand's view (confirm terms, request changes or decline, approve work)
- `/d/:token`, `/a/:token`: working brand links on the localStorage API (Tailwind styled)

## Database

`supabase/migrations/*.sql`: run each file once, in order, in the Supabase SQL Editor.

## How the screens were made

`src/screens/*.tsx` are converted 1:1 from the `.dc.html` design files by `scripts/dc-convert.js`. The conversion keeps:
- the same markup and inline styles
- the same `{{ }}` bindings, rewritten as JSX
- the same logic class, copied unchanged

so each screen renders like the prototype. The small runtime in `src/dc/runtime.tsx` covers the rest:
- head injection for fonts, keyframes and page resets, added on mount and removed on unmount
- hover, active and focus states as static CSS classes
- the `x-import` registry, used for the phone frame

These screens bring their own CSS, so no global stylesheet loads on them. Tailwind (`src/index.css`) loads only with the `/d` and `/a` brand-link pages and the 404 page.

To refresh a screen after the design changes, run the converter again on the updated `.dc.html` files. It runs in a browser, because it needs `DOMParser`.

## Deploying (Vercel)

`vercel.json` sets the Vite framework, the `dist` output folder and the SPA rewrites. If this folder sits inside a larger repo, set **Root Directory** to this folder in Vercel.

## Data

The prototype screens keep the demo data they had in the designs. `src/api` is the localStorage API used by the brand links. It is the layer to swap for the backend; see the comments in `src/api/index.ts`.
