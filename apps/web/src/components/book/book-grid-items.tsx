"use client";

import { type BookResponse } from "@/types";
import { useRouter } from "next/navigation";
import paths from "@/config/path";
import { Skeleton } from "@repo/ui/components/skeleton";
import { SearchX } from "lucide-react";
import { BookGridItem } from "./book-grid-item";
import { useLocale } from '@/hooks/ui/useLocale';
import { BookmarkProvider } from "./bookmark-provider";

interface BookGridItemsProps {
    data?: BookResponse[];
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
                        className={`group relative flex flex-col w-full max-w-[200px] rounded-md overflow-hidden border border-gray-200/80 bg-zinc-50/90 dark:border-zinc-800 dark:bg-zinc-900/80 h-full pb-1`}
                    >
                        <div className={`absolute top-0 left-0 right-0 rounded-md overflow-hidden pointer-events-none h-[50%]`}>
                            <Skeleton className="h-full w-full rounded-none bg-zinc-100/80 dark:bg-zinc-800/40" />
                        </div>
                        <div className={`h-20 w-full invisible`} aria-hidden="true" />

                        <div className={`relative px-2 sm:px-3 flex justify-center z-10 w-full transition-transform duration-500 -mt-14`}>
                            <div className={`flex items-center justify-center p-1 sm:p-1.5`}>
                                <Skeleton className={`rounded-sm w-[120px] aspect-[3/4]`} />
                            </div>
                        </div>

                        <div className="flex flex-col flex-grow p-2 pt-1 sm:p-2">
                            <Skeleton className="mb-1 h-2 sm:h-3 w-10" />
                            <div className="space-y-1">
                                <Skeleton className="h-3 sm:h-4 w-full" />
                                <Skeleton className="h-3 sm:h-4 w-2/3" />
                            </div>
                            <Skeleton className="mt-2 h-2 sm:h-3 w-1/2" />

                            <div className="mt-auto flex items-center justify-between pt-1">
                                <div className="flex items-center gap-0.5">
                                    <Skeleton className="h-3 w-3 rounded-full" />
                                    <Skeleton className="h-3 w-3 rounded-full" />
                                    <Skeleton className="h-3 w-3 rounded-full" />
                                    <Skeleton className="h-3 w-3 rounded-full" />
                                    <Skeleton className="h-3 w-3 rounded-full" />
                                    <Skeleton className="ml-1 h-3 w-8" />
                                </div>
                                <Skeleton className="h-5 w-5 rounded-md" />
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
