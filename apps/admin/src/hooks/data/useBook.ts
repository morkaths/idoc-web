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

/**
 * Hook to fetch books
 * @param params Filter parameters
 * @param options Query options
 */
export const useBooks = (
  params: FindParams = {},
  options?: ListQueryOptions<BookResponse>
) => {
  return useListQuery<BookResponse>(
    ['books', params],
    () => BookApi.find(params),
    options
  );
};

/**
 * Hook to search books
 * @param params Search parameters
 * @param options Query options
 */
export const useSearchBooks = (
  params: FindParams = {},
  options?: ListQueryOptions<BookResponse>
) => {
  return useListQuery<BookResponse>(
    ['books', 'search', params],
    () => BookApi.search(params),
    options
  );
};

/**
 * Hook to fetch a single book by ID
 * @param id Book ID
 * @param options Query options
 */
export const useBook = (
  id: string,
  options?: ItemQueryOptions<BookResponse>
) => {
  return useItemQuery<BookResponse>(
    ['books', id],
    () => BookApi.findById(id),
    { enabled: !!id, ...options }
  );
};

/**
 * Hook to create a new book
 * @param options Mutation options
 */
export const useCreateBook = (
  options?: CreateMutationOptions<BookRequest, BookResponse>
) => {
  return useCreateMutation<BookRequest, BookResponse>(
    (data) => BookApi.create(data),
    [['books']],
    options
  );
};

/**
 * Hook to update an existing book
 * @param options Mutation options
 */
export const useUpdateBook = (
  options?: UpdateMutationOptions<BookRequest, BookResponse>
) => {
  return useUpdateMutation<BookRequest, BookResponse>(
    ({ id, data }) => BookApi.update(id, data),
    (variables) => [['books', variables.id], ['books']],
    options
  );
};

/**
 * Hook to delete a book
 * @param options Mutation options
 */
export const useDeleteBook = (options?: DeleteMutationOptions) => {
  return useDeleteMutation(
    (id) => BookApi.delete(id),
    [['books']],
    options
  );
};

