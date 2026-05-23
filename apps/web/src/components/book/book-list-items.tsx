'use client';

import { useRouter } from 'next/navigation';
import paths from '@/config/path';
import { type BookResponse } from '@/types';
import { SearchX } from 'lucide-react';
import { useLocale } from '@/hooks/ui/useLocale';
import { Skeleton } from '@repo/ui/components/skeleton';
import { BookListItem } from './book-list-item';
import { BookmarkProvider } from './bookmark-provider';

interface BookListItemsProps {
  data?: BookResponse[];
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export function BookListItems({
  data = [],
  loading = false,
  error = null,
  className = '',
}: BookListItemsProps) {
  const router = useRouter();
  const { t, keys } = useLocale('books');

  if (loading) {
    return (
      <div className={`flex flex-col gap-3 sm:gap-4 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className='flex w-full overflow-hidden rounded-lg border border-gray-100 bg-white sm:rounded-xl dark:border-zinc-800 dark:bg-zinc-900'
          >
            {/* Left Accent Area w/ Cover Skeleton */}
            <div className='bg-primary/10 dark:bg-primary/20 flex w-24 shrink-0 items-center justify-center p-1 sm:w-40 sm:p-3'>
              <Skeleton className='aspect-[3/4] w-20 rounded-sm sm:w-28' />
            </div>

            {/* Content Skeleton */}
            <div className='flex min-w-0 flex-1 flex-col justify-center p-2 sm:p-6'>
              <Skeleton className='mb-2 h-2 w-10 sm:mb-3 sm:h-3 sm:w-12' /> {/* Tag */}
              <Skeleton className='mb-2 h-4 w-full sm:mb-3 sm:h-7 sm:w-3/4' /> {/* Title */}
              <Skeleton className='mb-2 h-3 w-1/2 sm:mb-4 sm:h-4 sm:w-1/3' /> {/* Author */}
              {/* Description */}
              <div className='mb-2 space-y-1 sm:mb-4 sm:space-y-2'>
                <Skeleton className='h-2.5 w-full sm:h-3' />
              </div>
              {/* Bottom Row */}
              <div className='mt-auto flex items-center justify-between border-t border-gray-50 pt-1.5 sm:pt-3 dark:border-zinc-800/50'>
                <Skeleton className='h-3 w-20 sm:h-4 sm:w-24' /> {/* Rating */}
                <Skeleton className='h-5 w-5 rounded-md' /> {/* Bookmark */}
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
  if (!data.length) {
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
      <div className={`grid grid-cols-1 gap-3 sm:gap-4 xl:grid-cols-2 xl:gap-6 ${className}`}>
        {data.map((book) => (
          <BookListItem
            key={book.id}
            book={book}
            onClick={() => router.push(paths.book(book.id))}
          />
        ))}
      </div>
    </BookmarkProvider>
  );
}
