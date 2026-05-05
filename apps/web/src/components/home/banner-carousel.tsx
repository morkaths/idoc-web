'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from '@repo/ui/components/carousel';
import { AppImage } from '@/components/app-image';
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

export const BannerCarousel = () => {
  const t = useTranslations('home');
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
        <Skeleton className='h-[400px] md:h-[500px] w-full rounded-[2rem]' />
      </div>
    );
  }

  if (featuredBooks.length === 0) return null;

  return (
    <section className='relative w-full overflow-hidden py-4 md:py-8 lg:py-10'>
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
        <CarouselContent className='-ml-4 md:-ml-8'>
          {featuredBooks.map((book, index) => (
            <CarouselItem
              key={book.id}
              className='pl-4 md:pl-8 basis-[94%] md:basis-[85%] lg:basis-[75%] xl:basis-[65%]'
            >
              <div className={cn(
                'relative h-[350px] md:h-[450px] lg:h-[500px] w-full overflow-hidden rounded-[3rem] transition-all duration-1000 ease-in-out select-none',
                current === index
                  ? 'scale-100 translate-y-0 opacity-100 shadow-[0_40px_80px_-15px_rgba(var(--primary-rgb),0.3),0_20px_40px_-10px_rgba(0,0,0,0.5)] z-20 ring-2 ring-white/30'
                  : 'scale-[0.85] translate-y-8 opacity-40 blur-[2px] z-0 grayscale contrast-75'
              )}>
                {/* Background Image with Overlay */}
                <div className='absolute inset-0'>
                  <AppImage
                    src={book.coverUrl || '/placeholder-banner.jpg'}
                    alt={book.title}
                    fill
                    className='object-cover transition-transform duration-[10000ms] ease-linear scale-100 group-hover:scale-110'
                    priority={index === 0}
                  />
                  <div className='absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-transparent z-10' />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10' />
                  <div className='absolute inset-0 bg-primary/5 mix-blend-overlay z-10' />
                </div>

                {/* Content */}
                <div className='absolute inset-0 flex flex-col justify-center p-8 md:p-12 lg:p-20 z-20'>
                  <div className='grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center'>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={current === index ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className='flex flex-col items-start space-y-4 md:space-y-6 text-white'
                    >
                      <div className='flex items-center gap-3'>
                        <Badge className='bg-primary text-primary-foreground border-none px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-primary/20'>
                          <Trophy className='h-3.5 w-3.5 fill-current' />
                          TOP {index + 1}
                        </Badge>
                        <div className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-yellow-400 shadow-xl'>
                          <div className='flex items-center -space-x-0.5'>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'h-3 w-3 md:h-3.5 md:w-3.5',
                                  i < Math.round(book.rating || 0) ? 'fill-current' : 'text-white/20'
                                )}
                              />
                            ))}
                          </div>
                          <span className='text-xs md:text-sm font-bold text-white ml-1'>
                            {(book.rating || 0).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <div className='space-y-2 md:space-y-4'>
                        <h2 className='text-3xl md:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight drop-shadow-2xl line-clamp-2 bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-transparent'>
                          {book.title}
                        </h2>
                        <p className='text-sm md:text-xl text-white/70 line-clamp-2 md:line-clamp-3 font-medium max-w-xl leading-relaxed'>
                          {book.description || t('banner.descriptionFallback')}
                        </p>
                      </div>

                      <div className='flex flex-wrap items-center gap-6 pt-4'>
                        <Button size='lg' className='rounded-full h-12 md:h-14 px-8 md:px-12 bg-white text-black hover:bg-white/90 font-bold group text-sm md:text-base shadow-2xl transition-all hover:scale-105 active:scale-95' asChild>
                          <Link href={`/books/${book.id}`}>
                            {t('banner.readNow')}
                            <ArrowRight className='ml-2 h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1' />
                          </Link>
                        </Button>
                        <div className='flex flex-col'>
                          <span className='text-[10px] uppercase tracking-widest text-white/40 font-bold'>{t('banner.author')}</span>
                          <span className='text-sm md:text-lg font-bold text-white/90 line-clamp-1'>{book.authors?.[0]?.name || t('banner.unknownAuthor')}</span>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                      animate={current === index ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.8, rotate: -5 }}
                      transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
                      className='hidden lg:block relative group'
                    >
                      <BookCover3d
                        src={book.coverUrl || '/placeholder-book.jpg'}
                        title={book.title}
                        width={240}
                        className='drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)]'
                      />
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className='absolute -top-6 -right-6 h-20 w-20 rounded-full bg-primary/20 backdrop-blur-3xl -z-10'
                      />
                      <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className='absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/10 backdrop-blur-2xl -z-10'
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Pagination Indicators */}
      <div className='mt-6 md:mt-10 flex justify-center items-center gap-3'>
        {featuredBooks.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-500 outline-none focus-visible:ring-2 ring-primary ring-offset-2',
              current === index
                ? 'w-10 md:w-14 bg-primary'
                : 'w-2 bg-primary/20 hover:bg-primary/40'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
