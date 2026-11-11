# E2E test list

Tracked Playwright specs under `tests/`. How to run them: [README.md](./README.md).

Recorder specs live in gitignored `video_test/` folders and are not listed here.

## `web` — Sunil Travels

`apps/web` is the public catalog. These specs do not sign in and do not call the FastAPI backend. Fleet and vehicle tests need local Supabase with the catalog seed (`supabase/seeds/001_sunil_travels.sql` or `python_seeds/_003_seed_vehicles.py`).

| File | What it covers |
| --- | --- |
| [`tests/catalog.spec.ts`](./tests/catalog.spec.ts) | Hire choice, schedule check, self-drive list, airport list without the self-drive-only car, callback phone, a saved guest enquiry, about and contact. |

## `web2` — template shell

Credentials: [`tests/helpers/auth.ts`](./tests/helpers/auth.ts) (defaults match `supabase/python_seeds/data/_001_data_users.py`).

| File | What it covers |
| --- | --- |
| [`tests/smoke.spec.ts`](./tests/smoke.spec.ts) | Homepage loads; unauthenticated users are sent to `/login`. |
| [`tests/login.spec.ts`](./tests/login.spec.ts) | Seeded email/password reaches the home page; a wrong password stays on login with an error. |
| [`tests/hello.spec.ts`](./tests/hello.spec.ts) | After sign-in, **Hello** calls `/api/v1/hello` and shows authenticated JSON. Needs the backend on `:8080`. |

## Browser check (`npm run test:browser`)

Separate config (`playwright.browser-check.config.ts`). Does not start web or web2.

| File | What it covers |
| --- | --- |
| [`tests/browser-check.spec.ts`](./tests/browser-check.spec.ts) | Opens one headed Chromium window so you can check window-manager / Hyprland rules. |
