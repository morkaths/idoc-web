'use client';

import { useSession } from 'next-auth/react';
import { RecommendationStrategy } from '@repo/types';
import { useFeed } from '@/hooks/data/useRecommendation';
import { BannerCarousel } from '@/components/home/banner-carousel';
import { RecommendationCarousel } from '@/components/home/recommendation-carousel';
import { RecommendationGrid } from '@/components/home/recommendation-grid';
import { NewArrivals } from '@/components/home/new-arrivals';
import { CategoriesGrid } from '@/components/home/categories-grid';
import { FeaturedAuthors } from '@/components/home/featured-authors';
import { StatsSection } from '@/components/home/stats-section';
import { CTASection } from '@/components/home/cta-section';
import { Skeleton } from '@repo/ui/components/skeleton';
import { useLocale, KEYS } from '@/hooks/ui/useLocale';
import { Sparkles, Users } from 'lucide-react';

/**
 * Reusable skeleton loader for a book carousel section.
 */
const CarouselSkeleton = () => {
  return (
    <div className='container py-12 pb-20'>
      <div className='mb-8 flex flex-col space-y-2'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-4 w-64' />
      </div>
      <div className='flex gap-4 overflow-hidden py-6'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className='min-w-[200px] flex-1 space-y-3'>
            <Skeleton className='h-[280px] w-full rounded-xl' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Reusable skeleton loader for a book grid section.
 */
const GridSkeleton = () => {
  return (
    <div className='container py-12 pb-20'>
      <div className='mb-8 flex items-end justify-between'>
        <div className='flex flex-col space-y-2'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-64' />
        </div>
        <Skeleton className='h-10 w-24' />
      </div>
      <div className='grid grid-cols-2 items-start justify-items-center gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className='w-full max-w-[200px] space-y-3'>
            <Skeleton className='h-[280px] w-full rounded-xl' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Unified skeleton loader for the entire Home page layout.
 * Prevents layout shifting by matching the structure of main components.
 */
const HomeSkeleton = () => {
  return (
    <div className='flex flex-col pb-20 space-y-12 md:space-y-24'>
      {/* Banner Skeleton */}
      <div className='container py-8'>
        <Skeleton className='h-[400px] w-full rounded-md md:h-[500px]' />
      </div>

      {/* Recommendations Carousel & Grid Skeletons */}
      <CarouselSkeleton />
      <GridSkeleton />
      <GridSkeleton />
    </div>
  );
};

export function HomeView() {
  const { data: session, status } = useSession();
  const { t } = useLocale('home');
  const userId = session?.user?.id || 'anonymous';

  // Construct request object once authentication state is resolved
  const feedRequest = status !== 'loading' ? {
    userId,
    sections: [
      {
        id: 'banner',
        title: 'Top Featured',
        strategy: RecommendationStrategy.POPULARITY,
        limit: 5,
      },
      {
        id: 'personal',
        title: 'For You',
        strategy: RecommendationStrategy.HYBRID,
        limit: 10,
      },
      {
        id: 'cbf',
        title: 'Based on Your Interests',
        strategy: RecommendationStrategy.CBF,
        limit: 10,
      },
      {
        id: 'ibcf',
        title: 'Readers Like You Enjoyed',
        strategy: RecommendationStrategy.IBCF,
        limit: 10,
      },
    ],
  } : undefined;

  const { data: feedData, isLoading } = useFeed(feedRequest, {
    enabled: status !== 'loading',
  });

  if (isLoading || status === 'loading') {
    return <HomeSkeleton />;
  }

  const bannerBooks = feedData?.feedLayout?.find((s) => s.id === 'banner')?.content || [];
  const personalBooks = feedData?.feedLayout?.find((s) => s.id === 'personal')?.content || [];
  const cbfBooks = feedData?.feedLayout?.find((s) => s.id === 'cbf')?.content || [];
  const ibcfBooks = feedData?.feedLayout?.find((s) => s.id === 'ibcf')?.content || [];

  return (
    <div className='flex flex-col pb-20'>
      <BannerCarousel books={bannerBooks} />
      <div className='space-y-12 md:space-y-24'>
        {personalBooks.length > 0 && (
          <RecommendationCarousel books={personalBooks} />
        )}

        {cbfBooks.length > 0 && (
          <RecommendationGrid
            books={cbfBooks}
            title={t(KEYS.discover.sections.interests.title)}
            subtitle={t(KEYS.discover.sections.interests.subtitle)}
            icon={Sparkles}
          />
        )}

        {ibcfBooks.length > 0 && (
          <RecommendationGrid
            books={ibcfBooks}
            title={t(KEYS.discover.sections.similarReaders.title)}
            subtitle={t(KEYS.discover.sections.similarReaders.subtitle)}
            icon={Users}
          />
        )}

        <NewArrivals />
        <CategoriesGrid />
        <FeaturedAuthors />
        <StatsSection />
        <CTASection />
      </div>
    </div>
  );
}
