---
name: Internationalization (i18n)
description: How to add translations and locale-aware content in the web app using next-intl
---

# Internationalization (i18n) Pattern

The `apps/web` app uses **next-intl** for internationalization with **App Router** integration.

## Architecture

```
apps/web/
├── src/
│   ├── i18n.ts                    # next-intl configuration
│   ├── app/
│   │   └── [locale]/              # Locale-based routing
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       └── ...
│   └── middlewares/               # Locale detection middleware
└── locales/
    ├── en.json                    # English translations
    └── vi.json                    # Vietnamese translations
```

## Adding New Translations

### 1. Add keys to locale files

Add/update both `locales/en.json` and `locales/vi.json`:

```json
// locales/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "books": {
    "title": "Library",
    "searchPlaceholder": "Search books...",
    "borrowButton": "Borrow this book"
  }
}

// locales/vi.json
{
  "common": {
    "save": "Lưu",
    "cancel": "Hủy"
  },
  "books": {
    "title": "Thư viện",
    "searchPlaceholder": "Tìm kiếm sách...",
    "borrowButton": "Mượn sách này"
  }
}
```

### 2. Use translations in Server Components

```typescript
import { useTranslations } from 'next-intl';

export default function BooksPage() {
  const t = useTranslations('books');

  return (
    <div>
      <h1>{t('title')}</h1>
      <input placeholder={t('searchPlaceholder')} />
    </div>
  );
}
```

### 3. Use translations in Client Components

```typescript
'use client';

import { useTranslations } from 'next-intl';

export function BorrowButton() {
  const t = useTranslations('books');

  return <button>{t('borrowButton')}</button>;
}
```

## Key Conventions

1. **Namespace by feature**: Group translations by feature name (`books`, `auth`, `common`)
2. **Flat keys within namespace**: Use dot notation for nested access: `t('key')`
3. **Always add both locales**: Never add a key to one locale without adding it to the other
4. **Common namespace**: Reusable translations (Save, Cancel, Delete) go in `common`
5. **Locale folder**: Translation JSON files in `locales/` at the app root (not in `src/`)
6. **Dynamic values**: Use ICU message format: `t('greeting', { name: 'John' })`
