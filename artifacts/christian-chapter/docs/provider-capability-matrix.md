# Provider capability matrix

See also `src/lib/platform/provider-matrix.ts`.

| Feature | Interface | Development adapter | Production | Local data | Failure | State |
|---|---|---|---|---|---|---|
| Email | sendTransactionalEmail | email.dev / email.resend | Resend | notifications, provider_results | retry then dead-letter | Implemented, send unverified |
| SMS | sendSmsCode / verifySmsCode | sms.dev | Open | verification_checks | recorded states | Sandbox |
| Selfie | runSelfieCheck | identity.dev | Open | verification_checks | hold, no auto-sanction | Sandbox |
| Photo-match | runPhotoMatch | identity.dev | Open | verification_checks | stays unverified | Sandbox |
| Image moderation | moderateImage | image_moderation.dev | Open | photo status, jobs | retry, stay pending | Sandbox |
| Payments | createCheckoutSession | payments.dev | Stripe sandbox then live | plan_entitlement | stay Free | Sandbox; public checkout off |
| Calls | startPrivateCall | calls.dev | Open | provider_results | unavailable | Interface until MSG-01 |
| Fraud | classifyMessageRisk | fraud.dev | Open | provider_results | unavailable ≠ pass | Until TRU-01 |
| Passkeys | — | — | WebAuthn later | — | — | DEFERRED_PRODUCTION |
