import { API_CONFIG } from '@/config/api';
import type { BookmarkResponse, BookmarkRequest } from '../types';
import { ApiClient, getAccessToken } from './config';
import { apiFactory } from './factory';

const factory = apiFactory<BookmarkResponse, BookmarkRequest>(
  API_CONFIG.endpoints.bookmarks,
  'Bookmark'
);

export const BookmarkApi = {
  ...factory,

  status: async (ids: string[]): Promise<Record<string, BookmarkResponse>> => {
    if (!getAccessToken()) return {};

    const response = await ApiClient.get<Record<string, BookmarkResponse>>(
      API_CONFIG.endpoints.bookmarks.status(ids),
      { security: 'private' }
    );
    if (response.success && response.data) return response.data;
    return {};
  },
};
