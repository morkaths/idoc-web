'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { useLocale as useLocaleIntl } from 'next-intl';
import { type CategoryTranslationResponse, type CategoryResponse } from '@/types';
import { SortDirection, FilterOperator } from '@repo/types';
import { useCategories } from '@/hooks/data/useCategory';
import { useRecommendations } from '@/hooks/data/useRecommendation';
import { useBorrowHistory } from '@/hooks/data/useBorrow';
import { useBooksByIds } from '@/hooks/data/useBook';
import { useLocale } from '@/hooks/ui/useLocale';
import { BookGridItems } from '@/components/book/book-grid-items';
import { CategoryScroll } from './category-scroll';
import { DiscoverBookSection } from './discover-book-section';
import { DiscoverHero } from './discover-hero';

export default function DiscoverView() {
  const { t, keys } = useLocale('discover');
  const locale = useLocaleIntl();
  const { data: session, status: authStatus } = useSession();
  const userId = session?.user?.id;
  const { data: categoriesResponse } = useCategories({
    limit: 20,
  });
  const { data: recommendedBooks, isLoading: recommendationsLoading } = useRecommendations(userId, {
    enabled: authStatus === 'authenticated' && !!userId,
  });

  const { data: borrowHistoryData } = useBorrowHistory(
    { limit: 10 },
    { enabled: authStatus === 'authenticated' && !!userId }
  );

  const borrowedBookIds = React.useMemo(() => {
    return borrowHistoryData?.data?.map((loan) => loan.book.id) ?? [];
  }, [borrowHistoryData?.data]);

  const { data: fullBorrowedBooks } = useBooksByIds(
    borrowedBookIds,
    borrowedBookIds.length > 0
  );

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

  const categories = React.useMemo(
    () => categoriesResponse?.data ?? [],
    [categoriesResponse?.data]
  );
  const [featuredCategories, setFeaturedCategories] = React.useState<CategoryResponse[]>([]);
  const shouldShowForYouSection =
    authStatus === 'authenticated' &&
    (recommendationsLoading || (recommendedBooks?.length ?? 0) > 0);

  React.useEffect(() => {
    if (categories.length === 0) {
      setFeaturedCategories([]);
      return;
    }

    const items = [...categories];

    for (let index = items.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      const current = items[index];
      const swap = items[swapIndex];

      if (!current || !swap) continue;

      items[index] = swap;
      items[swapIndex] = current;
    }

    setFeaturedCategories(items.slice(0, 4));
  }, [categories]);

  return (
    <div className='min-h-screen space-y-12 pb-20'>
      <DiscoverHero />

      <div className='container mx-auto space-y-16'>
        <section className='space-y-4 px-4'>
          <CategoryScroll />

          <div className='grid gap-12'>
            {featuredCategories.map((category) => {
              const translation =
                category.translations?.find(
                  (tr: CategoryTranslationResponse) => tr.lang === locale
                ) || category.translations?.[0];
              const categoryName = translation?.name || category.slug || 'Unnamed';
              const categoryDescription = translation?.description;

              return (
                <DiscoverBookSection
                  key={category.id}
                  title={categoryName}
                  description={categoryDescription}
                  params={{
                    limit: 8,
                    filters: [
                      {
                        field: 'categories.id',
                        value: [category.id],
                        operator: FilterOperator.IN,
                      },
                    ],
                    sorts: [{ field: 'createdAt', direction: SortDirection.DESC }],
                  }}
                  initialLimit={8}
                  loadMoreStep={8}
                />
              );
            })}
          </div>

          {shouldShowForYouSection ? (
            <section className='space-y-4'>
              <div className='space-y-1'>
                <h2 className='text-xl font-bold tracking-tight md:text-2xl'>
                  {t(keys.sections.forYou.title)}
                </h2>
                <p className='text-muted-foreground max-w-2xl text-sm'>
                  {t(keys.sections.forYou.subtitle)}
                </p>
              </div>

              <BookGridItems
                data={(recommendedBooks ?? []).slice(0, 10)}
                loading={recommendationsLoading}
              />
            </section>
          ) : null}

          {resolvedRecommendedCategories.map((category) => {
            const translation =
              category.translations?.find(
                (tr: CategoryTranslationResponse) => tr.lang === locale
              ) || category.translations?.[0];
            const categoryName = translation?.name || category.slug || 'Unnamed';
            const isHistoryBased = recommendedCategories.some((c) => c.id === category.id);

            const title = isHistoryBased
              ? t(keys.sections.becauseYouRead.title, { category: categoryName })
              : categoryName;

            const description = isHistoryBased
              ? t(keys.sections.becauseYouRead.subtitle)
              : translation?.description;

            return (
              <DiscoverBookSection
                key={`rec-${category.id}`}
                title={title}
                description={description}
                params={{
                  limit: 8,
                  filters: [
                    {
                      field: 'categories.id',
                      value: [category.id],
                      operator: FilterOperator.IN,
                    },
                  ],
                  sorts: [{ field: 'totalBorrows', direction: SortDirection.DESC }],
                }}
                initialLimit={8}
                loadMoreStep={8}
              />
            );
          })}

          <DiscoverBookSection
            title={t(keys.sections.newArrivals.title)}
            description={t(keys.sections.newArrivals.subtitle)}
            params={{
              limit: 8,
              sorts: [{ field: 'createdAt', direction: SortDirection.DESC }],
            }}
            initialLimit={8}
            loadMoreStep={8}
          />

          <DiscoverBookSection
            title={t(keys.sections.trending.title)}
            description={t(keys.sections.trending.subtitle)}
            params={{
              limit: 8,
              sorts: [{ field: 'totalReviews', direction: SortDirection.DESC }],
            }}
            initialLimit={8}
            loadMoreStep={8}
          />
        </section>
      </div>
    </div>
  );
}
