import { Icon } from '@iconify/react';
import { type BookResponse } from "@/types";
import { useState, useMemo } from 'react';
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

type BookGridItemProps = {
  book: BookResponse;
  onClick?: () => void;
};

export function BookGridItem({
  book,
  onClick,
}: BookGridItemProps) {
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

  const authorNames = useMemo(() => {
    return book.authors?.map(a => a.name).join(", ");
  }, [book.authors]);

  return (
    <>
      <div
        onClick={handleClick}
        className={`group relative flex flex-col w-full max-w-[200px] rounded-md cursor-pointer border border-gray-200/80 bg-zinc-50/90 transition-colors duration-200 hover:border-gray-300 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700 h-full pb-1}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
      >
        {/* Top Background Pattern - Wrapped in container to handle overflow-hidden locally */}
        <div className={`absolute top-0 left-0 right-0 rounded-md overflow-hidden pointer-events-none h-[40%]`}>
          <div className="h-full w-full bg-primary/10 dark:bg-primary/20" />
        </div>
        <div className={`h-20 w-full invisible`} aria-hidden="true" />

        <div className={`relative px-2 sm:px-3 flex justify-center z-10 w-full transition-transform duration-500 -mt-14`}>
            <BookCover3d
              src={coverSrc}
              title={book.title}
              width={115}
              wrapperClassName="p-1 sm:p-1.5"
              className="p-1 sm:p-1.5"
            />
        </div>

        {/* Content */}
        <div className={`flex flex-col flex-grow p-2 pt-0.5 sm:p-2 sm:pt-0.5`}>
          <span className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 font-medium tracking-wide block text-left">
            Ebook
          </span>

          <h3 className="font-bold text-foreground text-sm sm:text-base leading-snug line-clamp-2 text-left h-[35px] sm:h-[40px]" title={book.title}>
            {book.title}
          </h3>

          <div className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-1 text-left" title={authorNames}>
            {book.authors?.length ? (
              book.authors.map((a, i) => (
                <span key={i}>
                  <span className="underline decoration-gray-300 underline-offset-2 hover:text-primary hover:decoration-primary transition-colors">
                    {a.name}
                  </span>
                  {i < (book.authors?.length || 0) - 1 && ", "}
                </span>
              ))
            ) : (
              t(keys.view.author)
            )}
          </div>

          <div className={`mt-auto flex items-center justify-between`}>
            <div className="flex flex-col gap-0.5">
              <div className="flex sm:hidden items-center gap-1 text-amber-500">
                <Icon icon="mdi:star" width={14} height={14} />
                <span className="text-xs font-semibold text-foreground">
                  {book.rating ? book.rating.toFixed(1) : "0"}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({book.totalReviews || 0})
                </span>
              </div>

              <div className={`hidden sm:flex items-center gap-0.5 text-amber-500`}>
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
              className={`transition-colors p-1 ${isBookmarked
                ? "text-primary hover:text-primary/80"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-zinc-200"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <Loader2 className={`animate-spin text-primary w-5 h-5`} />
              ) : (
                <Icon
                  icon={isBookmarked ? "mdi:bookmark" : "mdi:bookmark-outline"}
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
