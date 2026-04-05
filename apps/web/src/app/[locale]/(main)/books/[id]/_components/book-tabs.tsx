'use client';

import { ReactNode, useState } from 'react';
import { BookResponse, Languages } from '@/types';
import { formatDate } from '@/utils/date';
import { useLocale } from '@/hooks/ui/useLocale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { BookGridItems } from '@/components/book/book-grid-items';
import { BookRecommended } from './book-recommended';
import { BookReviews } from './book-reviews';

interface TabItem {
  name: string;
  value: string;
  content: ReactNode;
}

export function BookTabs({ book }: { book?: BookResponse }) {
  const { t, keys } = useLocale('book');
  const [activeTab, setActiveTab] = useState('info');

  const tabs: TabItem[] = [
    {
      name: t(keys.tabs.info.label),
      value: 'info',
      content: (
        <div className='bg-card/30 mt-4 rounded-xl border border-gray-100 p-6 dark:border-zinc-800'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <div className='col-span-1 mb-2 space-y-2 md:col-span-2 lg:col-span-3'>
              <div className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                {t(keys.tabs.info.description.label)}
              </div>
              <div className='text-muted-foreground text-sm leading-relaxed'>
                {book?.description || t(keys.tabs.info.description.empty)}
              </div>
            </div>
            <div className='space-y-1'>
              <div className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                {t(keys.tabs.info.language.label)}
              </div>
              <div className='text-sm font-medium'>
                {(() => {
                  if (!book?.language) return 'N/A';
                  const langConfig = Languages.find((l) => l.value === book.language);
                  const flagCode = langConfig?.flag || book.language.toLowerCase();
                  return (
                    <div className='flex items-center gap-2'>
                      <span
                        className={`fi fi-${flagCode} text-lg`}
                        title={langConfig?.label || book.language}
                        aria-hidden
                      />
                      <span>{langConfig?.label || book.language}</span>
                    </div>
                  );
                })()}
              </div>
            </div>
            <div className='space-y-1'>
              <div className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                {t(keys.tabs.info.pages.label)}
              </div>
              <div className='text-sm font-medium'>
                {book?.pages || 'N/A'} {t(keys.tabs.info.pages.page)}
              </div>
            </div>
            <div className='space-y-1'>
              <div className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                Format
              </div>
              <div className='text-sm font-medium'>
                {book?.file?.split('.').pop()?.toUpperCase() || 'N/A'}
              </div>
            </div>
            <div className='space-y-1'>
              <div className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                {t(keys.tabs.info.publisher.label)}
              </div>
              <div className='text-sm font-medium'>{book?.publisher || 'N/A'}</div>
            </div>
            <div className='space-y-1'>
              <div className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                {t(keys.tabs.info.publishedYear.label)}
              </div>
              <div className='text-sm font-medium'>
                {book?.publishedDate ? formatDate(book.publishedDate) : 'N/A'}
              </div>
            </div>
            <div className='space-y-1'>
              <div className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                ISBN
              </div>
              <div className='text-sm font-medium'>{book?.isbn || 'N/A'}</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: t(keys.tabs.reviews.label),
      value: 'reviews',
      content: (
        <BookReviews
          bookId={book?.id}
          rating={book?.rating}
          totalReviews={book?.totalReviews}
          enabled={activeTab === 'reviews'}
        />
      ),
    },
    {
      name: t(keys.tabs.recommendations.label),
      value: 'recommendations',
      content: <BookRecommended enabled={activeTab === 'recommendations'} />,
    },
    {
      name: t(keys.tabs.similar.label),
      value: 'similar',
      content: null,
    },
    {
      name: t(keys.tabs.tags.label),
      value: 'tags',
      content: (
        <div className='mt-4 rounded-xl border border-dashed border-gray-600 p-8 text-center text-base text-gray-200'>
          <div className='mb-2 font-semibold'>{t(keys.tabs.tags.empty)}</div>
          <div className='text-sm text-gray-400'>{t(keys.tabs.tags.description)}</div>
        </div>
      ),
    },
    { name: 'Credits', value: 'credits', content: null },
    { name: 'Images', value: 'images', content: null },
    { name: 'Videos', value: 'videos', content: null },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full gap-4'>
      <TabsList className='bg-background no-scrollbar mx-auto flex w-full justify-start gap-1 overflow-x-auto border p-1 sm:w-fit sm:justify-center'>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className='data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground px-4 py-2 whitespace-nowrap dark:data-[state=active]:border-transparent'
          >
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
