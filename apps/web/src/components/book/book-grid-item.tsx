import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import paths from '@/config/path';
import { isValidCover } from '@/lib/book-utils';
import { type BookResponse } from '@/types';
import { Icon } from '@iconify/react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useDeleteBookmark } from '@/hooks/data/useBookmark';
import { useLocale } from '@/hooks/ui/useLocale';
import BookCover3d from '@repo/ui/components/book-cover-3d';
import { useBookmarkContext } from './bookmark-provider';

type BookGridItemProps = {
  book: BookResponse;
  onClick?: () => void;
};

export function BookGridItem({ book, onClick }: BookGridItemProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { t, keys } = useLocale('books');
  const [localBookmarkId, setLocalBookmarkId] = useState<string | undefined | null>(null);
  const bookmarkId = localBookmarkId !== null ? localBookmarkId : book.bookmarkId;
  const isBookmarked = !!bookmarkId;
  const coverSrc = isValidCover(book.coverUrl) ? book.coverUrl : undefined;

  const { setOpen, setCurrentBook } = useBookmarkContext();
  const { mutate: deleteBookmark, isPending: isDeleting } = useDeleteBookmark();

  const isLoading = isDeleting;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(paths.book(book.id));
    }
  };

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    if (isBookmarked) {
      const activeBookmarkId = book.bookmarkId || bookmarkId;
      if (activeBookmarkId) {
        deleteBookmark(String(activeBookmarkId), {
          onSuccess: () => {
            setLocalBookmarkId(undefined);
            toast.success(t(keys.view.bookmark.removed));
          },
          onError: () => {
            toast.error(t(keys.view.bookmark.error));
          },
        });
      }
    } else {
      if (!session?.user) {
        router.push(`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      setCurrentBook(book);
      setOpen(true);
    }
  };

  const authorNames = useMemo(() => {
    return book.authors?.map((a) => a.name).join(', ');
  }, [book.authors]);

  return (
    <>
      <div
        onClick={handleClick}
        className={`group relative flex h-full w-full max-w-[180px] cursor-pointer flex-col rounded-md border border-gray-200/80 bg-zinc-50/90 pb-1 transition-colors duration-200 hover:border-gray-300 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700`}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleClick();
        }}
      >
        {/* Top Background Pattern - Wrapped in container to handle overflow-hidden locally */}
        <div
          className={`pointer-events-none absolute top-0 right-0 left-0 h-[40%] overflow-hidden rounded-md`}
        >
          <div className='bg-primary/10 dark:bg-primary/20 h-full w-full' />
        </div>
        <div className={`invisible h-20 w-full`} aria-hidden='true' />

        <div
          className={`relative z-10 -mt-14 flex w-full justify-center px-2 transition-transform duration-500 sm:px-3`}
        >
          <BookCover3d
            src={coverSrc}
            title={book.title}
            width={115}
            wrapperClassName='p-1 sm:p-1.5'
            className='p-1 sm:p-1.5'
          />
        </div>

        {/* Content */}
        <div className={`flex flex-grow flex-col !p-2.5 !pt-0.5 sm:!p-3 sm:!pt-0.5`}>
          <span className='text-muted-foreground mb-0.5 block text-left text-[10px] font-medium tracking-wide sm:text-xs'>
            Ebook
          </span>

          <h3
            className='text-foreground line-clamp-2 h-[35px] text-left text-sm leading-snug font-bold sm:h-[40px] sm:text-base'
            title={book.title}
          >
            {book.title}
          </h3>

          <div
            className='text-muted-foreground mt-1 line-clamp-1 text-left text-xs sm:text-sm'
            title={authorNames}
          >
            {book.authors?.length
              ? book.authors.map((a, i) => (
                  <span key={i}>
                    <span className='hover:text-primary hover:decoration-primary underline decoration-gray-300 underline-offset-2 transition-colors'>
                      {a.name}
                    </span>
                    {i < (book.authors?.length || 0) - 1 && ', '}
                  </span>
                ))
              : t(keys.view.author)}
          </div>

          <div className={`mt-auto flex items-center justify-between`}>
            <div className='flex flex-col gap-0.5'>
              <div className='flex items-center gap-1 text-amber-500 sm:hidden'>
                <Icon icon='mdi:star' width={14} height={14} />
                <span className='text-foreground text-xs font-semibold'>
                  {book.rating ? book.rating.toFixed(1) : '0'}
                </span>
                <span className='text-muted-foreground text-xs'>({book.totalReviews || 0})</span>
              </div>

              <div className={`hidden items-center gap-0.5 text-amber-500 sm:flex`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon
                    key={i}
                    icon={i < Math.round(book.rating || 0) ? 'mdi:star' : 'mdi:star-outline'}
                    width={14}
                    height={14}
                  />
                ))}
                <span className='text-muted-foreground ml-1 text-xs'>
                  ({book.totalReviews || 0})
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleBookmark}
              disabled={isLoading}
              className={`p-1 transition-colors ${
                isBookmarked
                  ? 'text-primary hover:text-primary/80'
                  : 'text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-zinc-200'
              } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {isLoading ? (
                <Loader2 className={`text-primary h-5 w-5 animate-spin`} />
              ) : (
                <Icon
                  icon={isBookmarked ? 'mdi:bookmark' : 'mdi:bookmark-outline'}
                  width={20}
                  height={20}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
