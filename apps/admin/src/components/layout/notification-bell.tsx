import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { READ_NOTIFICATION_IDS_STORAGE_KEY, type NotificationResponse } from '@/types';
import { enUS } from 'date-fns/locale';
import { Bell, CheckCheck, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  isNotificationRead,
} from '@/hooks/data/useNotification';
import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@repo/ui/components/dropdown-menu';
import { ScrollArea } from '@repo/ui/components/scroll-area';
import { getNotificationConfig } from './data/notification-config';
import NotificationItem from './notification-item';

const loadStoredReadNotificationIds = () => {
  if (typeof window === 'undefined') return new Set<string>();

  try {
    const raw = window.localStorage.getItem(READ_NOTIFICATION_IDS_STORAGE_KEY);
    if (!raw) return new Set<string>();

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set<string>();

    return new Set(parsed.filter((value): value is string => typeof value === 'string'));
  } catch (_error) {
    return new Set<string>();
  }
};

/**
 * Component displaying a notification bell with a dropdown list of recent notifications
 */
export function NotificationBell() {
  const [selectedNotification, setSelectedNotification] = useState<NotificationResponse | null>(
    null
  );
  const [locallyReadNotificationIds, setLocallyReadNotificationIds] = useState<Set<string>>(
    loadStoredReadNotificationIds
  );
  const { data: countData } = useUnreadNotificationsCount();
  const unreadCount = countData ?? 0;
  const { data: notificationsList, isLoading } = useNotifications({
    page: 1,
    limit: 10,
  });

  const notificationData = notificationsList?.data ?? [];

  const notifications = notificationData
    .map((item) => (locallyReadNotificationIds.has(item.id) ? { ...item, isRead: true } : item))
    .slice()
    .sort((a, b) => {
      const aRead = isNotificationRead(a);
      const bRead = isNotificationRead(b);
      if (aRead !== bRead) {
        return Number(aRead) - Number(bRead);
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const locallyUnreadOnServerCount = notificationData.reduce((count, item) => {
    return count + (locallyReadNotificationIds.has(item.id) && !isNotificationRead(item) ? 1 : 0);
  }, 0);

  const safeUnreadCount = Math.max(0, unreadCount - locallyUnreadOnServerCount);
  const safeBadgeLabel = safeUnreadCount > 99 ? '99+' : safeUnreadCount.toString();
  const safeBadgeSizeClass =
    safeUnreadCount > 9
      ? 'h-5 min-w-[20px] px-1 text-[7px] leading-none'
      : 'h-4 w-4 text-[8px] leading-none';

  const currentSelectedNotification = selectedNotification
    ? {
        ...(notifications.find((n) => n.id === selectedNotification.id) ?? selectedNotification),
      }
    : null;

  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const handleMarkRead = (id: string, isReadVal: boolean) => {
    if (!isReadVal && !markReadMutation.isPending) {
      // Only mark locally as read after the server confirms
      markReadMutation.mutate(id, {
        onSuccess: () => {
          setLocallyReadNotificationIds((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
          });
        },
      });
    }
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(
        READ_NOTIFICATION_IDS_STORAGE_KEY,
        JSON.stringify(Array.from(locallyReadNotificationIds))
      );
    } catch (_error) {
      // Ignore storage failures and keep the in-memory optimistic state.
    }
  }, [locallyReadNotificationIds]);

  const openNotificationDetail = (item: NotificationResponse) => {
    const isReadVal = isNotificationRead(item);
    if (!isReadVal) {
      handleMarkRead(item.id, isReadVal);
    }

    setSelectedNotification(item);
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
        <Button variant='outline' size='icon' className='relative size-7'>
          <Bell className='text-foreground/80' />
          {safeUnreadCount > 0 && (
            <span
              className={cn(
                'bg-destructive ring-background animate-fade-in absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full leading-none font-bold text-white tabular-nums shadow-sm ring-2',
                safeBadgeSizeClass
              )}
            >
              <span className='bg-destructive/60 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75' />
              <span className='relative'>{safeBadgeLabel}</span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='border-border/80 bg-background/95 w-[380px] border p-0 shadow-lg backdrop-blur-md transition-all duration-300'
        align='end'
        alignOffset={-5}
        forceMount
      >
        <DropdownMenuLabel className='p-4 pb-3 font-normal'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-foreground text-sm font-semibold'>Notifications</span>
              {safeUnreadCount > 0 && (
                <span className='bg-primary/10 text-primary dark:bg-primary/20 rounded-full px-2 py-0.5 text-xs font-semibold'>
                  {safeUnreadCount} new
                </span>
              )}
            </div>
            {safeUnreadCount > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleMarkAllRead}
                disabled={markAllReadMutation.isPending}
                className='text-muted-foreground hover:text-primary hover:bg-primary/5 h-7 gap-1.5 px-2 text-xs font-medium transition-colors'
              >
                {markAllReadMutation.isPending ? (
                  <Loader2 className='h-3 w-3 animate-spin' />
                ) : (
                  <CheckCheck className='h-3.5 w-3.5' />
                )}
                Mark all as read
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className='m-0' />

        <ScrollArea className='h-[350px] w-full'>
          <div className='flex flex-col py-1'>
            {isLoading ? (
              <div className='text-muted-foreground flex h-[200px] flex-col items-center justify-center gap-2'>
                <Loader2 className='text-primary/60 h-8 w-8 animate-spin' />
                <span className='text-xs'>Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className='text-muted-foreground flex h-[200px] flex-col items-center justify-center gap-2 px-4 text-center'>
                <div className='bg-accent/40 border-border/40 rounded-full border p-3.5'>
                  <Bell className='h-6 w-6 opacity-40' />
                </div>
                <span className='mt-1 text-sm font-medium'>No notifications yet</span>
                <span className='max-w-[240px] text-xs opacity-75'>
                  The system will send you notifications when new processes are completed.
                </span>
              </div>
            ) : (
              notifications.map((item: NotificationResponse) => (
                <NotificationItem key={item.id} item={item} onOpen={openNotificationDetail} />
              ))
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>

      <Dialog
        open={selectedNotification !== null}
        onOpenChange={(open) => !open && setSelectedNotification(null)}
      >
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader className='space-y-3 pr-10 text-start'>
            <DialogTitle className='text-base'>Notification Details</DialogTitle>
            <DialogDescription>
              Review the full content of the notification and its current status.
            </DialogDescription>
          </DialogHeader>

          {currentSelectedNotification && (
            <div className='space-y-4 py-2'>
              <div className='border-border/60 bg-muted/30 flex items-start gap-3 rounded-xl border p-4'>
                {(() => {
                  const { Icon, iconClass } = getNotificationConfig(
                    currentSelectedNotification.type
                  );

                  return (
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-sm shadow-sm',
                        isNotificationRead(currentSelectedNotification)
                          ? 'text-muted-foreground/70 border-muted-foreground/20'
                          : iconClass
                      )}
                    >
                      <Icon className='h-5 w-5' />
                    </div>
                  );
                })()}
                <div className='min-w-0 flex-1 space-y-1'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <h3 className='text-foreground truncate text-sm font-semibold'>
                      {currentSelectedNotification.title}
                    </h3>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-medium',
                        isNotificationRead(currentSelectedNotification)
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                      )}
                    >
                      {isNotificationRead(currentSelectedNotification) ? 'Read' : 'Unread'}
                    </span>
                  </div>
                  <p className='text-muted-foreground text-xs leading-relaxed'>
                    {currentSelectedNotification.content}
                  </p>
                </div>
              </div>

              <div className='border-border/60 grid gap-2 rounded-xl border p-4 text-sm'>
                <div className='flex items-center justify-between gap-3'>
                  <span className='text-muted-foreground'>Type</span>
                  <span className='text-foreground font-medium'>
                    {currentSelectedNotification.type}
                  </span>
                </div>
                <div className='flex items-center justify-between gap-3'>
                  <span className='text-muted-foreground'>Created</span>
                  <span className='text-foreground font-medium'>
                    {formatDistanceToNow(new Date(currentSelectedNotification.createdAt), {
                      addSuffix: true,
                      locale: enUS,
                    })}
                  </span>
                </div>
                <div className='flex items-center justify-between gap-3'>
                  <span className='text-muted-foreground'>Updated</span>
                  <span className='text-foreground font-medium'>
                    {formatDistanceToNow(new Date(currentSelectedNotification.updatedAt), {
                      addSuffix: true,
                      locale: enUS,
                    })}
                  </span>
                </div>
              </div>

              <div className='flex justify-end'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setSelectedNotification(null)}
                >
                  <X className='mr-2 h-4 w-4' />
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}
