'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLocale, KEYS } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';

export const CTASection = () => {
  const { t, keys } = useLocale('home');

  return (
    <section className='container py-12 md:py-24'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className='bg-card border-primary/20 text-card-foreground relative overflow-hidden rounded-md border-2 px-6 py-16 shadow-sm md:px-16 md:py-24'
      >
        {/* Subtle Ambient Decorations - Support Light/Dark */}
        <div className='bg-primary/5 absolute -top-24 -right-24 h-96 w-96 rounded-md blur-[100px]' />
        <div className='bg-primary/10 absolute -bottom-24 -left-24 h-96 w-96 rounded-md blur-[100px]' />

        {/* Decorative Pattern */}
        <div
          className='pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]'
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className='relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className='bg-primary/10 border-primary/20 mb-6 flex items-center gap-2 rounded-md border px-4 py-1.5'
          >
            <Sparkles className='text-primary h-4 w-4' />
            <span className='text-primary text-[10px] font-black tracking-[0.2em] uppercase'>
              {t(keys.cta.action).split(' ')[0]} iDoc
            </span>
          </motion.div>

          <h2 className='from-foreground via-foreground to-foreground/70 mb-6 bg-gradient-to-br bg-clip-text text-4xl leading-[1.1] font-black tracking-tight text-transparent md:text-6xl lg:text-7xl'>
            {t(keys.cta.title)}
          </h2>

          <p className='text-muted-foreground mb-10 max-w-2xl text-lg leading-relaxed font-medium md:text-xl'>
            {t(keys.cta.subtitle)}
          </p>

          <div className='flex flex-wrap justify-center gap-5'>
            <Button
              size='lg'
              className='group shadow-primary/10 h-14 rounded-md px-10 text-base font-bold shadow-lg transition-all'
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
              className='hover:bg-primary/5 h-14 rounded-md border-2 px-10 text-base font-bold transition-all'
              asChild
            >
              <Link href='/books'>{t(KEYS.common.actions.viewAll)}</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
