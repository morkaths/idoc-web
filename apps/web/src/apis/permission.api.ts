import { API_CONFIG } from '@/config/api';
import type { Permission, FindParams, Pagination } from '../types';
import * as ApiRequest from './config';

export const PermissionApi = {
  find: async (params?: FindParams): Promise<{ data: Permission[]; pagination?: Pagination }> => {
    const response = await ApiRequest.apiGet<Permission[]>(
      API_CONFIG.endpoints.permission.find,
      { params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  findById: async (id: string): Promise<Permission | null> => {
    const response = await ApiRequest.apiGet<Permission>(
      API_CONFIG.endpoints.permission.findById(id)
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  create: async (data: Partial<Permission>): Promise<Permission | null> => {
    const response = await ApiRequest.apiPost<Permission>(
      API_CONFIG.endpoints.permission.create,
      { data }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  update: async (id: string, data: Partial<Permission>): Promise<Permission | null> => {
    const response = await ApiRequest.apiPatch<Permission>(
      API_CONFIG.endpoints.permission.update(id),
      { data }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiRequest.apiDelete<null>(
      API_CONFIG.endpoints.permission.delete(id)
    );
    return response.success;
  },
};
