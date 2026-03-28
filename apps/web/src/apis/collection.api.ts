import { API_CONFIG } from '@/config/api';
import type { CollectionResponse, CollectionRequest, FindParams, Pagination } from '../types';
import { ApiClient } from './config';

export const CollectionApi = {
    find: async (params?: FindParams): Promise<{ data: CollectionResponse[]; pagination?: Pagination }> => {
        const response = await ApiClient.get<CollectionResponse[]>(
            API_CONFIG.endpoints.collection.find,
            { mode: 'public', params }
        );
        return {
            data: response.data ?? [],
            pagination: response.pagination
        };
    },

    findById: async (id: string): Promise<CollectionResponse> => {
        const response = await ApiClient.get<CollectionResponse>(
            API_CONFIG.endpoints.collection.findById(id),
            { mode: 'public' }
        );
        if (response.success && response.data) return response.data;
        throw new Error(response.message || 'Collection not found');
    },

    create: async (data: CollectionRequest): Promise<CollectionResponse> => {
        const response = await ApiClient.post<CollectionResponse>(
            API_CONFIG.endpoints.collection.create,
            { mode: 'private', data }
        );
        if (response.success && response.data) return response.data;
        throw new Error(response.message || 'Failed to create collection');
    },

    update: async (id: string, data: Partial<CollectionRequest>): Promise<CollectionResponse> => {
        const response = await ApiClient.patch<CollectionResponse>(
            API_CONFIG.endpoints.collection.update(id),
            { mode: 'private', data }
        );
        if (response.success && response.data) return response.data;
        throw new Error(response.message || 'Failed to update collection');
    },

    delete: async (id: string): Promise<boolean> => {
        const response = await ApiClient.delete<null>(
            API_CONFIG.endpoints.collection.delete(id),
            { mode: 'private' }
        );
        return response.success;
    },
};
