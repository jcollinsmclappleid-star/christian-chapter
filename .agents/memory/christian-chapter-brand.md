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

## Architecture
- Next.js 15 App Router, TypeScript strict, self-contained at `artifacts/christian-chapter/`
- No Replit-specific infra (no artifact routing, no Replit object storage, no Replit auth) — portable to Cursor
- Dev: `next dev --port ${PORT:-3000}`
- `.gitignore` excludes `.env.local`, `.next/`, `*.tsbuildinfo`
- OG image not yet generated — metadata omits image reference until Task #11
