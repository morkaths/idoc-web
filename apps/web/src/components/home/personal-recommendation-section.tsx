'use client';

import type { RecommendedBookResponse } from '@/types';
import { Sparkles } from 'lucide-react';
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
    <section className='container py-6 pb-8 md:py-8 md:pb-10'>
      <div className='mb-5 flex items-end justify-between'>
        <div className='flex flex-col space-y-1.5'>
          <div className='flex items-center gap-2'>
            <Sparkles className='text-primary h-5 w-5' />
            <h2 className='from-primary to-primary/60 bg-gradient-to-br bg-clip-text text-3xl font-bold tracking-tight text-transparent'>
              {t(keys.recommendations.title)}
            </h2>
          </div>
          <p className='text-muted-foreground'>{t(keys.recommendations.subtitle)}</p>
        </div>
      </div>

      <BookCarousel books={books} limit={10} />
    </section>
  );
};

export default PersonalRecommendationSection;
