import Link from 'next/link';
import type { BookResponse } from '@/types';
import { BadgePlus } from 'lucide-react';
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
    <section className='container py-6 pb-8 md:py-8 md:pb-10'>
      <div className='mb-5 flex items-end justify-between'>
        <div className='flex flex-col space-y-1.5'>
          <div className='flex items-center gap-2'>
            <BadgePlus className='text-primary h-5 w-5' />
            <h2 className='from-primary to-primary/60 bg-gradient-to-br bg-clip-text text-3xl font-bold tracking-tight text-transparent'>
              {t('newArrivals.title')}
            </h2>
          </div>
          <p className='text-muted-foreground'>{t('newArrivals.subtitle')}</p>
        </div>
        <Link
          href='/books?sort=createdAt&order=desc'
          className='text-primary hover:bg-primary/5 font-semibold'
        >
          {tCommon('actions.viewAll')}
        </Link>
      </div>

      <BookCarousel books={books} emptyText={t('newArrivals.empty')} limit={10} />
    </section>
  );
};

export default NewArrivalsSection;
