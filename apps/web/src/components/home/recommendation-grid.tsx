'use client';

import { useSession } from 'next-auth/react';
import { Sparkles, type LucideIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRecommendations } from '@/hooks/data/useRecommendation';
import { useLocale, KEYS } from '@/hooks/ui/useLocale';
import type { RecommendedBookResponse } from '@/types';
import { Skeleton } from '@repo/ui/components/skeleton';
import { BookGridItem } from '@/components/book/book-grid-item';
import { Button } from '@repo/ui/components/button';
import { BookmarkProvider } from '@/components/book/bookmark-provider';

interface RecommendationGridProps {
  books?: RecommendedBookResponse[];
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  limit?: number;
}

export const RecommendationGrid = ({
  books: propBooks,
  title,
  subtitle,
  icon: Icon = Sparkles,
  limit = 10,
}: RecommendationGridProps) => {
  const { t, keys } = useLocale('home');
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { data: queryBooks, isLoading: queryLoading } = useRecommendations(userId, {
    enabled: !!userId && !propBooks,
  });
  const books = propBooks ?? queryBooks;
  const isLoading = !propBooks && queryLoading;

  // Don't render if not logged in or session is still loading (when propBooks is not provided)
  if (!propBooks && (status === 'loading' || !userId)) {
    return null;
  }

  // Don't render if loaded but no recommendations yet (new user / no history)
  if (!isLoading && (!books || books.length === 0)) {
    return null;
  }

  return (
    <section className='container py-5'>
      <div className='mb-8 flex items-end justify-between'>
        <div className='flex flex-col space-y-2'>
          <div className='flex items-center gap-2'>
            <Icon className='text-primary h-5 w-5' />
            <h2 className='from-primary to-primary/60 bg-gradient-to-br bg-clip-text text-3xl font-bold tracking-tight text-transparent'>
              {title || t(keys.recommendations.title)}
            </h2>
          </div>
          <p className='text-muted-foreground'>{subtitle || t(keys.recommendations.subtitle)}</p>
        </div>
        <Button variant='ghost' className='text-primary hover:bg-primary/5 font-semibold' asChild>
          <Link href='/discover'>
            {t(KEYS.common.actions.viewAll)}
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-2 items-start justify-items-center gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className='w-full max-w-[200px] space-y-3'>
              <Skeleton className='h-[280px] w-full rounded-xl' />
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
            </div>
          ))}
        </div>
      ) : (
        <BookmarkProvider>
          <div className='grid grid-cols-2 items-start justify-items-center gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {books!.slice(0, limit).map((book) => (
              <div key={book.id} className='w-full max-w-[200px]'>
                <BookGridItem book={book} />
              </div>
            ))}
          </div>
        </BookmarkProvider>
      )}
    </section>
  );
};
