'use client';

import { useLocale } from '@/hooks/ui/useLocale';
import { BookOpen, Users, PenTool, BookmarkCheck } from 'lucide-react';
import { useBooks } from '@/hooks/data/useBook';
import { useAuthors } from '@/hooks/data/useAuthor';
import { useUsers } from '@/hooks/data/useUser';
import { useBorrows } from '@/hooks/data/useBorrow';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

export const StatsSection = () => {
  const { data: session } = useSession();
  const { t, keys } = useLocale('home');
  const { data: booksData } = useBooks({ limit: 1 });
  const { data: authorsData } = useAuthors({ limit: 1 });
  const { data: usersData } = useUsers({ limit: 1 }, { enabled: !!session });
  const { data: borrowsData } = useBorrows({ limit: 1 }, { enabled: !!session });

  const stats = [
    {
      label: t(keys.stats.books),
      value: booksData?.pagination?.total?.toLocaleString() || '0',
      icon: BookOpen,
    },
    {
      label: t(keys.stats.users),
      value: usersData?.pagination?.total?.toLocaleString() || '0',
      icon: Users,
    },
    {
      label: t(keys.stats.authors),
      value: authorsData?.pagination?.total?.toLocaleString() || '0',
      icon: PenTool,
    },
    {
      label: t(keys.stats.borrows),
      value: borrowsData?.pagination?.total?.toLocaleString() || '0',
      icon: BookmarkCheck,
    },
  ];

  return (
    <section className='container py-12 md:py-24 relative overflow-hidden'>
      {/* Background Decorations - Sync with Banner style */}
      <div className='absolute -left-24 top-0 h-96 w-96 bg-primary/10 blur-[120px] rounded-md -z-10' />
      <div className='absolute -right-24 bottom-0 h-96 w-96 bg-primary/5 blur-[120px] rounded-md -z-10' />

      <div className='relative z-10 flex flex-col items-center text-center space-y-4 mb-16'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='space-y-4'
        >
          <h2 className='text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent'>
            {t(keys.stats.title)}
          </h2>
          <p className='max-w-2xl text-base md:text-lg text-muted-foreground font-medium'>
            {t(keys.stats.subtitle)}
          </p>
        </motion.div>
      </div>

      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8'>
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className='group relative'
          >
            <div className='relative h-full flex flex-col items-center p-6 md:p-10 rounded-md border border-primary/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl transition-all duration-500 hover:border-primary/20 hover:-translate-y-2 overflow-hidden'>
              {/* Subtle background gradient on hover */}
              <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

              <div className='relative z-10 flex h-14 w-14 md:h-20 md:w-20 items-center justify-center rounded-md bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3'>
                <stat.icon className='h-7 w-7 md:h-10 md:w-10' strokeWidth={1.5} />
              </div>

              <div className='relative z-10 mt-6 md:mt-8 flex flex-col items-center space-y-1'>
                <span className='text-3xl md:text-5xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300'>
                  {stat.value}
                </span>
                <span className='text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] transition-colors duration-300 group-hover:text-foreground/80'>
                  {stat.label}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
