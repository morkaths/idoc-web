import { type ColumnFiltersState, type SortingState } from '@tanstack/react-table';
import { type FindParams, SortDirection, FilterOperator } from '@repo/types';
import { z } from 'zod';

// --- Helpers ---
const commaSeparatedArray = z.string().transform((val) => val.split(',').filter(Boolean));
const arrayOrComma = z.union([z.array(z.string()), commaSeparatedArray]).catch([]);

// --- Constants ---
export const DEFAULT_BOOK_PAGE = 1;
export const DEFAULT_BOOK_LIMIT = 10;
export const DEFAULT_BOOK_SORT_FIELD = 'createdAt';
export const DEFAULT_BOOK_SORT_ORDER = SortDirection.DESC;

// --- Schemas ---

export const bookFilterSchema = z.object({
  query: z.string().catch(''),
  categories: arrayOrComma,
  languages: arrayOrComma,
});

export const bookFilterFormSchema = z.object({
  query: z.string(),
  categories: z.array(z.string()),
  languages: z.array(z.string()),
});

export const bookSortSchema = z.object({
  sortBy: z.string().default(DEFAULT_BOOK_SORT_FIELD).catch(DEFAULT_BOOK_SORT_FIELD),
  sortOrder: z.nativeEnum(SortDirection).default(DEFAULT_BOOK_SORT_ORDER).catch(DEFAULT_BOOK_SORT_ORDER),
});

export const bookQuerySchema = bookFilterSchema.extend({
  page: z.coerce.number().int().positive().catch(DEFAULT_BOOK_PAGE),
  limit: z.coerce.number().int().positive().catch(DEFAULT_BOOK_LIMIT),
}).merge(bookSortSchema);

// --- Types ---
export type BookQueryState = z.infer<typeof bookQuerySchema>;
export type BookFilterState = z.infer<typeof bookFilterSchema>;

// --- Logic Helpers ---

export function buildBookFindParams(
  page: number,
  limit: number,
  query: string,
  sorting: SortingState,
  columnFilters: ColumnFiltersState
): FindParams {
  const sortBy = sorting[0]?.id || DEFAULT_BOOK_SORT_FIELD;
  const sortOrder = sorting[0]?.desc ? SortDirection.DESC : SortDirection.ASC;

  const categories = (columnFilters.find((f) => f.id === 'categories')?.value as string[]) || [];
  const languages = (columnFilters.find((f) => f.id === 'language')?.value as string[]) || [];

  const filters = [];

  if (categories.length > 0) {
    filters.push({ field: 'categories.id', value: categories, operator: FilterOperator.IN });
  }

  if (languages.length > 0) {
    filters.push({ field: 'language', value: languages, operator: FilterOperator.IN });
  }

  return {
    page,
    limit,
    query,
    filters,
    sorts: [{ field: sortBy, direction: sortOrder }],
  };
}


