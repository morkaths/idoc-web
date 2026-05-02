'use client';

import { type FindParams } from '@/types';
import { useSearchBooks } from '@/hooks/data/useBook';
import { BookGridView } from './book-grid-view';
import { BookListView } from './book-list-view';

export function BookView({
  params,
  onPageChange,
  view = 'grid',
}: {
  params: FindParams;
  onPageChange: (page: number) => void;
  view?: 'grid' | 'list';
}) {
  const { data, isLoading, error } = useSearchBooks(params);

  const commonProps = {
    data: data?.data,
    loading: isLoading,
    error: error?.message,
    pagination: data?.pagination,
    onPageChange,
  };

  return view === 'list' ? <BookListView {...commonProps} /> : <BookGridView {...commonProps} />;
}
