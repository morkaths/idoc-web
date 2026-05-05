import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { BookApi } from '@/apis/book.api';
import { BookmarkApi } from '@/apis/bookmark.api';
import { RecommendationApi } from '@/apis/recommendation.api';
import {
  RecommendationStrategy,
  type BookmarkResponse,
  type RecommendationRequest,
  type RecommendedBookResponse,
} from '@/types';
import { useItemQuery } from './factory';

/**
 * Options for the recommendation hooks.
 */
export interface UseRecommendationsOptions extends RecommendationRequest {
  enabled?: boolean;
}

/**
 * Two-step hook for personalized book recommendations.
 *
 * Step 1: Call Python Agent → get [ { id, score, reason } ]
 * Step 2: Call Java Server with those IDs → get full BookResponse[]
 * Step 3: Merge score/reason + enrich with bookmark status
 *
 * @param userId - Current user's ID (skip query if undefined)
 * @param options - Strategy and enabled flag
 */
export const useRecommendations = (
  userId: string | undefined,
  options?: UseRecommendationsOptions
) => {
  const { strategy = RecommendationStrategy.HYBRID, enabled = true } = options ?? {};
  const { data: session, status: authStatus } = useSession();

  // --- Step 1: Agent call — get IDs with scores ---
  const {
    data: recData,
    isLoading: recLoading,
    isError: recError,
  } = useItemQuery(
    ['recommendations', userId, strategy],
    () => RecommendationApi.getForUser(userId!, strategy),
    {
      enabled: !!userId && enabled,
      staleTime: 5 * 60 * 1000,
    }
  );

  const bookIds = useMemo(
    () => recData?.items?.map((item) => item.id) ?? [],
    [recData]
  );

  // --- Step 2: Java Server call — get full book data ---
  const {
    data: booksData,
    isLoading: booksLoading,
    isError: booksError,
  } = useItemQuery(
    ['books', 'by-ids-rec', bookIds],
    () => BookApi.findByIds(bookIds),
    {
      enabled: bookIds.length > 0,
      staleTime: 5 * 60 * 1000,
    }
  );

  const userId2 = session?.user?.id;

  // --- Step 3a: Get bookmark status for these books ---
  const { data: bookmarkData } = useItemQuery<Record<string, BookmarkResponse>>(
    ['bookmarks', 'status', bookIds, userId2],
    () => BookmarkApi.status(bookIds),
    {
      enabled: bookIds.length > 0 && authStatus === 'authenticated' && !!userId2,
      staleTime: 5 * 60 * 1000,
    }
  );

  // --- Step 3b: Merge score + reason + bookmark into final list ---
  const enrichedBooks = useMemo<RecommendedBookResponse[]>(() => {
    if (!booksData || !Array.isArray(booksData)) return [];

    // Build lookup map: bookId → { score, reason }
    const recMap = new Map(recData?.items?.map((i) => [i.id, i]) ?? []);

    return booksData
      .map((book) => ({
        ...book,
        score: recMap.get(book.id)?.score,
        reason: recMap.get(book.id)?.reason,
        bookmarkId: bookmarkData?.[book.id]?.id ?? book.bookmarkId,
      }))
      // Sort by relevance score descending
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }, [booksData, recData, bookmarkData]);

  return {
    data: enrichedBooks,
    isLoading: recLoading || booksLoading,
    isError: recError || booksError,
    strategy: recData?.strategy,
  };
};


/**
 * Popularity-based fallback for unauthenticated users.
 * Calls the Agent with strategy='popularity' then fetches book details.
 */
export const usePopularBooks = (options?: { enabled?: boolean }) => {
  // data is RecommendationResponse | null
  const { data: recData, isLoading: recLoading } = useItemQuery(
    ['recommendations', 'anonymous', 'popularity'],
    () => RecommendationApi.getForUser('anonymous', RecommendationStrategy.POPULARITY),
    {
      enabled: options?.enabled !== false,
      staleTime: 10 * 60 * 1000,
    }
  );

  const bookIds = useMemo(
    () => recData?.items?.map((item) => item.id) ?? [],
    [recData]
  );

  // data is BookResponse[] | null
  const { data: booksData, isLoading: booksLoading } = useItemQuery(
    ['books', 'popular-rec', bookIds],
    () => BookApi.findByIds(bookIds),
    {
      enabled: bookIds.length > 0,
      staleTime: 10 * 60 * 1000,
    }
  );

  return {
    data: (booksData as RecommendedBookResponse[] | null) ?? [],
    isLoading: recLoading || booksLoading,
  };

};
