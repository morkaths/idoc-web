'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@repo/ui/components/button';
import { Badge } from '@repo/ui/components/badge';
import { ArrowRight, Search, BookOpen, Star } from 'lucide-react';
import Link from 'next/link';
import { usePopularBooks } from '@/hooks/data/useRecommendation';
import { Skeleton } from '@repo/ui/components/skeleton';
import { AppImage } from '@/components/app-image';
import { HOME_STATS } from './data/home-data';

export const HomeHero = () => {
  const t = useTranslations('home.hero');
  const { data: popularBooks, isLoading } = usePopularBooks();

  // Take the most popular book for the featured display
  const featuredBook = popularBooks?.[0];

  return (
    <section className='relative overflow-hidden bg-background pt-16 pb-20 lg:pt-24 lg:pb-32'>
      {/* Background Ornaments */}
      <div className='absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-32'>
        <svg
          viewBox='0 0 1024 1024'
          className='absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0'
          aria-hidden='true'
        >
          <circle
            cx='512'
            cy='512'
            r='512'
            fill='url(#759c1415-0410-454c-8f7c-9a820de03641)'
            fillOpacity='0.7'
          />
          <defs>
            <radialGradient id='759c1415-0410-454c-8f7c-9a820de03641'>
              <stop stopColor='var(--primary)' />
              <stop offset='1' stopColor='var(--primary-foreground)' />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className='container relative z-10'>
        <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
          <div className='flex flex-col items-start space-y-8'>
            <Badge variant='outline' className='rounded-full border-primary/20 bg-primary/5 px-4 py-1 text-primary'>
              <span className='mr-2 flex h-2 w-2 rounded-full bg-primary animate-pulse' />
              {t('subtitle')}
            </Badge>

            <h1 className='text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:leading-[1.1]'>
              {t('title')}
            </h1>

            <p className='max-w-xl text-lg text-muted-foreground'>
              {t('subtitle')}
            </p>

            <div className='flex w-full max-w-md flex-col gap-4 sm:flex-row'>
              <Button size='lg' className='rounded-full px-8 font-semibold shadow-lg shadow-primary/25' asChild>
                <Link href='/catalog'>
                  {t('action')} <ArrowRight className='ml-2 h-5 w-5' />
                </Link>
              </Button>
              <Button variant='outline' size='lg' className='rounded-full px-8' asChild>
                <Link href='/search'>
                  <Search className='mr-2 h-5 w-5' /> {t('searchBooks')}
                </Link>
              </Button>
            </div>

            <div className='flex items-center gap-6 pt-4'>
              <div className='flex -space-x-3'>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className='h-10 w-10 rounded-full border-2 border-background bg-muted'
                    style={{
                      backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`,
                      backgroundSize: 'cover',
                    }}
                  />
                ))}
                <div className='flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-bold text-primary-foreground'>
                  +1k
                </div>
              </div>
              <p className='text-sm text-muted-foreground'>
                {t('joinedBy', { count: HOME_STATS.TOTAL_READERS })}
              </p>
            </div>
          </div>

          <div className='relative lg:ml-auto'>
            {isLoading ? (
              <div className='relative h-[450px] w-[300px] overflow-hidden rounded-2xl border bg-muted p-4 shadow-2xl'>
                <Skeleton className='h-full w-full rounded-xl' />
              </div>
            ) : featuredBook ? (
              <div className='group relative transition-all duration-500 hover:-translate-y-2'>
                {/* Book Card Display */}
                <div className='relative z-10 h-[450px] w-[300px] overflow-hidden rounded-2xl border bg-card shadow-2xl transition-all duration-500 group-hover:shadow-primary/20'>
                  <AppImage
                    src={featuredBook.coverUrl || '/placeholder-book.jpg'}
                    alt={featuredBook.title}
                    fill
                    className='object-cover transition-transform duration-700 group-hover:scale-110'
                    priority
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white'>
                    <Badge className='mb-2 w-fit bg-primary/90 hover:bg-primary'>
                      <Star className='mr-1 h-3 w-3 fill-current' />
                      {featuredBook.weightedRating?.toFixed(1) || '4.5'}
                    </Badge>
                    <h3 className='text-xl font-bold line-clamp-2'>{featuredBook.title}</h3>
                    <p className='text-sm opacity-90'>{featuredBook.authors?.[0]?.name || t('unknownAuthor')}</p>
                    <Button variant='link' className='mt-4 p-0 text-white hover:text-primary transition-colors' asChild>
                      <Link href={`/books/${featuredBook.id}`}>
                        {t('readPreview')} <ArrowRight className='ml-2 h-4 w-4' />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className='absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-2xl bg-primary/10 blur-xl' />
                <div className='absolute -top-6 -left-6 -z-10 h-full w-full rounded-2xl bg-secondary/10 blur-xl' />
                
                {/* Floating Badge */}
                <div className='absolute -right-12 top-10 z-20 hidden animate-bounce rounded-xl bg-background p-4 shadow-xl lg:block'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600'>
                      <BookOpen className='h-6 w-6' />
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground'>{t('todaysPick')}</p>
                      <p className='text-sm font-bold'>{t('trendingNow')}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='h-[450px] w-[300px] rounded-2xl bg-muted border flex items-center justify-center'>
                <p className='text-muted-foreground'>{t('noFeaturedBooks')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
