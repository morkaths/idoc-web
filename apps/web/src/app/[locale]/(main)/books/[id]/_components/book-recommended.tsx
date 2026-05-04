'use client';

import { useSession } from 'next-auth/react';
import { BookGridItems } from '@/components/book/book-grid-items';
import { useRecommendations, usePopularBooks } from '@/hooks/data/useRecommendation';
import { RecommendationStrategy } from '@/apis/recommendation.api';

interface BookRecommendedProps {
  enabled?: boolean;
  strategy?: RecommendationStrategy;
}

/**
 * Displays personalized book recommendations for the current user.
 *
 * Flow:
 *  1. If user is logged in → calls Agent for personalized recs (2-step)
 *  2. If user is not logged in → falls back to popularity-based recs
 */
export function BookRecommended({
  enabled = true,
  strategy = RecommendationStrategy.HYBRID,
}: BookRecommendedProps) {
  const { data: session, status: authStatus } = useSession();
  const isAuthenticated = authStatus === 'authenticated';

  const {
    data: personalizedBooks,
    isLoading: personalizedLoading,
    isError: personalizedError,
  } = useRecommendations(session?.user?.id, {
    strategy,
    enabled: enabled && isAuthenticated,
  });

  const { data: popularBooks, isLoading: popularLoading } = usePopularBooks({
    enabled: enabled && !isAuthenticated,
  });

  const books = isAuthenticated ? personalizedBooks : popularBooks;
  const isLoading = isAuthenticated ? personalizedLoading : popularLoading;
  const error = personalizedError ? 'Không thể tải gợi ý sách.' : undefined;

  return (
    <div className='mt-4'>
      <BookGridItems data={books} loading={isLoading} error={error} />
    </div>
  );
}
