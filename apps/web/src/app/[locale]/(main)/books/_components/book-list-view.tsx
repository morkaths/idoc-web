'use client';

import { type BookResponse, type Pagination as PaginationType } from '@/types';
import { BookListItems } from '@/components/book/book-list-items';
import { Pagination } from '@/components/pagination';

export function BookListView({
  data = [],
  loading = false,
  error,
  pagination,
  onPageChange,
}: {
  data?: BookResponse[];
  loading?: boolean;
  error?: string;
  pagination?: PaginationType;
  onPageChange?: (page: number) => void;
}) {
  return (
    <div className='space-y-6'>
      <BookListItems data={data} loading={loading} error={error} />
      {pagination && onPageChange && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
}
