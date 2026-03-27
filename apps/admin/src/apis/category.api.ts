import { ApiEndpoint } from '@/config/api';
import type { Category, CategoryRequest, FindParams } from '../types';
import { apiFactory } from './factory';

const factory = apiFactory<Category, CategoryRequest>(
  ApiEndpoint.endpoints.categories,
  'Category',
  { find: 'public', findById: 'public' }
);

export const CategoryApi = {
  ...factory,
  find: (params?: FindParams) => factory.find({ ...params, lang: 'all' }),
  findById: (id: string) => factory.findById(id, { lang: 'all' }),
};
