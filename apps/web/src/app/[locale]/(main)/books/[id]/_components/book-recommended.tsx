'use client';

import { useBooks } from '@/hooks/data/useBook';
import { BookGridItems } from '@/components/book/book-grid-items';

export function BookRecommended({ enabled = true }: { enabled?: boolean }) {
  const { data: recommendedBooksData, isLoading, error } = useBooks({}, { enabled });
  const recommendedBooks = recommendedBooksData?.data || [];

  return (
    <div className='mt-4'>
      <BookGridItems data={recommendedBooks} loading={isLoading} error={error?.message} />
    </div>
  );
}
