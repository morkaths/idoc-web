import { z } from 'zod';
import { type ColumnFiltersState, type SortingState } from '@tanstack/react-table';
import { type FindParams, SortDirection, FilterOperator } from '@repo/types';

// --- Helpers ---
const commaSeparatedArray = z.string().transform((val) => val.split(',').filter(Boolean));
const arrayOrComma = z.union([z.array(z.string()), commaSeparatedArray]).catch([]);

// --- Constants ---
export const DEFAULT_AUTHOR_PAGE = 1;
export const DEFAULT_AUTHOR_LIMIT = 10;
export const DEFAULT_AUTHOR_SORT_FIELD = 'createdAt';
export const DEFAULT_AUTHOR_SORT_ORDER = SortDirection.DESC;

// --- Schemas ---

export const authorFilterSchema = z.object({
  query: z.string().catch(''),
  nationality: arrayOrComma,
});

export const authorFilterFormSchema = z.object({
  query: z.string(),
  nationality: z.array(z.string()),
});

export const authorSortSchema = z.object({
  sortBy: z.string().default(DEFAULT_AUTHOR_SORT_FIELD).catch(DEFAULT_AUTHOR_SORT_FIELD),
  sortOrder: z
    .nativeEnum(SortDirection)
    .default(DEFAULT_AUTHOR_SORT_ORDER)
    .catch(DEFAULT_AUTHOR_SORT_ORDER),
});

export const authorQuerySchema = authorFilterSchema
  .extend({
    page: z.coerce.number().int().positive().catch(DEFAULT_AUTHOR_PAGE),
    limit: z.coerce.number().int().positive().catch(DEFAULT_AUTHOR_LIMIT),
  })
  .merge(authorSortSchema);

// --- Types ---
export type AuthorQueryState = z.infer<typeof authorQuerySchema>;
export type AuthorFilterState = z.infer<typeof authorFilterSchema>;

// --- Logic Helpers ---

export function buildAuthorFindParams(
  page: number,
  limit: number,
  query: string,
  sorting: SortingState,
  columnFilters: ColumnFiltersState
): FindParams {
  const sortBy = sorting[0]?.id || DEFAULT_AUTHOR_SORT_FIELD;
  const sortOrder = sorting[0]?.desc ? SortDirection.DESC : SortDirection.ASC;

  const nationality = (columnFilters.find((f) => f.id === 'nationality')?.value as string[]) || [];

  const filters = [];

  if (nationality.length > 0) {
    filters.push({ field: 'nationality', value: nationality, operator: FilterOperator.IN });
  }

  return {
    page,
    limit,
    query,
    filters,
    sorts: [{ field: sortBy, direction: sortOrder }],
  };
}
