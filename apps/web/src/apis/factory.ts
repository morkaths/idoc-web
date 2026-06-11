import type { ApiResponse, FindParams, PageParams, PageResponse } from '../types';
import { ApiClient, type SecurityStrategy } from './config';

export interface CrudEndpoints {
  find: () => string;
  search?: () => string;
  findById: (id: string) => string;
  findByIds: (ids: readonly string[]) => string;
  create: () => string;
  createMany: () => string;
  update: (id: string) => string;
  updateMany: (ids: readonly string[]) => string;
  delete: (id: string) => string;
  deleteMany: (ids: readonly string[]) => string;
  [key: string]: unknown;
}

export type SecurityConfig = {
  find: SecurityStrategy;
  search: SecurityStrategy;
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
  search: 'private',
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
 * @template TParams The type of additional query parameters (defaults to object)
 */
export const apiFactory = <TResponse, TRequest, TParams = object>(
  endpoints: CrudEndpoints,
  customConfig?: Partial<SecurityConfig>
) => {
  const config: SecurityConfig = { ...defaultConfig, ...customConfig };

  return {
    find: async (params?: PageParams & TParams): Promise<ApiResponse<PageResponse<TResponse>>> => {
      return ApiClient.get<PageResponse<TResponse>>(endpoints.find(), {
        security: config.find,
        params,
      });
    },

    search: async (
      params?: FindParams & TParams
    ): Promise<ApiResponse<PageResponse<TResponse>>> => {
      return ApiClient.post<PageResponse<TResponse>>(
        endpoints.search ? endpoints.search() : `${endpoints.find()}/search`,
        {
          security: config.search,
          data: params,
        }
      );
    },

    findById: async <P = TParams>(id: string, params?: P): Promise<ApiResponse<TResponse>> => {
      return ApiClient.get<TResponse>(endpoints.findById(id), {
        security: config.findById,
        params,
      });
    },

    findByIds: async <P = TParams>(
      ids: string[],
      params?: P
    ): Promise<ApiResponse<TResponse[]>> => {
      return ApiClient.get<TResponse[]>(endpoints.findByIds(ids), {
        security: config.findByIds,
        params,
      });
    },

    create: async <P = TParams>(data: TRequest, params?: P): Promise<ApiResponse<TResponse>> => {
      return ApiClient.post<TResponse>(endpoints.create(), {
        security: config.create,
        data,
        params,
      });
    },

    createMany: async <P = TParams>(
      data: TRequest[],
      params?: P
    ): Promise<ApiResponse<TResponse[]>> => {
      return ApiClient.post<TResponse[]>(endpoints.createMany(), {
        security: config.createMany,
        data,
        params,
      });
    },

    update: async <P = TParams>(
      id: string,
      data: Partial<TRequest>,
      params?: P
    ): Promise<ApiResponse<TResponse>> => {
      return ApiClient.patch<TResponse>(endpoints.update(id), {
        security: config.update,
        data,
        params,
      });
    },

    updateMany: async <P = TParams>(
      ids: string[],
      data: Partial<TRequest>[],
      params?: P
    ): Promise<ApiResponse<TResponse[]>> => {
      return ApiClient.patch<TResponse[]>(endpoints.updateMany(ids), {
        security: config.updateMany,
        data,
        params,
      });
    },

    delete: async <P = TParams>(id: string, params?: P): Promise<ApiResponse<void>> => {
      return ApiClient.delete<void>(endpoints.delete(id), {
        security: config.delete,
        params,
      });
    },

    deleteMany: async <P = TParams>(
      ids: string[],
      params?: P
    ): Promise<ApiResponse<void | null>> => {
      return ApiClient.delete<void | null>(endpoints.deleteMany(ids), {
        security: config.deleteMany,
        params,
      });
    },
  };
};
