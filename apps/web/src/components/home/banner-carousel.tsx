'use client';

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from '@repo/ui/components/carousel';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import { cn } from '@repo/ui/lib/utils';
import { Skeleton } from '@repo/ui/components/skeleton';
import { ArrowRight, Star, Trophy } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { useBooks } from '@/hooks/data/useBook';
import BookCover3d from '@repo/ui/components/book-cover-3d';
import { useLocale } from '@/hooks/ui/useLocale';
import { isValidCover } from '@/lib/book-utils';

export const BannerCarousel = () => {
  const { t, keys } = useLocale('home');
  const { data: booksResponse, isLoading } = useBooks();
  const books = booksResponse?.data;
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const featuredBooks = books?.slice(0, 5) ?? [];

  if (isLoading) {
    return (
      <div className='container py-8'>
        <Skeleton className='h-[400px] md:h-[500px] w-full rounded-md' />
      </div>
    );
  }

  if (featuredBooks.length === 0) return null;

  return (
    <section className='relative w-full overflow-hidden py-4 md:py-8 lg:py-10 pb-12 md:pb-20'>
      <Carousel
        setApi={setApi}
        opts={{
          align: 'center',
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
        className='w-full'
      >
        <CarouselContent className='-ml-2 md:-ml-4 lg:-ml-6 py-4'>
          {featuredBooks.map((book, index) => {
            return (
              <CarouselItem
                key={book.id}
                className='pl-4 md:pl-8 basis-[94%] md:basis-[85%] lg:basis-[75%] xl:basis-[65%] py-4'
              >
                <div className={cn(
                  'relative h-[350px] md:h-[450px] lg:h-[500px] w-full transition-all duration-1000 ease-in-out select-none rounded-md border-2 border-primary/20 bg-card',
                  current === index
                    ? 'scale-100 translate-y-0 opacity-100 z-20 shadow-sm'
                    : 'scale-[0.85] translate-y-8 opacity-40 blur-[2px] z-0 grayscale contrast-75'
                )}>
                  <div className='absolute inset-0 rounded-md overflow-hidden pointer-events-none'>
                    {/* Subtle Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
                         style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} 
                    />
                    <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent' />
                  </div>

                  {/* Content */}
                  <div className='absolute inset-0 flex flex-col justify-center p-8 md:p-12 lg:p-20 z-20'>
                    <div className='grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center'>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={current === index ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className='flex flex-col items-start space-y-4 md:space-y-6'
                      >
                        <div className='flex items-center gap-3'>
                          <Badge className='bg-primary text-primary-foreground border-none px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-1.5'>
                            <Trophy className='h-3.5 w-3.5 fill-current' />
                            TOP {index + 1}
                          </Badge>
                          <div className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-amber-500'>
                            <div className='flex items-center -space-x-0.5'>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    'h-3 w-3 md:h-3.5 md:w-3.5',
                                    i < Math.round(book.rating || 0) ? 'fill-current' : 'text-muted-foreground/30'
                                  )}
                                />
                              ))}
                            </div>
                            <span className='text-xs md:text-sm font-bold text-foreground ml-1'>
                              {(book.rating || 0).toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <div className='space-y-2 md:space-y-4'>
                          <h2 className='text-3xl md:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight line-clamp-2 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent'>
                            {book.title}
                          </h2>
                          <p className='text-sm md:text-xl text-muted-foreground line-clamp-2 md:line-clamp-3 font-medium max-w-xl leading-relaxed'>
                            {book.description || t(keys.banner.descriptionFallback)}
                          </p>
                        </div>

                        <div className='flex flex-wrap items-center gap-6 pt-4'>
                          <Button size='lg' className='rounded-xl h-12 md:h-14 px-8 md:px-12 font-bold group text-sm md:text-base transition-all' asChild>
                            <Link href={`/books/${book.id}`}>
                              {t(keys.actions.readNow)}
                              <ArrowRight className='ml-2 h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1' />
                            </Link>
                          </Button>
                          <div className='flex flex-col'>
                            <span className='text-[10px] uppercase tracking-widest text-muted-foreground font-bold'>
                              {t(keys.banner.author)}
                            </span>
                            <span className='text-sm md:text-lg font-bold text-foreground line-clamp-1'>
                              {book.authors?.[0]?.name || t(keys.banner.unknownAuthor)}
                            </span>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={current === index ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className='hidden lg:block relative group'
                      >
                        <BookCover3d
                          src={isValidCover(book.coverUrl) ? book.coverUrl : undefined}
                          title={book.title}
                          width={200}
                          className='drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]'
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Pagination Indicators */}
      <div className='mt-6 md:mt-10 flex justify-center items-center gap-3'>
        {featuredBooks.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-500 outline-none focus-visible:ring-2 ring-primary dark:ring-offset-slate-950 ring-offset-white',
              current === index
                ? 'w-10 md:w-14 bg-primary'
                : 'w-2 dark:bg-primary/20 dark:hover:bg-primary/40 bg-primary/10 hover:bg-primary/20'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
