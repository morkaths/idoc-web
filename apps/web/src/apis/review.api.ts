import { API_CONFIG } from '@/config/api';
import type { ReviewResponse, ReviewRequest, FindParams, Pagination } from '../types';
import { ApiClient } from './config';

export const ReviewApi = {
  find: async (
    params?: FindParams
  ): Promise<{ data: ReviewResponse[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<ReviewResponse[]>(API_CONFIG.endpoints.review.find, {
      mode: 'public',
      params,
    });
    return {
      data: response.data ?? [],
      pagination: response.pagination,
    };
  },

  findById: async (id: string): Promise<ReviewResponse> => {
    const response = await ApiClient.get<ReviewResponse>(API_CONFIG.endpoints.review.findById(id), {
      mode: 'public',
    });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Review not found');
  },

  create: async (data: ReviewRequest): Promise<ReviewResponse> => {
    const response = await ApiClient.post<ReviewResponse>(API_CONFIG.endpoints.review.create, {
      mode: 'private',
      data,
    });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to create review');
  },

  update: async (id: string, data: Partial<ReviewRequest>): Promise<ReviewResponse> => {
    const response = await ApiClient.patch<ReviewResponse>(API_CONFIG.endpoints.review.update(id), {
      mode: 'private',
      data,
    });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to update review');
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiClient.delete<null>(API_CONFIG.endpoints.review.delete(id), {
      mode: 'private',
    });
    return response.success;
  },
};
