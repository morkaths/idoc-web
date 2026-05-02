import { type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { CategoryApi } from '@/apis';
import type { FindParams, CategoryResponse, CategoryRequest, ApiResponse, PageResponse } from '@/types';
import { useListQuery, useItemQuery, useCreateMutation, useUpdateMutation, useDeleteMutation } from './factory';

/**
 * Hook to fetch categories with pagination
 * @param params Search/filter parameters
 * @param options Query options
 */
export const useCategories = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<ApiResponse<PageResponse<CategoryResponse>>, Error>, 'queryKey' | 'queryFn'>
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
  options?: Omit<UseQueryOptions<ApiResponse<PageResponse<CategoryResponse>>, Error>, 'queryKey' | 'queryFn'>
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
export const useCategory = (
  id: string,
  options?: Omit<UseQueryOptions<ApiResponse<CategoryResponse>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useItemQuery<CategoryResponse>(
    ['categories', id],
    () => CategoryApi.findById(id),
    {
      enabled: !!id,
      ...options,
    }
  );
};

/**
 * Hook to create a new category
 * @param options Mutation options
 */
export const useCreateCategory = <TContext = unknown>(
  options?: UseMutationOptions<ApiResponse<CategoryResponse>, Error, CategoryRequest, TContext>
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
  options?: UseMutationOptions<
    ApiResponse<CategoryResponse>,
    Error,
    { id: string; data: Partial<CategoryRequest> },
    TContext
  >
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
  options?: UseMutationOptions<ApiResponse<void>, Error, string, TContext>
) => {
  return useDeleteMutation<TContext>(
    (id) => CategoryApi.delete(id),
    [['categories']],
    options
  );
};
