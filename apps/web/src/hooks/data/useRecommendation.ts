import { useMemo } from 'react';
import {
  RecommendationStrategy,
  type BookResponse,
  type RecommendationResponse,
  type RecommendedBookResponse,
  SortDirection,
} from '@/types';
import { BookApi } from '@/apis/book.api';
import { RecommendationApi } from '@/apis/recommendation.api';
import { useItemQuery, useListQuery } from './factory';
import { useBooksByIds } from './useBook';

const useEnrichedBooks = (
  recData: RecommendationResponse | null,
  isLoadingRec: boolean,
  isErrorRec: boolean
) => {
  const bookIds = useMemo(() => recData?.items?.map((item) => item.id) ?? [], [recData]);
  const {
    data: booksData,
    isLoading: isLoadingBooks,
    isError: isErrorBooks,
  } = useBooksByIds(bookIds, bookIds.length > 0);

  const data = useMemo<RecommendedBookResponse[]>(() => {
    const books = booksData ?? [];

    if (!books.length) return [];

    const recMap = new Map(recData?.items?.map((i) => [i.id, i]) ?? []);

    return books
      .map((book: BookResponse) => ({
        ...book,
        score: recMap.get(book.id)?.score,
        reason: recMap.get(book.id)?.reason,
      }))
      .sort(
        (a: RecommendedBookResponse, b: RecommendedBookResponse) => (b.score ?? 0) - (a.score ?? 0)
      );
  }, [booksData, recData]);

  return {
    data,
    isLoading: isLoadingRec || isLoadingBooks,
    isError: isErrorRec || isErrorBooks,
    strategy: recData?.strategy,
  };
};

export const useRecommendations = (
  userId: string | undefined,
  options: {
    strategy?: RecommendationStrategy;
    enabled?: boolean;
  } = {}
) => {
  const { strategy = RecommendationStrategy.HYBRID, enabled = true } = options;
  const { data, isLoading, isError } = useItemQuery(
    ['recommendations', userId, strategy],
    () => RecommendationApi.getForUser(userId!, strategy),
    {
      enabled: !!userId && enabled,
      staleTime: 5 * 60 * 1000,
    }
  );

  return useEnrichedBooks(data, isLoading, isError);
};

export const usePopularBooks = (options: { enabled?: boolean } = {}) => {
  const { enabled = true } = options;
  const { data, isLoading, isError } = useItemQuery(
    ['recommendations', 'popular'],
    () => RecommendationApi.getPopular(),
    {
      enabled,
      staleTime: 10 * 60 * 1000,
    }
  );

  return useEnrichedBooks(data, isLoading, isError);
};

export const useSimilarBooks = (
  bookId: string | undefined,
  options: { enabled?: boolean } = {}
) => {
  const { enabled = true } = options;
  const { data, isLoading, isError } = useItemQuery(
    ['recommendations', 'similar', bookId],
    () => RecommendationApi.getSimilar(bookId!),
    {
      enabled: !!bookId && enabled,
      staleTime: 30 * 60 * 1000,
    }
  );

  return useEnrichedBooks(data, isLoading, isError);
};

export const useNewArrivals = (options: { limit?: number; enabled?: boolean } = {}) => {
  const { limit = 10, enabled = true } = options;
  const {
    data: booksResponse,
    isLoading,
    isError,
  } = useListQuery<BookResponse>(
    ['books', 'new-arrivals', limit],
    () => BookApi.find({ limit, sorts: [{ field: 'createdAt', direction: SortDirection.DESC }] }),
    { enabled, staleTime: 30 * 60 * 1000 }
  );

  const booksData = booksResponse.data;

  const data = useMemo<RecommendedBookResponse[]>(() => {
    return booksData.map((book: BookResponse) => ({
      ...book,
    }));
  }, [booksData]);

  return {
    data,
    isLoading,
    isError,
  };
};
