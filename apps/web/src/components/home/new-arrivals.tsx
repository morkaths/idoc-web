'use client';

import Link from 'next/link';
import { SortDirection } from '@repo/types';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSearchBooks } from '@/hooks/data/useBook';
import { useLocale, KEYS } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/ui/components/carousel';
import { Skeleton } from '@repo/ui/components/skeleton';
import { BookGridItem } from '@/components/book/book-grid-item';

export const NewArrivals = () => {
  const { t, keys } = useLocale('home');
  // Fetch latest books
  const { data: booksResponse, isLoading } = useSearchBooks({
    sorts: [{ field: 'createdAt', direction: SortDirection.DESC }],
    limit: 10,
  });
  const books = booksResponse?.data;

  return (
    <section className='container py-12 pb-20'>
      <div className='mb-8 flex items-end justify-between'>
        <div className='flex flex-col space-y-2'>
          <div className='flex items-center gap-2'>
            <Sparkles className='text-primary h-5 w-5' />
            <h2 className='from-primary to-primary/60 bg-gradient-to-br bg-clip-text text-3xl font-bold tracking-tight text-transparent'>
              {t(keys.newArrivals.title)}
            </h2>
          </div>
          <p className='text-muted-foreground'>{t(keys.newArrivals.subtitle)}</p>
        </div>
        <Button variant='ghost' className='text-primary hover:bg-primary/5 font-semibold' asChild>
          <Link href='/books?sort=createdAt&order=desc'>
            {t(KEYS.common.actions.viewAll)}
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Carousel className='w-full'>
          <CarouselContent className='-ml-6 py-6'>
            {[1, 2, 3, 4, 5].map((i) => (
              <CarouselItem
                key={i}
                className='basis-1/2 py-4 pl-6 sm:basis-1/3 md:basis-1/4 lg:basis-1/5'
              >
                <div className='space-y-3'>
                  <Skeleton className='h-[280px] w-full rounded-xl' />
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-4 w-1/2' />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : books && books.length > 0 ? (
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className='w-full'
        >
          <CarouselContent className='-ml-6 py-6'>
            {books.map((book) => (
              <CarouselItem
                key={book.id}
                className='basis-1/2 py-4 pl-6 sm:basis-1/3 md:basis-1/4 lg:basis-1/5'
              >
                <BookGridItem book={book} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className='hidden md:block'>
            <CarouselPrevious className='-left-6' />
            <CarouselNext className='-right-6' />
          </div>
        </Carousel>
      ) : (
        <div className='flex h-[200px] items-center justify-center rounded-xl border-2 border-dashed'>
          <p className='text-muted-foreground'>{t(keys.newArrivals.empty)}</p>
        </div>
      )}
    </section>
  );
};
