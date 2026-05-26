'use client';

import Link from 'next/link';
import { useLocale as useLocaleIntl } from 'next-intl';
import type { CategoryTranslationResponse, CategoryResponse } from '@/types';
import { cn } from '@repo/ui/lib/utils';
import { ArrowRight, Book, LayoutGrid } from 'lucide-react';
import { useCategories } from '@/hooks/data/useCategory';
import { useLocale, KEYS } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import { Skeleton } from '@repo/ui/components/skeleton';
import { CategoryIcons } from './data/category-data';

const COLORS = [
  'from-blue-500/20 to-indigo-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
  'from-rose-500/20 to-pink-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
  'from-amber-500/20 to-orange-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
  'from-emerald-500/20 to-teal-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
  'from-violet-500/20 to-purple-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400',
  'from-cyan-500/20 to-sky-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400',
];

export const CategoriesGrid = () => {
  const { t, keys } = useLocale('home');
  const locale = useLocaleIntl();
  const { data: categories, isLoading } = useCategories({ limit: 11 });

  const items = categories?.data || [];

  const getSpan = (index: number) => {
    if (index === 0) return 'md:col-span-2 md:row-span-2';
    if (index === 3) return 'md:col-span-2';
    if (index === 6) return 'md:row-span-2';
    return '';
  };

  return (
    <section className='container py-5 md:py-10'>
      <div className='mb-6 flex items-end justify-between gap-4'>
        <div className='flex flex-col space-y-1.5'>
          <div className='flex items-center gap-2'>
            <LayoutGrid className='text-primary h-5 w-5' />
            <h2 className='from-primary to-primary/60 bg-gradient-to-br bg-clip-text text-3xl font-bold tracking-tight text-transparent'>
              {t(keys.categories.title)}
            </h2>
          </div>
          <p className='text-muted-foreground'>{t(keys.categories.subtitle)}</p>
        </div>
        <Button variant='ghost' className='text-primary hover:bg-primary/5 font-semibold' asChild>
          <Link href='/books'>
            {t(KEYS.common.actions.viewAll)}
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4'>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              key={i}
              className={cn(
                'h-36 rounded-md md:h-40',
                i === 1 ? 'h-auto md:col-span-2 md:row-span-2' : ''
              )}
            />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className='grid auto-rows-[128px] grid-cols-2 gap-3 md:grid-cols-4 md:gap-4'>
          {items.map((category: CategoryResponse, index: number) => {
            const { translations, slug, id } = category;
            const translation =
              translations?.find((tr: CategoryTranslationResponse) => tr.lang === locale) ||
              translations?.[0];
            const name = translation?.name || slug || 'Unnamed';
            const description = translation?.description;

            const Icon = CategoryIcons[slug] || Book;
            const colorClass = COLORS[index % COLORS.length];
            const spanClass = getSpan(index);

            return (
              <Link
                key={id}
                href={`/catalog?category=${id}`}
                className={cn(
                  'group relative overflow-hidden rounded-md border bg-gradient-to-br transition-all duration-300',
                  'hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl',
                  colorClass,
                  spanClass
                )}
              >
                <div className='bg-background/40 absolute inset-0 backdrop-blur-[2px] transition-colors group-hover:bg-transparent' />

                <div className='relative z-10 flex h-full flex-col justify-between p-4 md:p-5'>
                  <div className='space-y-1'>
                    <h3 className='text-foreground group-hover:text-primary flex items-center gap-2 text-base font-bold tracking-tight transition-colors md:text-xl'>
                      <Icon className='h-5 w-5 shrink-0 md:h-6 md:w-6' />
                      {name}
                    </h3>
                    <p className='text-muted-foreground/80 line-clamp-2 translate-y-2 text-xs leading-relaxed font-medium opacity-0 transition-opacity duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:text-sm'>
                      {description || t(keys.categories.description)}
                    </p>
                  </div>
                </div>

                <Icon className='absolute -right-8 -bottom-8 h-32 w-32 opacity-[0.03] transition-all duration-700 group-hover:scale-125 group-hover:-rotate-12 group-hover:opacity-[0.08]' />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className='flex h-[160px] items-center justify-center border-2 border-dashed'>
          <p className='text-muted-foreground'>{t(keys.categories.empty)}</p>
        </div>
      )}
    </section>
  );
};
