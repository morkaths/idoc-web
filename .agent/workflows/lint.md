---
description: How to build the project for production deployment
---

# Build for Production

## Build all apps

// turbo

1. From the **root** directory, run:

```bash
npm run build
```

This builds both apps in the correct dependency order (packages first, then apps).

## Build a single app

// turbo 2. Build only the **admin** app:

```bash
npm run build --workspace=admin
```

// turbo 3. Build only the **web** app:

```bash
npm run build --workspace=web
```

## Type checking

// turbo 4. Run type checking across all workspaces:

```bash
npm run check-types
```

## Build outputs

| App          | Build Tool                    | Output   |
| ------------ | ----------------------------- | -------- |
| `apps/admin` | Vite (`tsc -b && vite build`) | `dist/`  |
| `apps/web`   | Next.js (`next build`)        | `.next/` |

## Pre-build checklist

- Ensure all `.env` files are configured properly
- Run `npm run lint` to catch lint errors
- Run `npm run check-types` to catch type errors
- Verify shared packages build successfully first
