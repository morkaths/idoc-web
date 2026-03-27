---
description: How to create a new API service module
---

# Create New API Service

Follow the existing pattern in `apps/admin/src/apis/`. Reference any existing `*.api.ts` file.

## Steps

### 1. Create the API file

Create `src/apis/{entity}.api.ts`:

```typescript
import { ApiClient } from './config';
import type { Entity, EntityRequest, FindParams } from '@/types';

export class EntityApi {
  private static readonly BASE = '/api/v1/entities';

  /**
   * Fetch all entities with optional pagination and filtering.
   */
  static findAll(params?: FindParams) {
    return ApiClient.get<Entity[]>(this.BASE, { params });
  }

  /**
   * Fetch a single entity by ID.
   */
  static findById(id: string) {
    return ApiClient.get<Entity>(`${this.BASE}/${id}`);
  }

  /**
   * Create a new entity.
   */
  static create(data: EntityRequest) {
    return ApiClient.post<Entity>(this.BASE, { data });
  }

  /**
   * Partially update an existing entity.
   */
  static update(id: string, data: Partial<EntityRequest>) {
    return ApiClient.patch<Entity>(`${this.BASE}/${id}`, { data });
  }

  /**
   * Delete an entity by ID.
   */
  static delete(id: string) {
    return ApiClient.delete<void>(`${this.BASE}/${id}`);
  }
}
```

### 2. Register in barrel export

Add to `src/apis/index.ts`:
```typescript
export { EntityApi } from './entity.api';
```

### 3. Define types

Ensure the following types exist in `src/types/`:

- **Response type** in `response.ts`: The entity interface matching backend response
- **Request type** in `request.ts`: The DTO for create/update operations
- Re-export from `index.ts`

### Key conventions

- Class name: `{Entity}Api` (PascalCase + "Api" suffix)
- Static methods only — no instantiation needed
- Use `ApiClient` from `./config` (handles auth tokens, interceptors, error formatting)
- Default mode is `'private'` (authenticated). Use `{ mode: 'public' }` for unauthenticated endpoints
- For file uploads, use `FormData` and set appropriate headers:
  ```typescript
  static upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return ApiClient.post<FileResponse>(this.BASE, {
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  ```
