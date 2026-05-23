'use client';

import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { BookOpen, Users, PenTool, BookmarkCheck } from 'lucide-react';
import { useAuthors } from '@/hooks/data/useAuthor';
import { useBooks } from '@/hooks/data/useBook';
import { useBorrows } from '@/hooks/data/useBorrow';
import { useUsers } from '@/hooks/data/useUser';
import { useLocale } from '@/hooks/ui/useLocale';

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
    <section className='relative container overflow-hidden py-12 md:py-24'>
      {/* Background Decorations - Sync with Banner style */}
      <div className='bg-primary/10 absolute top-0 -left-24 -z-10 h-96 w-96 rounded-md blur-[120px]' />
      <div className='bg-primary/5 absolute -right-24 bottom-0 -z-10 h-96 w-96 rounded-md blur-[120px]' />

      <div className='relative z-10 mb-16 flex flex-col items-center space-y-4 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='space-y-4'
        >
          <h2 className='from-foreground via-foreground to-foreground/70 bg-gradient-to-br bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-5xl'>
            {t(keys.stats.title)}
          </h2>
          <p className='text-muted-foreground max-w-2xl text-base font-medium md:text-lg'>
            {t(keys.stats.subtitle)}
          </p>
        </motion.div>
      </div>

      <div className='grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-4'>
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className='group relative'
          >
            <div className='border-primary/10 hover:border-primary/20 relative flex h-full flex-col items-center overflow-hidden rounded-md border bg-white/50 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 md:p-10 dark:bg-zinc-900/50'>
              {/* Subtle background gradient on hover */}
              <div className='from-primary/5 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

              <div className='bg-primary/10 text-primary relative z-10 flex h-14 w-14 items-center justify-center rounded-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 md:h-20 md:w-20'>
                <stat.icon className='h-7 w-7 md:h-10 md:w-10' strokeWidth={1.5} />
              </div>

              <div className='relative z-10 mt-6 flex flex-col items-center space-y-1 md:mt-8'>
                <span className='text-foreground group-hover:text-primary text-3xl font-black tracking-tighter transition-colors duration-300 md:text-5xl'>
                  {stat.value}
                </span>
                <span className='text-muted-foreground group-hover:text-foreground/80 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 md:text-xs'>
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
