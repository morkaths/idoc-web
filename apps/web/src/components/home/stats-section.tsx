import * as React from 'react';
import { getTranslations } from 'next-intl/server';
import { STATS_ITEMS_CONFIG } from './data/stats-data';

interface StatsSectionProps {
  stats: {
    books: number;
    users: number;
    authors: number;
    borrows: number;
  };
}

/**
 * Server component that displays dashboard statistics.
 * Receives fetched stats via props.
 */
export const StatsSection = async ({ stats }: StatsSectionProps) => {
  const t = await getTranslations('home');

  return (
    <section className='relative container overflow-hidden py-12 md:py-24'>
      {/* Background Decorations - Sync with Banner style */}
      <div className='bg-primary/10 absolute top-0 -left-24 -z-10 h-96 w-96 rounded-md blur-[120px]' />
      <div className='bg-primary/5 absolute -right-24 bottom-0 -z-10 h-96 w-96 rounded-md blur-[120px]' />

      <div className='relative z-10 mb-16 flex flex-col items-center space-y-4 text-center'>
        <div className='animate-fade-in space-y-4'>
          <h2 className='from-foreground via-foreground to-foreground/70 bg-gradient-to-br bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-5xl'>
            {t('stats.title')}
          </h2>
          <p className='text-muted-foreground max-w-2xl text-base font-medium md:text-lg'>
            {t('stats.subtitle')}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-4'>
        {STATS_ITEMS_CONFIG.map((config, index) => {
          const value = config.getValue(stats).toLocaleString();
          const label = t(config.labelKey);
          const Icon = config.icon;

          return (
            <div key={index} className='group relative'>
              <div className='border-primary/10 hover:border-primary/20 relative flex h-full flex-col items-center overflow-hidden rounded-md border bg-white/50 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 md:p-10 dark:bg-zinc-900/50'>
                {/* Subtle background gradient on hover */}
                <div className='from-primary/5 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

                <div className='bg-primary/10 text-primary relative z-10 flex h-14 w-14 items-center justify-center rounded-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 md:h-20 md:w-20'>
                  <Icon className='h-7 w-7 md:h-10 md:w-10' strokeWidth={1.5} />
                </div>

                <div className='relative z-10 mt-6 flex flex-col items-center space-y-1 md:mt-8'>
                  <span className='text-foreground group-hover:text-primary text-3xl font-black tracking-tighter transition-colors duration-300 md:text-5xl'>
                    {value}
                  </span>
                  <span className='text-muted-foreground group-hover:text-foreground/80 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 md:text-xs'>
                    {label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StatsSection;
