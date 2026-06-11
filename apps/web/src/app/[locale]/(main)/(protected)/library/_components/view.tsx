'use client';

import { useLocale } from '@/hooks/ui/useLocale';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/ui/components/tabs';
import BookGridView from './books-grid-view';
import { BorrowsDialogs } from './borrows-dialogs';
import { BorrowsPrimaryButtons } from './borrows-primary-buttons';
import { BorrowsProvider } from './borrows-provider';
import { BorrowsTable } from './borrows-table';

export function LibraryView() {
  const { t, keys } = useLocale('library');
  return (
    <main className='container w-full max-w-full overflow-x-hidden pt-20 pb-8'>
      <div className='mb-6'>
        <h1 className='mb-2 text-2xl font-bold'>{t(keys.title)}</h1>
        <p className='text-muted-foreground'>{t(keys.description)}</p>
      </div>
      <Tabs defaultValue='recommendations' className='w-full'>
        <TabsList className='mb-6'>
          <TabsTrigger value='recommendations'>{t(keys.tabs.recommendations)}</TabsTrigger>
          <TabsTrigger value='history'>{t(keys.tabs.history)}</TabsTrigger>
        </TabsList>
        <TabsContent value='recommendations'>
          <BookGridView />
        </TabsContent>
        <TabsContent value='history'>
          <BorrowsProvider>
            <div className='@container/content flex w-full max-w-full flex-col gap-4 overflow-hidden sm:gap-6'>
              <div className='flex flex-wrap items-end justify-end gap-4 sm:gap-6'>
                <BorrowsPrimaryButtons />
              </div>
              <BorrowsTable />
            </div>
            <BorrowsDialogs />
          </BorrowsProvider>
        </TabsContent>
      </Tabs>
    </main>
  );
}
