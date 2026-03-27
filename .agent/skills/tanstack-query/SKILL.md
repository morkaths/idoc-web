---
name: TanStack Query Data Hooks
description: How to create TanStack Query hooks for CRUD operations following the project's established pattern
---

# TanStack Query Data Hooks

This skill covers creating custom hooks in `apps/admin/src/hooks/data/` that wrap API calls with TanStack Query for reactive data fetching and mutations.

## Location

All data hooks live in: `apps/admin/src/hooks/data/use{Entity}.ts`

## Template

```typescript
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { EntityApi } from '@/apis';
import type { Entity, EntityRequest, FindParams, Pagination } from '@/types';

type EntityResponse = { data: Entity[]; pagination?: Pagination };

// ─── LIST HOOK ──────────────────────────────────────────────────────────────────

/**
 * Fetch a paginated, filterable list of entities.
 * Uses staleTime of 5 minutes to avoid excessive refetching.
 */
export const useEntities = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<EntityResponse, Error, EntityResponse, any[]>, 'queryKey' | 'queryFn'>
) => {
  const query = useQuery<EntityResponse, Error, EntityResponse, any[]>({
    queryKey: ['entities', params],
    queryFn: () => EntityApi.findAll(params),
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

  return {
    ...query,
    data: {
      data: query.data?.data || [],
      pagination: query.data?.pagination,
    },
  };
};

// ─── DETAIL HOOK ────────────────────────────────────────────────────────────────

/**
 * Fetch a single entity by ID.
 * Only enabled when ID is truthy.
 */
export const useEntity = (id: string) => {
  const query = useQuery({
    queryKey: ['entities', id],
    queryFn: () => EntityApi.findById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

  return {
    ...query,
    data: query.data || null,
  };
};

// ─── CREATE HOOK ────────────────────────────────────────────────────────────────

/**
 * Create a new entity.
 * Invalidates the list query on success.
 */
export const useCreateEntity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EntityRequest) => EntityApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
    },
  });
};

// ─── UPDATE HOOK ────────────────────────────────────────────────────────────────

/**
 * Update an existing entity.
 * Invalidates both the detail and list queries on success.
 */
export const useUpdateEntity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EntityRequest> }) =>
      EntityApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['entities', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['entities'] });
    },
  });
};

// ─── DELETE HOOK ────────────────────────────────────────────────────────────────

/**
 * Delete an entity by ID.
 * Invalidates the list query on success.
 */
export const useDeleteEntity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => EntityApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
    },
  });
};
```

## Key Conventions

1. **Query keys**: Always start with the entity name in plural: `['entities']`, `['entities', id]`, `['entities', params]`
2. **staleTime**: Use `5 * 60 * 1000` (5min) for lists, `10 * 60 * 1000` (10min) for details
3. **refetchOnWindowFocus**: Always `false` for list queries
4. **enabled**: Use `!!id` for detail queries to prevent fetching with empty ID
5. **Invalidation**: Always invalidate related queries on mutation success
6. **Naming**: `use{Entities}` (plural) for list, `use{Entity}` (singular) for detail, `useCreate{Entity}`, `useUpdate{Entity}`, `useDelete{Entity}` for mutations
7. **Return shape**: Normalize the return to always have `data` and `pagination` fields for lists

## Usage in Components

```typescript
// In a table component
const { data, isLoading } = useEntities({ page: 1, limit: 10, query: search });

// In a form dialog
const createEntity = useCreateEntity();
const updateEntity = useUpdateEntity();

const handleSubmit = async (formData: EntityRequest) => {
  if (isEditing) {
    await updateEntity.mutateAsync({ id: selectedId, data: formData });
    toast.success('Entity updated successfully!');
  } else {
    await createEntity.mutateAsync(formData);
    toast.success('Entity created successfully!');
  }
};
```
