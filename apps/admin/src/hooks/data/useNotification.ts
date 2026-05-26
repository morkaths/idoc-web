import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { NotificationApi } from '@/apis/notification.api';
import type { NotificationResponse, PageParams, ApiResponse, PageResponse } from '@/types';
import {
  useListQuery,
  useItemQuery,
  type ListQueryOptions,
  type ItemQueryOptions,
} from './factory';

/**
 * Helper to check if a notification has been read.
 */
export const isNotificationRead = (item: NotificationResponse | null | undefined): boolean => {
  if (!item) return false;
  return !!item.isRead;
};

/**
 * Hook to fetch paginated notifications for the current user
 * @param params Page parameters
 * @param options Query options
 */
export const useNotifications = (
  params: PageParams = {},
  options?: ListQueryOptions<NotificationResponse>
) => {
  return useListQuery<NotificationResponse>(
    ['notifications', params],
    () => NotificationApi.find(params),
    options
  );
};

/**
 * Hook to fetch the number of unread notifications
 * @param options Query options
 */
export const useUnreadNotificationsCount = (options?: ItemQueryOptions<number>) => {
  return useItemQuery<number>(
    ['notifications', 'unread-count'],
    () => NotificationApi.countUnread(),
    options
  );
};

/**
 * Hook to mark a notification as read
 */
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => NotificationApi.markRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      // Snapshot all cached notification list pages for potential rollback
      const prevSnapshots = queryClient.getQueriesData<
        ApiResponse<PageResponse<NotificationResponse>>
      >({ queryKey: ['notifications'] });
      const prevCount = queryClient.getQueryData<number>(['notifications', 'unread-count']);

      // Optimistically mark item as read across all cached notification pages
      queryClient.setQueriesData<ApiResponse<PageResponse<NotificationResponse>>>(
        { queryKey: ['notifications'] },
        (current) => {
          if (!current?.data || !Array.isArray(current.data.content)) return current;
          return {
            ...current,
            data: {
              ...current.data,
              content: current.data.content.map((item) =>
                item.id === id ? { ...item, isRead: true } : item
              ),
            },
          };
        }
      );

      // Optimistically decrement unread-count
      if (typeof prevCount === 'number') {
        queryClient.setQueryData(['notifications', 'unread-count'], Math.max(0, prevCount - 1));
      }

      return { prevSnapshots, prevCount } as {
        prevSnapshots?: [QueryKey, ApiResponse<PageResponse<NotificationResponse>> | undefined][];
        prevCount?: number | undefined;
      };
    },
    onError: (_err, _variables, context) => {
      // Rollback all cached pages to their previous state
      context?.prevSnapshots?.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });
      if (typeof context?.prevCount === 'number') {
        queryClient.setQueryData(['notifications', 'unread-count'], context.prevCount);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => NotificationApi.markAllRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      // Snapshot all cached notification list pages for potential rollback
      const prevSnapshots = queryClient.getQueriesData<
        ApiResponse<PageResponse<NotificationResponse>>
      >({ queryKey: ['notifications'] });
      const prevCount = queryClient.getQueryData<number>(['notifications', 'unread-count']);

      // Optimistically mark all items as read across all cached notification pages
      queryClient.setQueriesData<ApiResponse<PageResponse<NotificationResponse>>>(
        { queryKey: ['notifications'] },
        (current) => {
          if (!current?.data || !Array.isArray(current.data.content)) return current;
          return {
            ...current,
            data: {
              ...current.data,
              content: current.data.content.map(
                (item) => ({ ...item, isRead: true })
              ),
            },
          };
        }
      );

      // Optimistically set unread count to zero
      queryClient.setQueryData(['notifications', 'unread-count'], 0);

      return { prevSnapshots, prevCount } as {
        prevSnapshots?: [QueryKey, ApiResponse<PageResponse<NotificationResponse>> | undefined][];
        prevCount?: number | undefined;
      };
    },
    onError: (_err, _variables, context) => {
      // Rollback all cached pages to their previous state
      context?.prevSnapshots?.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });
      if (typeof context?.prevCount === 'number') {
        queryClient.setQueryData(['notifications', 'unread-count'], context.prevCount);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
