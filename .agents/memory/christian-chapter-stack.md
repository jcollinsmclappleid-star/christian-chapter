---
name: Christian Chapter stack
description: Tech choices and key constraints for the artifacts/christian-chapter Next.js app
---

## Stack
- Next.js 15 App Router, TypeScript strict, React 19
- Tailwind v4 CSS-first (`@theme` block in globals.css, `@tailwindcss/postcss` plugin in postcss.config.mjs — no tailwind.config.js)
- Fonts: `next/font/google` — EB_Garamond (serif, variable `--font-garamond`) + Space_Grotesk (sans, variable `--font-grotesk`) declared in src/app/layout.tsx
- drizzle-orm + @neondatabase/serverless (schema not yet written — Task #8 scope)
- framer-motion for animations

## Key constraints
- Self-contained — no Replit artifact routing, no Replit object storage, no Replit auth
- Dev server: `next dev --port ${PORT:-3000}`; workflow name `artifacts/christian-chapter: web`
- Env vars: NEXT_PUBLIC_SITE_URL, DATABASE_URL, RESEND_API_KEY, ADMIN_PASSWORD (see .env.example)
- /register/* and /admin/* pages are noindex shells — full wizard in Task #8
- Religious belief data is UK GDPR Article 9 special category — explicit consent required at registration

**Why self-contained:** Moving to Cursor after initial build. All infrastructure must be standard Next.js, nothing Replit-proprietary.
