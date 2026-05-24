import { type ColumnFiltersState, type SortingState } from '@tanstack/react-table';
import { type FindParams, FilterOperator, SortDirection } from '@repo/types';

// --- Constants ---
export const DEFAULT_STORAGE_PAGE = 1;
export const DEFAULT_STORAGE_LIMIT = 10;
export const DEFAULT_STORAGE_SORT_FIELD = 'createdAt';
export const DEFAULT_STORAGE_SORT_ORDER = SortDirection.DESC;

// --- Logic Helpers ---
export function buildStorageFindParams(
  page: number,
  limit: number,
  query: string,
  sorting: SortingState,
  columnFilters: ColumnFiltersState
): FindParams {
  const sortBy = sorting[0]?.id || DEFAULT_STORAGE_SORT_FIELD;
  const sortOrder = sorting[0]?.desc ? SortDirection.DESC : SortDirection.ASC;
  const contentType = (columnFilters.find((f) => f.id === 'contentType')?.value as string[]) || [];

  const filters = [];
  if (contentType.length > 0) {
    filters.push({
      field: 'contentType',
      value: contentType,
      operator: FilterOperator.IN,
    });
  }

  return {
    page,
    limit,
    query,
    filters,
    sorts: [{ field: sortBy, direction: sortOrder }],
  };
}
