'use client';

import * as React from 'react';
import { useSearch } from '@/context/search-provider';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { SearchIcon, Sparkles } from 'lucide-react';
import { useLocale } from '@/hooks/ui/useLocale';
import { Kbd } from '@repo/ui/components/kbd';

export function DiscoverHero() {
  const { t, keys, KEYS } = useLocale('discover');
  const { setOpen } = useSearch();

  return (
    <div className='relative overflow-hidden py-8 sm:py-12 md:py-20'>
      {/* Background blobs */}
      <div className='pointer-events-none absolute top-0 left-1/2 -z-10 h-full w-full -translate-x-1/2 overflow-hidden'>
        <div className='bg-primary/10 absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full blur-[120px]' />
        <div className='bg-primary/5 absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full blur-[100px]' />
      </div>

      <div className='mx-auto flex max-w-4xl flex-col items-center space-y-6 px-4 text-center sm:space-y-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase sm:text-xs'
        >
          <Sparkles className='h-3 w-3' />
          {t(KEYS.navigation.catalog.discover.title)}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='space-y-3 sm:space-y-4'
        >
          <h1 className='text-3xl leading-[1.08] font-black tracking-tight sm:text-4xl sm:leading-[1.1] md:text-6xl'>
            {t(keys.hero.title)}
          </h1>
          <p className='text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg md:text-xl'>
            {t(keys.hero.subtitle)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='w-full max-w-2xl'
        >
          <button
            onClick={() => setOpen(true)}
            className={cn(
              'group border-primary/20 bg-card hover:bg-accent/50 shadow-primary/5 relative flex min-h-10 w-full items-center gap-2 rounded-md border-2 px-3 text-left shadow-lg transition-all duration-300 sm:h-12 sm:gap-3 sm:px-4 md:h-14'
            )}
          >
            <SearchIcon className='text-primary h-4 w-4 shrink-0 sm:h-5 sm:w-5 md:h-6 md:w-6' />
            <span className='text-muted-foreground flex-1 text-sm sm:text-base md:text-lg'>
              {t(keys.hero.searchPlaceholder)}
            </span>
            <Kbd className='hidden h-7 border-2 px-2 sm:flex'>
              <span className='text-xs'>⌘</span>K
            </Kbd>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
