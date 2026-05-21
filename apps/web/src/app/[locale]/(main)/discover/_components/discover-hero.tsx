'use client';

import * as React from 'react';
import { useLocale } from '@/hooks/ui/useLocale';
import { SearchIcon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSearch } from '@/context/search-provider';
import { Kbd } from "@repo/ui/components/kbd";

export function DiscoverHero() {
  const { t, keys, KEYS } = useLocale('discover');
  const { setOpen } = useSearch();

  return (
    <div className='relative overflow-hidden py-8 sm:py-12 md:py-20'>
      {/* Background blobs */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden'>
        <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full' />
        <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full' />
      </div>

      <div className='flex flex-col items-center text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] sm:text-xs font-bold uppercase tracking-wider'
        >
          <Sparkles className='w-3 h-3' />
          {t(KEYS.navigation.catalog.discover.title)}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='space-y-3 sm:space-y-4'
        >
          <h1 className='text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-[1.08] sm:leading-[1.1]'>
            {t(keys.hero.title)}
          </h1>
          <p className='text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto'>
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
              'group relative w-full min-h-10 sm:h-12 md:h-14 px-3 sm:px-4 rounded-md border-2 border-primary/20 bg-card hover:bg-accent/50 text-left transition-all duration-300 shadow-lg shadow-primary/5 flex items-center gap-2 sm:gap-3'
            )}
          >
            <SearchIcon className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary shrink-0' />
            <span className='flex-1 text-sm sm:text-base md:text-lg text-muted-foreground'>
              {t(keys.hero.searchPlaceholder)}
            </span>
            <Kbd className='hidden sm:flex h-7 px-2 border-2'>
              <span className='text-xs'>⌘</span>K
            </Kbd>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
