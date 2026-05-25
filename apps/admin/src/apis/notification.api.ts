import { ApiEndpoint } from '@/config/api';
import type { ApiResponse, PageResponse, NotificationResponse, PageParams } from '@/types';
import { ApiClient } from './config';

export const NotificationApi = {
  find: async (params?: PageParams): Promise<ApiResponse<PageResponse<NotificationResponse>>> => {
    return ApiClient.get<PageResponse<NotificationResponse>>(
      ApiEndpoint.endpoints.notifications.find(),
      {
        security: 'private',
        params,
      }
    );
  },

  markRead: async (id: string): Promise<ApiResponse<void>> => {
    return ApiClient.patch<void>(ApiEndpoint.endpoints.notifications.markRead(id), {
      security: 'private',
    });
  },

  markAllRead: async (): Promise<ApiResponse<void>> => {
    return ApiClient.patch<void>(ApiEndpoint.endpoints.notifications.markAllRead(), {
      security: 'private',
    });
  },

  countUnread: async (): Promise<ApiResponse<number>> => {
    return ApiClient.get<number>(ApiEndpoint.endpoints.notifications.countUnread(), {
      security: 'private',
    });
  },
};
