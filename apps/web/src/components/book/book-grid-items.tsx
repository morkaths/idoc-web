'use client';

import { useRouter } from 'next/navigation';
import paths from '@/config/path';
import { type BookResponse } from '@/types';
import { SearchX } from 'lucide-react';
import { useLocale } from '@/hooks/ui/useLocale';
import { Skeleton } from '@repo/ui/components/skeleton';
import { BookGridItem } from './book-grid-item';
import { BookmarkProvider } from './bookmark-provider';

interface BookGridItemsProps {
  data?: BookResponse[];
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export function BookGridItems({
  data = [],
  loading = false,
  error = null,
  className = '',
}: BookGridItemsProps) {
  const router = useRouter();
  const { t, keys } = useLocale('books');

  if (loading) {
    return (
      <div
        className={`grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] items-start justify-items-center gap-6 ${className}`}
      >
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`group relative flex h-full w-[180px] min-w-[180px] max-w-[180px] shrink-0 flex-col overflow-hidden rounded-md border border-gray-200/80 bg-zinc-50/90 pb-1 dark:border-zinc-800 dark:bg-zinc-900/80`}
          >
            <div
              className={`pointer-events-none absolute top-0 right-0 left-0 h-[50%] overflow-hidden rounded-md`}
            >
              <Skeleton className='h-full w-full rounded-none bg-zinc-100/80 dark:bg-zinc-800/40' />
            </div>
            <div className={`invisible h-20 w-full`} aria-hidden='true' />

            <div
              className={`relative z-10 -mt-14 flex w-full justify-center px-2 transition-transform duration-500 sm:px-3`}
            >
              <div className={`flex items-center justify-center p-1 sm:p-1.5`}>
                <Skeleton className={`aspect-[3/4] w-[120px] rounded-sm`} />
              </div>
            </div>

            <div className='flex flex-grow flex-col p-2 pt-1 sm:p-2'>
              <Skeleton className='mb-1 h-2 w-10 sm:h-3' />
              <div className='space-y-1'>
                <Skeleton className='h-3 w-full sm:h-4' />
                <Skeleton className='h-3 w-2/3 sm:h-4' />
              </div>
              <Skeleton className='mt-2 h-2 w-1/2 sm:h-3' />

              <div className='mt-auto flex items-center justify-between pt-1'>
                <div className='flex items-center gap-0.5'>
                  <Skeleton className='h-3 w-3 rounded-full' />
                  <Skeleton className='h-3 w-3 rounded-full' />
                  <Skeleton className='h-3 w-3 rounded-full' />
                  <Skeleton className='h-3 w-3 rounded-full' />
                  <Skeleton className='h-3 w-3 rounded-full' />
                  <Skeleton className='ml-1 h-3 w-8' />
                </div>
                <Skeleton className='h-5 w-5 rounded-md' />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='rounded-md bg-red-50 p-4 text-center text-red-700 dark:bg-red-900/20 dark:text-red-300'>
        {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className='bg-card/50 flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 px-4 py-20 dark:border-zinc-800'>
        <div className='bg-primary/5 mb-4 rounded-full p-6'>
          <SearchX className='text-primary h-12 w-12 opacity-40' />
        </div>
        <h3 className='mb-2 text-xl font-bold text-gray-900 dark:text-zinc-100'>
          {t(keys.view.empty.title)}
        </h3>
        <p className='max-w-sm text-center text-sm text-gray-500 dark:text-gray-400'>
          {t(keys.view.empty.description)}
        </p>
      </div>
    );
  }

  return (
    <BookmarkProvider>
      <div
        className={`grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] items-start justify-items-center gap-6 ${className}`}
      >
        {data.map((book) => (
          <BookGridItem
            key={book.id}
            book={book}
            onClick={() => router.push(paths.book(book.id))}
          />
        ))}
      </div>
    </BookmarkProvider>
  );
}
