import { API_CONFIG } from '@/config/api';
import type { BookResponse, BookRequest } from '../types';
import { apiFactory } from './factory';

export const BookApi = apiFactory<BookResponse, BookRequest>(API_CONFIG.endpoints.books, 'Book', {
  find: 'public',
  findById: 'public',
});
