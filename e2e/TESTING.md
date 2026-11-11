# E2E testing

Playwright drives `web` (port 5173) and `web2` (port 5174). You start Supabase and the backend; Playwright builds or reuses the Vite apps.

## Commands

From `e2e/` (see [README.md](./README.md) for headed/video/UI variants):

```bash
npm test
npm run test:web
npm run test:web2
```

## What exists today

The spec inventory is [TESTS.md](./TESTS.md). Do not duplicate that list here.

Current coverage:

- `web`: Sunil Travels catalog (hire form, fleet, vehicle rate, callback phone, about, contact). Needs Supabase for the fleet. Does not need the backend.
- `web2` smoke: homepage loads; guests go to `/login`
- `web2` login: seeded email/password; wrong password stays on login
- `web2` hello: authenticated `GET /api/v1/hello` (needs the backend)

## What to add

- Any new clickable login method or home-page action that a person can use → a spec under `tests/`.
- Keep credentials aligned with `supabase/python_seeds/data/_001_data_users.py` (defaults `test@example.com` / `password123`).
- Prefer isolated tests over depending on another spec passing first.
