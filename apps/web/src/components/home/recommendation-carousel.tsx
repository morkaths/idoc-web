'use client';

import { useLocale } from '@/hooks/ui/useLocale';
import { useSession } from 'next-auth/react';
import { useRecommendations } from '@/hooks/data/useRecommendation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/ui/components/carousel';
import { BookGridItem } from '@/components/book/book-grid-item';
import { Skeleton } from '@repo/ui/components/skeleton';
import { Heart } from 'lucide-react';

export const RecommendationCarousel = () => {
  const { t, keys } = useLocale('home');
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: books, isLoading } = useRecommendations(userId, {
    enabled: !!userId,
  });

  if (!userId) return null;

  return (
    <section className='container py-12'>
      <div className='mb-8 flex items-end justify-between'>
        <div className='flex flex-col space-y-2'>
          <div className='flex items-center gap-2'>
            <Heart className='h-5 w-5 text-primary' />
            <h2 className='text-3xl font-bold tracking-tight bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent'>
              {t(keys.recommendations.title)}
            </h2>
          </div>
          <p className='text-muted-foreground'>{t(keys.recommendations.subtitle)}</p>
        </div>
      </div>

      {isLoading ? (
        <div className='flex gap-4 overflow-hidden'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className='min-w-[200px] flex-1 space-y-3'>
              <Skeleton className='h-[280px] w-full rounded-xl' />
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
            </div>
          ))}
        </div>
      ) : books && books.length > 0 ? (
        <div className='px-12'>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className='w-full'
          >
            <CarouselContent className='-ml-4'>
              {books.slice(0, 10).map((book) => (
                <CarouselItem key={book.id} className='pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5'>
                  <BookGridItem book={book} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      ) : (
        <div className='flex h-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed gap-2'>
          <p className='text-lg font-medium text-muted-foreground'>{t(keys.recommendations.empty)}</p>
          <p className='text-sm text-muted-foreground'>{t(keys.recommendations.startBookmarking)}</p>
        </div>
      )}
    </section>
  );
};
