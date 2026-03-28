import { API_CONFIG } from '@/config/api';
import type { BookmarkResponse, BookmarkRequest, FindParams, Pagination } from '../types';
import { ApiClient, getAccessToken } from './config';

export const BookmarkApi = {
  find: async (
    params?: FindParams
  ): Promise<{ data: BookmarkResponse[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<BookmarkResponse[]>(API_CONFIG.endpoints.bookmark.find, {
      mode: 'public',
      params,
    });
    return {
      data: response.data ?? [],
      pagination: response.pagination,
    };
  },

  findById: async (id: string): Promise<BookmarkResponse> => {
    const response = await ApiClient.get<BookmarkResponse>(
      API_CONFIG.endpoints.bookmark.findById(id),
      { mode: 'public' }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Bookmark not found');
  },

  status: async (items: string[]): Promise<Record<string, string>> => {
    if (!getAccessToken()) return {};

    const response = await ApiClient.post<Record<string, string>>(
      API_CONFIG.endpoints.bookmark.status,
      { mode: 'public', data: { items } }
    );
    if (response.success && response.data) return response.data;
    return {};
  },

  create: async (data: BookmarkRequest): Promise<BookmarkResponse> => {
    const response = await ApiClient.post<BookmarkResponse>(API_CONFIG.endpoints.bookmark.create, {
      mode: 'private',
      data,
    });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to create bookmark');
  },

  update: async (id: string, data: Partial<BookmarkRequest>): Promise<BookmarkResponse> => {
    const response = await ApiClient.patch<BookmarkResponse>(
      API_CONFIG.endpoints.bookmark.update(id),
      { mode: 'private', data }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to update bookmark');
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiClient.delete<null>(API_CONFIG.endpoints.bookmark.delete(id), {
      mode: 'private',
    });
    return response.success;
  },
};
