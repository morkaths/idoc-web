import { useMemo } from 'react';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import {
  RecommendationStrategy,
  type BookResponse,
  type RecommendationResponse,
  type RecommendedBookResponse,
  type FeedRequest,
  type FeedResponse,
  type RecommendationInteractionRequest,
  type ApiResponse,
  type EnrichedFeedSection,
  type SimilarBooksResponse,
} from '@repo/types';
import { RecommendationApi } from '@/apis/recommendation.api';
import { useItemQuery, type ItemQueryOptions } from './factory';
import { useBooksByIds } from './useBook';

export type RecommendationQueryOptions = ItemQueryOptions<RecommendationResponse> & {
  strategy?: RecommendationStrategy;
  page?: number;
  limit?: number;
};

export type PopularRecommendationQueryOptions = ItemQueryOptions<RecommendationResponse> & {
  page?: number;
  limit?: number;
};

export type SimilarRecommendationQueryOptions = ItemQueryOptions<SimilarBooksResponse> & {
  page?: number;
  limit?: number;
};

export const useRecommendations = (
  userId: string | undefined,
  options: RecommendationQueryOptions = {}
) => {
  const { strategy = RecommendationStrategy.HYBRID, page, limit, ...queryOptions } = options;
  const { data, isLoading, isError } = useItemQuery(
    ['recommendations', userId, strategy, page, limit],
    () => RecommendationApi.getForUser(userId!, strategy, page, limit),
    {
      ...queryOptions,
      enabled: !!userId && queryOptions.enabled !== false,
      staleTime: queryOptions.staleTime ?? 5 * 60 * 1000,
    }
  );

  return useEnrichedBooks(data, isLoading, isError);
};

export const usePopularBooks = (options?: PopularRecommendationQueryOptions) => {
  const { page, limit, ...queryOptions } = options ?? {};
  const { data, isLoading, isError } = useItemQuery(
    ['recommendations', 'popular', page, limit],
    () => RecommendationApi.getPopular(page, limit),
    {
      ...queryOptions,
      staleTime: queryOptions?.staleTime ?? 10 * 60 * 1000,
    }
  );

  return useEnrichedBooks(data, isLoading, isError);
};

export const useSimilarBooks = (
  bookId: string | undefined,
  options?: SimilarRecommendationQueryOptions
) => {
  const { page, limit, ...queryOptions } = options ?? {};
  const { data, isLoading, isError } = useItemQuery(
    ['recommendations', 'similar', bookId, page, limit],
    () => RecommendationApi.getSimilar(bookId!, page, limit),
    {
      ...queryOptions,
      enabled: !!bookId && queryOptions?.enabled !== false,
      staleTime: queryOptions?.staleTime ?? 30 * 60 * 1000,
    }
  );

  return useEnrichedBooks(data, isLoading, isError);
};

export const useFeed = (req: FeedRequest | undefined, options?: ItemQueryOptions<FeedResponse>) => {
  const {
    data: feedData,
    isLoading: isLoadingFeed,
    isError: isErrorFeed,
    ...rest
  } = useItemQuery(['recommendations', 'feed', req], () => RecommendationApi.getFeed(req!), {
    ...options,
    enabled: !!req && options?.enabled !== false,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
  });

  const feedLayout = useMemo(() => feedData?.feedLayout || [], [feedData?.feedLayout]);

  const bookIds = useMemo(() => {
    const ids = new Set<string>();
    feedLayout.forEach((section) => {
      section.content?.forEach((item) => {
        if (item.id) ids.add(item.id);
      });
    });
    return Array.from(ids);
  }, [feedLayout]);

  const {
    data: booksData,
    isLoading: isLoadingBooks,
    isError: isErrorBooks,
  } = useBooksByIds(bookIds, bookIds.length > 0);

  const enrichedFeed = useMemo<EnrichedFeedSection[]>(() => {
    if (!feedLayout.length) return [];
    const books = booksData ?? [];
    const bookMap = new Map(books.map((b) => [b.id, b]));

    return feedLayout.map((section) => {
      const enrichedItems = (section.content ?? [])
        .map((item): RecommendedBookResponse | null => {
          const book = bookMap.get(item.id);
          if (!book) return null;
          return {
            ...book,
            score: item.score,
            reason: item.reason,
            predicted: item.predicted,
          };
        })
        .filter((item): item is RecommendedBookResponse => item !== null)
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

      return {
        id: section.id,
        type: section.type,
        title: section.title,
        strategy: section.strategy,
        content: enrichedItems,
      };
    });
  }, [feedLayout, booksData]);

  return {
    data: {
      userId: feedData?.userId,
      impressionId: feedData?.impressionId,
      feedLayout: enrichedFeed,
    },
    isLoading: isLoadingFeed || isLoadingBooks,
    isError: isErrorFeed || isErrorBooks,
    ...rest,
  };
};

export const useLogRecommendationInteraction = (
  options?: UseMutationOptions<ApiResponse<boolean>, Error, RecommendationInteractionRequest>
) => {
  return useMutation({
    mutationFn: (req: RecommendationInteractionRequest) => RecommendationApi.logInteraction(req),
    ...options,
  });
};

const useEnrichedBooks = (
  recData: RecommendationResponse | SimilarBooksResponse | null,
  isLoadingRec: boolean,
  isErrorRec: boolean
) => {
  const bookIds = useMemo(() => recData?.content?.map((item) => item.id) ?? [], [recData]);
  const {
    data: booksData,
    isLoading: isLoadingBooks,
    isError: isErrorBooks,
  } = useBooksByIds(bookIds, bookIds.length > 0);

  const data = useMemo<RecommendedBookResponse[]>(() => {
    const books = booksData ?? [];

    if (!books.length) return [];

    const recMap = new Map(
      recData?.content?.map((i) => [
        i.id,
        i as { id: string; score: number; reason?: string; predicted?: number },
      ]) ?? []
    );

    return books
      .map((book: BookResponse) => ({
        ...book,
        score: recMap.get(book.id)?.score,
        reason: recMap.get(book.id)?.reason,
        predicted: recMap.get(book.id)?.predicted,
      }))
      .sort(
        (a: RecommendedBookResponse, b: RecommendedBookResponse) => (b.score ?? 0) - (a.score ?? 0)
      );
  }, [booksData, recData]);

  const pagination = useMemo(() => {
    if (!recData) return undefined;
    return {
      total: recData.total,
      page: recData.page,
      limit: recData.limit,
      pages: recData.pages,
      last: recData.last,
    };
  }, [recData]);

  const strategy = useMemo(() => {
    if (recData && 'strategy' in recData) {
      return recData.strategy;
    }
    return undefined;
  }, [recData]);

  return {
    data,
    pagination,
    isLoading: isLoadingRec || isLoadingBooks,
    isError: isErrorRec || isErrorBooks,
    strategy,
  };
};
