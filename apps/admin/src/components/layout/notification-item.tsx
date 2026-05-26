import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { NotificationResponse } from '@/types';
import { enUS } from 'date-fns/locale';
import { isNotificationRead } from '@/hooks/data/useNotification';
import { cn } from '@/lib/utils';
import { Button } from '@repo/ui/components/button';
import { DropdownMenuItem } from '@repo/ui/components/dropdown-menu';
import { getNotificationConfig } from './data/notification-config';

type Props = {
  item: NotificationResponse;
  onOpen: (item: NotificationResponse) => void;
};

/**
 * Component for rendering an individual notification item in the bell dropdown list.
 */
export default function NotificationItem({ item, onOpen }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { Icon, iconClass } = getNotificationConfig(item.type);
  const formattedTime = formatDistanceToNow(new Date(item.createdAt), {
    addSuffix: true,
    locale: enUS,
  });
  const isRead = isNotificationRead(item);
  const shouldTruncate = (item.content || '').length > 220;

  return (
    <DropdownMenuItem
      onSelect={(e: Event) => {
        e.preventDefault();
        onOpen(item);
      }}
      className={cn(
        'focus:bg-accent/80 mx-1.5 my-0.5 flex cursor-pointer items-center gap-2 rounded-lg border p-3.5 transition-all duration-200 select-none',
        !isRead
          ? 'border-blue-500/15 bg-blue-500/8 font-medium shadow-sm hover:bg-blue-500/12 dark:border-blue-500/10 dark:bg-blue-500/10 dark:hover:bg-blue-500/15'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent/30 border-transparent bg-transparent'
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center self-start bg-transparent text-sm transition-transform duration-300',
          isRead ? 'text-muted-foreground/60' : iconClass
        )}
      >
        <Icon className='h-5 w-5' />
      </div>

      <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
        <div className='flex items-center justify-between gap-2'>
          <span
            className={cn(
              'truncate text-sm leading-tight font-semibold',
              !isRead ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'
            )}
          >
            {item.title}
          </span>
          {!isRead && (
            <span className='h-2 w-2 shrink-0 animate-pulse rounded-full bg-destructive' />
          )}
        </div>

        <p className='text-muted-foreground/90 text-xs leading-relaxed font-normal break-words whitespace-pre-wrap'>
          {expanded || !shouldTruncate ? item.content : `${item.content.slice(0, 220)}...`}
        </p>

        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground/75 mt-1 text-[10px] font-normal'>
            {formattedTime}
          </span>
          {shouldTruncate && (
            <Button
              variant='ghost'
              size='sm'
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((s) => !s);
              }}
            >
              {expanded ? 'Show less' : 'Show more'}
            </Button>
          )}
        </div>
      </div>
    </DropdownMenuItem>
  );
}
