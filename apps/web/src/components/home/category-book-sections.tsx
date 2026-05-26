import * as React from 'react';
import type { BookResponse, CategoryResponse, CategoryTranslationResponse } from '@/types';
import { getLocale } from 'next-intl/server';
import { BookGridRandom } from '@/components/book/book-grid-random';

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
        return (
          <BookGridRandom
            key={category.id}
            books={books}
            title={title}
            subtitle={subtitle}
            icon='book-open'
            shuffle
          />
        );
      })}
    </>
  );
};

export default CategoryBookSections;
