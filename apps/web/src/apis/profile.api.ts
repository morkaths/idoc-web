import { API_CONFIG } from '@/config/api';
import type { Profile, FindParams, Pagination } from '../types';
import { ApiClient } from './config';

export const ProfileApi = {
    me: async (): Promise<Profile | null> => {
        const response = await ApiClient.get<Profile>(
            API_CONFIG.endpoints.profile.me
        );
        if (response.success && response.data) return response.data;
        return null;
    },

    find: async (params?: FindParams): Promise<{ data: Profile[]; pagination?: Pagination }> => {
        const response = await ApiClient.get<Profile[]>(
            API_CONFIG.endpoints.profile.find,
            { params }
        );
        return {
            data: response.data ?? [],
            pagination: response.pagination
        };
    },

    findById: async (id: string): Promise<Profile | null> => {
        const response = await ApiClient.get<Profile>(
            API_CONFIG.endpoints.profile.findById(id)
        );
        if (response.success && response.data) return response.data;
        return null;
    },

    create: async (data: Partial<Profile>): Promise<Profile | null> => {
        const response = await ApiClient.post<Profile>(
            API_CONFIG.endpoints.profile.create,
            { data }
        );
        if (response.success && response.data) return response.data;
        return null;
    },

    update: async (id: string, data: Partial<Profile>): Promise<Profile | null> => {
        const response = await ApiClient.patch<Profile>(
            API_CONFIG.endpoints.profile.update(id),
            { data }
        );
        if (response.success && response.data) return response.data;
        return null;
    },

    delete: async (id: string): Promise<boolean> => {
        const response = await ApiClient.delete<null>(
            API_CONFIG.endpoints.profile.delete(id)
        );
        return response.success;
    },
};
