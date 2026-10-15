# Placeholders and "arrives in a later update"

Everything in the app that is visible but not built yet, and what it does today.
Slice numbers come from the code and the project plan. "Not scheduled" means no slice has been named.
Nothing here saves data it cannot save: each item shows a notice or an empty state instead.

## Removed (not coming)

- **Expenses**: the Payments > Expenses tab, "Add expense", the Spent and Profit tiles, Spent by category and the profit row on Reports.
- **The six small shortcut icons** next to the Payments title.
- The prototype routes `/preview`, `/preview/m` and `/preview/brand`.

## Still to come

| Page | Element | What happens today | Slice |
|---|---|---|---|
| Overview | "Send reminder" (Owed to you, Needs you) | Notice | 6 |
| Deals | Remind / Nudge / Follow up on a row | Notice | 6 |
| Deals | "Type" filter (disabled) | Disabled, tooltip | 4 |
| Deliverables | "Remind brand" | Notice | 6 |
| Deliverables | Reels / Stories filter (disabled) | Disabled, tooltip | 4 |
| Deliverables | One row per deal instead of per item | Rows are deals | 4 |
| Deal page | "Brand links arrive in the next update"; hand-driven stage buttons | Banner; creator moves the stage by hand | Not scheduled (brand links: links, answers, verifications tables) |
| Deal page | Submit work needs deliverable items | Use "Mark submitted" | 4 |
| Payments | Bulk-action checkboxes in History | Notice | Not scheduled |
| Payments | Advance + balance deals as two history rows | One row per deal | 6 |
| Payments, Deal page | Logging reminders, recording part payments | Notice or error from the data layer | 6 |
| Reports | Download CSV, Export PDF, Deal stages export | Notice | 9 |
| Reports | Income by content type | Empty state | 4 |
| Profile menu | "Copy my profile link" | Notice | Not scheduled |
| Receipts | Receipt uploads | Not built. Purpose still to be decided; nothing to build yet | To be decided |

## Other things to know

- **Create Deal fields need a migration.** The first draft date, final delivery date, payment structure, advance % and the pasted brand message are saved by `supabase/migrations/20261016000000_deal_form_fields.sql`. Until it is applied, a plain save works but those fields are dropped, and a save with a pasted message fails. Deliverables shows "No date set" without it.
- **Privacy and Terms** (`/privacy`, `/terms`) are DRAFTS marked "Draft, pending legal review". Every [PLACEHOLDER] must be filled in and the text reviewed by a lawyer before launch. The pop-ups render in the browser, so a crawler that does not run JavaScript will only see the homepage.
- **Console warnings.** With Supabase on, the app logs one quiet line per unbuilt table (links, answers, submissions, verifications, payments, reminders, receipts). They are silent in the local demo.
- **Open / Active / Overdue.** "Open" means every deal that is not paid, cancelled, declined or archived, drafts and sent offers included (`openTotals` in `src/lib/dealsView.ts`). Active = Open minus Overdue. The Deals header, the Overview and Reports all use that one function.
