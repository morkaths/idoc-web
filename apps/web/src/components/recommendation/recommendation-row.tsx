'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/ui/components/carousel';
import { BookGridItem } from '../book/book-grid-item';
import { Skeleton } from '@repo/ui/components/skeleton';
import { BookmarkProvider } from '../book/bookmark-provider';
import { type RecommendedBookResponse } from '@/types';
import { useRouter } from 'next/navigation';
import paths from '@/config/path';

interface RecommendationRowProps {
  title: string;
  description?: string;
  books?: RecommendedBookResponse[];
  isLoading?: boolean;
  error?: string | null;
}

export function RecommendationRow({
  title,
  description,
  books = [],
  isLoading = false,
  error = null,
}: RecommendationRowProps) {
  const router = useRouter();

  if (error) {
    return (
      <div className='py-4'>
        <h2 className='text-2xl font-bold mb-4'>{title}</h2>
        <div className='p-4 text-center rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'>
          {error}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='py-4 space-y-4'>
        <div className='space-y-1'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-4 w-96' />
        </div>
        <div className='flex gap-6 overflow-hidden'>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className='flex flex-col w-[240px] shrink-0 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800 h-full'
            >
              <Skeleton className='h-32 w-full rounded-none bg-primary/5' />
              <div className='relative px-4 -mt-24 w-full flex justify-center z-10'>
                <Skeleton className='w-36 aspect-[3/4] shadow-md rounded-sm' />
              </div>
              <div className='p-3 pt-3 flex flex-col flex-grow gap-2'>
                <Skeleton className='h-3 w-10' />
                <div className='space-y-1'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-2/3' />
                </div>
                <Skeleton className='h-3 w-1/2 mt-1' />
                <div className='mt-auto flex items-center justify-between pt-2'>
                  <Skeleton className='h-3 w-16' />
                  <Skeleton className='h-5 w-5 rounded-md' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className='py-4 space-y-4'
    >
      <div className='flex flex-col'>
        <h2 className='text-xl sm:text-2xl font-bold text-foreground'>
          {title}
        </h2>
        {description && (
          <p className='text-sm text-muted-foreground'>{description}</p>
        )}
      </div>

      <BookmarkProvider>
        <Carousel
          opts={{
            align: 'start',
            loop: false,
          }}
          className='w-full'
        >
          <CarouselContent className='-ml-4'>
            {books.map((book) => (
              <CarouselItem
                key={book.id}
                className='pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/5'
              >
                <BookGridItem
                  book={book}
                  onClick={() => router.push(paths.book(book.id))}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className='hidden sm:block'>
            <CarouselPrevious className='-left-4' />
            <CarouselNext className='-right-4' />
          </div>
        </Carousel>
      </BookmarkProvider>
    </motion.div>
  );
}
