import { ApiEndpoint } from '@/config/api';
import type { AuthorResponse, AuthorRequest } from '../types';
import { apiFactory } from './factory';

export const AuthorApi = apiFactory<AuthorResponse, AuthorRequest>(
  ApiEndpoint.endpoints.authors,
  'Author',
  {
    find: 'public',
    findById: 'public',
    findByIds: 'public',
  }
);