'use client';

import Link from 'next/link';
import * as React from 'react';
import type { BookResponse } from '@/types';
import { ArrowRight, Sparkles, BookOpen, Heart } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/ui/components/carousel';
import { Skeleton } from '@repo/ui/components/skeleton';
import { BookGridItem } from './book-grid-item';
import { BookmarkProvider } from './bookmark-provider';

const iconMap = {
  sparkles: Sparkles,
  'book-open': BookOpen,
  heart: Heart,
};

interface BookCarouselProps {
  books?: BookResponse[];
  isLoading?: boolean;
  title: string;
  subtitle?: string;
  icon?: keyof typeof iconMap;
  viewAllHref?: string;
  viewAllText?: string;
  emptyText?: string;
  limit?: number;
}

/**
 * Reusable carousel component to display a collection of books.
 */
export const BookCarousel = ({
  books = [],
  isLoading = false,
  title,
  subtitle,
  icon = 'sparkles',
  viewAllHref,
  viewAllText = 'Xem tất cả',
  emptyText = 'Không tìm thấy sách nào.',
  limit = 10,
}: BookCarouselProps) => {
  const Icon = iconMap[icon] || Sparkles;

  const displayBooks = React.useMemo(() => {
    return books.slice(0, limit);
  }, [books, limit]);

  if (!isLoading && displayBooks.length === 0) {
    return (
      <section className='container py-6 pb-8 md:py-8 md:pb-10'>
        <div className='mb-5 flex items-end justify-between'>
          <div className='flex flex-col space-y-1.5'>
            <div className='flex items-center gap-2'>
              <Icon className='text-primary h-5 w-5' />
              <h2 className='from-primary to-primary/60 bg-gradient-to-br bg-clip-text text-3xl font-bold tracking-tight text-transparent'>
                {title}
              </h2>
            </div>
            {subtitle && <p className='text-muted-foreground'>{subtitle}</p>}
          </div>
        </div>
        <div className='flex h-[200px] items-center justify-center rounded-xl border-2 border-dashed'>
          <p className='text-muted-foreground'>{emptyText}</p>
        </div>
      </section>
    );
  }

  return (
    <section className='container py-6 pb-8 md:py-8 md:pb-10'>
      <div className='mb-5 flex items-end justify-between'>
        <div className='flex flex-col space-y-1.5'>
          <div className='flex items-center gap-2'>
            <Icon className='text-primary h-5 w-5' />
            <h2 className='from-primary to-primary/60 bg-gradient-to-br bg-clip-text text-3xl font-bold tracking-tight text-transparent'>
              {title}
            </h2>
          </div>
          {subtitle && <p className='text-muted-foreground'>{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Button variant='ghost' className='text-primary hover:bg-primary/5 font-semibold' asChild>
            <Link href={viewAllHref}>
              {viewAllText}
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className='px-2 md:px-4'>
          <Carousel className='w-full'>
            <CarouselContent className='-ml-4 py-3 md:-ml-6 md:py-4'>
              {[1, 2, 3, 4, 5].map((i) => (
                <CarouselItem
                  key={i}
                  className='basis-1/2 py-2 pl-4 sm:basis-1/3 sm:pl-5 md:basis-1/4 md:py-3 md:pl-6 lg:basis-1/5'
                >
                  <div className='group relative flex h-full w-full max-w-[180px] flex-col overflow-hidden rounded-md border border-gray-200/80 bg-zinc-50/90 pb-1 dark:border-zinc-800 dark:bg-zinc-900/80'>
                    <div className='pointer-events-none absolute top-0 right-0 left-0 h-[50%] overflow-hidden rounded-md'>
                      <Skeleton className='h-full w-full rounded-none bg-zinc-100/80 dark:bg-zinc-800/40' />
                    </div>
                    <div className='invisible h-20 w-full' aria-hidden='true' />

                    <div className='relative z-10 -mt-14 flex w-full justify-center px-2 transition-transform duration-500 sm:px-3'>
                      <div className='flex items-center justify-center p-1 sm:p-1.5'>
                        <Skeleton className='aspect-[3/4] w-[120px] rounded-sm' />
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
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      ) : (
        <BookmarkProvider>
          <div className='px-2 md:px-4'>
            <Carousel
              opts={{
                align: 'start',
                loop: displayBooks.length > 5,
              }}
              className='w-full'
            >
              <CarouselContent className='-ml-4 py-3 md:-ml-6 md:py-4'>
                {displayBooks.map((book) => (
                  <CarouselItem
                    key={book.id}
                    className='basis-1/2 py-2 pl-4 sm:basis-1/3 sm:pl-5 md:basis-1/4 md:py-3 md:pl-6 lg:basis-1/5'
                  >
                    <BookGridItem book={book} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {displayBooks.length > 2 && (
                <div className='hidden md:block'>
                  <CarouselPrevious className='-left-4' />
                  <CarouselNext className='-right-4' />
                </div>
              )}
            </Carousel>
          </div>
        </BookmarkProvider>
      )}
    </section>
  );
};
