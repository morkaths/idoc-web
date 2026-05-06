'use client';

import { BookGridItem } from '@/components/book/book-grid-item';
import { Skeleton } from '@repo/ui/components/skeleton';
import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useBooks } from '@/hooks/data/useBook';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/ui/components/carousel';
import { useLocale, KEYS } from '@/hooks/ui/useLocale';

export const PopularBooks = () => {
  const { t, keys } = useLocale('home');
  const { data: booksResponse, isLoading } = useBooks();
  const books = booksResponse?.data;

  return (
    <section className='container py-12'>
      <div className='mb-8 flex items-end justify-between'>
        <div className='flex flex-col space-y-2'>
          <h2 className='text-3xl font-bold tracking-tight bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent'>{t(keys.popular.title)}</h2>
          <p className='text-muted-foreground'>{t(keys.popular.subtitle)}</p>
        </div>
        <Button variant='ghost' className='text-primary font-semibold hover:bg-primary/5' asChild>
          <Link href='/books'>
            {t(KEYS.common.actions.viewAll)}
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Carousel className='w-full'>
          <CarouselContent className='-ml-6'>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <CarouselItem key={i} className='pl-6 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5'>
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
          <CarouselContent className='-ml-6'>
            {books.map((book) => (
              <CarouselItem key={book.id} className='pl-6 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5'>
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
          <p className='text-muted-foreground'>
            {t(keys.popular.empty)}
          </p>
        </div>
      )}
    </section>
  );
};
