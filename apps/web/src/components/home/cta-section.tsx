'use client';

import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import { useLocale, KEYS } from '@/hooks/ui/useLocale';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CTASection = () => {
  const { t, keys } = useLocale('home');

  return (
    <section className='container py-12 md:py-24'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className='relative overflow-hidden rounded-md bg-card border-2 border-primary/20 px-6 py-16 text-card-foreground md:px-16 md:py-24 shadow-sm'
      >
        {/* Subtle Ambient Decorations - Support Light/Dark */}
        <div className='absolute -right-24 -top-24 h-96 w-96 rounded-md bg-primary/5 blur-[100px]' />
        <div className='absolute -left-24 -bottom-24 h-96 w-96 rounded-md bg-primary/10 blur-[100px]' />

        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />

        <div className='relative z-10 mx-auto max-w-4xl text-center flex flex-col items-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className='mb-6 flex items-center gap-2 px-4 py-1.5 rounded-md bg-primary/10 border border-primary/20'
          >
            <Sparkles className='h-4 w-4 text-primary' />
            <span className='text-[10px] font-black uppercase tracking-[0.2em] text-primary'>
              {t(keys.cta.action).split(' ')[0]} iDoc
            </span>
          </motion.div>

          <h2 className='text-4xl font-black tracking-tight md:text-6xl lg:text-7xl leading-[1.1] mb-6 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent'>
            {t(keys.cta.title)}
          </h2>

          <p className='max-w-2xl text-lg text-muted-foreground md:text-xl font-medium leading-relaxed mb-10'>
            {t(keys.cta.subtitle)}
          </p>

          <div className='flex flex-wrap justify-center gap-5'>
            <Button
              size='lg'
              className='h-14 px-10 rounded-md text-base font-bold transition-all group shadow-lg shadow-primary/10'
              asChild
            >
              <Link href='/auth/sign-up'>
                {t(keys.cta.action)}
                <ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
              </Link>
            </Button>

            <Button
              size='lg'
              variant='outline'
              className='h-14 px-10 rounded-md text-base font-bold border-2 transition-all hover:bg-primary/5'
              asChild
            >
              <Link href='/books'>
                {t(KEYS.common.actions.viewAll)}
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
