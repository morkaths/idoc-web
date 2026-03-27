---
description: How to lint, format, and check for unused code
---

# Lint & Code Quality

## Lint all apps

// turbo
1. Run ESLint across all workspaces:
```bash
npm run lint
```

## Format code

// turbo
2. Format all TypeScript and Markdown files with Prettier:
```bash
npm run format
```

## Check for unused exports (Admin only)

// turbo
3. Run Knip to detect unused files, dependencies, and exports:
```bash
npm run knip --workspace=admin
```

## Individual app linting

// turbo
4. Lint only admin:
```bash
npm run lint --workspace=admin
```

// turbo
5. Lint only web:
```bash
npm run lint --workspace=web
```

## Notes

- ESLint 9 is used with flat config (`eslint.config.js` / `eslint.config.mjs`)
- Prettier config is in `apps/admin/.prettierrc`
- Admin uses `@trivago/prettier-plugin-sort-imports` for auto-sorting imports
- Knip config is in `apps/admin/knip.config.ts`
