import Link from 'next/link';
import type { AuthorResponse } from '@/types';
import { ArrowRight, Users2 } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Button } from '@repo/ui/components/button';
import { FeaturedAuthorsCarousel } from '@/components/home/featured-authors-carousel';

interface FeaturedAuthorsSectionProps {
  authors: AuthorResponse[];
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j] as T, shuffled[i] as T];
  }

  return shuffled;
};

/**
 * Server component that renders the authors layout section.
 * Receives featured authors via props and delegates carousel rendering to a client component.
 */
export const FeaturedAuthorsSection = async ({ authors }: FeaturedAuthorsSectionProps) => {
  const t = await getTranslations('home');
  const tCommon = await getTranslations('common');
  const displayAuthors = shuffleArray(authors);

  if (authors.length === 0) {
    return (
      <section className='container py-12 pb-20'>
        <div className='mb-8 flex items-end justify-between'>
          <div className='flex flex-col space-y-2'>
            <div className='flex items-center gap-2'>
              <Users2 className='text-primary h-5 w-5' />
              <h2 className='from-primary to-primary/60 bg-gradient-to-br bg-clip-text text-3xl font-bold tracking-tight text-transparent'>
                {t('featuredAuthors.title')}
              </h2>
            </div>
            <p className='text-muted-foreground'>{t('featuredAuthors.subtitle')}</p>
          </div>
        </div>
        <div className='flex h-[200px] items-center justify-center rounded-xl border-2 border-dashed'>
          <p className='text-muted-foreground'>{t('featuredAuthors.empty')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className='container py-12 pb-20'>
      <div className='mb-8 flex items-end justify-between'>
        <div className='flex flex-col space-y-2'>
          <div className='flex items-center gap-2'>
            <Users2 className='text-primary h-5 w-5' />
            <h2 className='from-primary to-primary/60 bg-gradient-to-br bg-clip-text text-3xl font-bold tracking-tight text-transparent'>
              {t('featuredAuthors.title')}
            </h2>
          </div>
          <p className='text-muted-foreground'>{t('featuredAuthors.subtitle')}</p>
        </div>
        <Button variant='ghost' className='text-primary hover:bg-primary/5 font-semibold' asChild>
          <Link href='/authors'>
            {tCommon('actions.viewAll')}
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </Button>
      </div>

      <FeaturedAuthorsCarousel authors={displayAuthors} />
    </section>
  );
};

export default FeaturedAuthorsSection;
