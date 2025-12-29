"use client";

import { useBooks } from "@/hooks/data/useBook";
import { FindParams } from "@/types";
import { useEffect, useState } from "react";
import BookGridView from "./book-grid-view";
import BookListView from "./book-list-view";

export default function BookView({
    filter,
    view = "grid",
}: {
    filter: Partial<FindParams>;
    view?: "grid" | "list";
}) {
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useBooks({ page, ...filter });
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(1);
    }, [filter]);

    const commonProps = {
        data: data?.data,
        loading: isLoading,
        error: error?.message,
        pagination: data?.pagination,
        onPageChange: setPage,
    };

    return view === "list" ? (
        <BookListView {...commonProps} />
    ) : (
        <BookGridView {...commonProps} />
    );
}