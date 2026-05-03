import { ApiEndpoint } from '@/config/api';
import type { BookmarkResponse, BookmarkRequest, ApiResponse } from '../types';
import { ApiClient } from './config';
import { apiFactory } from './factory';

const factory = apiFactory<BookmarkResponse, BookmarkRequest>(
  ApiEndpoint.endpoints.bookmarks,
  {
    find: 'public',
    findById: 'public',
    findByIds: 'public',
  }
);

export const BookmarkApi = {
  ...factory,

  status: async (ids: string[]): Promise<ApiResponse<Record<string, string | null>>> => {
    return ApiClient.get<Record<string, string | null>>(
      ApiEndpoint.endpoints.bookmarks.status(ids),
      { security: 'private' }
    );
  },
};

