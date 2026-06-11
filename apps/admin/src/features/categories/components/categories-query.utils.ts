import { z } from 'zod';
import { type ColumnFiltersState, type SortingState } from '@tanstack/react-table';
import { type FindParams, FilterOperator, SortDirection } from '@repo/types';

// --- Helpers ---
const commaSeparatedArray = z.string().transform((val) => val.split(',').filter(Boolean));
const arrayOrComma = z.union([z.array(z.string()), commaSeparatedArray]).catch([]);

// --- Constants ---
export const DEFAULT_CATEGORY_PAGE = 1;
export const DEFAULT_CATEGORY_LIMIT = 10;
export const DEFAULT_CATEGORY_SORT_FIELD = 'createdAt';
export const DEFAULT_CATEGORY_SORT_ORDER = SortDirection.DESC;

// --- Schemas ---
export const categoryFilterSchema = z.object({
  query: z.string().catch(''),
  lang: arrayOrComma,
});

export const categoryFilterFormSchema = z.object({
  query: z.string(),
  lang: z.array(z.string()),
});

export const categorySortSchema = z.object({
  sortBy: z.string().default(DEFAULT_CATEGORY_SORT_FIELD).catch(DEFAULT_CATEGORY_SORT_FIELD),
  sortOrder: z
    .nativeEnum(SortDirection)
    .default(DEFAULT_CATEGORY_SORT_ORDER)
    .catch(DEFAULT_CATEGORY_SORT_ORDER),
});

export const categoryQuerySchema = categoryFilterSchema
  .extend({
    page: z.coerce.number().int().positive().catch(DEFAULT_CATEGORY_PAGE),
    limit: z.coerce.number().int().positive().catch(DEFAULT_CATEGORY_LIMIT),
  })
  .merge(categorySortSchema);

// --- Types ---
export type CategoryQueryState = z.infer<typeof categoryQuerySchema>;
export type CategoryFilterState = z.infer<typeof categoryFilterSchema>;

// --- Logic Helpers ---
export function buildCategoryFindParams(
  page: number,
  limit: number,
  query: string,
  sorting: SortingState,
  columnFilters: ColumnFiltersState
): FindParams {
  const sortBy = sorting[0]?.id || DEFAULT_CATEGORY_SORT_FIELD;
  const sortOrder = sorting[0]?.desc ? SortDirection.DESC : SortDirection.ASC;
  const lang = (columnFilters.find((f) => f.id === 'lang')?.value as string[]) || [];

  return {
    page,
    limit,
    query,
    filters: lang.length
      ? [{ field: 'translations.lang', value: lang, operator: FilterOperator.IN }]
      : [],
    sorts: [{ field: sortBy, direction: sortOrder }],
  };
}
