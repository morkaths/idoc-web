'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { useLocale as useLocaleIntl } from 'next-intl';
import type { CategoryResponse, CategoryTranslationResponse } from '@/types';
import { RecommendationStrategy, FilterOperator, SortDirection } from '@repo/types';
import { BookOpen } from 'lucide-react';
import { useBooksByIds, useSearchBooks } from '@/hooks/data/useBook';
import { useBorrowHistory } from '@/hooks/data/useBorrow';
import { useCategories } from '@/hooks/data/useCategory';
import { useFeed } from '@/hooks/data/useRecommendation';
import { useLocale } from '@/hooks/ui/useLocale';
import { Skeleton } from '@repo/ui/components/skeleton';
import { BannerCarousel } from '@/components/home/banner-carousel';
import { CategoriesGrid } from '@/components/home/categories-grid';
import { CTASection } from '@/components/home/cta-section';
import { FeaturedAuthors } from '@/components/home/featured-authors';
import { NewArrivals } from '@/components/home/new-arrivals';
import { RecommendationCarousel } from '@/components/home/recommendation-carousel';
import { RecommendationGrid } from '@/components/home/recommendation-grid';
import { StatsSection } from '@/components/home/stats-section';

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
    <div className='flex flex-col space-y-12 pb-20 md:space-y-24'>
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
  const { t: tDiscover, keys: discoverKeys } = useLocale('discover');
  const locale = useLocaleIntl();
  const userId = session?.user?.id || 'anonymous';

  // Construct request object once authentication state is resolved
  const feedRequest =
    status !== 'loading'
      ? {
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
          ],
        }
      : undefined;

  const { data: feedData, isLoading: feedLoading } = useFeed(feedRequest, {
    enabled: status !== 'loading',
  });

  // Fetch borrow history if user is authenticated
  const { data: borrowHistoryData, isLoading: borrowHistoryLoading } = useBorrowHistory(
    { limit: 10 },
    { enabled: status === 'authenticated' && userId !== 'anonymous' }
  );

  const borrowedBookIds = React.useMemo(() => {
    return borrowHistoryData?.data?.map((loan) => loan.book.id) ?? [];
  }, [borrowHistoryData?.data]);

  // Fetch full books to get categories
  const { data: fullBorrowedBooks, isLoading: isBooksLoading } = useBooksByIds(
    borrowedBookIds,
    status === 'authenticated' && borrowedBookIds.length > 0
  );

  // Fetch all categories as fallback
  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories({
    limit: 20,
  });

  // Calculate recommended categories based on borrow history frequency
  const recommendedCategories = React.useMemo(() => {
    if (!fullBorrowedBooks || fullBorrowedBooks.length === 0) return [];

    const freq: Record<string, { count: number; category: CategoryResponse }> = {};

    fullBorrowedBooks.forEach((book) => {
      book.categories?.forEach((cat) => {
        if (!freq[cat.id]) {
          freq[cat.id] = { count: 0, category: cat };
        }
        const item = freq[cat.id];
        if (item) {
          item.count += 1;
        }
      });
    });

    const sorted = Object.values(freq).sort((a, b) => b.count - a.count);
    return sorted.map((item) => item.category);
  }, [fullBorrowedBooks]);

  // Resolve to exactly 2 categories (using fallbacks if needed)
  const resolvedRecommendedCategories = React.useMemo(() => {
    const list = [...recommendedCategories];

    if (list.length >= 2) {
      return list.slice(0, 2);
    }

    const existingIds = new Set(list.map((c) => c.id));
    const allCategories = categoriesResponse?.data ?? [];

    for (const cat of allCategories) {
      if (list.length >= 2) break;
      if (!existingIds.has(cat.id)) {
        list.push(cat);
        existingIds.add(cat.id);
      }
    }

    return list.slice(0, 2);
  }, [recommendedCategories, categoriesResponse?.data]);

  // Query books for the resolved categories
  const cat1 = resolvedRecommendedCategories[0];
  const cat2 = resolvedRecommendedCategories[1];

  const { data: cat1Data, isLoading: isCat1Loading } = useSearchBooks(
    {
      limit: 10,
      filters: cat1
        ? [
            {
              field: 'categories.id',
              value: [cat1.id],
              operator: FilterOperator.IN,
            },
          ]
        : [],
      sorts: [{ field: 'totalBorrows', direction: SortDirection.DESC }],
    },
    {
      enabled: !!cat1,
    }
  );

  const { data: cat2Data, isLoading: isCat2Loading } = useSearchBooks(
    {
      limit: 10,
      filters: cat2
        ? [
            {
              field: 'categories.id',
              value: [cat2.id],
              operator: FilterOperator.IN,
            },
          ]
        : [],
      sorts: [{ field: 'totalBorrows', direction: SortDirection.DESC }],
    },
    {
      enabled: !!cat2,
    }
  );

  const cat1Books = React.useMemo(() => {
    return (cat1Data?.data ?? []).map((book) => ({
      ...book,
      strategy: RecommendationStrategy.HYBRID,
    }));
  }, [cat1Data?.data]);

  const cat2Books = React.useMemo(() => {
    return (cat2Data?.data ?? []).map((book) => ({
      ...book,
      strategy: RecommendationStrategy.HYBRID,
    }));
  }, [cat2Data?.data]);

  // Determine title and subtitle based on whether it is history-based or fallback
  const getCategoryTitleAndSubtitle = React.useCallback(
    (category: CategoryResponse) => {
      const translation =
        category.translations?.find((tr: CategoryTranslationResponse) => tr.lang === locale) ||
        category.translations?.[0];
      const categoryName = translation?.name || category.slug || 'Unnamed';
      const isHistoryBased = recommendedCategories.some((c) => c.id === category.id);

      const title = isHistoryBased
        ? tDiscover(discoverKeys.sections.becauseYouRead.title, { category: categoryName })
        : categoryName;

      const subtitle = isHistoryBased
        ? tDiscover(discoverKeys.sections.becauseYouRead.subtitle)
        : translation?.description;

      return { title, subtitle };
    },
    [locale, recommendedCategories, tDiscover, discoverKeys.sections.becauseYouRead]
  );

  const isFeedLoading = feedLoading || status === 'loading';
  const isBorrowHistoryLoading = borrowHistoryLoading || isBooksLoading;
  const isCategoriesLoading = categoriesLoading || isCat1Loading || isCat2Loading;

  const pageLoading =
    isFeedLoading || (status === 'authenticated' && isBorrowHistoryLoading) || isCategoriesLoading;

  if (pageLoading) {
    return <HomeSkeleton />;
  }

  const bannerBooks = feedData?.feedLayout?.find((s) => s.id === 'banner')?.content || [];
  const personalBooks = feedData?.feedLayout?.find((s) => s.id === 'personal')?.content || [];

  return (
    <div className='flex flex-col pb-20'>
      <BannerCarousel books={bannerBooks} />
      <div className='space-y-12 md:space-y-24'>
        {personalBooks.length > 0 && <RecommendationCarousel books={personalBooks} />}

        {cat1 && cat1Books.length > 0 && (
          <RecommendationGrid
            books={cat1Books}
            title={getCategoryTitleAndSubtitle(cat1).title}
            subtitle={getCategoryTitleAndSubtitle(cat1).subtitle}
            icon={BookOpen}
          />
        )}

        {cat2 && cat2Books.length > 0 && (
          <RecommendationGrid
            books={cat2Books}
            title={getCategoryTitleAndSubtitle(cat2).title}
            subtitle={getCategoryTitleAndSubtitle(cat2).subtitle}
            icon={BookOpen}
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
