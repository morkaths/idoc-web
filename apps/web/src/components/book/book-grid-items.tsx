"use client";

import React from "react";
import BookGridItem from "./book-grid-item";
import { Book } from "@/types";
import { useRouter } from "next/navigation";
import paths from "@/config/path";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Card, CardContent } from "@repo/ui/components/card";

interface BookGridItemsProps {
    data?: Book[];
    loading?: boolean;
    error?: string | null;
    className?: string;
}

const BookGridItems: React.FC<BookGridItemsProps> = ({
    data = [],
    loading = false,
    error = null,
    className = "",
}) => {
    const router = useRouter();

    if (!loading) {
        return (
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-items-center items-start ${className}`}>
                {[...Array(10)].map((_, i) => (
                    <Card key={i} className="w-full max-w-60">
                        <CardContent className="p-0">
                            <Skeleton className="aspect-3/4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4 mb-1" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                    </Card>
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
            <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                No books found.
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-items-center items-start ${className}`}>
            {data.map((book) => (
                <BookGridItem
                    key={book._id}
                    book={book}
                    onClick={() => router.push(paths.book(book.slug))}
                />
            ))}
        </div>
    );
};

export default BookGridItems;