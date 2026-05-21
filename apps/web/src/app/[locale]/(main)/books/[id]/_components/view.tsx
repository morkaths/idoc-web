'use client';

import { type BookResponse, BorrowStatus } from '@/types';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import { Bookmark, Plus, BookX } from 'lucide-react';
import { toast } from 'sonner';
import { useBook } from '@/hooks/data/useBook';
import { useCreateBorrow } from '@/hooks/data/useBorrow';
import { useLocale } from '@/hooks/ui/useLocale';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Skeleton } from '@repo/ui/components/skeleton';
import { BookTabs } from './book-tabs';
import { BorrowBookDialog } from './borrow-book-dialog';
import { AddBookmarkDialog } from './add-bookmark-dialog';
import BookCover3d from '@repo/ui/components/book-cover-3d';
import { isValidCover } from '@/lib/book-utils';

interface BookDetailViewProps {
  id: string;
}

const CoverImage = ({ title, src }: { title: string; src?: string }) => {

  return (
    <div className='relative z-10 flex justify-center'>
      <BookCover3d
        src={isValidCover(src) ? src : undefined}
        title={title}
        width={300}
        className='drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]'
      />
    </div>
  );
};

function BookDetailSkeleton() {
  return (
    <div className='relative min-h-screen pt-2 pb-10 md:pt-10'>
      {/* Banner */}
      <Skeleton className='relative h-64 w-full rounded-none md:h-72 lg:h-96' />

      {/* Main content */}
      <div className='relative mx-auto -mt-24 flex max-w-5xl flex-col gap-4 px-4 md:-mt-40 md:flex-row md:gap-8'>
        {/* Book cover */}
        <div className='aspect-[3/4] w-46 overflow-hidden rounded-md border-2 bg-white sm:w-64 md:w-72 lg:w-80 dark:bg-zinc-800'>
          <Skeleton className='h-full w-full rounded-none' />
        </div>

        {/* Book info */}
        <div className='flex flex-1 flex-col justify-end space-y-4 pb-2'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-8 w-3/4 md:h-10' />
          {/* Categories */}
          <div className='flex flex-wrap gap-2'>
            <Skeleton className='h-6 w-20 rounded-md' />
            <Skeleton className='h-6 w-24 rounded-md' />
            <Skeleton className='h-6 w-16 rounded-md' />
          </div>
          {/* Author */}
          <Skeleton className='h-4 w-48' />
          {/* Actions */}
          <div className='flex gap-2 pt-2'>
            <Skeleton className='h-10 w-32' />
            <Skeleton className='h-10 w-32' />
          </div>
        </div>
      </div>

      <div className='mx-auto mt-6 max-w-5xl space-y-6 px-4 md:mt-10'>
        {/* Tabs List */}
        <div className='bg-background mx-auto flex w-fit justify-center gap-1 rounded-md border p-1'>
          <Skeleton className='h-8 w-20 rounded-md' />
          <Skeleton className='h-8 w-20 rounded-md' />
          <Skeleton className='h-8 w-24 rounded-md' />
          <Skeleton className='h-8 w-20 rounded-md' />
          <Skeleton className='h-8 w-20 rounded-md' />
          <Skeleton className='h-8 w-20 rounded-md' />
          <Skeleton className='h-8 w-20 rounded-md' />
          <Skeleton className='h-8 w-20 rounded-md' />
        </div>

        {/* Tab Content (Info style) */}
        <div className='bg-card/30 mt-4 rounded-xl border border-gray-100 p-6 dark:border-zinc-800'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {/* Description - Spanning full width */}
            <div className='col-span-1 mb-2 space-y-2 md:col-span-2 lg:col-span-3'>
              <Skeleton className='mb-2 h-3 w-24' />
              <div className='space-y-1'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-5/6' />
                <Skeleton className='h-4 w-4/6' />
              </div>
            </div>

            {/* Other Info Items */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className='space-y-1'>
                <Skeleton className='h-3 w-16' />
                <Skeleton className='h-5 w-32' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookDetailError() {
  const router = useRouter();
  const { t, keys } = useLocale('book');

  return (
    <div className='animate-in fade-in zoom-in flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center duration-300'>
      <div className='relative'>
        <div className='bg-background relative rounded-md border p-6 shadow-sm'>
          <BookX className='text-muted-foreground h-12 w-12' />
        </div>
      </div>
      <div className='mx-auto max-w-md space-y-2'>
        <h2 className='text-2xl font-bold tracking-tight'>{t(keys.error.title)}</h2>
        <p className='text-muted-foreground'>{t(keys.error.description)}</p>
      </div>
      <div className='flex items-center gap-2'>
        <Button variant='outline' onClick={() => window.location.reload()}>
          {t(keys.error.actions.reload)}
        </Button>
        <Button onClick={() => router.push('/')}>{t(keys.error.actions.backToHome)}</Button>
      </div>
    </div>
  );
}

export function BookDetailView({ id }: BookDetailViewProps) {
  const router = useRouter();
  const { locale } = useParams() as { locale: string };
  const { t, keys } = useLocale('book');
  const { data: session } = useSession();
  const user = session?.user;
  const { data: book, isLoading, error } = useBook(id);
  const [openBorrow, setOpenBorrow] = useState(false);
  const [openAddToFolder, setOpenAddToFolder] = useState(false);
  const createBorrowMut = useCreateBorrow();

  if (isLoading) return <BookDetailSkeleton key='skeleton' />;
  if (error || !book) return <BookDetailError key='error' />;

  const handleBorrowClick = () => {
    if (!user) {
      router.push(`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setOpenBorrow(true);
  };

  const handleAddBookmarkClick = () => {
    if (!user) {
      router.push(`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setOpenAddToFolder(true);
  };

  return (
    <div key='content' className='relative min-h-screen pt-14 pb-10 md:pt-16'>
      {/* Banner */}
      <div className='bg-primary/10 dark:bg-primary/10 relative h-64 w-full md:h-72 lg:h-96' />
      {/* Main content */}
      <div className='relative mx-auto -mt-24 flex max-w-5xl flex-col gap-4 px-4 md:-mt-40 md:flex-row md:gap-8'>
        {/* Book cover */}
        <CoverImage title={book.title} src={book.coverUrl} />
        {/* Book info */}
        <div className='flex flex-1 flex-col justify-end'>
          <div className='mb-2 text-sm'>
            {book.publishedDate && dayjs(book.publishedDate).format('MMMM D, YYYY')}
          </div>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>{book.title}</h2>
          {/* Categories */}
          <div className='mb-4 flex flex-wrap gap-2'>
            {book.categories?.map((cat) => {
              const translation =
                cat.translations?.find((t) => t.lang === locale) || cat.translations?.[0];
              return (
                <Badge key={cat.id} variant='outline'>
                  {translation?.name || cat.id}
                </Badge>
              );
            })}
          </div>
          {/* Author */}
          <div className='text-muted-foreground mb-6 text-sm'>
            {t(keys.by)}{' '}
            {book.authors?.length
              ? book.authors.map((a, i) => (
                <span key={i}>
                  <span className='text-muted-foreground hover:text-primary cursor-pointer font-semibold underline transition-colors'>
                    {a.name}
                  </span>
                  {i < (book.authors?.length || 0) - 1 && ', '}
                </span>
              ))
              : t(keys.author)}
          </div>
          {/* Actions */}
          <div className='flex gap-2'>
            <Button variant='outline' onClick={handleAddBookmarkClick}>
              <Plus className='h-4 w-4' />
              {t(keys.bookmarks.title)}
            </Button>
            <Button variant='default' onClick={handleBorrowClick}>
              <Bookmark className='h-4 w-4' />
              {t(keys.actions.borrow)}
            </Button>
            <BorrowBookDialog
              open={openBorrow}
              onOpenChange={setOpenBorrow}
              onSubmit={(data) => {
                return toast.promise(
                  createBorrowMut.mutateAsync({
                    bookId: book.id!,
                    userId: user?.id || '',
                    status: BorrowStatus.BORROWED,
                    ...data,
                  }),
                  {
                    loading: t(keys.borrow.states.loading),
                    success: () => {
                      setOpenBorrow(false);
                      return t(keys.borrow.states.success);
                    },
                    error: (err) => err?.message || t(keys.borrow.states.error),
                  }
                );
              }}
            />
            <AddBookmarkDialog
              bookId={book.id!}
              open={openAddToFolder}
              onOpenChange={setOpenAddToFolder}
            />
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className='mx-auto mt-6 max-w-5xl px-4 md:mt-10'>
        <BookTabs book={book as BookResponse} />
      </div>
    </div>
  );
}
