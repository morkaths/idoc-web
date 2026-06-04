'use client';

import Link from 'next/link';
import * as React from 'react';
import type { AuthorResponse } from '@/types';
import { useLocale } from '@/hooks/ui/useLocale';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/ui/components/carousel';
import { AppImage } from '@/components/app-image';

interface FeaturedAuthorsCarouselProps {
  authors: AuthorResponse[];
}

/**
 * Client component that displays featured authors in a Carousel.
 */
export const FeaturedAuthorsCarousel = ({ authors }: FeaturedAuthorsCarouselProps) => {
  const { t, keys } = useLocale('navigation');

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: authors.length > 6,
      }}
      className='w-full'
    >
      <CarouselContent className='-ml-6 py-6'>
        {authors.map((author) => (
          <CarouselItem
            key={author.id}
            className='basis-1/2 py-4 pl-6 sm:basis-1/3 md:basis-1/4 lg:basis-1/6'
          >
            <Link
              href={`/authors/${author.id}`}
              className='group flex flex-col items-center text-center transition-all hover:-translate-y-1'
            >
              <div className='group-hover:ring-primary relative h-24 w-24 rounded-full ring-2 ring-transparent ring-offset-2 transition-all md:h-32 md:w-32'>
                <div className='absolute inset-0 overflow-hidden rounded-full'>
                  <AppImage
                    src={
                      author.avatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${author.name}`
                    }
                    alt={author.name}
                    fill
                    className='object-cover'
                  />
                </div>
              </div>
              <h3 className='group-hover:text-primary mt-4 line-clamp-1 font-semibold'>
                {author.name}
              </h3>
              <p className='text-muted-foreground line-clamp-1 text-sm'>
                {author.nationality || t(keys.authors.label)}
              </p>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      {authors.length > 2 && (
        <div className='hidden md:block'>
          <CarouselPrevious className='-left-6' />
          <CarouselNext className='-right-6' />
        </div>
      )}
    </Carousel>
  );
};

export default FeaturedAuthorsCarousel;
