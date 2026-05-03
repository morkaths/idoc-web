import { ApiEndpoint } from '@/config/api';
import type { BookResponse, BookRequest } from '../types';
import { apiFactory } from './factory';

const factory = apiFactory<BookResponse, BookRequest>(
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

