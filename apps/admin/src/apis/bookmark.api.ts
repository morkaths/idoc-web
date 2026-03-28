import { ApiEndpoint } from '@/config/api';
import { useAuthStore } from '@/stores/auth-store';
import type { BookmarkResponse, BookmarkRequest } from '../types';
import { ApiClient } from './config';
import { apiFactory } from './factory';

const factory = apiFactory<BookmarkResponse, BookmarkRequest>(
  ApiEndpoint.endpoints.bookmarks,
  'Bookmark',
  { find: 'public', findById: 'public', findByIds: 'public' }
);

export const BookmarkApi = {
  ...factory,

  status: async (ids: string[]): Promise<Record<string, string | null>> => {
    const { auth } = useAuthStore.getState();
    if (!auth.token) return {};
    const response = await ApiClient.get<Record<string, string | null>>(
      ApiEndpoint.endpoints.bookmarks.status(ids),
      { security: 'private' }
    );
    if (response.success && response.data) return response.data;
    return {};
  },
};
