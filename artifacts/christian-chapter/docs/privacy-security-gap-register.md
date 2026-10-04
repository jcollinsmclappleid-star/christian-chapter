# Privacy and security gap register

Internal. 4 October 2026. Not a legal sign-off.

| Item | Status | Where |
|---|---|---|
| Controller, ICO reference, not VAT registered | Done | `src/lib/site-config.ts` |
| Record of processing and short DPIA | Done, kept short | `docs/record-of-processing.md`, `docs/dpia.md` |
| Profanity block on names and profiles | Done | `src/lib/language/profanity.ts` |
| Message clock: 30 days unread, 7 days after first read | Done in code. Apply `0009_message_retention.sql` | `src/lib/chat/retention.ts` |
| Cron deletes expired messages and report copies | Done. Needs `CRON_SECRET` and a scheduler | `src/app/api/cron/jobs/route.ts` |
| Export includes messages still kept | Done | `src/app/api/account/export/route.ts` |
| Block closes the thread and stops a new message | Done | `src/lib/chat/open.ts` |
| Terms and privacy are separate checkboxes | Done | `src/app/register/_components/review-screen.tsx` |
| Reported messages kept 90 days, staff see only that copy | Done in code. Apply `0010_report_evidence.sql` | `src/app/api/conversations/[id]/report/route.ts`, `/admin/reports` |
| Live message text sealed in the database | Done. Not end-to-end encryption. Older rows still read as plain text | `src/lib/chat/seal.ts` |
| Online safety and child-access notes | Done, short. Not an Ofcom filing | `docs/online-safety-assessment.md`, `docs/child-access-assessment.md` |
| After a restore, run the cron purge before reopening | Written | `docs/backup-restore.md` |
| Admin multi-factor | Left open, as asked | `src/app/api/admin/login/route.ts` |
| Signed processor contracts | Left open, as asked | — |
