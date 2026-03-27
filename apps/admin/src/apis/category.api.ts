import { ApiEndpoint } from '@/config/api';
import type { Category, CategoryRequest } from '../types';
import { apiFactory } from './factory';

export const CategoryApi = apiFactory<Category, CategoryRequest>(
  ApiEndpoint.endpoints.categories,
  'Category',
  { find: 'public', findById: 'public' }
);
