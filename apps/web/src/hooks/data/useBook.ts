import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { BookApi } from '@/apis';
import { BookmarkApi } from '@/apis/bookmark.api';
import type { BookResponse, BookRequest, FindParams, BookmarkResponse, PageParams } from '@/types';
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

export type EnrichedBook = BookResponse & {
  bookmarkId?: string;
};

/**
 * Internal hook to enrich book list with bookmark status
 */
function useBookListEnricher(booksQueryResult: ReturnType<typeof useListQuery<BookResponse>>) {
  const { data: session, status: authStatus } = useSession();

  const bookIds = useMemo(() => {
    const content = booksQueryResult.data.data;
    if (!content || !Array.isArray(content)) return [];
    return content.map(b => b.id).sort();
  }, [booksQueryResult.data.data]);

  const userId = session?.user?.id;

  const { data: bookmarkData } = useItemQuery<Record<string, BookmarkResponse>>(
    ['bookmarks', 'status', bookIds, userId],
    () => BookmarkApi.status(bookIds),
    {
      enabled: bookIds.length > 0 && authStatus === 'authenticated' && !!userId,
      staleTime: 5 * 60 * 1000,
    }
  );

  const enrichedBooks = useMemo<EnrichedBook[]>(() => {
    const content = booksQueryResult.data.data;
    if (!content || !Array.isArray(content)) return [];

    return content.map(book => ({
      ...book,
      bookmarkId: bookmarkData?.[book.id]?.id
    }));
  }, [booksQueryResult.data.data, bookmarkData]);

  return {
    ...booksQueryResult,
    data: {
      ...booksQueryResult.data,
      data: enrichedBooks,
    },
  };
}

/**
 * Hook to fetch books with pagination and bookmark status
 * @param params Page parameters
 * @param options Query options
 */
export const useBooks = (
  params: PageParams = {},
  options?: ListQueryOptions<BookResponse>
) => {
  const booksQuery = useListQuery<BookResponse>(
    ['books', params],
    () => BookApi.find(params),
    options
  );

  return useBookListEnricher(booksQuery);
};

/**
 * Hook to search books with bookmark status
 * @param params Search parameters
 * @param options Query options
 */
export const useSearchBooks = (
  params: FindParams = {},
  options?: ListQueryOptions<BookResponse>
) => {
  const booksQuery = useListQuery<BookResponse>(
    ['books', 'search', params],
    () => BookApi.search(params),
    options
  );

  return useBookListEnricher(booksQuery);
};

/**
 * Hook to fetch a single book by ID with bookmark status
 * @param id Book ID
 * @param options Query options
 */
export const useBook = (id: string | undefined, options?: Parameters<typeof useItemQuery<BookResponse>>[2]) => {
  const { status: authStatus } = useSession();

  const query = useItemQuery<BookResponse>(
    ['books', id],
    () => BookApi.findById(id!),
    { ...options, enabled: !!id && options?.enabled !== false }
  );

  const { data: bookmarkData } = useItemQuery<Record<string, BookmarkResponse>>(
    ['bookmarks', 'status', [id]],
    () => BookmarkApi.status([id!]),
    { enabled: !!id && authStatus === 'authenticated' }
  );

  const enrichedBook = useMemo<EnrichedBook | null>(() => {
    if (!query.data) return null;
    return {
      ...query.data,
      bookmarkId: bookmarkData?.[id!]?.id,
    };
  }, [query.data, bookmarkData, id]);

  return {
    ...query,
    data: enrichedBook,
  };
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
export const useDeleteBook = <TContext = unknown>(
  options?: DeleteMutationOptions<TContext>
) => {
  return useDeleteMutation<TContext>(
    (id) => BookApi.delete(id),
    [['books']],
    options
  );
};

