import { API_CONFIG } from '@/config/api';
import type { Bookmark, FindParams, Pagination } from '../types';
import * as ApiRequest from './config';
import { getAccessToken } from './config';

export const BookmarkApi = {
    find: async (params?: FindParams): Promise<{ data: Bookmark[]; pagination?: Pagination }> => {
        const response = await ApiRequest.apiGet<Bookmark[]>(
            API_CONFIG.endpoints.bookmark.find,
            { mode: 'public', params }
        );
        return {
            data: response.data ?? [],
            pagination: response.pagination
        };
    },

    findById: async (id: string): Promise<Bookmark | null> => {
        const response = await ApiRequest.apiGet<Bookmark>(
            API_CONFIG.endpoints.bookmark.findById(id),
            { mode: 'public' }
        );
        if (response.success && response.data) return response.data;
        return null;
    },

    status: async (itemIds: string[]): Promise<Record<string, string | null>> => {
        if (!getAccessToken()) return {};

        const response = await ApiRequest.apiPost<Record<string, string | null>>(
            API_CONFIG.endpoints.bookmark.status,
            { mode: 'public', data: { itemIds } }
        );
        if (response.success && response.data) return response.data;
        return {};
    },

    create: async (data: Partial<Bookmark>): Promise<Bookmark | null> => {
        const response = await ApiRequest.apiPost<Bookmark>(
            API_CONFIG.endpoints.bookmark.create,
            { mode: 'private', data }
        );
        if (response.success && response.data) return response.data;
        return null;
    },

    update: async (id: string, data: Partial<Bookmark>): Promise<Bookmark | null> => {
        const response = await ApiRequest.apiPatch<Bookmark>(
            API_CONFIG.endpoints.bookmark.update(id),
            { mode: 'private', data }
        );
        if (response.success && response.data) return response.data;
        return null;
    },

    delete: async (id: string): Promise<boolean> => {
        const response = await ApiRequest.apiDelete<null>(
            API_CONFIG.endpoints.bookmark.delete(id),
            { mode: 'private' }
        );
        return response.success;
    },
};
