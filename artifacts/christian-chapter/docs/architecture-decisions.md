# Architecture decisions

## ADR-001 Neon Pool, not neon-http

FND-01 submit + consents must be one transaction. neon-http cannot. Keep `@neondatabase/serverless` Pool + `ws`.

## ADR-002 iron-session, no second auth vendor

Members use hashed magic links and `cc_member`. Staff use `cc_admin` + `staff_users` roles. Passkeys/MFA are a documented production boundary, not a parallel identity system.

## ADR-003 Sandbox adapters behind typed interfaces

Email, SMS, identity, image moderation, payments, calls and fraud share `ProviderResult` with pass/fail/pending/unavailable. Public copy must not treat sandbox as a genuine check.

## ADR-004 Feature flags activate, they do not replace permissions

`FEATURE_*` / `CC_RUNTIME` gate public journeys. Staff permissions remain authoritative for data access.

## ADR-005 Lean admin until the milestone needs more

Review, approve, request changes, and message the member. Matching explainability, cases and billing support arrive with those milestones. Do not add flags/jobs/providers consoles as product UI.

## ADR-006 One other-member serializer

`publicProfileView` / `GET /api/profile/preview` is the only payload another member may receive. CSS is not privacy.
