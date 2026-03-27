---
description: How to start the development server for admin, web, or both apps
---

# Start Dev Server

## Run all apps (via Turborepo)

// turbo
1. From the **root** directory, run:
```bash
npm run dev
```

This starts both `apps/admin` (Vite, port 5173) and `apps/web` (Next.js, port 3000) concurrently.

## Run a single app

// turbo
2. To run only the **admin** app:
```bash
npm run dev --workspace=admin
```

// turbo
3. To run only the **web** app:
```bash
npm run dev --workspace=web
```

## Notes

- Admin app uses **Vite** dev server with HMR on port `5173` (configurable via `VITE_PORT` in `.env`)
- Web app uses **Next.js** dev server on port `3000`
- Both apps require environment variables — check `.env.example` in each app directory
- Make sure `node_modules` are installed at the root level: `npm install`
