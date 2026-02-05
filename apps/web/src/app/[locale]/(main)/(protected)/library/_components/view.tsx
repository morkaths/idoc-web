"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/components/tabs";
import BookGridView from "./books-grid-view";
import { BorrowsProvider } from "./borrows-provider";
import { BorrowsPrimaryButtons } from "./borrows-primary-buttons";
import { BorrowsTable } from "./borrows-table";
import { BorrowsDialogs } from "./borrows-dialogs";
import { useLocale } from '@/hooks/ui/useLocale';

export function LibraryView() {
  const { t, keys } = useLocale('library');
  return (
    <main className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{t(keys.title)}</h1>
        <p className="text-muted-foreground">{t(keys.description)}</p>
      </div>
      <Tabs defaultValue="books" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="books">{t(keys.tabs.books)}</TabsTrigger>
          <TabsTrigger value="borrows">{t(keys.tabs.borrows)}</TabsTrigger>
        </TabsList>
        <TabsContent value="books">
          <BookGridView filter={{}} />
        </TabsContent>
        <TabsContent value="borrows">
          <BorrowsProvider>
            <div className='flex flex-col gap-4 sm:gap-6'>
              <div className='flex flex-wrap items-end justify-end gap-4 sm:gap-6'>
                <div>
                </div>
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
