import { Icon } from '@iconify/react';
import { Book } from "@/types";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useDeleteBookmark } from "@/hooks/data/useBookmark";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/hooks/ui/useLocale';
import { useBookmarkContext } from './bookmark-provider';

type BookGridItemProps = {
  book: Book;
  onClick?: () => void;
};

export function BookGridItem({
  book,
  onClick,
}: BookGridItemProps) {
  const { t, keys } = useLocale('books');
  const [imageError, setImageError] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(book.bookmarkId);
  const isBookmarked = !!bookmarkId;

  const { setOpen, setCurrentBook } = useBookmarkContext();
  const { mutate: deleteBookmark, isPending: isDeleting } = useDeleteBookmark();

  const isLoading = isDeleting;

  // Sync state with props
  useEffect(() => {
    setBookmarkId(book.bookmarkId);
  }, [book.bookmarkId]);

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    if (isBookmarked) {
      if (bookmarkId) {
        deleteBookmark(bookmarkId, {
          onSuccess: () => {
            setBookmarkId(undefined);
            toast.success(t(keys.view.bookmark.removed));
          },
          onError: (error) => {
            console.error("Failed to unbookmark:", error);
            toast.error(t(keys.view.bookmark.error));
          }
        });
      } else {
        console.warn("Cannot unbookmark: Missing bookmark ID");
      }
    } else {
      setCurrentBook(book);
      setOpen(true);
    }
  };

  return (
    <>
      <div
        onClick={onClick}
        className="group relative flex flex-col w-full max-w-[240px] bg-white dark:bg-zinc-900 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-zinc-800 h-full"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(); }}
      >
        {/* Top Background Pattern */}
        <div className="h-46 w-full bg-primary/10 dark:bg-primary/10" />

        {/* Book Cover Container */}
        <div className="relative px-4 -mt-36 w-full flex justify-center z-10 w-full">
          <div className="relative w-36 aspect-[3/4] shadow-[0_8px_16px_rgb(0,0,0,0.15)] dark:shadow-[0_8px_16px_rgb(0,0,0,0.3)] rounded-sm overflow-hidden transition-transform duration-300 group-hover:-translate-y-1 bg-white dark:bg-zinc-800">
            {!imageError && book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 200px"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-3 text-center bg-muted/20 dark:bg-zinc-800/50">
                <span className="font-medium text-xs sm:text-sm line-clamp-4 leading-tight opacity-60 break-words w-full px-2">
                  {book.title}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 pt-3 flex flex-col flex-grow">
          <span className="text-xs text-muted-foreground mb-1 font-medium tracking-wide block text-left">
            Ebook
          </span>

          <h3 className="font-bold text-foreground text-base leading-snug line-clamp-2 mb-1 text-left h-[44px]" title={book.title}>
            {book.title}
          </h3>

          <div className="text-sm text-muted-foreground mb-2 line-clamp-1 text-left" title={book.authors?.map(a => a.name).join(", ")}>
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

          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-0.5 text-amber-500">
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
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
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
