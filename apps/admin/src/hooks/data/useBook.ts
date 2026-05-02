import { BookApi } from '@/apis';
import type { BookResponse, BookRequest, FindParams } from '@/types';
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

export const useBooks = (
  params: FindParams = {},
  options?: ListQueryOptions<BookResponse>
) => {
  return useListQuery<BookResponse>(
    ['books', params],
    () => BookApi.find(params),
    {
      staleTime: 5 * 60 * 1000,
      ...options,
    }
  );
};

export const useSearchBooks = (
  params: FindParams = {},
  options?: ListQueryOptions<BookResponse>
) => {
  return useListQuery<BookResponse>(
    ['books', 'search', params],
    () => BookApi.search(params),
    {
      ...options,
    }
  );
};

export const useBook = (
  id: string,
  options?: ItemQueryOptions<BookResponse>
) => {
  return useItemQuery<BookResponse>(
    ['books', id],
    () => BookApi.findById(id),
    {
      enabled: !!id,
      ...options,
    }
  );
};

export const useCreateBook = (
  options?: CreateMutationOptions<BookRequest, BookResponse>
) => {
  return useCreateMutation<BookRequest, BookResponse>(
    (data) => BookApi.create(data),
    [['books']],
    options
  );
};

export const useUpdateBook = (
  options?: UpdateMutationOptions<BookRequest, BookResponse>
) => {
  return useUpdateMutation<BookRequest, BookResponse>(
    ({ id, data }) => BookApi.update(id, data),
    (variables) => [['books', variables.id], ['books']],
    options
  );
};

export const useDeleteBook = (options?: DeleteMutationOptions) => {
  return useDeleteMutation(
    (id) => BookApi.delete(id),
    [['books']],
    options
  );
};

