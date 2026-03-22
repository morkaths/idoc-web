import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/components/pagination";
import { Pagination as PaginationType } from "@/types";
import { cn } from "@repo/ui/lib/utils";
import { useLocale } from '@/hooks/ui/useLocale';

type Props = {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Pagination({ pagination, onPageChange, className }: Props) {
  const { t, keys } = useLocale('common');
  const { page, pages } = pagination;
  if (pages <= 1) return null;

  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(pages, page + 2);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const renderLink = (p: number, label?: string | number, isActive = false) => (
    <PaginationItem key={p}>
      <PaginationLink
        href="#"
        isActive={isActive}
        onClick={(e) => { e.preventDefault(); if (p !== page) onPageChange(p); }}
      >
        {label ?? p}
      </PaginationLink>
    </PaginationItem>
  );

  const isFirst = page <= 1;
  const isLast = page >= pages;

  return (
    <ShadcnPagination className={cn("mt-8", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => { e.preventDefault(); if (!isFirst) onPageChange(page - 1); }}
            className={cn(isFirst && "pointer-events-none opacity-50 select-none cursor-not-allowed")}
            aria-disabled={isFirst}
            tabIndex={isFirst ? -1 : 0}
          >
            {t(keys.actions.previous)}
          </PaginationPrevious>
        </PaginationItem>

        {startPage > 1 && (
          <>
            {renderLink(1)}
            {startPage > 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
          </>
        )}

        {pageNumbers.map((p) => renderLink(p, p, p === page))}

        {endPage < pages && (
          <>
            {endPage < pages - 1 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
            {renderLink(pages)}
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => { e.preventDefault(); if (!isLast) onPageChange(page + 1); }}
            className={cn(isLast && "pointer-events-none opacity-50 select-none cursor-not-allowed")}
            aria-disabled={isLast}
            tabIndex={isLast ? -1 : 0}
          >
            {t(keys.actions.next)}
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
}
