'use client';

import { useSession } from 'next-auth/react';
import { Heart } from 'lucide-react';
import { useRecommendations } from '@/hooks/data/useRecommendation';
import { useLocale } from '@/hooks/ui/useLocale';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/ui/components/carousel';
import { Skeleton } from '@repo/ui/components/skeleton';
import { BookGridItem } from '@/components/book/book-grid-item';

export const RecommendationCarousel = () => {
  const { t, keys } = useLocale('home');
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { data: books, isLoading } = useRecommendations(userId, {
    enabled: !!userId,
  });

  // Don't render if not logged in or session is still loading
  if (status === 'loading' || !userId) return null;

  // Don't render if loaded but no recommendations yet (new user / no history)
  if (!isLoading && (!books || books.length === 0)) return null;

  return (
    <section className='container py-12 pb-20'>
      <div className='mb-8 flex items-end justify-between'>
        <div className='flex flex-col space-y-2'>
          <div className='flex items-center gap-2'>
            <Heart className='text-primary h-5 w-5' />
            <h2 className='from-primary to-primary/60 bg-gradient-to-br bg-clip-text text-3xl font-bold tracking-tight text-transparent'>
              {t(keys.recommendations.title)}
            </h2>
          </div>
          <p className='text-muted-foreground'>{t(keys.recommendations.subtitle)}</p>
        </div>
      </div>

      {isLoading ? (
        <div className='flex gap-4 overflow-hidden py-6'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className='min-w-[200px] flex-1 space-y-3'>
              <Skeleton className='h-[280px] w-full rounded-xl' />
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
            </div>
          ))}
        </div>
      ) : (
        <div className='px-6'>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className='w-full'
          >
            <CarouselContent className='-ml-6 py-6'>
              {books!.slice(0, 10).map((book) => (
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
        </div>
      )}
    </section>
  );
};
