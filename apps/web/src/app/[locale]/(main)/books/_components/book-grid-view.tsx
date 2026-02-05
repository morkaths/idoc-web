"use client";

import { Book, Pagination as PaginationType } from "@/types";
import { BookGridItems } from "@/components/book/book-grid-items";
import { Pagination } from "@/components/pagination";

export function BookGridView({
  data = [],
  loading = false,
  error,
  pagination,
  onPageChange,
}: {
  data?: Book[];
  loading?: boolean;
  error?: string;
  pagination?: PaginationType;
  onPageChange?: (page: number) => void;
}) {
  return (
    <div className="space-y-6">
      <BookGridItems data={data} loading={loading} error={error} />
      {pagination && onPageChange && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
}