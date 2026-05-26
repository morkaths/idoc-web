import type { BookResponse } from '@/types';
import { getTranslations } from 'next-intl/server';
import { BookCarousel } from '@/components/book/book-carousel';

interface NewArrivalsSectionProps {
  books: BookResponse[];
}

/**
 * Server component that displays newly arrived books in a BookCarousel.
 * Receives fetched books via props.
 */
export const NewArrivalsSection = async ({ books }: NewArrivalsSectionProps) => {
  const t = await getTranslations('home');
  const tCommon = await getTranslations('common');

  return (
    <BookCarousel
      books={books}
      title={t('newArrivals.title')}
      subtitle={t('newArrivals.subtitle')}
      icon='sparkles'
      viewAllHref='/books?sort=createdAt&order=desc'
      viewAllText={tCommon('actions.viewAll')}
      emptyText={t('newArrivals.empty')}
      limit={10}
    />
  );
};

export default NewArrivalsSection;
