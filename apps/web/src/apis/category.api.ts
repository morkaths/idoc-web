import { API_CONFIG } from '@/config/api';
import type { CategoryRequest, CategoryResponse } from '../types';
import { apiFactory } from './factory';

export const CategoryApi = apiFactory<CategoryResponse, CategoryRequest>(
  API_CONFIG.endpoints.categories,
  'Category',
  {
    find: 'public',
    findById: 'public',
  }
);
