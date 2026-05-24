'use client';

import { useSession } from 'next-auth/react';
import { Heart, type LucideIcon } from 'lucide-react';
import { useRecommendations } from '@/hooks/data/useRecommendation';
import { useLocale } from '@/hooks/ui/useLocale';
import type { RecommendedBookResponse } from '@/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/ui/components/carousel';
import { Skeleton } from '@repo/ui/components/skeleton';
import { BookGridItem } from '@/components/book/book-grid-item';

export const RecommendationCarousel = ({
  books: propBooks,
  title,
  subtitle,
  icon: Icon = Heart,
}: {
  books?: RecommendedBookResponse[];
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
}) => {
  const { t, keys } = useLocale('home');
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { data: queryBooks, isLoading: queryLoading } = useRecommendations(userId, {
    enabled: !!userId && !propBooks,
  });
  const books = propBooks ?? queryBooks;
  const isLoading = !propBooks && queryLoading;

  // Don't render if not logged in or session is still loading (when propBooks is not provided)
  if (!propBooks && (status === 'loading' || !userId)) return null;

  // Don't render if loaded but no recommendations yet (new user / no history)
  if (!isLoading && (!books || books.length === 0)) return null;

  return (
    <section className='container py-6 pb-8 md:py-8 md:pb-10'>
      <div className='mb-5 flex items-end justify-between'>
        <div className='flex flex-col space-y-1.5'>
          <div className='flex items-center gap-2'>
            <Icon className='text-primary h-5 w-5' />
            <h2 className='from-primary to-primary/60 bg-gradient-to-br bg-clip-text text-3xl font-bold tracking-tight text-transparent'>
              {title || t(keys.recommendations.title)}
            </h2>
          </div>
          <p className='text-muted-foreground'>{subtitle || t(keys.recommendations.subtitle)}</p>
        </div>
      </div>

      {isLoading ? (
        <div className='flex gap-3 overflow-hidden py-3'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className='min-w-[200px] flex-1 space-y-3'>
              <Skeleton className='h-[280px] w-full rounded-xl' />
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
            </div>
          ))}
        </div>
      ) : (
        <div className='px-2 md:px-4'>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className='w-full'
          >
            <CarouselContent className='-ml-4 py-3 md:-ml-6 md:py-4'>
              {books!.slice(0, 10).map((book) => (
                <CarouselItem
                  key={book.id}
                  className='basis-1/2 py-2 pl-4 sm:basis-1/3 sm:pl-5 md:basis-1/4 md:py-3 md:pl-6 lg:basis-1/5'
                >
                  <BookGridItem book={book} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className='hidden md:block'>
              <CarouselPrevious className='-left-4' />
              <CarouselNext className='-right-4' />
            </div>
          </Carousel>
        </div>
      )}
    </section>
  );
};
