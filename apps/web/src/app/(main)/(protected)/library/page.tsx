"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/components/tabs";
import BookGridView from "./_components/books-grid-view";
import { BorrowsProvider } from "./_components/borrows-provider";
import { BorrowsPrimaryButtons } from "./_components/borrows-primary-buttons";
import { BorrowsTable } from "./_components/borrows-table";
import { BorrowsDialogs } from "./_components/borrows-dialogs";

export default function LibraryPage() {
  return (
    <main className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Library</h1>
        <p className="text-muted-foreground">Manage your borrowed books and explore your personal library history.</p>
      </div>
      <Tabs defaultValue="books" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="books">Book List</TabsTrigger>
          <TabsTrigger value="borrows">Borrow List</TabsTrigger>
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