'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useCategories } from '@/hooks/data/useCategory';
import { Badge } from '@repo/ui/components/badge';
import { Skeleton } from '@repo/ui/components/skeleton';
import { InfiniteSlider } from '@repo/ui/components/infinite-slider';
import Link from 'next/link';
import { Book } from 'lucide-react';
import { CATEGORY_ICONS, HOME_LIMITS } from './data/home-data';
import type { CategoryResponse, CategoryTranslationResponse } from '@/types';

export const CategoriesGrid = () => {
  const t = useTranslations('home.categories');
  const locale = useLocale();
  const { data: categories, isLoading } = useCategories({ limit: HOME_LIMITS.CATEGORIES });

  const items = categories?.data || [];

  const renderCategoryBadge = (category: CategoryResponse) => {
    const { translations, slug, id } = category;
    const translation = translations?.find((tr: CategoryTranslationResponse) => tr.lang === locale) || translations?.[0];
    const name = translation?.name || slug || 'Unnamed';

    const slugKey = slug.charAt(0).toUpperCase() + slug.slice(1);
    const Icon = CATEGORY_ICONS[name] || CATEGORY_ICONS[slugKey] || CATEGORY_ICONS[slug] || Book;

    return (
      <Link key={id} href={`/catalog?category=${id}`} className='group'>
        <Badge 
          variant='secondary' 
          className='flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:shadow-lg rounded-full border-none bg-muted/50 backdrop-blur-sm'
        >
          <Icon className='h-4 w-4 transition-transform group-hover:rotate-12' />
          <span>{name}</span>
        </Badge>
      </Link>
    );
  };

  // Split categories into two rows for a more dynamic look
  const row1 = items.slice(0, Math.ceil(items.length / 2));
  const row2 = items.slice(Math.ceil(items.length / 2));

  return (
    <section className='container py-16 overflow-hidden'>
      <div className='mb-10 flex flex-col items-center text-center space-y-3'>
        <h2 className='text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
          {t('title')}
        </h2>
        <p className='text-muted-foreground max-w-2xl'>
          {t('subtitle')}
        </p>
      </div>

      {isLoading ? (
        <div className='flex gap-4 overflow-hidden py-4'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className='h-10 w-32 rounded-full' />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className='flex flex-col gap-6'>
          <InfiniteSlider gap={16} speed={30} reverse={false}>
            {row1.map(renderCategoryBadge)}
          </InfiniteSlider>
          {row2.length > 0 && (
            <InfiniteSlider gap={16} speed={35} reverse={true}>
              {row2.map(renderCategoryBadge)}
            </InfiniteSlider>
          )}
        </div>
      ) : (
        <div className='flex h-[150px] items-center justify-center rounded-2xl border-2 border-dashed bg-muted/30'>
          <p className='text-muted-foreground'>{t('empty')}</p>
        </div>
      )}
    </section>
  );
};

