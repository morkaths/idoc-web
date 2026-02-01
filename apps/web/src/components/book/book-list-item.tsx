import { useState, useEffect } from 'react';
import Image from "next/image";
import { Icon } from '@iconify/react';
import { Book } from "@/types";
import { cn } from "@/lib/utils";
import { useDeleteBookmark } from "@/hooks/data/useBookmark";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/hooks/ui/useLocale';
import { useBookmarkContext } from './bookmark-provider';

type BookListItemProps = {
  book: Book;
  onClick?: () => void;
  className?: string;
};

export function BookListItem({ book, onClick, className }: BookListItemProps) {
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
      }
    } else {
      setCurrentBook(book);
      setOpen(true);
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex w-full bg-white dark:bg-zinc-900 rounded-xl overflow-hidden cursor-pointer border border-gray-100 dark:border-zinc-800 transition-all duration-300 hover:shadow-md min-h-[180px]",
        className
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(); }}
    >
      {/* Left Accent Area with Book Cover - Synced with BookGridItem Primary */}
      <div className="relative w-46 shrink-0 bg-primary/10 dark:bg-primary/10 flex items-center justify-center p-4">
        <div className="relative w-28 aspect-[3/4] shadow-[0_8px_16px_rgb(0,0,0,0.1)] dark:shadow-[0_8px_16px_rgb(0,0,0,0.3)] rounded-sm overflow-hidden transition-transform duration-300 group-hover:-translate-y-1 bg-white dark:bg-zinc-800">
          {!imageError && book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              className="object-cover"
              sizes="150px"
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

      {/* Content Area */}
      <div className="flex-1 p-6 flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-1 font-medium">
          <span>Ebook</span>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2 truncate leading-tight transition-colors text-left" title={book.title}>
          {book.title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="text-sm text-gray-500 dark:text-gray-400 underline decoration-gray-300 dark:decoration-gray-600 underline-offset-2 hover:text-primary hover:decoration-primary dark:hover:text-primary dark:hover:decoration-primary transition-all mb-2 line-clamp-1 text-left">
            {book.authors?.length ? book.authors.map(a => a.name).join(", ") : t(keys.view.author)}
          </div>
        </div>

        <p className="text-sm text-muted-foreground dark:text-gray-400 line-clamp-2 max-w-2xl text-left leading-relaxed">
          {book.description || t(keys.view.description)}
        </p>

        {/* Syncing rating style from BookGridItem */}
        <div className="mt-3 flex items-center justify-between border-t border-gray-50 dark:border-zinc-800/50 pt-3">
          <div className="flex items-center gap-0.5 text-amber-500 dark:text-amber-400">
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

          <button
            onClick={handleToggleBookmark}
            disabled={isLoading}
            className={`text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-zinc-200 transition-colors p-1 ${isBookmarked ? "text-primary hover:text-primary/80" : ""
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
  );
}