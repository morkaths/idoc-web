import { FilterOperator, SortDirection } from './enum';

/**
 * Pagination metadata often returned from the API
 */
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  last?: boolean;
}

/**
 * Single sort criteria
 */
export interface SortItem {
  field: string;
  direction?: SortDirection;
}

/**
 * Single filter criteria
 */
export interface FilterItem {
  field: string;
  value: unknown;
  operator?: FilterOperator;
}

/**
 * Generic parameters for paginated requests
 */
export interface PageParams {
  page?: number;
  limit?: number;
  query?: string;
  sorts?: SortItem[];
  includes?: string[];
}

/**
 * Extended parameters for filtered and paginated requests
 */
export interface FindParams extends PageParams {
  filters?: FilterItem[];
}

/**
 * Generic option type for view modes or similar selections
 */
export interface ViewModeOption {
  value: string;
  label: string;
  icon: string;
}
