import { API_CONFIG } from '@/config/api';
import type { Review, ReviewRequest, FindParams, Pagination } from '../types';
import { ApiClient } from './config';

export const ReviewApi = {
    find: async (params?: FindParams): Promise<{ data: Review[]; pagination?: Pagination }> => {
        const response = await ApiClient.get<Review[]>(
            API_CONFIG.endpoints.review.find,
            { mode: 'public', params }
        );
        return {
            data: response.data ?? [],
            pagination: response.pagination
        };
    },

    findById: async (id: string): Promise<Review | null> => {
        const response = await ApiClient.get<Review>(
            API_CONFIG.endpoints.review.findById(id),
            { mode: 'public' }
        );
        if (response.success && response.data) return response.data;
        return null;
    },

    create: async (data: ReviewRequest): Promise<Review | null> => {
        const response = await ApiClient.post<Review>(
            API_CONFIG.endpoints.review.create,
            { mode: 'private', data }
        );
        if (response.success && response.data) return response.data;
        return null;
    },

    update: async (id: string, data: Partial<ReviewRequest>): Promise<Review | null> => {
        const response = await ApiClient.patch<Review>(
            API_CONFIG.endpoints.review.update(id),
            { mode: 'private', data }
        );
        if (response.success && response.data) return response.data;
        return null;
    },

    delete: async (id: string): Promise<boolean> => {
        const response = await ApiClient.delete<null>(
            API_CONFIG.endpoints.review.delete(id),
            { mode: 'private' }
        );
        return response.success;
    },
};
