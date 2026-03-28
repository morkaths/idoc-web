'use client';

import { useCallback } from 'react';
import { FindParams } from '@/types';
import { useBooks } from '@/hooks/data/useBook';
import { useQueryParams } from '@/hooks/ui/useQueryParams';
import { BookGridView } from './book-grid-view';
import { BookListView } from './book-list-view';

export function BookView({
  filter,
  view = 'grid',
}: {
  filter: Partial<FindParams>;
  view?: 'grid' | 'list';
}) {
  const { getParam, setParams } = useQueryParams();
  const page = Number(getParam('page')) || 1;

  const handlePageChange = useCallback(
    (newPage: number) => {
      setParams({ page: newPage }, { preservePage: true });
    },
    [setParams]
  );

  const { data, isLoading, error } = useBooks({ page, ...filter });

  const commonProps = {
    data: data?.data,
    loading: isLoading,
    error: error?.message,
    pagination: data?.pagination,
    onPageChange: handlePageChange,
  };

  return view === 'list' ? <BookListView {...commonProps} /> : <BookGridView {...commonProps} />;
}
