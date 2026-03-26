---
description: How to create a new feature module in the admin app
---

# Create New Feature Module (Admin)

Follow the existing feature pattern in `apps/admin/src/features/`. Use the `books` feature as the reference implementation.

## Steps

### 1. Define types in `src/types/`

Add response interface in `response.ts`:
```typescript
export interface Entity {
  id: string;
  name: string;
  // ... fields from API response
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
```

Add request DTO in `request.ts`:
```typescript
export interface EntityRequest {
  name: string;
  // ... fields for create/update
}
```

Add enums in `enum.ts` if needed. Ensure all are re-exported in `index.ts`.

### 2. Create API service in `src/apis/`

Create `entity.api.ts`:
```typescript
import { ApiClient } from './config';
import type { Entity, EntityRequest, FindParams } from '@/types';

export class EntityApi {
  private static readonly BASE = '/api/v1/entities';

  static findAll(params?: FindParams) {
    return ApiClient.get<Entity[]>(this.BASE, { params });
  }

  static findById(id: string) {
    return ApiClient.get<Entity>(`${this.BASE}/${id}`);
  }

  static create(data: EntityRequest) {
    return ApiClient.post<Entity>(this.BASE, { data });
  }

  static update(id: string, data: Partial<EntityRequest>) {
    return ApiClient.patch<Entity>(`${this.BASE}/${id}`, { data });
  }

  static delete(id: string) {
    return ApiClient.delete<void>(`${this.BASE}/${id}`);
  }
}
```

Register in `src/apis/index.ts` barrel export.

### 3. Create feature folder structure

```
src/features/{name}/
├── index.tsx
└── components/
    ├── {name}-provider.tsx
    ├── {name}-table.tsx
    ├── {name}-columns.tsx
    ├── {name}-dialogs.tsx
    ├── {name}-mutate-dialog.tsx
    ├── {name}-primary-buttons.tsx
    ├── {name}-table-row-actions.tsx
    └── {name}-table-bulk-actions.tsx
```

### 4. Create components (in order)

**4a. Provider** (`{name}-provider.tsx`):
- Create a context with dialog open/close states
- Track selected items for edit/delete/bulk actions
- Wrap feature with this provider

**4b. Columns** (`{name}-columns.tsx`):
- Define `ColumnDef<Entity>[]` using TanStack Table
- Include checkbox column for bulk selection
- Include actions column with row action menu

**4c. Table** (`{name}-table.tsx`):
- Use shared `DataTable` component from `@/components/data-table/`
- Implement search toolbar with filters
- Use TanStack Query for data fetching

**4d. Dialogs** (`{name}-dialogs.tsx`):
- Aggregate all dialog components
- Connect to provider context for open/close state

**4e. Mutate Dialog** (`{name}-mutate-dialog.tsx`):
- Form dialog using React Hook Form + Zod validation
- Handle both create (POST) and edit (PATCH) modes
- Use `sonner` toast for success/error feedback

**4f. Primary Buttons** (`{name}-primary-buttons.tsx`):
- "Add" button that opens create dialog
- Optional "Import" button

**4g. Row Actions** (`{name}-table-row-actions.tsx`):
- Dropdown menu with Edit, Delete actions
- Connect to provider context

**4h. Bulk Actions** (`{name}-table-bulk-actions.tsx`):
- Toolbar shown when rows are selected
- Bulk delete action

### 5. Create entry point (`index.tsx`)

```typescript
import { EntityDialogs } from './components/entity-dialogs';
import { EntityPrimaryButtons } from './components/entity-primary-buttons';
import { EntityProvider } from './components/entity-provider';
import { EntityTable } from './components/entity-table';

export function Entities() {
  return (
    <EntityProvider>
      <div className='flex flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-4 sm:gap-6'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Entities</h2>
            <p className='text-muted-foreground'>Manage your entities</p>
          </div>
          <EntityPrimaryButtons />
        </div>
        <EntityTable />
      </div>
      <EntityDialogs />
    </EntityProvider>
  );
}
```

### 6. Add route

Create route file in `src/routes/` following TanStack Router file-based convention. Import and render the feature component.

### 7. Add sidebar navigation

Update the sidebar config in `src/config/path.ts` to include the new feature route.
