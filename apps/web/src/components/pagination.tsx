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

type Props = {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
};

export default function Pagination({ pagination, onPageChange }: Props) {
  const { page, pages } = pagination;

  const pageNumbers: number[] = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++) {
    pageNumbers.push(i);
  }
  const firstPageNumber = pageNumbers[0] ?? 1;
  const lastPageNumber = pageNumbers[pageNumbers.length - 1] ?? pages;

  return (
    <ShadcnPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={e => {
              e.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
            aria-disabled={page <= 1}
          />
        </PaginationItem>
        {pageNumbers.length > 0 && firstPageNumber > 1 && (
          <>
            <PaginationItem>
              <PaginationLink href="#" onClick={e => { e.preventDefault(); onPageChange(1); }}>
                1
              </PaginationLink>
            </PaginationItem>
            {firstPageNumber > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}
        {pageNumbers.map(p => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#"
              isActive={p === page}
              onClick={e => { e.preventDefault(); onPageChange(p); }}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        {lastPageNumber < pages && (
          <>
            {lastPageNumber < pages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href="#" onClick={e => { e.preventDefault(); onPageChange(pages); }}>
                {pages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={e => {
              e.preventDefault();
              if (page < pages) onPageChange(page + 1);
            }}
            aria-disabled={page >= pages}
          />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
}