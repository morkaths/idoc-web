import { API_CONFIG } from '@/config/api';
import type { CategoryRequest, CategoryResponse, FindParams } from '../types';
import { apiFactory } from './factory';

const factory = apiFactory<CategoryResponse, CategoryRequest, { lang?: string }>(
  API_CONFIG.endpoints.categories,
  {
    find: 'public',
    findById: 'public',
  }
);

export const CategoryApi = {
  ...factory,
  find: (params?: FindParams) => factory.find({ ...params, lang: 'all' }),
  findById: (id: string) => factory.findById(id, { lang: 'all' }),
};
