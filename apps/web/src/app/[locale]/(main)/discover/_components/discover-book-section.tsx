'use client';

import * as React from 'react';
import type { FindParams } from '@/types';
import { motion } from 'framer-motion';
import { useSearchBooks } from '@/hooks/data/useBook';
import { Button } from '@repo/ui/components/button';
import { BookGridItems } from '@/components/book/book-grid-items';

type DiscoverBookSectionProps = {
  title: string;
  description?: string;
  params: FindParams;
  initialLimit?: number;
  loadMoreStep?: number;
};

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @template T
 * @param {T[]} array - The array to shuffle.
 * @returns {T[]} The shuffled array.
 */
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j] as T;
    shuffled[j] = temp as T;
  }
  return shuffled;
};

export function DiscoverBookSection({
  title,
  description,
  params,
  initialLimit = 8,
}: DiscoverBookSectionProps) {
  const [page, setPage] = React.useState(1);
  const [books, setBooks] = React.useState<
    NonNullable<ReturnType<typeof useSearchBooks>['data']>['data']
  >([]);

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
      const shuffledNext = shuffleArray(nextBooks);
      if (page === 1) return shuffledNext;

      const seenIds = new Set(current.map((book) => book.id));
      const merged = [...current];

      for (const book of shuffledNext) {
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
          <h2 className='text-xl font-bold tracking-tight md:text-2xl'>{title}</h2>
          {description ? (
            <p className='text-muted-foreground max-w-2xl text-sm'>{description}</p>
          ) : null}
        </div>
      </div>

      <BookGridItems data={books} loading={isLoading} error={error?.message} />

      {hasMore ? (
        <div className='flex justify-center px-4'>
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
