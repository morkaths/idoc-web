import { ApiEndpoint } from '@/config/api';
import type { AuthorRequest, AuthorResponse } from '../types';
import { apiFactory } from './factory';

const factory = apiFactory<AuthorResponse, AuthorRequest>(
  ApiEndpoint.endpoints.authors,
  {
    find: 'public',
    findById: 'public',
    search: 'public',
  }
);

export const AuthorApi = {
  ...factory,
};

