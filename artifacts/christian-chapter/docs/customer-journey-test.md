# Customer journey test (20 mock profiles)

Development-only fixtures live under `@synthetic.christianchapter.invalid`. They are removed whenever you re-run the journey seed.

## Reset fixtures

From `artifacts/christian-chapter`:

```bash
pnpm db:migrate          # ensure 0009/0010 applied
pnpm db:seed:journey     # 20 members + concierge demo pair + smoke checks
```

Or signed in as admin with `seed.manage`: `POST /api/dev/seed` with body `{ "mode": "journey", "smoke": true }`.

## Manual browser checklist

1. **Sign in (member)** — `/sign-in` → use e.g. demo man/woman emails printed by the seed script → open dev magic link from terminal if Resend is unset.
2. **Account** — `/account` loads; profile shows approved state.
3. **Introductions** — `/introductions` shows hand-picked card for the demo pair; open detail → **Write to …** opens `/conversations/[id]`.
4. **Messaging** — send a polite message; refresh; other party reads (expiry clock starts on first read).
5. **Safety** — block or report from conversation UI; confirm send blocked after block.
6. **Export** — `/account` → download export; JSON includes retained messages.
7. **Admin** — `/admin/login` as `staff-administrator@synthetic.christianchapter.invalid` (dev password) → **Matching** lists journey members; **Members** / **Profiles** show synthetic badge; connect another pair if needed (both need **clear** photos — journey seed already sets this).

## Automated smoke (no browser)

`pnpm db:seed:journey` — DB checks: member count, clear photos, hand-pick intro, conversation, sealed demo message.

With `pnpm dev` running on `PORT` (default 3000):

```bash
pnpm journey:http
```

Exercises magic-link sign-in (dev link), `/api/auth/me`, introductions, conversation send/read, and account API for `syn-001-40s-en@…`.
