'use client';

import Link from 'next/link';
import * as React from 'react';
import { useLocale as useLocaleIntl } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import { useCategories } from '@/hooks/data/useCategory';
import { useLocale } from '@/hooks/ui/useLocale';
import { Badge } from '@repo/ui/components/badge';
import { InfiniteSlider } from '@repo/ui/components/infinite-slider';
import { Skeleton } from '@repo/ui/components/skeleton';

export function CategoryScroll() {
  const { t, keys } = useLocale('discover');
  const locale = useLocaleIntl();
  const { data: categoriesResponse, isLoading } = useCategories({ limit: 20 });
  const categories = categoriesResponse?.data || [];

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between'>
          <Skeleton className='h-6 w-28 sm:w-48' />
          <Skeleton className='h-4 w-20 sm:w-28' />
        </div>

        <div className='relative'>
          <div className='from-background pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-8 bg-gradient-to-r to-transparent md:hidden' />
          <div className='from-background pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-8 bg-gradient-to-l to-transparent md:hidden' />

          <div className='px-4 pb-4'>
            <div className='overflow-hidden py-2'>
              <div className='flex w-max items-center gap-4'>
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className='h-8 w-20 shrink-0 rounded-md sm:h-10 sm:w-32' />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='text-lg font-bold sm:text-xl md:text-2xl'>{t(keys.categories.title)}</h2>
        <Link
          href='/catalog'
          className='text-primary flex items-center gap-1 text-sm font-medium hover:underline'
        >
          {t(keys.categories.all)}
          <ChevronRight className='h-4 w-4' />
        </Link>
      </div>

      <div className='relative'>
        {/* Shadow gradients for scroll indication */}
        <div className='from-background pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-8 bg-gradient-to-r to-transparent md:hidden' />
        <div className='from-background pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-8 bg-gradient-to-l to-transparent md:hidden' />

        <div className='px-4 pb-4'>
          <InfiniteSlider gap={16} speed={80} speedOnHover={25} className='py-2'>
            {categories.map((category, index) => {
              const translation =
                category.translations?.find((tr) => tr.lang === locale) ||
                category.translations?.[0];
              const name = translation?.name || category.slug || 'Unnamed';

              const COLORS = [
                'from-blue-500/20 to-indigo-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
                'from-rose-500/20 to-pink-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
                'from-amber-500/20 to-orange-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
                'from-emerald-500/20 to-teal-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
                'from-violet-500/20 to-purple-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400',
                'from-cyan-500/20 to-sky-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400',
              ];

              const colorClass = COLORS[index % COLORS.length];

              return (
                <Link
                  key={category.id}
                  href={`/catalog?category=${category.slug}`}
                  className='inline-flex shrink-0'
                >
                  <Badge
                    variant='outline'
                    className={
                      'cursor-pointer rounded-lg border-2 px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-sm ' +
                      colorClass
                    }
                  >
                    {name}
                  </Badge>
                </Link>
              );
            })}
          </InfiniteSlider>
        </div>
      </div>
    </div>
  );
}
