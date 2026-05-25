import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationApi } from '@/apis/notification.api';
import type { NotificationResponse, PageParams } from '@/types';
import {
  useListQuery,
  useItemQuery,
  type ListQueryOptions,
  type ItemQueryOptions,
} from './factory';

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
export const useUnreadNotificationsCount = (
  options?: ItemQueryOptions<number>
) => {
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
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      }
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
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      }
    },
  });
};
