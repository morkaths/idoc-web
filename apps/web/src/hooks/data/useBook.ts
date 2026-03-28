import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { BookApi } from '@/apis';
import type { Book, BookRequest, FindParams, Pagination } from '@/types';
import { BookmarkApi } from '@/apis/bookmark.api';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

type PaginationResponse = { data: Book[]; pagination?: Pagination };

export const useBooks = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
  const { data: session, status } = useSession();

  const booksQuery = useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
    queryKey: ['books', params],
    queryFn: () => BookApi.find(params),
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    ...options
  });

  const bookIds = useMemo(() => {
    if (!booksQuery.data?.data) return [];
    return booksQuery.data.data.map(b => b.id).sort();
  }, [booksQuery.data]);

  const userId = session?.user?.id;

  const bookmarksQuery = useQuery({
    queryKey: ['bookmarks', 'status', bookIds, userId],
    queryFn: () => BookmarkApi.status(bookIds),
    enabled: bookIds.length > 0 && status === 'authenticated' && !!userId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const books = booksQuery.data?.data?.map(book => ({
    ...book,
    bookmarkId: bookmarksQuery.data?.[book.id] || undefined
  })) || [];

  return {
    ...booksQuery,
    data: {
      data: books,
      pagination: booksQuery.data?.pagination,
    }
  };
};

export const useBook = (id: string, options?: Omit<UseQueryOptions<Book, Error, Book, QueryKey>, 'queryKey' | 'queryFn'>) => {
  const { data: session, status } = useSession();

  // 1. Fetch book details
  const bookQuery = useQuery<Book, Error, Book, QueryKey>({
    queryKey: ['books', id],
    queryFn: () => BookApi.findById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    ...options
  });

  // 2. Fetch bookmark status
  const userId = session?.user?.id;
  const bookmarksQuery = useQuery({
    queryKey: ['bookmarks', 'status', id, userId],
    queryFn: () => BookmarkApi.status([id]),
    enabled: !!id && status === 'authenticated' && !!bookQuery.data,
    staleTime: 5 * 60 * 1000,
  });

  // 3. Merge data
  const book = bookQuery.data ? {
    ...bookQuery.data,
    bookmarkId: bookmarksQuery.data?.[id] || undefined
  } : null;

  return {
    ...bookQuery,
    data: book,
  };
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookRequest) => BookApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BookRequest> }) => BookApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => BookApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};
