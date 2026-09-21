# FND-01 handover — Founding account foundation

**Branch:** `main` (uncommitted FND-01 work at handover)  
**Baseline commit:** `26498f2a2045e9526e54b0e8a56ff53ba5e9af47`  
**Policy version:** `2026-09-20` (effective 20 September 2026)  
**Programme status:** FND-01 complete; full platform in progress. See `docs/master-build-plan.md`. Next executable work after MEM-01 is MAT-01.

Qualified UK legal review of `/privacy`, `/terms` and `/cookies` is still required before paid public acquisition. Copy describes current founding-cohort processing only.

## Baseline vs audit

The FND-01 audit findings reproduced before this work: waitlist-only `founding_members`, no member session, drafts in `localStorage` only, Neon HTTP (no transactions), consent insert could fail after a 201, no live policy pages, safety/SEO claims ahead of the product, no test runner.

This slice keeps the visual product and adds account, consent, honesty and the three SEO guides last.

## What shipped

- `siteConfig` for legal/contact/founding flags; 40+ eligibility on welcome + DOB + API; timezone-safe age helper.
- Schema: `users`, `email_tokens`, `founding_applications`, `policy_documents`, `consent_records` (keyed by `user_id`), `audit_events`, `account_closure_requests`. Legacy `founding_members` retained.
- Reversible SQL: `src/db/migrations/0001_fnd01_account_foundation.sql` and `.down.sql`. Waitlist rows copy as `pending_email_verification` with `email_verified_at` null.
- Drizzle client switched to Neon serverless **Pool / WebSocket** so application + consents commit in one transaction (FND-07).
- Magic-link auth on iron-session (`cc_member`); `/sign-in`, `/verify`, `/account`; hashed tokens; rate limits; Resend with visible failure; `RESEND_FROM_EMAIL`.
- Authenticated wizard drafts persist server-side; `cc_wizard_v1` is a pre-verify cache then cleared.
- Live `/privacy`, `/terms`, `/cookies`; versioned consents; review step; no 201 without terms + religious consent.
- Religious-consent withdrawal and closure request queue (`/admin/closures`). Cookie page lists `cc_member`, `cc_admin`, `cc_wizard_v1` only. No banner.
- Safety now vs planned; FAQ/footer/JSON-LD honesty pass; admin statuses + `audit_events`.
- SEO last: `/christian-dating/remarriage`, `/guides/safety/romance-fraud`, `/guides/christian-relationships/dating-across-denominations`. Homepage decorative overlay/gradient not restored.

`lib/db` is unused by the Next app. Its schema files were aligned so they do not fork FND-01 columns.

## Env vars

See `.env.example`: `DATABASE_URL`, `SESSION_SECRET` (32+ chars, required in production), `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, `LEGAL_CONTACT_EMAIL`, `LEGAL_ENTITY_NAME`, `VAT_REGISTERED`.

## Quality gates

| Gate | How | Status |
|------|-----|--------|
| A | Node test runner: submit schema requires consents; submit route uses `db.transaction` | **Passed** (21 tests) |
| B | Node test runner: 40th birthday / leap-day age helper | **Passed** |
| C | Node test runner: policy pages, cookie names, no Ltd/VAT in default footer, unique SEO pages | **Passed** |
| D | `tsc --noEmit` and `next build` in `artifacts/christian-chapter` | **Passed** |
| E | SQL up/down assertions; live apply with `node --env-file=.env.local ./scripts/apply-fnd01.mjs` | SQL **passed**; live apply **blocked** here (no `.env.local` / `DATABASE_URL` on this machine) |

Run tests: `pnpm --filter @workspace/christian-chapter test`

The milestone asked for Vitest. This workspace strips Darwin `esbuild`/`rollup` optional binaries (Replit linux-only overrides), so GATE-A–E run with Node's test runner:

```bash
cd artifacts/christian-chapter
node --experimental-strip-types --test src/lib/age.test.ts src/lib/submit-schema.test.ts src/lib/legal-content.test.ts src/lib/admin-status.test.ts src/db/migrations.test.ts
```

## Provider status

| Dependency | Status |
|------------|--------|
| Neon / Postgres | **Implemented, not production-verified** until `0001` is applied on the target database and a submit is observed in one transaction |
| Resend | **Implemented, not production-verified** until `RESEND_API_KEY` is set. Without a key, links are captured in development (`devLink` / logs) and the UI must not claim delivery. **Blocked** on production send until the key and from-address are confirmed |
| iron-session cookies | **Verified in code**; production requires `SESSION_SECRET` |

## Apply migration

```bash
cd artifacts/christian-chapter
node --env-file=.env.local ./scripts/apply-fnd01.mjs
```

Rollback: `0001_fnd01_account_foundation.down.sql` (does not drop `founding_members`).

## Out of scope (unchanged)

Matching, messaging, photos, billing, events, calling, location pages, Auth.js/Clerk, cookie banner, invented company, admin TOTP (documented strong equivalent: required session secret, rate-limited login, 8h httpOnly cookie).
