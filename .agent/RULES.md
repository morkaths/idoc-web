# iDoc Web — Project Rules & Conventions

> For system architecture and diagrams, see [ARCHITECTURE.md](./ARCHITECTURE.md).  
> For tech stack and library versions, see [TECH_STACK.md](./TECH_STACK.md).
## Coding Conventions

### General Rules

- **Functional components only** — no class components
- `const` over `let`, never `var`
- Single quotes for strings
- Always include semicolons
- 2-space indentation
- All in-code comments and JSDoc in **English**
- Chat explanations in **Vietnamese**

### Naming

| What                  | Convention                          | Example                     |
| --------------------- | ----------------------------------- | --------------------------- |
| Components            | PascalCase                          | `UserProfile`, `BooksTable` |
| Functions / Variables | camelCase                           | `getUserData`, `isLoading`  |
| Constants             | UPPER_SNAKE_CASE                    | `API_BASE_URL`              |
| Files                 | kebab-case (match export)           | `books-table.tsx`           |
| API services          | `{Entity}Api`                       | `BookApi`, `AuthApi`        |
| Types                 | PascalCase                          | `User`, `ApiResponse<T>`    |
| Stores                | `use{Name}Store`                    | `useAuthStore`              |
| Data hooks            | `use{Entity}` / `useCreate{Entity}` | `useBooks`, `useCreateBook` |

### Path Aliases

| Alias      | Path                    |
| ---------- | ----------------------- |
| `@/`       | `./src/` (both apps)    |
| `@repo/ui` | `../../packages/ui/src` |

---

## Patterns

### API Service Pattern

All API services in `src/apis/*.api.ts` use the `ApiClient` class:

```typescript
import { ApiClient } from "./config";

export class EntityApi {
  private static readonly BASE = "/api/v1/entities";

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

### Feature Module Pattern (Admin)

Each feature in `src/features/{name}/` follows:

1. **`index.tsx`** — Entry component with Provider wrapper
2. **`components/{name}-provider.tsx`** — Context for dialog states & selected items
3. **`components/{name}-table.tsx`** — Data table with search/filter toolbar
4. **`components/{name}-columns.tsx`** — TanStack Table column definitions
5. **`components/{name}-dialogs.tsx`** — Aggregates all dialogs (create/edit/delete)
6. **`components/{name}-mutate-dialog.tsx`** — Form dialog for create/edit
7. **`components/{name}-primary-buttons.tsx`** — Top action buttons (Add, Import)
8. **`components/{name}-table-row-actions.tsx`** — Row-level action menu
9. **`components/{name}-table-bulk-actions.tsx`** — Bulk action toolbar

### Type System

Types organized in `src/types/`:

- **`response.ts`** — Server response interfaces (`User`, `Book`, `ApiResponse<T>`, `Pagination`)
- **`request.ts`** — Request DTOs (`UserRequest`, `BookRequest`)
- **`enum.ts`** — Enums (`BorrowStatus`, `UserStatus`)
- **`index.ts`** — Barrel re-exports

### Error Handling

- User-facing error messages in **Vietnamese**
- Log detailed errors in English for debugging
- API errors standardized via Axios interceptors in `ApiClient`
- Toast notifications via `sonner`

### Git Commits

```
[type]: Short description in English
```

Types: `feat`, `fix`, `refactor`, `docs`, `style`
