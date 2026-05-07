'use client';

import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import { useLocale, KEYS } from '@/hooks/ui/useLocale';

export const CTASection = () => {
  const { t, keys } = useLocale('home');

  return (
    <section className='container py-20'>
      <div className='relative overflow-hidden rounded-[2.5rem] bg-primary px-6 py-12 text-primary-foreground md:px-12 md:py-20 shadow-2xl shadow-primary/20'>
        {/* Decorative elements */}
        <div className='absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-20'>
          <div className='h-64 w-64 rounded-full border-[32px] border-primary-foreground/30' />
        </div>
        <div className='absolute left-0 bottom-0 translate-y-1/4 -translate-x-1/4 opacity-10'>
          <div className='h-96 w-96 rounded-full bg-primary-foreground/20 blur-3xl' />
        </div>

        <div className='relative z-10 mx-auto max-w-3xl text-center'>
          <h2 className='text-3xl font-bold tracking-tight md:text-5xl'>
            {t(keys.cta.title)}
          </h2>
          <p className='mt-6 text-lg text-primary-foreground/90 md:text-xl'>
            {t(keys.cta.subtitle)}
          </p>
          <div className='mt-10 flex flex-wrap justify-center gap-4'>
            <Button
              size='lg'
              variant='secondary'
              className='h-12 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all'
              asChild
            >
              <Link href='/auth/sign-up'>{t(keys.cta.action)}</Link>
            </Button>
            <Button
              size='lg'
              variant='ghost'
              className='h-12 border border-white/40 text-white bg-transparent px-8 text-lg font-semibold hover:bg-white/10 transition-all'
              asChild
            >
              <Link href='/books'>{t(KEYS.common.actions.viewAll)}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
