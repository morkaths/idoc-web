import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import paths from '@/config/path';
import { isValidCover } from '@/lib/book-utils';
import { cn } from '@/lib/utils';
import { type BookResponse } from '@/types';
import { Icon } from '@iconify/react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useDeleteBookmark } from '@/hooks/data/useBookmark';
import { useLocale } from '@/hooks/ui/useLocale';
import BookCover3d from '@repo/ui/components/book-cover-3d';
import { useBookmarkContext } from './bookmark-provider';

type BookListItemProps = {
  book: BookResponse;
  onClick?: () => void;
  className?: string;
};

export function BookListItem({ book, onClick, className }: BookListItemProps) {
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
        deleteBookmark(activeBookmarkId, {
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

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative flex w-full cursor-pointer overflow-hidden rounded-lg border border-gray-100 bg-white transition-colors duration-200 hover:border-gray-300 sm:rounded-xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700',
        className
      )}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleClick();
      }}
    >
      {/* Left Accent Area with Book Cover - Synced with BookGridItem Primary */}
      <div className='bg-primary/10 dark:bg-primary/20 relative flex w-24 shrink-0 items-center justify-center p-1 sm:w-36 sm:p-2'>
        <BookCover3d
          src={coverSrc}
          title={book.title}
          width={96}
          className='origin-center scale-90 p-0 sm:scale-100 sm:p-1'
        />
      </div>

      {/* Content Area */}
      <div className='flex min-w-0 flex-1 flex-col justify-center p-2 sm:p-3'>
        <div className='mb-1 flex items-center gap-2 text-[9px] font-medium text-gray-400 sm:text-xs dark:text-gray-500'>
          <span>Ebook</span>
        </div>

        <h3
          className='mb-1 line-clamp-2 text-left text-sm leading-tight font-bold text-gray-900 transition-colors sm:mb-2 sm:truncate sm:text-lg dark:text-zinc-100'
          title={book.title}
        >
          {book.title}
        </h3>

        <div
          className='text-muted-foreground mb-1 line-clamp-1 text-left text-[11px] sm:mb-2 sm:text-sm'
          title={book.authors?.map((a) => a.name).join(', ')}
        >
          {book.authors?.length
            ? book.authors.map((a, i) => (
                <span key={i}>
                  <span className='hover:text-primary hover:decoration-primary underline decoration-gray-300 underline-offset-2 transition-colors dark:decoration-gray-600'>
                    {a.name}
                  </span>
                  {i < (book.authors?.length || 0) - 1 && ', '}
                </span>
              ))
            : t(keys.view.author)}
        </div>

        <p
          className='text-muted-foreground line-clamp-1 max-w-2xl text-left text-[11px] leading-relaxed sm:line-clamp-2 sm:text-sm dark:text-gray-400'
          title={book.description}
        >
          {book.description || t(keys.view.description)}
        </p>

        {/* Syncing rating style from BookGridItem */}
        <div className='mt-1.5 flex items-center justify-between border-t border-gray-50 pt-1.5 sm:mt-3 sm:pt-3 dark:border-zinc-800/50'>
          <div className='flex flex-col gap-0.5'>
            {/* Mobile Rating View (1 star + score) */}
            <div className='flex items-center gap-1 text-amber-500 sm:hidden dark:text-amber-400'>
              <Icon icon='mdi:star' width={12} height={12} />
              <span className='text-foreground text-xs font-semibold'>
                {book.rating ? book.rating.toFixed(1) : '0'}
              </span>
              <span className='text-muted-foreground text-xs'>({book.totalReviews || 0})</span>
            </div>

            {/* Desktop Rating View (5 stars) */}
            <div className='hidden items-center gap-0.5 text-amber-500 sm:flex dark:text-amber-400'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon
                  key={i}
                  icon={i < Math.round(book.rating || 0) ? 'mdi:star' : 'mdi:star-outline'}
                  width={14}
                  height={14}
                />
              ))}
              <span className='text-muted-foreground ml-1 text-xs'>({book.totalReviews || 0})</span>
            </div>
          </div>

          <button
            onClick={handleToggleBookmark}
            disabled={isLoading}
            className={`p-1 text-gray-400 transition-colors hover:text-gray-900 dark:text-gray-500 dark:hover:text-zinc-200 ${
              isBookmarked ? 'text-primary hover:text-primary/80' : ''
            } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {isLoading ? (
              <Loader2 className='text-primary h-4 w-4 animate-spin sm:h-5 sm:w-5' />
            ) : (
              <Icon
                icon={isBookmarked ? 'mdi:bookmark' : 'mdi:bookmark-outline'}
                width={18}
                height={18}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
