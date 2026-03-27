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
 * @param endpoints - Object containing API endpoints
 * @param resourceName - Name of the resource (e.g., 'Author', 'Book') used for error messages
 * @param customConfig - Configuration for API access modes (defaulting write operations to 'private')
 * @returns An object with CRUD methods
 */
export const apiFactory = <Response, Request>(
  endpoints: CrudEndpoints,
  resourceName: string,
  customConfig?: Partial<SecurityConfig>
) => {
  const config: SecurityConfig = { ...defaultConfig, ...customConfig };

  return {
    find: async (params?: FindParams): Promise<{ data: Response[]; pagination?: Pagination }> => {
      const response = await ApiClient.get<Response[]>(endpoints.find, {
        security: config.find,
        params,
      });
      return { data: response.data ?? [], pagination: response.pagination };
    },

    findById: async (id: string): Promise<Response> => {
      const response = await ApiClient.get<Response>(endpoints.findById(id), {
        security: config.findById,
      });
      if (response.success && response.data) return response.data;
      throw new Error(response.message || `${resourceName} not found`);
    },

    findByIds: async (ids: string[]): Promise<Response[]> => {
      const response = await ApiClient.get<Response[]>(endpoints.findByIds(ids), {
        security: config.findByIds,
      });
      return response.data ?? [];
    },

    create: async (data: Request): Promise<Response> => {
      const response = await ApiClient.post<Response>(endpoints.create, {
        security: config.create,
        data,
      });
      if (response.success && response.data) return response.data;
      throw new Error(response.message || `Failed to create ${resourceName.toLowerCase()}`);
    },

    createMany: async (data: Request[]): Promise<Response[]> => {
      const response = await ApiClient.post<Response[]>(endpoints.createMany, { 
        security: config.createMany, 
        data 
      });
      return response.data ?? [];
    },

    update: async (id: string, data: Partial<Request>): Promise<Response> => {
      const response = await ApiClient.patch<Response>(endpoints.update(id), {
        security: config.update,
        data,
      });
      if (response.success && response.data) return response.data;
      throw new Error(response.message || `Failed to update ${resourceName.toLowerCase()}`);
    },

    updateMany: async (ids: string[], data: Partial<Request>[]): Promise<Response[]> => {
      const response = await ApiClient.patch<Response[]>(endpoints.updateMany(ids), { 
        security: config.updateMany, 
        data 
      });
      return response.data ?? [];
    },

    delete: async (id: string): Promise<boolean> => {
      const response = await ApiClient.delete<null>(endpoints.delete(id), {
        security: config.delete,
      });
      return response.success;
    },

    deleteMany: async (ids: string[]): Promise<boolean> => {
      const response = await ApiClient.delete<null>(endpoints.deleteMany(ids), { 
        security: config.deleteMany 
      });
      return response.success;
    },
  };
};
