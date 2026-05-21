'use client';

import { BookGridItems } from '@/components/book/book-grid-items';
import { useSimilarBooks } from '@/hooks/data/useRecommendation';
import { useLocale } from '@/hooks/ui/useLocale';

interface BookSimilarProps {
  bookId?: string;
  enabled?: boolean;
}

export function BookSimilar({ bookId, enabled = true }: BookSimilarProps) {
  const { t, keys } = useLocale('home');

  const { data: similarBooks, isLoading, isError } = useSimilarBooks(bookId, {
    enabled: !!bookId && enabled,
  });

  const error = isError ? t(keys.recommendations.error) : undefined;

  return (
    <div className='mt-4'>
      <BookGridItems data={similarBooks} loading={isLoading} error={error} />
    </div>
  );
}
