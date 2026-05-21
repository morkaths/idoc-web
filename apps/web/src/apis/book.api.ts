import { ApiEndpoint } from '@/config/api';
import type { BookResponse, BookRequest, FindParams } from '../types';
import { apiFactory } from './factory';

export type BookSearchParams = FindParams & {
  authorIds?: string[];
};

const factory = apiFactory<BookResponse, BookRequest, BookSearchParams>(
  ApiEndpoint.endpoints.books,
  {
    find: 'public',
    search: 'public',
    findById: 'public',
  }
);

export const BookApi = {
  ...factory,
};

