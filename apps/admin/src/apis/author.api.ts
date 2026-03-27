import { ApiEndpoint } from '@/config/api';
import type { Author, AuthorRequest } from '../types';
import { apiFactory } from './factory';

export const AuthorApi = apiFactory<Author, AuthorRequest>(
  ApiEndpoint.endpoints.authors,
  'Author',
  {
    find: 'public',
    findById: 'public',
    findByIds: 'public',
  }
);