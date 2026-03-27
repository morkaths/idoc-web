import { ApiEndpoint } from '@/config/api';
import type { Book, BookRequest } from '../types';
import { apiFactory } from './factory';

export const BookApi = apiFactory<Book, BookRequest>(
  ApiEndpoint.endpoints.books,
  'Book',
  { find: 'public', findById: 'public' }
);