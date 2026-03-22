"use client";

import { Book } from "@/types";
import { useRouter } from "next/navigation";
import paths from "@/config/path";
import { Skeleton } from "@repo/ui/components/skeleton";
import { SearchX } from "lucide-react";
import { BookGridItem } from "./book-grid-item";
import { useLocale } from '@/hooks/ui/useLocale';
import { BookmarkProvider } from "./bookmark-provider";

interface BookGridItemsProps {
    data?: Book[];
    loading?: boolean;
    error?: string | null;
    className?: string;
}

export function BookGridItems({
    data = [],
    loading = false,
    error = null,
    className = "",
}: BookGridItemsProps) {
    const router = useRouter();
    const { t, keys } = useLocale('books');

    if (loading) {
        return (
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-items-center items-start ${className}`}>
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-col w-full max-w-[240px] bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800 h-full"
                    >
                        {/* Top Background Pattern Skeleton */}
                        <Skeleton className="h-32 w-full rounded-none bg-primary/5" />

                        {/* Book Cover Skeleton */}
                        <div className="relative px-2 sm:px-4 -mt-24 w-full flex justify-center z-10">
                            <Skeleton className="w-28 sm:w-36 aspect-[3/4] shadow-md rounded-sm" />
                        </div>

                        {/* Content Skeleton */}
                        <div className="p-2 sm:p-3 pt-2 sm:pt-3 flex flex-col flex-grow gap-1 sm:gap-2">
                            <Skeleton className="h-2 sm:h-3 w-10" /> {/* Ebook tag */}
                            <div className="space-y-1">
                                <Skeleton className="h-3 sm:h-4 w-full" /> {/* Title line 1 */}
                                <Skeleton className="h-3 sm:h-4 w-2/3" /> {/* Title line 2 */}
                            </div>
                            <Skeleton className="h-2 sm:h-3 w-1/2 mt-1" /> {/* Author */}

                            <div className="mt-auto flex items-center justify-between pt-2">
                                <Skeleton className="h-3 w-16" /> {/* Rating stars */}
                                <Skeleton className="h-5 w-5 rounded-md" /> {/* Bookmark icon */}
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

    if (data.length === 0) {
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
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-items-center items-start ${className}`}>
                {data.map((book) => (
                    <BookGridItem
                        key={book.id}
                        book={book}
                        onClick={() => router.push(paths.book(book.id))}
                    />
                ))}
            </div>
        </BookmarkProvider>
    );
}