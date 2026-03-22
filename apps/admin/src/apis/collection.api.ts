import { API_CONFIG } from '@/config/api';
import type { Collection, CollectionRequest, FindParams, Pagination } from '../types';
import { ApiClient } from './config';

export const CollectionApi = {
    find: async (params?: FindParams): Promise<{ data: Collection[]; pagination?: Pagination }> => {
        const response = await ApiClient.get<Collection[]>(
            API_CONFIG.endpoints.collection.find,
            { mode: 'public', params }
        );
        return {
            data: response.data ?? [],
            pagination: response.pagination
        };
    },

    findById: async (id: string): Promise<Collection> => {
        const response = await ApiClient.get<Collection>(
            API_CONFIG.endpoints.collection.findById(id),
            { mode: 'public' }
        );
        if (response.success && response.data) return response.data;
        throw new Error(response.message || 'Collection not found');
    },

    create: async (data: CollectionRequest): Promise<Collection> => {
        const response = await ApiClient.post<Collection>(
            API_CONFIG.endpoints.collection.create,
            { mode: 'private', data }
        );
        if (response.success && response.data) return response.data;
        throw new Error(response.message || 'Failed to create collection');
    },

    update: async (id: string, data: Partial<CollectionRequest>): Promise<Collection> => {
        const response = await ApiClient.patch<Collection>(
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
