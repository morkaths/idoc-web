import { BookApi } from '@/apis';
import type { BookResponse, BookRequest, FindParams } from '@/types';
import { BookmarkApi } from '@/apis/bookmark.api';
import { useListQuery, useItemQuery, useCreateMutation, useUpdateMutation, useDeleteMutation, type ListQueryOptions, type ItemQueryOptions } from './factory';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

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

  const { data: bookmarkData } = useItemQuery<Record<string, { id: string }>>(
    ['bookmarks', 'status', bookIds, userId],
    () => BookmarkApi.status(bookIds),
    {
      enabled: bookIds.length > 0 && authStatus === 'authenticated' && !!userId,
      staleTime: 5 * 60 * 1000,
    }
  );

  const enrichedBooks = useMemo(() => {
    const content = booksQueryResult.data.data;
    if (!content || !Array.isArray(content)) return [];
    
    return content.map(book => ({
      ...book,
      bookmark: bookmarkData?.[book.id]?.id
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
 * @param params Search/filter parameters
 * @param options Query options
 */
export const useBooks = (
  params: FindParams = {},
  options?: ListQueryOptions<BookResponse>
) => {
  const booksQuery = useListQuery<BookResponse>(
    ['books', params],
    () => BookApi.find(params),
    {
      staleTime: 5 * 60 * 1000,
      ...options
    }
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
    {
      staleTime: 5 * 60 * 1000,
      ...options
    }
  );

  return useBookListEnricher(booksQuery);
};

/**
 * Hook to fetch a single book by ID with bookmark status
 * @param id Book ID
 * @param options Query options
 */
export const useBook = (
  id: string, 
  options?: ItemQueryOptions<BookResponse>
) => {
  const { data: session, status: authStatus } = useSession();

  // 1. Fetch book details
  const bookQuery = useItemQuery<BookResponse>(
    ['books', id],
    () => BookApi.findById(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000,
      ...options
    }
  );

  // 2. Fetch bookmark status
  const userId = session?.user?.id;
  const { data: bookmarkData } = useItemQuery<Record<string, { id: string }>>(
    ['bookmarks', 'status', id, userId],
    () => BookmarkApi.status([id]),
    {
      enabled: !!id && authStatus === 'authenticated' && !!bookQuery.data,
      staleTime: 5 * 60 * 1000,
    }
  );

  // 3. Merge data
  const enrichedBook = useMemo(() => {
    const bookData = bookQuery.data;
    if (!bookData) return null;
    
    return {
      ...bookData,
      bookmark: bookmarkData?.[id]?.id
    };
  }, [bookQuery.data, bookmarkData, id]);

  return {
    ...bookQuery,
    data: enrichedBook,
  };
};


/**
 * Hook to create a new book
 * @param options Mutation options
 */
export const useCreateBook = <TContext = unknown>(
  options?: any
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
  options?: any
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
  options?: any
) => {
  return useDeleteMutation<TContext>(
    (id) => BookApi.delete(id),
    [['books']],
    options
  );
};

