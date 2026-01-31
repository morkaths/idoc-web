"use client";

import { BookGridItems } from "@/components/book/book-grid-items";
import { useBooks } from "@/hooks/data/useBook";

export function RecommendedBooks() {
    const { data: recommendedBooksData, isLoading, error } = useBooks();
    const recommendedBooks = recommendedBooksData?.data || [];

    return (
        <div className="mt-4">
            <BookGridItems data={recommendedBooks} loading={isLoading} error={error?.message} />
        </div>
    );
}
