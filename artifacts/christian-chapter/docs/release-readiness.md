# Release readiness

Public production activation is not authorised by this programme.

| Item | State |
|---|---|
| Real charging | Disabled (`billing` flag off in production; `siteConfig.billingLive` false) |
| Real-member mailouts | Blocked until Resend verified |
| Synthetic members in production | Forbidden (`isPublicProduction` guard) |
| Sandbox verification as genuine | Forbidden in member-facing copy |
| Legal pages | Implemented; qualified UK review BLOCKED_OWNER |
| SESSION_SECRET | Required in production |
| Location SEO aggregates | Off until privacy-safe supply exists |
