import * as React from 'react';
import type { BookResponse, CategoryResponse, CategoryTranslationResponse } from '@/types';
import { getLocale } from 'next-intl/server';
import { Library } from 'lucide-react';
import { BookGridRandom } from '@/components/book/book-grid-random';
import { CategoryIcons } from './data/category-data';

interface CategorySection {
  category: CategoryResponse;
  books: BookResponse[];
}

interface CategoryBookSectionsProps {
  sections: CategorySection[];
}

/**
 * Server component that displays books under multiple selected categories.
 * Receives category sections via props.
 */
export const CategoryBookSections = async ({ sections }: CategoryBookSectionsProps) => {
  const locale = await getLocale();

  const getCategoryTitleAndSubtitle = (category: CategoryResponse) => {
    const translation =
      category.translations?.find((tr: CategoryTranslationResponse) => tr.lang === locale) ||
      category.translations?.[0];
    const title = translation?.name || category.slug || 'Unnamed';
    const subtitle = translation?.description || '';
    return { title, subtitle };
  };

  return (
    <>
      {sections.map(({ category, books }) => {
        const { title, subtitle } = getCategoryTitleAndSubtitle(category);
        const Icon = CategoryIcons[category.slug] || Library;
        return (
          <section key={category.id} className='container py-6 pb-8 md:py-8 md:pb-10'>
            <div className='mb-5 flex items-end justify-between'>
              <div className='flex flex-col space-y-1.5'>
                <div className='flex items-center gap-2'>
                  <Icon className='text-primary h-5 w-5' />
                  <h2 className='from-primary to-primary/60 bg-gradient-to-br bg-clip-text text-3xl font-bold tracking-tight text-transparent'>
                    {title}
                  </h2>
                </div>
                {subtitle && <p className='text-muted-foreground'>{subtitle}</p>}
              </div>
            </div>
            <BookGridRandom books={books} shuffle />
          </section>
        );
      })}
    </>
  );
};

export default CategoryBookSections;
