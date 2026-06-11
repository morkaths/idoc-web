import { CategoryApi } from '@/apis';
import type { FindParams, CategoryResponse, CategoryRequest, PageParams } from '@/types';
import {
  useListQuery,
  useItemQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  type ListQueryOptions,
  type ItemQueryOptions,
  type CreateMutationOptions,
  type UpdateMutationOptions,
  type DeleteMutationOptions,
} from './factory';

/**
 * Hook to fetch categories with pagination
 * @param params Pagination parameters
 * @param options Query options
 */
export const useCategories = (
  params: PageParams = {},
  options?: ListQueryOptions<CategoryResponse>
) => {
  return useListQuery<CategoryResponse>(
    ['categories', params],
    () => CategoryApi.find(params),
    options
  );
};

/**
 * Hook to search categories
 * @param params Search parameters
 * @param options Query options
 */
export const useSearchCategories = (
  params: FindParams = {},
  options?: ListQueryOptions<CategoryResponse>
) => {
  return useListQuery<CategoryResponse>(
    ['categories', 'search', params],
    () => CategoryApi.search(params),
    options
  );
};

/**
 * Hook to fetch a single category by ID
 * @param id Category ID
 * @param options Query options
 */
export const useCategory = (id: string, options?: ItemQueryOptions<CategoryResponse>) => {
  return useItemQuery<CategoryResponse>(['categories', id], () => CategoryApi.findById(id), {
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to create a new category
 * @param options Mutation options
 */
export const useCreateCategory = <TContext = unknown>(
  options?: CreateMutationOptions<CategoryRequest, CategoryResponse, TContext>
) => {
  return useCreateMutation<CategoryRequest, CategoryResponse, TContext>(
    (data) => CategoryApi.create(data),
    [['categories']],
    options
  );
};

/**
 * Hook to update an existing category
 * @param options Mutation options
 */
export const useUpdateCategory = <TContext = unknown>(
  options?: UpdateMutationOptions<CategoryRequest, CategoryResponse, TContext>
) => {
  return useUpdateMutation<CategoryRequest, CategoryResponse, TContext>(
    ({ id, data }) => CategoryApi.update(id, data),
    (variables) => [['categories'], ['categories', variables.id]],
    options
  );
};

/**
 * Hook to delete a category
 * @param options Mutation options
 */
export const useDeleteCategory = <TContext = unknown>(
  options?: DeleteMutationOptions<TContext>
) => {
  return useDeleteMutation<TContext>((id) => CategoryApi.delete(id), [['categories']], options);
};
