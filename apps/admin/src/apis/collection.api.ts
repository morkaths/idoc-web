import { ApiEndpoint } from '@/config/api';
import type { CollectionResponse, CollectionRequest } from '../types';
import { apiFactory } from './factory';

export const CollectionApi = apiFactory<CollectionResponse, CollectionRequest>(
  ApiEndpoint.endpoints.collections,
  'Collection',
  { find: 'public', findById: 'public' }
);
