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
- `/app`: desktop app (Home, Deals and Brands, Payments, Deliverables, Reports, plus the create deal, deal detail and record screens)
- `/m`: mobile web app. On phones it fills the screen; on desktop it shows inside a phone frame
- `/brand`: the brand's view (confirm terms, request changes or decline, approve work)
- `/d/:token`, `/a/:token`: working brand links on the localStorage API (Tailwind styled)

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

The prototype screens keep the demo data they had in the designs. `src/api` is the data layer: it runs on localStorage by default and on Supabase when `.env.local` has keys.

## Backend (Supabase)

```bash
npm i -g supabase
supabase login
supabase init                       # once, keeps the existing supabase/ folder
supabase link --project-ref <ref>
supabase db push                    # tables, RLS, views, receipts bucket, hourly sweep
supabase functions deploy brand --no-verify-jwt
supabase secrets set RESEND_API_KEY=... MAIL_FROM="AlgoStudio <codes@yourdomain>"
cp .env.example .env.local          # fill in the project URL and anon key
```

In the Supabase dashboard: Auth → Email templates → Magic Link, include `{{ .Token }}` so creators get a 6-digit code. Add the same two `VITE_` variables in Vercel.

- `supabase/migrations/…_init.sql`: creators, one table per entity in `src/api/types.ts` (stored as `data jsonb` with generated columns for reporting), `expenses` with soft delete, `categories`, the `money_by_month`, `spent_by_category` and `deal_profit` views, the private `receipts` bucket, and an hourly `sweep()` that expires links, purges deleted expenses after 30 days and removes accounts past their deletion date.
- `supabase/functions/brand`: the public `/d/:token` and `/a/:token` actions (view, open, email code, verify, answer, approve or request a revision). Brands never get database access; every call is scoped by the link token.
- `src/api/remote.ts`: creator actions run the same logic as `local.ts`, then only the changed rows are written. Row-level security limits every read and write to the signed-in creator.
- For testing without email, set `DEMO_CODES=true` as a function secret to return brand codes in the response.
