import { CategoryApi } from '@/apis';
import type {
  FindParams,
  CategoryResponse,
  CategoryRequest,
} from '@/types';
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

export const useCategories = (
  params: FindParams = {},
  options?: ListQueryOptions<CategoryResponse>
) => {
  return useListQuery<CategoryResponse>(
    ['categories', params],
    () => CategoryApi.find(params),
    {
      staleTime: 60 * 60 * 1000,
      ...options,
    }
  );
};

export const useSearchCategories = (
  params: FindParams = {},
  options?: ListQueryOptions<CategoryResponse>
) => {
  return useListQuery<CategoryResponse>(
    ['categories', 'search', params],
    () => CategoryApi.search(params),
    {
      ...options,
    }
  );
};

export const useCategory = (
  id: string,
  options?: ItemQueryOptions<CategoryResponse>
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

export const useCreateCategory = (
  options?: CreateMutationOptions<CategoryRequest, CategoryResponse>
) => {
  return useCreateMutation<CategoryRequest, CategoryResponse>(
    (data) => CategoryApi.create(data),
    [['categories']],
    options
  );
};

export const useUpdateCategory = (
  options?: UpdateMutationOptions<CategoryRequest, CategoryResponse>
) => {
  return useUpdateMutation<CategoryRequest, CategoryResponse>(
    ({ id, data }) => CategoryApi.update(id, data),
    (variables) => [['categories', variables.id], ['categories']],
    options
  );
};

export const useDeleteCategory = (options?: DeleteMutationOptions) => {
  return useDeleteMutation(
    (id) => CategoryApi.delete(id),
    [['categories']],
    options
  );
};



