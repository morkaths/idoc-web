import { API_CONFIG } from '@/config/api';
import type { BookResponse, BookRequest } from '../types';
import { apiFactory } from './factory';

export const BookApi = apiFactory<BookResponse, BookRequest>(API_CONFIG.endpoints.books, {
  find: 'public',
  search: 'public',
  findById: 'public',
});

