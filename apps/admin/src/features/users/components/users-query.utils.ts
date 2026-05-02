import { type ColumnFiltersState, type SortingState } from '@tanstack/react-table';
import { type FindParams, SortDirection, FilterOperator } from '@repo/types';
import { z } from 'zod';

// --- Helpers ---
const commaSeparatedArray = z.string().transform((val) => val.split(',').filter(Boolean));
const arrayOrComma = z.union([z.array(z.string()), commaSeparatedArray]).catch([]);

// --- Constants ---
export const DEFAULT_USER_PAGE = 1;
export const DEFAULT_USER_LIMIT = 10;
export const DEFAULT_USER_SORT_FIELD = 'createdAt';
export const DEFAULT_USER_SORT_ORDER = SortDirection.DESC;

// --- Schemas ---

export const userFilterSchema = z.object({
  query: z.string().catch(''),
  status: arrayOrComma,
});

export const userFilterFormSchema = z.object({
  query: z.string(),
  status: z.array(z.string()),
});

export const userSortSchema = z.object({
  sortBy: z.string().default(DEFAULT_USER_SORT_FIELD).catch(DEFAULT_USER_SORT_FIELD),
  sortOrder: z.nativeEnum(SortDirection).default(DEFAULT_USER_SORT_ORDER).catch(DEFAULT_USER_SORT_ORDER),
});

export const userQuerySchema = userFilterSchema.extend({
  page: z.coerce.number().int().positive().catch(DEFAULT_USER_PAGE),
  limit: z.coerce.number().int().positive().catch(DEFAULT_USER_LIMIT),
}).merge(userSortSchema);

// --- Types ---
export type UserQueryState = z.infer<typeof userQuerySchema>;
export type UserFilterState = z.infer<typeof userFilterSchema>;

// --- Logic Helpers ---

export function buildUserFindParams(
  page: number,
  limit: number,
  query: string,
  sorting: SortingState,
  columnFilters: ColumnFiltersState
): FindParams {
  const sortBy = sorting[0]?.id || DEFAULT_USER_SORT_FIELD;
  const sortOrder = sorting[0]?.desc ? SortDirection.DESC : SortDirection.ASC;

  const status = (columnFilters.find((f) => f.id === 'status')?.value as string[]) || [];
  const role = (columnFilters.find((f) => f.id === 'role')?.value as string[]) || [];

  const filters = [];

  if (status.length > 0) {
    filters.push({ field: 'status', value: status, operator: FilterOperator.IN });
  }

  if (role.length > 0) {
    filters.push({ field: 'role', value: role, operator: FilterOperator.IN });
  }

  return {
    page,
    limit,
    query,
    filters,
    sorts: [{ field: sortBy, direction: sortOrder }],
  };
}
