'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@repo/ui/components/button';
import { BookGridItems } from '@/components/book/book-grid-items';
import { useSearchBooks } from '@/hooks/data/useBook';
import type { FindParams } from '@/types';

type DiscoverBookSectionProps = {
  title: string;
  description?: string;
  params: FindParams;
  initialLimit?: number;
  loadMoreStep?: number;
};

export function DiscoverBookSection({
  title,
  description,
  params,
  initialLimit = 8,
}: DiscoverBookSectionProps) {
  const [page, setPage] = React.useState(1);
  const [books, setBooks] = React.useState<NonNullable<ReturnType<typeof useSearchBooks>['data']>['data']>([]);

  const paramsKey = React.useMemo(() => JSON.stringify(params), [params]);

  const queryParams = {
    ...params,
    page,
    limit: initialLimit,
  };

  const { data, isLoading, isFetching, error } = useSearchBooks(queryParams);

  React.useEffect(() => {
    setPage(1);
    setBooks([]);
  }, [paramsKey]);

  React.useEffect(() => {
    const nextBooks = data?.data ?? [];

    if (!nextBooks.length) return;

    setBooks((current) => {
      if (page === 1) return nextBooks;

      const seenIds = new Set(current.map((book) => book.id));
      const merged = [...current];

      for (const book of nextBooks) {
        if (!seenIds.has(book.id)) {
          merged.push(book);
          seenIds.add(book.id);
        }
      }

      return merged;
    });
  }, [data?.data, page]);

  const total = data?.pagination?.total ?? 0;
  const hasMore = books.length < total;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className='space-y-4'
    >
      <div className='space-y-1 px-4'>
        <div className='space-y-1'>
          <h2 className='text-xl md:text-2xl font-bold tracking-tight'>{title}</h2>
          {description ? (
            <p className='text-sm text-muted-foreground max-w-2xl'>{description}</p>
          ) : null}
        </div>
      </div>

      <BookGridItems
        data={books}
        loading={isLoading}
        error={error?.message}
      />

      {hasMore ? (
        <div className='px-4 flex justify-center'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setPage((current) => current + 1)}
            disabled={isFetching}
            className='min-w-36'
          >
            {isFetching ? 'Loading...' : `Load more`}
          </Button>
        </div>
      ) : null}
    </motion.section>
  );
}
