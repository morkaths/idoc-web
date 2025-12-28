"use client";

import BookListItems from "@/components/book/book-list-items";
import Pagination from "@/components/pagination";
import { useBooks } from "@/hooks/data/useBook";
import { FindParams } from "@/types";
import { useState } from "react";

export default function BookListView({ filter }: { filter: Partial<FindParams> }) {
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useBooks({ page, ...filter });

    return (
        <>
            <BookListItems
                data={data?.data}
                loading={isLoading}
                error={error?.message}
            />
            {data?.pagination && (
                <Pagination
                    pagination={data.pagination}
                    onPageChange={setPage}
                />
            )}
        </>
    );
}