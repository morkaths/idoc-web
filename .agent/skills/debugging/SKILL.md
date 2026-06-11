---
name: Debugging & Troubleshooting
description: Common issues and their solutions for the idoc-web monorepo
---

# Debugging & Troubleshooting

Quick reference for diagnosing and resolving common issues in the idoc-web monorepo.

## Common Issues

### 1. `401 Unauthorized` / Token Expired

**Symptom**: API calls return 401, console shows `AccessDeniedError` or `jwt expired`.

**Root Cause**: Access token expired and refresh failed.

**Solution**:

- Check `apps/admin/src/apis/config.ts` — the interceptor auto-refreshes tokens on 401
- If refresh also fails, user is logged out and redirected to sign-in
- Clear cookies manually if stuck: delete `token` and `user` cookies
- Check if the backend token expiry is too short for development

### 2. Hydration Mismatch (Web App)

**Symptom**: Next.js shows `Hydration failed because the server-rendered HTML didn't match the client`.

**Common Causes**:

- Components rendering different content on server vs client (e.g., `Date.now()`, `window` access)
- Browser extensions injecting elements
- Theme provider not suppressing hydration warnings

**Solution**:

- Wrap client-only code with `'use client'` directive
- Use `useEffect` for browser-only rendering
- Check `suppressHydrationWarning` on `<html>` tag
- Test in incognito mode to rule out extensions

### 3. TanStack Router Route Not Found

**Symptom**: New page shows 404 or route tree doesn't update.

**Solution**:

- The route tree (`src/routeTree.gen.ts`) is auto-generated
- Restart the dev server — TanStack Router plugin regenerates routes on startup
- Ensure route file follows the file-based convention in `src/routes/`
- Check `vite.config.ts` for the `tanstackRouter()` plugin

### 4. Module Resolution / Import Alias Errors

**Symptom**: `Cannot find module '@/...'` or `@repo/ui/...`.

**Solution**:

- `@/` resolves to `./src/` — configured in `tsconfig.json` and `vite.config.ts`
- `@repo/ui` resolves to `../../packages/ui/src` in admin's Vite config
- After adding new packages, restart the dev server
- Run `npm install` at the root if new dependencies were added

### 5. Turbo Cache Issues

**Symptom**: Changes not reflected, stale builds.

**Solution**:

```bash
# Clear Turbo cache
npx turbo clean
# Or delete manually
rm -rf .turbo node_modules/.cache
```

### 6. ESLint / Prettier Conflicts

**Symptom**: Formatting wars between ESLint and Prettier.

**Solution**:

- `eslint-config-prettier` is installed to disable ESLint rules that conflict with Prettier
- Run `npm run format` first, then `npm run lint`
- Admin has `.prettierrc` with `@trivago/prettier-plugin-sort-imports`

### 7. TailwindCSS 4 Classes Not Working

**Symptom**: New utility classes have no effect.

**Solution**:

- TailwindCSS 4 uses CSS-first configuration (no `tailwind.config.js` in most cases)
- Check if the PostCSS plugin is correctly configured in `postcss.config.cjs`
- Ensure `@tailwindcss/vite` plugin is in `vite.config.ts` (admin)
- Ensure `@tailwindcss/postcss` is in `postcss.config.cjs` (web)

## Debugging Tools

| Tool                     | Purpose                         | Command                          |
| ------------------------ | ------------------------------- | -------------------------------- |
| React DevTools           | Component tree, props, state    | Browser extension                |
| TanStack Query Devtools  | Query cache, mutations          | Auto-enabled in dev              |
| TanStack Router Devtools | Route tree, params              | Auto-enabled in dev              |
| Knip                     | Find unused code                | `npm run knip --workspace=admin` |
| Network tab              | API request/response inspection | Browser DevTools                 |

## Logging Conventions

- **AuthStore**: Prefixed with `[AuthStore]`
- **API errors**: Standardized via Axios interceptors in `ApiClient`
- Use `console.error()` for errors, `console.log()` for debug info
- Remove debug logs before committing (Knip helps catch these)
