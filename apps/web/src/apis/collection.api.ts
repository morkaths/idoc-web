import { API_CONFIG } from '@/config/api';
import type { Collection, FindParams, Pagination } from '../types';
import * as ApiRequest from './config';

export const CollectionApi = {
    find: async (params?: FindParams): Promise<{ data: Collection[]; pagination?: Pagination }> => {
        const response = await ApiRequest.apiGet<Collection[]>(
            API_CONFIG.endpoints.collection.find,
            { mode: 'public', params }
        );
        return {
            data: response.data ?? [],
            pagination: response.pagination
        };
    },

    findById: async (id: string): Promise<Collection | null> => {
        const response = await ApiRequest.apiGet<Collection>(
            API_CONFIG.endpoints.collection.findById(id),
            { mode: 'public' }
        );
        if (response.success && response.data) return response.data;
        return null;
    },

    create: async (data: Partial<Collection>): Promise<Collection | null> => {
        const response = await ApiRequest.apiPost<Collection>(
            API_CONFIG.endpoints.collection.create,
            { mode: 'private', data }
        );
        if (response.success && response.data) return response.data;
        return null;
    },

    update: async (id: string, data: Partial<Collection>): Promise<Collection | null> => {
        const response = await ApiRequest.apiPatch<Collection>(
            API_CONFIG.endpoints.collection.update(id),
            { mode: 'private', data }
        );
        if (response.success && response.data) return response.data;
        return null;
    },

    delete: async (id: string): Promise<boolean> => {
        const response = await ApiRequest.apiDelete<null>(
            API_CONFIG.endpoints.collection.delete(id),
            { mode: 'private' }
        );
        return response.success;
    },
};
