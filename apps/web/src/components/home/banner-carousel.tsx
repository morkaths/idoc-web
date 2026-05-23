'use client';

import Link from 'next/link';
import * as React from 'react';
import { isValidCover } from '@/lib/book-utils';
import { cn } from '@repo/ui/lib/utils';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Trophy } from 'lucide-react';
import { useBooks } from '@/hooks/data/useBook';
import { useLocale } from '@/hooks/ui/useLocale';
import { Badge } from '@repo/ui/components/badge';
import BookCover3d from '@repo/ui/components/book-cover-3d';
import { Button } from '@repo/ui/components/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@repo/ui/components/carousel';
import { Skeleton } from '@repo/ui/components/skeleton';

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
        <Skeleton className='h-[400px] w-full rounded-md md:h-[500px]' />
      </div>
    );
  }

  if (featuredBooks.length === 0) return null;

  return (
    <section className='relative w-full overflow-hidden py-4 pb-12 md:py-8 md:pb-20 lg:py-10'>
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
        <CarouselContent className='-ml-2 py-4 md:-ml-4 lg:-ml-6'>
          {featuredBooks.map((book, index) => {
            return (
              <CarouselItem
                key={book.id}
                className='basis-[94%] py-4 pl-4 md:basis-[85%] md:pl-8 lg:basis-[75%] xl:basis-[65%]'
              >
                <div
                  className={cn(
                    'border-primary/20 bg-card relative h-[350px] w-full rounded-md border-2 transition-all duration-1000 ease-in-out select-none md:h-[450px] lg:h-[500px]',
                    current === index
                      ? 'z-20 translate-y-0 scale-100 opacity-100 shadow-sm'
                      : 'z-0 translate-y-8 scale-[0.85] opacity-40 blur-[2px] contrast-75 grayscale'
                  )}
                >
                  <div className='pointer-events-none absolute inset-0 overflow-hidden rounded-md'>
                    {/* Subtle Background Pattern */}
                    <div
                      className='absolute inset-0 opacity-[0.03] dark:opacity-[0.05]'
                      style={{
                        backgroundImage:
                          'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                        backgroundSize: '40px 40px',
                      }}
                    />
                    <div className='from-primary/5 absolute inset-0 bg-gradient-to-br via-transparent to-transparent' />
                  </div>

                  {/* Content */}
                  <div className='absolute inset-0 z-20 flex flex-col justify-center p-8 md:p-12 lg:p-20'>
                    <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto]'>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={current === index ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className='flex flex-col items-start space-y-4 md:space-y-6'
                      >
                        <div className='flex items-center gap-3'>
                          <Badge className='bg-primary text-primary-foreground flex items-center gap-1.5 rounded-full border-none px-4 py-1.5 text-[10px] font-black tracking-widest uppercase md:text-xs'>
                            <Trophy className='h-3.5 w-3.5 fill-current' />
                            TOP {index + 1}
                          </Badge>
                          <div className='bg-primary/5 border-primary/10 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-amber-500'>
                            <div className='flex items-center -space-x-0.5'>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    'h-3 w-3 md:h-3.5 md:w-3.5',
                                    i < Math.round(book.rating || 0)
                                      ? 'fill-current'
                                      : 'text-muted-foreground/30'
                                  )}
                                />
                              ))}
                            </div>
                            <span className='text-foreground ml-1 text-xs font-bold md:text-sm'>
                              {(book.rating || 0).toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <div className='space-y-2 md:space-y-4'>
                          <h2 className='from-foreground via-foreground to-foreground/70 line-clamp-2 bg-gradient-to-br bg-clip-text text-3xl leading-[1.1] font-black tracking-tight text-transparent md:text-5xl lg:text-7xl'>
                            {book.title}
                          </h2>
                          <p className='text-muted-foreground line-clamp-2 max-w-xl text-sm leading-relaxed font-medium md:line-clamp-3 md:text-xl'>
                            {book.description || t(keys.banner.descriptionFallback)}
                          </p>
                        </div>

                        <div className='flex flex-wrap items-center gap-6 pt-4'>
                          <Button
                            size='lg'
                            className='group h-12 rounded-xl px-8 text-sm font-bold transition-all md:h-14 md:px-12 md:text-base'
                            asChild
                          >
                            <Link href={`/books/${book.id}`}>
                              {t(keys.actions.readNow)}
                              <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 md:h-5 md:w-5' />
                            </Link>
                          </Button>
                          <div className='flex flex-col'>
                            <span className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                              {t(keys.banner.author)}
                            </span>
                            <span className='text-foreground line-clamp-1 text-sm font-bold md:text-lg'>
                              {book.authors?.[0]?.name || t(keys.banner.unknownAuthor)}
                            </span>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={
                          current === index ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
                        }
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className='group relative hidden lg:block'
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
      <div className='mt-6 flex items-center justify-center gap-3 md:mt-10'>
        {featuredBooks.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              'ring-primary h-2 rounded-full ring-offset-white transition-all duration-500 outline-none focus-visible:ring-2 dark:ring-offset-slate-950',
              current === index
                ? 'bg-primary w-10 md:w-14'
                : 'dark:bg-primary/20 dark:hover:bg-primary/40 bg-primary/10 hover:bg-primary/20 w-2'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
