import { ApiEndpoint } from '@/config/api';
import type { AuthorResponse, AuthorRequest } from '../types';
import { apiFactory } from './factory';

const factory = apiFactory<AuthorResponse, AuthorRequest>(
  ApiEndpoint.endpoints.authors,
  {
    find: 'public',
    findById: 'public',
    findByIds: 'public',
  }
);

export const AuthorApi = {
  ...factory,
};
