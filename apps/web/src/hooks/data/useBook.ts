import { BookApi } from '@/apis';
import type { BookResponse, BookRequest, PageParams } from '@/types';
import type { BookSearchParams } from '@/apis/book.api';
import {
  useListQuery,
  useItemQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  type ListQueryOptions,
  type CreateMutationOptions,
  type UpdateMutationOptions,
  type DeleteMutationOptions,
} from './factory';

export const useBooksByIds = (bookIds: string[], enabled = true) => {
  const query = useItemQuery<BookResponse[]>(
    ['books', 'bulk', bookIds],
    () => BookApi.findByIds(bookIds),
    {
      enabled: enabled && bookIds.length > 0,
      staleTime: 10 * 60 * 1000,
    }
  );

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

/**
 * Hook to fetch books with pagination
 * @param params Pagination parameters
 * @param options Query options
 */
export const useBooks = (params: PageParams = {}, options?: ListQueryOptions<BookResponse>) => {
  return useListQuery<BookResponse>(['books', params], () => BookApi.find(params), options);
};

/**
 * Hook to search books
 * @param params Search parameters
 * @param options Query options
 */
export const useSearchBooks = (
  params: BookSearchParams = {},
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
  id: string | undefined,
  options?: Parameters<typeof useItemQuery<BookResponse>>[2]
) => {
  return useItemQuery<BookResponse>(['books', id], () => BookApi.findById(id!), {
    ...options,
    enabled: !!id && options?.enabled !== false,
  });
};

/**
 * Hook to create a new book
 * @param options Mutation options
 */
export const useCreateBook = <TContext = unknown>(
  options?: CreateMutationOptions<BookRequest, BookResponse, TContext>
) => {
  return useCreateMutation<BookRequest, BookResponse, TContext>(
    (data) => BookApi.create(data),
    [['books']],
    options
  );
};

/**
 * Hook to update an existing book
 * @param options Mutation options
 */
export const useUpdateBook = <TContext = unknown>(
  options?: UpdateMutationOptions<BookRequest, BookResponse, TContext>
) => {
  return useUpdateMutation<BookRequest, BookResponse, TContext>(
    ({ id, data }) => BookApi.update(id, data),
    (variables) => [['books'], ['books', variables.id]],
    options
  );
};

/**
 * Hook to delete a book
 * @param options Mutation options
 */
export const useDeleteBook = <TContext = unknown>(options?: DeleteMutationOptions<TContext>) => {
  return useDeleteMutation<TContext>((id) => BookApi.delete(id), [['books']], options);
};
