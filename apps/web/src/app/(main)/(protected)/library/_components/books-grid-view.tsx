"use client";

import { useMemo, useState } from "react";
import { BookGridItems } from "@/components/book/book-grid-items";
import Pagination from "@/components/pagination";
import { useBorrowHistory } from "@/hooks/data/useBorrow";
import { Book, FindParams } from "@/types";

export default function BookGridView({ filter }: { filter: Partial<FindParams> }) {
    const [page, setPage] = useState(1);

    const { data, isLoading, error } = useBorrowHistory({ page, ...filter });
    const books: Book[] = useMemo(() => {
        const seen = new Set<string>();
        return (data?.data || [])
            .map(borrow => borrow.item)
            .filter((book): book is Book => {
                if (!book || seen.has(book._id)) return false;
                seen.add(book._id);
                return true;
            });
    }, [data]);

    return (
        <div className="space-y-6">
            <BookGridItems
                data={books}
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