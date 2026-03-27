import { ApiEndpoint } from '@/config/api';
import type { Collection, CollectionRequest } from '../types';
import { apiFactory } from './factory';

export const CollectionApi = apiFactory<Collection, CollectionRequest>(
  ApiEndpoint.endpoints.collections,
  'Collection',
  { find: 'public', findById: 'public' }
);
