"use client";

import { useMemo, useState } from "react";
import { BookGridItems } from "@/components/book/book-grid-items";
import { Pagination } from "@/components/pagination";
import { useBorrowHistory } from "@/hooks/data/useBorrow";
import { BookResponse, FindParams } from "@/types";

import { useBookmarkStatus } from "@/hooks/data/useBookmark";

export default function BookGridView({ filter }: { filter: Partial<FindParams> }) {
    const [page, setPage] = useState(1);

    const { data, isLoading, error } = useBorrowHistory({ page, ...filter });
    const books: BookResponse[] = useMemo(() => {
        const seen = new Set<string>();
        return (data?.data || [])
            .map(borrow => borrow.item)
            .filter((book): book is BookResponse => {
                if (!book || seen.has(book.id)) return false;
                seen.add(book.id);
                return true;
            });
    }, [data]);

    const bookIds = useMemo(() => books.map(b => b.id), [books]);
    const { data: bookmarkStatus } = useBookmarkStatus(bookIds);

    const booksWithStatus = useMemo(() => {
        if (!bookmarkStatus) return books;
        return books.map(book => ({
            ...book,
            bookmarkId: bookmarkStatus[book.id] ?? book.bookmarkId
        }));
    }, [books, bookmarkStatus]);

    return (
        <div className="space-y-6">
            <BookGridItems
                data={booksWithStatus}
                loading={isLoading}
                error={error?.message}
            />
            {data?.pagination && (
                <Pagination
                    pagination={data.pagination}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
}