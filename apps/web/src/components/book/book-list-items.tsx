"use client";

import { type BookResponse } from "@/types";
import { Skeleton } from "@repo/ui/components/skeleton";

import { SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import paths from "@/config/path";
import { BookListItem } from "./book-list-item";
import { useLocale } from '@/hooks/ui/useLocale';
import { BookmarkProvider } from "./bookmark-provider";

interface BookListItemsProps {
  data?: BookResponse[];
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export function BookListItems({
  data = [],
  loading = false,
  error = null,
  className = "",
}: BookListItemsProps) {
  const router = useRouter();
  const { t, keys } = useLocale('books');

  if (loading) {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex w-full bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-800 min-h-[180px]"
          >
            {/* Left Accent Area w/ Cover Skeleton */}
            <div className="w-32 sm:w-40 shrink-0 bg-primary/5 dark:bg-primary/10 flex items-center justify-center p-3 sm:p-4">
              <Skeleton className="w-24 sm:w-28 aspect-[3/4] shadow-md rounded-sm" />
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 p-3 sm:p-6 flex flex-col justify-center min-w-0">
              <Skeleton className="h-2 sm:h-3 w-10 sm:w-12 mb-2 sm:mb-3" /> {/* Tag */}

              <Skeleton className="h-5 sm:h-7 w-full sm:w-3/4 mb-2 sm:mb-3" /> {/* Title */}

              <Skeleton className="h-3 sm:h-4 w-1/2 sm:w-1/3 mb-3 sm:mb-4" /> {/* Author */}

              {/* Description */}
              <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                <Skeleton className="h-2.5 sm:h-3 w-full" />
                <Skeleton className="h-2.5 sm:h-3 w-5/6" />
              </div>

              {/* Bottom Row */}
              <div className="mt-auto pt-2 sm:pt-3 border-t border-gray-50 dark:border-zinc-800/50 flex items-center justify-between">
                <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" /> {/* Rating */}
                <Skeleton className="h-5 w-5 rounded-md" /> {/* Bookmark */}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-4 text-center rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
        {error}
      </div>
    );
  }
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 w-full bg-card/50 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800">
        <div className="bg-primary/5 p-6 rounded-full mb-4">
          <SearchX className="w-12 h-12 text-primary opacity-40" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-2">
          {t(keys.view.empty.title)}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm text-sm">
          {t(keys.view.empty.description)}
        </p>
      </div>
    );
  }
  return (
    <BookmarkProvider>
      <div className={`grid grid-cols-1 xl:grid-cols-2 gap-6 ${className}`}>
        {data.map((book) => (
          <BookListItem
            key={book.id}
            book={book}
            onClick={() => router.push(paths.book(book.id))}
          />
        ))}
      </div>
    </BookmarkProvider>
  );
}