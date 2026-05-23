import { z } from 'zod';
import {
  commaSeparatedArray,
  numericParam,
  parseSearchParams,
  buildQueryString,
} from '@/utils/query';
import { type FindParams, SortDirection, FilterOperator } from '@repo/types';

// --- Types & Constants ---

export enum BookSortField {
  TITLE = 'title',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  PUBLISHED_DATE = 'publishedDate',
  RATING = 'rating',
  TOTAL_REVIEWS = 'totalReviews',
}

export const DEFAULT_BOOK_PAGE = 1;
export const DEFAULT_BOOK_LIMIT = 12;
export const DEFAULT_BOOK_SORT_FIELD = BookSortField.CREATED_AT;
export const DEFAULT_BOOK_SORT_ORDER = SortDirection.DESC;

// --- Schemas ---

const arrayOrComma = z.union([z.array(z.string()), commaSeparatedArray]).catch([]);

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
  sortBy: z.nativeEnum(BookSortField).catch(DEFAULT_BOOK_SORT_FIELD),
  sortOrder: z.nativeEnum(SortDirection).catch(DEFAULT_BOOK_SORT_ORDER),
});

export const bookQuerySchema = bookFilterSchema
  .extend({
    page: numericParam(DEFAULT_BOOK_PAGE),
    limit: numericParam(DEFAULT_BOOK_LIMIT),
  })
  .merge(bookSortSchema);

// --- Derived Types ---

export type BookQueryState = z.infer<typeof bookQuerySchema>;
export type BookFilterState = z.infer<typeof bookFilterSchema>;
export type BookSortState = z.infer<typeof bookSortSchema>;

// --- Default States ---

export const DEFAULT_BOOK_FILTER: BookFilterState = { query: '', categories: [], languages: [] };
export const DEFAULT_BOOK_SORT: BookSortState = {
  sortBy: DEFAULT_BOOK_SORT_FIELD,
  sortOrder: DEFAULT_BOOK_SORT_ORDER,
};

export const parseBookQuery = (params: URLSearchParams) =>
  parseSearchParams(bookQuerySchema, params);

export const buildBookQuery = (
  filter: BookFilterState,
  sort: BookSortState,
  page = DEFAULT_BOOK_PAGE,
  limit = DEFAULT_BOOK_LIMIT
) =>
  buildQueryString({
    ...filter,
    sortBy: sort.sortBy !== DEFAULT_BOOK_SORT_FIELD ? sort.sortBy : undefined,
    sortOrder: sort.sortOrder !== DEFAULT_BOOK_SORT_ORDER ? sort.sortOrder : undefined,
    page: page !== DEFAULT_BOOK_PAGE ? page : undefined,
    limit: limit !== DEFAULT_BOOK_LIMIT ? limit : undefined,
  });

export const buildBookFindParams = (
  filter: BookFilterState,
  sort: BookSortState,
  page = DEFAULT_BOOK_PAGE,
  limit = DEFAULT_BOOK_LIMIT
): FindParams => ({
  page,
  limit,
  query: filter.query,
  filters: [
    ...(filter.categories.length
      ? [{ field: 'categories.id', value: filter.categories, operator: FilterOperator.IN }]
      : []),
    ...(filter.languages.length
      ? [{ field: 'language', value: filter.languages, operator: FilterOperator.IN }]
      : []),
  ],
  sorts: [{ field: sort.sortBy, direction: sort.sortOrder }],
});
