import { API_CONFIG } from '@/config/api';
import type { BookmarkResponse, BookmarkRequest, ApiResponse } from '../types';
import { ApiClient } from './config';
import { apiFactory } from './factory';

const factory = apiFactory<BookmarkResponse, BookmarkRequest>(API_CONFIG.endpoints.bookmarks);

export const BookmarkApi = {
  ...factory,

  status: async (ids: string[]): Promise<ApiResponse<Record<string, BookmarkResponse>>> => {
    return ApiClient.get<Record<string, BookmarkResponse>>(
      API_CONFIG.endpoints.bookmarks.status(ids),
      { security: 'private' }
    );
  },
};

