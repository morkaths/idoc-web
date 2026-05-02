import { type ColumnFiltersState, type SortingState } from '@tanstack/react-table';
import { type FilterItem, type FindParams, type SortItem } from '@/types';

/**
 * Filter state for borrow history.
 */
export interface BorrowFilterState {
  query?: string;
  status?: string[];
}

/**
 * Available sort fields for borrow history.
 */
export type BorrowSortField = 'borrowedAt' | 'dueDate' | 'returnedAt' | 'createdAt' | 'updatedAt';

/**
 * Sort state for borrow history.
 */
export interface BorrowSortState {
  sortBy?: BorrowSortField;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Builds FindParams for Borrow API from internal table state.
 *
 * @param page Current page (1-indexed)
 * @param limit Items per page
 * @param query Global search query
 * @param sorting TanStack Table sorting state
 * @param columnFilters TanStack Table column filters state
 * @returns FindParams object for API calls
 */
export function buildBorrowFindParams(
  page: number,
  limit: number,
  query: string,
  sorting: SortingState,
  columnFilters: ColumnFiltersState
): FindParams {
  const sorts: SortItem[] | undefined = sorting[0]
    ? [
      {
        field: String(sorting[0].id),
        direction: (sorting[0].desc ? 'desc' : 'asc') as 'asc' | 'desc',
      },
    ]
    : undefined;

  const filters: FilterItem[] = [];
  columnFilters.forEach((f) => {
    if (f.id === 'status' && Array.isArray(f.value)) {
      filters.push({
        field: 'status',
        value: f.value,
        operator: 'in',
      });
    }
  });

  return {
    page,
    limit,
    query: query ?? '',
    sorts,
    filters: filters.length > 0 ? filters : undefined,
  };
}

/**
 * Builds URL search string from filter and sort state.
 */
export const buildBorrowQueryString = (
  page: number,
  query: string,
  sorting: SortingState,
  columnFilters: ColumnFiltersState
): string => {
  const p = new URLSearchParams();
  if (query) p.set('q', query);
  if (page > 1) p.set('page', String(page));

  // Serialize sorting
  if (sorting[0]) {
    p.set('sortBy', sorting[0].id);
    p.set('sortOrder', sorting[0].desc ? 'desc' : 'asc');
  }

  // Serialize column filters
  columnFilters.forEach((f) => {
    if (Array.isArray(f.value) && f.value.length > 0) {
      p.set(f.id, f.value.join(','));
    } else if (f.value) {
      p.set(f.id, String(f.value));
    }
  });

  return p.toString();
};
