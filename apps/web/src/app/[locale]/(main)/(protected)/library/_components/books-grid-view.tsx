'use client';

import { useMemo, useState } from 'react';
import { type BookResponse, type FindParams } from '@/types';
import { useBorrowHistory } from '@/hooks/data/useBorrow';
import { BookGridItems } from '@/components/book/book-grid-items';
import { Pagination } from '@/components/pagination';

export default function BookGridView({ filter }: { filter: Partial<FindParams> }) {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useBorrowHistory({ page, ...filter });
  const books: BookResponse[] = useMemo(() => {
    const seen = new Set<string>();
    return (data?.data || [])
      .map((borrow) => borrow.book as unknown as BookResponse)
      .filter((book): book is BookResponse => {
        if (!book || seen.has(book.id)) return false;
        seen.add(book.id);
        return true;
      });
  }, [data]);

  return (
    <div className='space-y-6'>
      <BookGridItems data={books} loading={isLoading} error={error?.message} />
      {data?.pagination && <Pagination pagination={data.pagination} onPageChange={setPage} />}
    </div>
  );
}

