'use client';

import { useAuthors } from '@/hooks/data/useAuthor';
import { useLocale, KEYS } from '@/hooks/ui/useLocale';
import { Skeleton } from '@repo/ui/components/skeleton';
import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import { ArrowRight, Users2 } from 'lucide-react';
import { AppImage } from '@/components/app-image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/ui/components/carousel';

export const FeaturedAuthors = () => {
  const { t, keys } = useLocale('home');
  const { data: authorsResponse, isLoading } = useAuthors({
    limit: 15, // Increase limit for carousel
  });
  const authors = authorsResponse?.data;

  return (
    <section className='container py-12'>
      <div className='mb-8 flex items-end justify-between'>
        <div className='flex flex-col space-y-2'>
          <div className='flex items-center gap-2'>
            <Users2 className='h-5 w-5 text-primary' />
            <h2 className='text-3xl font-bold tracking-tight bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent'>
              {t(keys.featuredAuthors.title)}
            </h2>
          </div>
          <p className='text-muted-foreground'>{t(keys.featuredAuthors.subtitle)}</p>
        </div>
        <Button variant='ghost' className='text-primary font-semibold hover:bg-primary/5' asChild>
          <Link href='/authors'>
            {t(KEYS.common.actions.viewAll)}
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Carousel className='w-full'>
          <CarouselContent className='-ml-6'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CarouselItem key={i} className='pl-6 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6'>
                <div className='flex flex-col items-center space-y-3'>
                  <Skeleton className='h-24 w-24 rounded-full md:h-32 md:w-32' />
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-3 w-16' />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : authors && authors.length > 0 ? (
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className='w-full'
        >
          <CarouselContent className='-ml-6'>
            {authors.map((author) => (
              <CarouselItem key={author.id} className='pl-6 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6'>
                <Link
                  href={`/authors/${author.id}`}
                  className='group flex flex-col items-center text-center transition-all hover:-translate-y-1'
                >
                  <div className='relative h-24 w-24 overflow-hidden rounded-full ring-2 ring-transparent ring-offset-2 transition-all group-hover:ring-primary md:h-32 md:w-32'>
                    <AppImage
                      src={author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${author.name}`}
                      alt={author.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <h3 className='mt-4 font-semibold group-hover:text-primary line-clamp-1'>{author.name}</h3>
                  <p className='text-sm text-muted-foreground line-clamp-1'>
                    {author.nationality || t(KEYS.navigation.authors.label)}
                  </p>
                </Link>
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
          <p className='text-muted-foreground'>{t(keys.featuredAuthors.empty)}</p>
        </div>
      )}
    </section>
  );
};
