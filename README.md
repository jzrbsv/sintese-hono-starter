# sintese-hono-starter

Monorepo (npm workspaces): Hono API and Next.js + shadcn web app.

```bash
npm install
npm run dev:api   # Hono — http://localhost:3000 (or PORT in apps/api/.env)
npm run dev:web   # Next.js — http://localhost:3001
```

Root `.env` is not shared automatically; configure `apps/api` with its own `.env` for `DATABASE_URL` and `DATABASE_TOKEN` as before.
