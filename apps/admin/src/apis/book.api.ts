import { ApiEndpoint } from '@/config/api';
import type { BookResponse, BookRequest } from '../types';
import { apiFactory } from './factory';

export const BookApi = apiFactory<BookResponse, BookRequest>(
  ApiEndpoint.endpoints.books,
  'Book',
  { find: 'public', findById: 'public' }
);