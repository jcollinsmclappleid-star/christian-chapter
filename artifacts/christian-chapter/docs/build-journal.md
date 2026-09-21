# Build journal

## 2026-09-21 — Homepage conversion

- Removed the Chapter House homepage, 3D runtime, posters, and `?house=` modals.
- Replaced them with a product-led page and a labelled example introduction that is not a match.
- Founding-stage customer copy now uses one explanation. Age confirmation is separate from that explanation.
- Heading and link colours sit in the Tailwind base layer so ivory text wins on oxblood and evergreen.

## 2026-09-20 — FND-CHECK living plan

- Created docs registers and ADRs under `docs/`.
- UK residence declaration and account export added as FND-CHECK repairs.
- Profile APIs gated by existing feature flags.
- Passkeys recorded as DEFERRED_PRODUCTION (ADR-002).
- Live migrate remains BLOCKED_OWNER without DATABASE_URL.

Next: MEM profile completeness.

## 2026-09-20 — MEM-01 profile, media, seed

- Editorial chapters, Essentials, visibility, `changes_required`, authorised preview serializer.
- Voice/video upload API; sandbox mobile/selfie/photo-match journeys.
- 120 synthetic members via `buildSyntheticSpecs`.
- Live apply still BLOCKED_OWNER without DATABASE_URL.
