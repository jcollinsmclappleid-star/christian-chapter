# Christian Chapter — living master build plan

**Status date:** 21 September 2026  
**Target:** complete development/staging platform. Public charging and real-member activation remain off.

This file is the repository-owned contract. It supersedes “MEM-01 only” and waitlist-as-product readings. Admin stays lean (review / approve / message) until a later milestone needs more.

## Baseline to preserve

- Editorial public site and honesty flags in `src/lib/site-config.ts`
- FND-01 users, magic-link `cc_member`, versioned consents, legal routes
- Neon Pool/WebSocket + Drizzle
- Profile studio + dating-card presentation
- Feature flags, staff permissions, sandbox providers, jobs (in code, not ops consoles)
- Node test runner

## Milestone status

| Milestone | Status |
|---|---|
| FND-CHECK | IMPLEMENTED_UNVERIFIED — claimable Neon applied 0000–0005 |
| MEM-01 | IMPLEMENTED_UNVERIFIED |
| MAT-01 | IMPLEMENTED_UNVERIFIED |
| ACT-01 | IMPLEMENTED_UNVERIFIED |
| CON-01 | IMPLEMENTED_UNVERIFIED — MSG-01 / TRU-01 next |
| MOD-01 | IN_PROGRESS — photo scan + profile review |
| PAY-01 | IN_PROGRESS — sandbox adapter only |
| NTF-01 | IN_PROGRESS — table + staff notes |
| EVT / MTM / REF | NOT_STARTED |
| SEO-01 | IN_PROGRESS — hubs exist; no location aggregates |
| OPS-01 | IMPLEMENTED_UNVERIFIED |
| QA-01 | IN_PROGRESS — unit/schema tests only |

## Next executable packages

1. MSG-01 messaging between matched members
2. TRU-01 verification / preventative safety
3. Browser verification of introductions with a signed-in synthetic member

## Homepage (21 September 2026)

The Chapter House is removed. The public homepage is a conversion page: proposition, four-step explanation, a labelled example introduction from `src/lib/home/demo-fixture.ts`, founding-stage copy, and links into the existing register and sign-in journeys. `CHAPTER_HOUSE_RUNTIME_CONTRACT.md` is superseded for visual structure. Privacy, consent, and claim-integrity rules remain.

## Owner actions

- DATABASE_URL for live migrate evidence
- UK legal review before paid acquisition
- Resend key before claiming delivery
- Do not enable public checkout
