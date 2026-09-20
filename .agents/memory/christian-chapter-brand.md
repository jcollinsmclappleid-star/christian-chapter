---
name: Christian Chapter brand decisions
description: Durable copy rules, design tokens, and architectural choices for the Christian Chapter app
---

## Founding-phase copy rules
- Never claim an existing member base, UK-wide presence, or operating service capabilities
- Pricing is NOT finalized — all plans labelled "Price TBD"; no "Most popular" label
- Founding membership is free with no end date announced
- Activity policy and response time targets are design intent, labelled as such — not current operating claims
- Success stories are empty by design until members consent to be featured
- Religious belief data is UK GDPR Article 9 special category — explicit consent required at registration (Task #8 scope)

**Why:** The brief explicitly prohibits fabricated member/activity claims and hard-coded prices during the founding phase.

## Design tokens
- Background: ivory `#F7F3EC`, text: plum `#1E1220`, CTA: oxblood `#8B1F2F`, trust: evergreen `#1D4A36`, accent: brass `#C4A05A`
- Serif: EB Garamond (`--font-garamond`), Sans: Space Grotesk (`--font-grotesk`)
- Tailwind v4 CSS-first — tokens live in `@theme` block in globals.css; no tailwind.config.js

## Canvas and mockup sandbox conventions
- Mockup sandbox routing: `/__mockup/preview/{folder}/{ComponentName}` — auto-discovered from the file system, no route registration needed
- In mockup sandbox, use Google Fonts `@import` in `<style>` tags (not `next/font`)
- Canvas iframe lifecycle: place `state: "building"` FIRST via `create-auto`, then update to `state: "live"` with URL once component is ready
- Canvas shape schema: use `text` not `label` for geo/text shapes; `fontSize` is invalid in `CanvasShapeInput`; `borderRight` duplicate keys in inline style objects are a TS1117 error — keep only one
- GDPR religious-data consent: explicit in-context checkbox required before faith questions; consent enables Continue button (`gdprConsent` state)

**Why:** Canvas skill requires building → live lifecycle; mockup routing is auto-discovered; TS strict mode catches duplicate object keys.

## Architecture
- Next.js 15 App Router, TypeScript strict, self-contained at `artifacts/christian-chapter/`
- No Replit-specific infra (no artifact routing, no Replit object storage, no Replit auth) — portable to Cursor
- Dev: `next dev --port ${PORT:-3000}`
- `.gitignore` excludes `.env.local`, `.next/`, `*.tsbuildinfo`
- OG image not yet generated — metadata omits image reference until Task #11

## Neon HTTP driver limitations (drizzle-orm 0.45 + @neondatabase/serverless)
- `db.transaction()` throws "No transactions support in neon-http driver" — use sequential inserts
- `INSERT ... RETURNING` via drizzle or raw neon SQL returns `[]` — use SELECT-after-insert to retrieve id
- JS `null` for optional boolean columns serialises as `""` (empty string), causing `invalid input syntax for type boolean` — pass `undefined` instead so Drizzle omits the column from the INSERT
- Unique constraint violations (pg code 23505) are wrapped as `err.cause` on the outer Error; check both `err.code` and `err.cause.code`

**Why:** Discovered when the founding-member registration API silently failed in production with the HTTP adapter. The WebSocket-based adapter (`drizzle(Pool)`) supports transactions properly but requires a different DB setup.
