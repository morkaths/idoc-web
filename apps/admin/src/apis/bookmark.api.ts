import { useAuthStore } from '@/stores/auth-store';
import { API_CONFIG } from '@/config/api';
import type { Bookmark, BookmarkRequest, FindParams, Pagination } from '../types';
import { ApiClient } from './config';

export const BookmarkApi = {
    find: async (params?: FindParams): Promise<{ data: Bookmark[]; pagination?: Pagination }> => {
        const response = await ApiClient.get<Bookmark[]>(
            API_CONFIG.endpoints.bookmark.find,
            { mode: 'public', params }
        );
        return {
            data: response.data ?? [],
            pagination: response.pagination
        };
    },

    findById: async (id: string): Promise<Bookmark | null> => {
        const response = await ApiClient.get<Bookmark>(
            API_CONFIG.endpoints.bookmark.findById(id),
            { mode: 'public' }
        );
        if (response.success && response.data) return response.data;
        return null;
    },

    status: async (items: string[]): Promise<Record<string, string | null>> => {
        const { auth } = useAuthStore.getState();
        if (!auth.token) return {};
        const response = await ApiClient.post<Record<string, string | null>>(
            API_CONFIG.endpoints.bookmark.status,
            { mode: 'private', data: { items } }
        );
        if (response.success && response.data) return response.data;
        return {};
    },

    create: async (data: BookmarkRequest): Promise<Bookmark | null> => {
        const response = await ApiClient.post<Bookmark>(
            API_CONFIG.endpoints.bookmark.create,
            { mode: 'private', data }
        );
        if (response.success && response.data) return response.data;
        return null;
    },

    update: async (id: string, data: Partial<BookmarkRequest>): Promise<Bookmark | null> => {
        const response = await ApiClient.patch<Bookmark>(
            API_CONFIG.endpoints.bookmark.update(id),
            { mode: 'private', data }
        );
        if (response.success && response.data) return response.data;
        return null;
    },

    delete: async (id: string): Promise<boolean> => {
        const response = await ApiClient.delete<null>(
            API_CONFIG.endpoints.bookmark.delete(id),
            { mode: 'private' }
        );
        return response.success;
    },
};
