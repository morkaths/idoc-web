'use client';

import { useLocale } from '@/hooks/ui/useLocale';
import { BookOpen, Users, PenTool, BookmarkCheck } from 'lucide-react';
import { useBooks } from '@/hooks/data/useBook';
import { useAuthors } from '@/hooks/data/useAuthor';
import { useUsers } from '@/hooks/data/useUser';
import { useBorrows } from '@/hooks/data/useBorrow';

export const StatsSection = () => {
  const { t, keys } = useLocale('home');
  const { data: booksData } = useBooks({ limit: 1 });
  const { data: authorsData } = useAuthors({ limit: 1 });
  const { data: usersData } = useUsers({ limit: 1 });
  const { data: borrowsData } = useBorrows({ limit: 1 });

  const stats = [
    {
      label: t(keys.stats.books),
      value: booksData?.pagination?.total?.toLocaleString() || '0',
      icon: BookOpen,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: t(keys.stats.users),
      value: usersData?.pagination?.total?.toLocaleString() || '0',
      icon: Users,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      label: t(keys.stats.authors),
      value: authorsData?.pagination?.total?.toLocaleString() || '0',
      icon: PenTool,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      label: t(keys.stats.borrows),
      value: borrowsData?.pagination?.total?.toLocaleString() || '0',
      icon: BookmarkCheck,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
  ];

  return (
    <section className='container py-20'>
      <div className='relative overflow-hidden bg-muted/30 px-6 py-12 md:px-12 md:py-20'>
        {/* Background Decorations */}
        <div className='absolute -left-20 -top-20 h-64 w-64 bg-primary/5 blur-3xl' />
        <div className='absolute -right-20 -bottom-20 h-64 w-64 bg-primary/10 blur-3xl' />

        <div className='relative z-10 flex flex-col items-center text-center'>
          <h2 className='text-3xl font-bold tracking-tight md:text-4xl'>
            {t(keys.stats.title)}
          </h2>
          <p className='mt-4 max-w-2xl text-lg text-muted-foreground'>
            {t(keys.stats.subtitle)}
          </p>

          <div className='mt-12 grid w-full grid-cols-2 gap-8 md:grid-cols-4'>
            {stats.map((stat, index) => (
              <div
                key={index}
                className='flex flex-col items-center space-y-4 transition-transform hover:scale-105'
              >
                <div className={`flex h-16 w-16 items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className='flex flex-col'>
                  <span className='text-3xl font-bold tracking-tight md:text-4xl'>
                    {stat.value}
                  </span>
                  <span className='text-sm font-medium text-muted-foreground uppercase tracking-wider'>
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
