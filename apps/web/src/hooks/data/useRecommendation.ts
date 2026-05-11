import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { BookApi } from '@/apis/book.api';
import { BookmarkApi } from '@/apis/bookmark.api';
import { RecommendationApi } from '@/apis/recommendation.api';
import {
  RecommendationStrategy,
  type BookmarkResponse,
  type RecommendationResponse,
  type RecommendedBookResponse,
} from '@/types';
import { useItemQuery } from './factory';

const useEnrichedBooks = (
  recData: RecommendationResponse | null,
  isLoadingRec: boolean,
  isErrorRec: boolean
) => {
  const { data: session, status: authStatus } = useSession();

  const bookIds = useMemo(() => recData?.items?.map((item) => item.id) ?? [], [recData]);

  const { data: booksData, isLoading: isLoadingBooks, isError: isErrorBooks } = useItemQuery(
    ['books', 'by-ids-rec', bookIds],
    () => BookApi.findByIds(bookIds),
    {
      enabled: bookIds.length > 0,
      staleTime: 5 * 60 * 1000
    }
  );

  const currentUserId = session?.user?.id;
  const { data: bookmarkData } = useItemQuery<Record<string, BookmarkResponse>>(
    ['bookmarks', 'status', bookIds, currentUserId],
    () => BookmarkApi.status(bookIds),
    {
      enabled: bookIds.length > 0 && authStatus === 'authenticated' && !!currentUserId,
      staleTime: 5 * 60 * 1000
    }
  );

  const data = useMemo<RecommendedBookResponse[]>(() => {
    if (!booksData || !Array.isArray(booksData)) return [];

    const recMap = new Map(recData?.items?.map((i) => [i.id, i]) ?? []);

    return booksData
      .map((book) => ({
        ...book,
        score: recMap.get(book.id)?.score,
        reason: recMap.get(book.id)?.reason,
        bookmarkId: bookmarkData?.[book.id]?.id ?? book.bookmarkId,
      }))
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }, [booksData, recData, bookmarkData]);

  return {
    data,
    isLoading: isLoadingRec || isLoadingBooks,
    isError: isErrorRec || isErrorBooks,
    strategy: recData?.strategy,
  };
};

export const useRecommendations = (
  userId: string | undefined,
  strategy: RecommendationStrategy = RecommendationStrategy.HYBRID
) => {
  const { data, isLoading, isError } = useItemQuery(
    ['recommendations', userId, strategy],
    () => RecommendationApi.getForUser(userId!, strategy),
    {
      enabled: !!userId,
      staleTime: 5 * 60 * 1000
    }
  );

  return useEnrichedBooks(data, isLoading, isError);
};

export const usePopularBooks = () => {
  const { data, isLoading, isError } = useItemQuery(
    ['recommendations', 'popular'],
    () => RecommendationApi.getPopular(),
    { staleTime: 10 * 60 * 1000 }
  );

  return useEnrichedBooks(data, isLoading, isError);
};

export const useSimilarBooks = (bookId: string | undefined) => {
  const { data, isLoading, isError } = useItemQuery(
    ['recommendations', 'similar', bookId],
    () => RecommendationApi.getSimilar(bookId!),
    {
      enabled: !!bookId,
      staleTime: 30 * 60 * 1000
    }
  );

  return useEnrichedBooks(data, isLoading, isError);
};
