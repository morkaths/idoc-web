import { useState } from 'react';
import { Icon } from '@iconify/react';
import { type BookResponse } from "@/types";
import { cn } from "@/lib/utils";
import { useDeleteBookmark } from "@/hooks/data/useBookmark";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/hooks/ui/useLocale';
import { useBookmarkContext } from './bookmark-provider';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import paths from '@/config/path';
import BookCover3d from '@repo/ui/components/book-cover-3d';
import { isValidCover } from '@/lib/book-utils';

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
          }
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
        "group relative flex w-full bg-white dark:bg-zinc-900 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer border border-gray-100 dark:border-zinc-800 transition-colors duration-200 hover:border-gray-300 dark:hover:border-zinc-700",
        className
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
    >
      {/* Left Accent Area with Book Cover - Synced with BookGridItem Primary */}
      <div className="relative w-24 sm:w-36 shrink-0 bg-primary/10 dark:bg-primary/20 flex items-center justify-center p-1 sm:p-2">
        <BookCover3d
          src={coverSrc}
          title={book.title}
          width={96}
          className="scale-90 sm:scale-100 p-0 sm:p-1 origin-center"
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 p-2 sm:p-3 flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-2 text-[9px] sm:text-xs text-gray-400 dark:text-gray-500 mb-1 font-medium">
          <span>Ebook</span>
        </div>

        <h3 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-zinc-100 mb-1 sm:mb-2 line-clamp-2 sm:truncate leading-tight transition-colors text-left" title={book.title}>
          {book.title}
        </h3>

        <div className="text-[11px] sm:text-sm text-muted-foreground mb-1 sm:mb-2 line-clamp-1 text-left" title={book.authors?.map(a => a.name).join(", ")}>
          {book.authors?.length ? (
            book.authors.map((a, i) => (
              <span key={i}>
                <span className="underline decoration-gray-300 dark:decoration-gray-600 underline-offset-2 hover:text-primary hover:decoration-primary transition-colors">
                  {a.name}
                </span>
                {i < (book.authors?.length || 0) - 1 && ", "}
              </span>
            ))
          ) : (
            t(keys.view.author)
          )}
        </div>

        <p className="text-[11px] sm:text-sm text-muted-foreground dark:text-gray-400 line-clamp-1 sm:line-clamp-2 max-w-2xl text-left leading-relaxed" title={book.description}>
          {book.description || t(keys.view.description)}
        </p>

        {/* Syncing rating style from BookGridItem */}
        <div className="mt-1.5 sm:mt-3 flex items-center justify-between border-t border-gray-50 dark:border-zinc-800/50 pt-1.5 sm:pt-3">
          <div className="flex flex-col gap-0.5">
            {/* Mobile Rating View (1 star + score) */}
            <div className="flex sm:hidden items-center gap-1 text-amber-500 dark:text-amber-400">
              <Icon icon="mdi:star" width={12} height={12} />
              <span className="text-xs font-semibold text-foreground">
                {book.rating ? book.rating.toFixed(1) : "0"}
              </span>
              <span className="text-xs text-muted-foreground">
                ({book.totalReviews || 0})
              </span>
            </div>

            {/* Desktop Rating View (5 stars) */}
            <div className="hidden sm:flex items-center gap-0.5 text-amber-500 dark:text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon
                  key={i}
                  icon={i < Math.round(book.rating || 0) ? "mdi:star" : "mdi:star-outline"}
                  width={14}
                  height={14}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">
                ({book.totalReviews || 0})
              </span>
            </div>
          </div>

          <button
            onClick={handleToggleBookmark}
            disabled={isLoading}
            className={`text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-zinc-200 transition-colors p-1 ${isBookmarked ? "text-primary hover:text-primary/80" : ""
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-primary" />
            ) : (
              <Icon
                icon={isBookmarked ? "mdi:bookmark" : "mdi:bookmark-outline"}
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
