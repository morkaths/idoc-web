import { z } from 'zod';
import { type ColumnFiltersState, type SortingState } from '@tanstack/react-table';
import { type FindParams, FilterOperator, SortDirection } from '@repo/types';

// --- Helpers ---
const commaSeparatedArray = z.string().transform((val) => val.split(',').filter(Boolean));
const arrayOrComma = z.union([z.array(z.string()), commaSeparatedArray]).catch([]);

// --- Constants ---
export const DEFAULT_BORROW_PAGE = 1;
export const DEFAULT_BORROW_LIMIT = 10;
export const DEFAULT_BORROW_SORT_FIELD = 'borrowedDate';
export const DEFAULT_BORROW_SORT_ORDER = SortDirection.DESC;

// --- Schemas ---
export const borrowFilterSchema = z.object({
  query: z.string().catch(''),
  status: arrayOrComma,
});

export const borrowFilterFormSchema = z.object({
  query: z.string(),
  status: z.array(z.string()),
});

export const borrowSortSchema = z.object({
  sortBy: z.string().default(DEFAULT_BORROW_SORT_FIELD).catch(DEFAULT_BORROW_SORT_FIELD),
  sortOrder: z.nativeEnum(SortDirection).default(DEFAULT_BORROW_SORT_ORDER).catch(DEFAULT_BORROW_SORT_ORDER),
});

export const borrowQuerySchema = borrowFilterSchema.extend({
  page: z.coerce.number().int().positive().catch(DEFAULT_BORROW_PAGE),
  limit: z.coerce.number().int().positive().catch(DEFAULT_BORROW_LIMIT),
}).merge(borrowSortSchema);

// --- Types ---
export type BorrowQueryState = z.infer<typeof borrowQuerySchema>;
export type BorrowFilterState = z.infer<typeof borrowFilterSchema>;

// --- Logic Helpers ---
export function buildBorrowFindParams(
  page: number,
  limit: number,
  query: string,
  sorting: SortingState,
  columnFilters: ColumnFiltersState
): FindParams {
  const sortBy = sorting[0]?.id || DEFAULT_BORROW_SORT_FIELD;
  const sortOrder = sorting[0]?.desc ? SortDirection.DESC : SortDirection.ASC;
  const status = (columnFilters.find((f) => f.id === 'status')?.value as string[]) || [];

  return {
    page,
    limit,
    query,
    filters: status.length
      ? [{ field: 'status', value: status, operator: FilterOperator.IN }]
      : [],
    sorts: [{ field: sortBy, direction: sortOrder }],
  };
}
