import { Sparkles, AlertCircle, Info, Bell, CheckCheck, Loader2 } from 'lucide-react';
import {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/hooks/data/useNotification';
import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@repo/ui/components/dropdown-menu';
import { ScrollArea } from '@repo/ui/components/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { NotificationResponse } from '@/types';

/**
 * Helper to get the correct icon and styling for each notification type
 * @param type Notification type from the backend
 */
const getNotificationConfig = (type: string) => {
  switch (type) {
    case 'RECOMMENDER_TRAINED_SUCCESS':
      return {
        Icon: Sparkles,
        iconClass: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50',
        dotClass: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
      };
    case 'RECOMMENDER_TRAINED_FAILURE':
      return {
        Icon: AlertCircle,
        iconClass: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/50',
        dotClass: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
      };
    default:
      return {
        Icon: Info,
        iconClass: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/50',
        dotClass: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]',
      };
  }
};

/**
 * Component displaying a notification bell with a dropdown list of recent notifications
 */
export function NotificationBell() {
  const { data: countData } = useUnreadNotificationsCount();
  const unreadCount = countData ?? 0;

  const { data: notificationsList, isLoading } = useNotifications({
    page: 1,
    limit: 10,
  });

  const notifications = notificationsList?.data ?? [];

  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const handleMarkRead = (id: string, isRead: boolean) => {
    if (!isRead && !markReadMutation.isPending) {
      markReadMutation.mutate(id);
    }
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.preventDefault();
    if (unreadCount > 0 && !markAllReadMutation.isPending) {
      markAllReadMutation.mutate();
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='relative h-9 w-9 rounded-full hover:bg-accent/60 transition-all duration-300'
        >
          <Bell className='h-[19px] w-[19px] text-foreground/80' />
          {unreadCount > 0 && (
            <span className='absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background animate-fade-in'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive/60 opacity-75' />
              <span className='relative'>{unreadCount > 99 ? '99+' : unreadCount}</span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='w-[380px] p-0 shadow-lg border border-border/80 bg-background/95 backdrop-blur-md transition-all duration-300'
        align='end'
        alignOffset={-5}
        forceMount
      >
        <DropdownMenuLabel className='font-normal p-4 pb-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-semibold text-foreground'>Thông báo</span>
              {unreadCount > 0 && (
                <span className='rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary dark:bg-primary/20'>
                  {unreadCount} mới
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleMarkAllRead}
                disabled={markAllReadMutation.isPending}
                className='h-7 px-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 gap-1.5 transition-colors font-medium'
              >
                {markAllReadMutation.isPending ? (
                  <Loader2 className='h-3 w-3 animate-spin' />
                ) : (
                  <CheckCheck className='h-3.5 w-3.5' />
                )}
                Đánh dấu đã đọc tất cả
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className='m-0' />

        <ScrollArea className='h-[350px] w-full'>
          <div className='flex flex-col py-1'>
            {isLoading ? (
              <div className='flex h-[200px] flex-col items-center justify-center gap-2 text-muted-foreground'>
                <Loader2 className='h-8 w-8 animate-spin text-primary/60' />
                <span className='text-xs'>Đang tải thông báo...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className='flex h-[200px] flex-col items-center justify-center gap-2 text-muted-foreground px-4 text-center'>
                <div className='rounded-full bg-accent/40 p-3.5 border border-border/40'>
                  <Bell className='h-6 w-6 opacity-40' />
                </div>
                <span className='text-sm font-medium mt-1'>Không có thông báo nào</span>
                <span className='text-xs opacity-75 max-w-[240px]'>
                  Hệ thống sẽ gửi thông báo đến bạn khi có tiến trình mới hoàn tất.
                </span>
              </div>
            ) : (
              notifications.map((item: NotificationResponse) => {
                const { Icon, iconClass, dotClass } = getNotificationConfig(item.type);
                const formattedTime = formatDistanceToNow(new Date(item.createdAt), {
                  addSuffix: true,
                  locale: vi,
                });

                return (
                  <DropdownMenuItem
                    key={item.id}
                    onSelect={(e) => {
                      e.preventDefault();
                      handleMarkRead(item.id, item.isRead);
                    }}
                    className={cn(
                      'flex items-start gap-3 p-3.5 mx-1.5 my-0.5 rounded-lg cursor-pointer transition-all duration-200 border border-transparent select-none focus:bg-accent/80',
                      !item.isRead
                        ? 'bg-accent/40 font-medium hover:bg-accent/60 border-border/20 shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                    )}
                  >
                    <div className={cn('flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg border text-sm shadow-sm transition-transform duration-300 hover:scale-105', iconClass)}>
                      <Icon className='h-4.5 w-4.5' />
                    </div>
                    <div className='flex flex-col flex-1 min-w-0 gap-0.5'>
                      <div className='flex items-center justify-between gap-2'>
                        <span className={cn('text-xs font-semibold truncate leading-tight', !item.isRead ? 'text-foreground' : 'text-muted-foreground')}>
                          {item.title}
                        </span>
                        {!item.isRead && (
                          <span className={cn('h-2 w-2 rounded-full shrink-0 animate-pulse', dotClass)} />
                        )}
                      </div>
                      <p className='text-xs line-clamp-2 leading-relaxed text-muted-foreground/90 font-normal'>
                        {item.content}
                      </p>
                      <span className='text-[10px] text-muted-foreground/75 font-normal mt-1'>
                        {formattedTime}
                      </span>
                    </div>
                  </DropdownMenuItem>
                );
              })
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
