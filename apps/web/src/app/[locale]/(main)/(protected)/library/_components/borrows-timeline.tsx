'use client';

import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { type BorrowResponse } from '@/types';
import { Calendar, Check, Clock, AlertCircle, Play } from 'lucide-react';
import { useLocale } from '@/hooks/ui/useLocale';
import { Badge } from '@repo/ui/components/badge';

type TimelineEntry = {
  date: string;
  title: React.ReactNode;
  content: React.ReactNode;
  type: 'create' | 'renew' | 'return' | 'due' | 'overdue';
};

interface BorrowTimelineProps {
  borrow: BorrowResponse;
  className?: string;
}

export const BorrowTimeline = ({ borrow, className }: BorrowTimelineProps) => {
  const { t, keys } = useLocale('library');
  const timelineData: TimelineEntry[] = [];

  const richRenderer = {
    strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
    span: (chunks: React.ReactNode) => <span>{chunks}</span>,
  };

  // Created
  if (borrow.createdAt) {
    timelineData.push({
      date: format(new Date(borrow.createdAt), 'PPP'),
      title: t(keys.table.actions.history.timeline.borrowed.title),
      content: t.rich(keys.table.actions.history.timeline.borrowed.content, {
        username: borrow.borrower?.username || borrow.borrower.username,
        title: borrow.item?.title || borrow.item.title,
        ...richRenderer,
      }),
      type: 'create',
    });
  }

  // Renewals
  if (borrow.renewals && borrow.renewals.length > 0) {
    borrow.renewals.forEach((renewal, index) => {
      const date = renewal.renewedAt ? new Date(renewal.renewedAt) : null;
      timelineData.push({
        date: date ? format(date, 'PPP') : t(keys.table.actions.history.timeline.unknown),
        title: t(keys.table.actions.history.timeline.renewal.title, { index: index + 1 }),
        content: t.rich(keys.table.actions.history.timeline.renewal.content, {
          date: renewal.newExpireTime ? format(new Date(renewal.newExpireTime), 'PPP') : '...',
          ...richRenderer,
        }),
        type: 'renew',
      });
    });
  }

  // Return or Due
  if (borrow.returnTime) {
    timelineData.push({
      date: format(new Date(borrow.returnTime), 'PPP'),
      title: t(keys.table.actions.history.timeline.returned.title),
      content: t(keys.table.actions.history.timeline.returned.content),
      type: 'return',
    });
  } else if (borrow.expireTime) {
    const expireDate = new Date(borrow.expireTime);
    const isOverdue = expireDate < new Date();
    const dateStr = format(expireDate, 'PPP');

    if (isOverdue) {
      timelineData.push({
        date: dateStr,
        title: t(keys.table.actions.history.timeline.overdue.title),
        content: t.rich(keys.table.actions.history.timeline.overdue.content, {
          date: dateStr,
          ...richRenderer,
        }),
        type: 'overdue',
      });
    } else {
      timelineData.push({
        date: dateStr,
        title: t(keys.table.actions.history.timeline.due.title),
        content: t.rich(keys.table.actions.history.timeline.due.content, {
          date: dateStr,
          ...richRenderer,
        }),
        type: 'due',
      });
    }
  }

  const getIcon = (type: TimelineEntry['type']) => {
    switch (type) {
      case 'create':
        return <Play className='text-primary-foreground h-3 w-3' fill='currentColor' />;
      case 'renew':
        return <Clock className='text-primary-foreground h-3 w-3' />;
      case 'return':
        return <Check className='text-primary-foreground h-3 w-3' />;
      case 'overdue':
        return <AlertCircle className='h-3 w-3 text-white' />;
      case 'due':
        return <Calendar className='text-primary-foreground h-3 w-3' />;
    }
  };

  const getBgColor = (type: TimelineEntry['type']) => {
    switch (type) {
      case 'overdue':
        return 'bg-destructive';
      default:
        return 'bg-primary';
    }
  };

  const getBadgeVariant = (
    type: TimelineEntry['type']
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (type === 'create' || type === 'return') return 'default';
    if (type === 'overdue') return 'destructive';
    return 'outline';
  };

  return (
    <div className={cn('p-4 pl-1', className)}>
      <div className='ml-3'>
        {timelineData.map((entry, index) => {
          const isLast = index === timelineData.length - 1;
          return (
            <div
              key={index}
              className={cn(
                'border-border relative border-l pl-8',
                isLast ? 'border-l-transparent pb-0' : 'pb-8'
              )}
            >
              <span
                className={cn(
                  'ring-background absolute top-0 -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-8',
                  getBgColor(entry.type)
                )}
              >
                {getIcon(entry.type)}
              </span>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between gap-2'>
                  <h3 className='text-foreground flex items-center text-sm font-semibold'>
                    <Badge variant={getBadgeVariant(entry.type)} className='text-xs font-normal'>
                      {entry.title}
                    </Badge>
                  </h3>
                  <time className='text-muted-foreground text-[10px] leading-none font-normal whitespace-nowrap'>
                    {entry.date}
                  </time>
                </div>
                <div className='text-foreground/80 text-sm'>{entry.content}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
