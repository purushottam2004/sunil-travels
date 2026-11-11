# Frontend

pnpm monorepo with shared packages and Vite React apps under `apps/`.

`apps/web` is the Sunil Travels catalog: public pages, Supabase for vehicles and enquiries, optional Google sign-in. `apps/web2` is still the original signed-in template shell (email login and the Hello call).

Vercel SPA rewrites (`/(.*)` → `/index.html`) live in [`vercel.json`](./vercel.json), [`apps/web/vercel.json`](./apps/web/vercel.json), and [`apps/web2/vercel.json`](./apps/web2/vercel.json) so client-side routes do not 404 on refresh. Keep the copy that matches the Vercel Root Directory.

## Setup

Setup steps live in [SETUP_GUIDE.md](./SETUP_GUIDE.md).

For the full local stack order, see the root [SETUP_GUIDE.md](../SETUP_GUIDE.md). Contribution rules: [CONTRIBUTING.md](./CONTRIBUTING.md).
