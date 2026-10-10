# AlgoStudio — Vite app

React 19 + TypeScript + Tailwind v4 + React Router 7. Built from the AlgoStudio design files. All data lives in localStorage behind an API layer you can swap out.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
```

Log in with any email. The 6-digit code appears on screen in demo mode. `ananya@gmail.com` is preloaded with 14 seeded deals, one for every stage.

## Routes

| Path | Screen |
|---|---|
| `/` | Marketing website |
| `/login` | Email code login + profile setup |
| `/app` | Home (period switch, totals, "Do this first", Needs you) |
| `/app/deals` | Deals: pipeline cards, Open / Done, grouped Needs you / Waiting on brand |
| `/app/brands` | Brands (tab inside Deals) |
| `/app/deals/new`, `/app/deals/:id/edit` | Create deal / edit draft / new version |
| `/app/deals/:id` | Deal detail |
| `/app/deals/:id/record` | Deal record (append-only log) |
| `/app/payments` | Payments + editable reminder (WhatsApp / Copy) |
| `/app/deliverables` | Deliverables |
| `/app/reports` | Reports (CSV, PDF via print) |
| `/app/templates` | Templates (profile menu → Manage templates) |
| `/app/settings` | Settings (profile menu) |
| `/d/:token` | Brand terms link: confirm / request changes / decline |
| `/a/:token` | Brand approval link: approve / request revision |

The app is responsive. Below 1024px it becomes the mobile web app, with a bottom tab bar and a floating create button. Sheets become bottom sheets.

To try the brand side, open a deal, go to **Brand links** and click **Brand's view**.

## Design rules carried over
- Max 5 nav items. Brands is a tab inside Deals. Templates and Settings live in the profile menu.
- One green primary button per screen. Everything else is white with a grey outline. Black is used only for the active nav and selected chips.
- Text contrast is at least 4.5:1. Chart values are printed on the chart, never shown only on hover.
- Logo: Jost 600.

## Swapping in the backend
`src/api/index.ts` exports `api = localApi`. Replace it with a client that has the same shape (`auth`, `creator`, `deals`, `work`, `payments`, `templates`, `brand`) and calls your server. `useStore()` uses `useSyncExternalStore`. Have your client keep a snapshot and call its subscribers after each mutation, or after a realtime event.

Rules the server must own (the mock already follows them):
- Link tokens are 128-bit and opaque. `sendLink` can be retried safely if you pass the same `token`.
- One answer per link. A repeat call returns the first answer.
- Brand code: 6 digits, valid 10 min, 3 tries. A verified device is remembered for 30 days for each deal.
- Terms links expire after 7 days (`deals.sweep` / `brand.get`). This should become a cron job.
- Every mutation writes an event in the same step. Events are never edited.
- Changing sent terms always creates a new version. Confirmed terms stay locked.
- Remove the `demoCode` return values from `requestCode` once real email is wired up.

Not in V1: payment processing, file uploads, server PDF generation (print is used for now).
