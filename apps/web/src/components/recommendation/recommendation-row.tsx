'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import paths from '@/config/path';
import { type RecommendedBookResponse } from '@/types';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/ui/components/carousel';
import { Skeleton } from '@repo/ui/components/skeleton';
import { BookGridItem } from '../book/book-grid-item';
import { BookmarkProvider } from '../book/bookmark-provider';

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
        <h2 className='mb-4 text-2xl font-bold'>{title}</h2>
        <div className='rounded-md bg-red-50 p-4 text-center text-red-700 dark:bg-red-900/20 dark:text-red-300'>
          {error}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='space-y-4 py-4'>
        <div className='space-y-1'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-4 w-96' />
        </div>
        <div className='flex gap-6 overflow-hidden'>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className='flex h-full w-[240px] shrink-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900'
            >
              <Skeleton className='bg-primary/5 h-32 w-full rounded-none' />
              <div className='relative z-10 -mt-24 flex w-full justify-center px-4'>
                <Skeleton className='aspect-[3/4] w-36 rounded-sm shadow-md' />
              </div>
              <div className='flex flex-grow flex-col gap-2 p-3 pt-3'>
                <Skeleton className='h-3 w-10' />
                <div className='space-y-1'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-2/3' />
                </div>
                <Skeleton className='mt-1 h-3 w-1/2' />
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
      className='space-y-4 py-4'
    >
      <div className='flex flex-col'>
        <h2 className='text-foreground text-xl font-bold sm:text-2xl'>{title}</h2>
        {description && <p className='text-muted-foreground text-sm'>{description}</p>}
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
                className='basis-1/2 pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/5'
              >
                <BookGridItem book={book} onClick={() => router.push(paths.book(book.id))} />
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
