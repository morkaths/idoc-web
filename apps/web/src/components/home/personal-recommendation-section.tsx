'use client';

import type { RecommendedBookResponse } from '@/types';
import { useLocale } from '@/hooks/ui/useLocale';
import { BookCarousel } from '@/components/book/book-carousel';

interface PersonalRecommendationSectionProps {
  books: RecommendedBookResponse[];
}

/**
 * Client-side component to display personalized recommendations for logged-in users.
 * Receives fetched recommendation books via props.
 */
export const PersonalRecommendationSection = ({ books }: PersonalRecommendationSectionProps) => {
  const { t, keys } = useLocale('home');

  if (!books || books.length === 0) {
    return null;
  }

  return (
    <BookCarousel
      books={books}
      title={t(keys.recommendations.title)}
      subtitle={t(keys.recommendations.subtitle)}
      icon='heart'
      limit={10}
    />
  );
};

export default PersonalRecommendationSection;
