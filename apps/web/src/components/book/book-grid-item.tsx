import { Icon } from '@iconify/react';
import { Book } from "@/types";
import Image from 'next/image';
import { useState } from 'react';

type BookGridItemProps = {
  book: Book;
  onClick?: () => void;
};

export function BookGridItem({
  book,
  onClick,
}: BookGridItemProps) {
  const [imageError, setImageError] = useState(false);

  return (
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
            "Unknown Author"
          )}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
             <div className="flex items-center gap-0.5 text-amber-500">
              {[1, 2, 3, 4].map((star) => (
                <Icon key={star} icon="mdi:star" width={14} height={14} />
              ))}
              <Icon icon="mdi:star-outline" width={14} height={14} />
            </div>
          </div>

          <button className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-zinc-200 transition-colors p-1">
            <Icon icon="mdi:bookmark-outline" width={20} height={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
