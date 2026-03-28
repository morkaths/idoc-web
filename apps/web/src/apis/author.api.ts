import { API_CONFIG } from '@/config/api';
import type { AuthorRequest, AuthorResponse } from '../types';
import { apiFactory } from './factory';

export const AuthorApi = apiFactory<AuthorResponse, AuthorRequest>(
  API_CONFIG.endpoints.authors,
  'Author',
  {
    find: 'public',
    findById: 'public',
  }
);
