import { ApiClient, type SecurityStrategy } from './config';
import type { FindParams, Pagination } from '../types';

export interface CrudEndpoints {
  find: string;
  findById: (id: string) => string;
  findByIds: (ids: readonly string[]) => string;
  create: string;
  createMany: string;
  update: (id: string) => string;
  updateMany: (ids: readonly string[]) => string;
  delete: (id: string) => string;
  deleteMany: (ids: readonly string[]) => string;
  [key: string]: unknown;
}

export type SecurityConfig = {
  find: SecurityStrategy;
  findById: SecurityStrategy;
  findByIds: SecurityStrategy;
  create: SecurityStrategy;
  createMany: SecurityStrategy;
  update: SecurityStrategy;
  updateMany: SecurityStrategy;
  delete: SecurityStrategy;
  deleteMany: SecurityStrategy;
};

const defaultConfig: SecurityConfig = {
  find: 'private',
  findById: 'private',
  findByIds: 'private',
  create: 'private',
  createMany: 'private',
  update: 'private',
  updateMany: 'private',
  delete: 'private',
  deleteMany: 'private',
};

/**
 * Generic API factory for CRUD operations
 * @template TResponse The type of the resource response
 * @template TRequest The type of the resource request data
 * @template TParams The type of additional query parameters (defaults to Record<string, unknown>)
 */
export const apiFactory = <
  TResponse,
  TRequest,
  TParams = Record<string, unknown>
>(
  endpoints: CrudEndpoints,
  resourceName: string,
  customConfig?: Partial<SecurityConfig>
) => {
  const config: SecurityConfig = { ...defaultConfig, ...customConfig };

  return {
    find: async (params?: FindParams & TParams): Promise<{ data: TResponse[]; pagination?: Pagination }> => {
      const response = await ApiClient.get<TResponse[]>(endpoints.find, {
        security: config.find,
        params,
      });
      return { data: response.data ?? [], pagination: response.pagination };
    },

    findById: async <P = TParams>(id: string, params?: P): Promise<TResponse> => {
      const response = await ApiClient.get<TResponse>(endpoints.findById(id), {
        security: config.findById,
        params,
      });
      if (response.success && response.data) return response.data;
      throw new Error(response.message || `${resourceName} not found`);
    },

    findByIds: async <P = TParams>(ids: string[], params?: P): Promise<TResponse[]> => {
      const response = await ApiClient.get<TResponse[]>(endpoints.findByIds(ids), {
        security: config.findByIds,
        params,
      });
      return response.data ?? [];
    },

    create: async <P = TParams>(data: TRequest, params?: P): Promise<TResponse> => {
      const response = await ApiClient.post<TResponse>(endpoints.create, {
        security: config.create,
        data,
        params,
      });
      if (response.success && response.data) return response.data;
      throw new Error(response.message || `Failed to create ${resourceName.toLowerCase()}`);
    },

    createMany: async <P = TParams>(data: TRequest[], params?: P): Promise<TResponse[]> => {
      const response = await ApiClient.post<TResponse[]>(endpoints.createMany, { 
        security: config.createMany, 
        data,
        params
      });
      return response.data ?? [];
    },

    update: async <P = TParams>(id: string, data: Partial<TRequest>, params?: P): Promise<TResponse> => {
      const response = await ApiClient.patch<TResponse>(endpoints.update(id), {
        security: config.update,
        data,
        params,
      });
      if (response.success && response.data) return response.data;
      throw new Error(response.message || `Failed to update ${resourceName.toLowerCase()}`);
    },

    updateMany: async <P = TParams>(ids: string[], data: Partial<TRequest>[], params?: P): Promise<TResponse[]> => {
      const response = await ApiClient.patch<TResponse[]>(endpoints.updateMany(ids), { 
        security: config.updateMany, 
        data,
        params
      });
      return response.data ?? [];
    },

    delete: async <P = TParams>(id: string, params?: P): Promise<boolean> => {
      const response = await ApiClient.delete<null>(endpoints.delete(id), {
        security: config.delete,
        params,
      });
      return response.success;
    },

    deleteMany: async <P = TParams>(ids: string[], params?: P): Promise<boolean> => {
      const response = await ApiClient.delete<null>(endpoints.deleteMany(ids), { 
        security: config.deleteMany,
        params
      });
      return response.success;
    },
  };
};
