'use client';

import { cn } from "@/lib/utils";
import { type BorrowResponse } from "@/types";
import { format } from "date-fns";
import { Badge } from "@repo/ui/components/badge";
import { Calendar, Check, Clock, AlertCircle, Play } from "lucide-react";
import { useLocale } from "@/hooks/ui/useLocale";

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
        span: (chunks: React.ReactNode) => <span>{chunks}</span>
    };

    // Created
    if (borrow.createdAt) {
        timelineData.push({
            date: format(new Date(borrow.createdAt), "PPP"),
            title: t(keys.table.actions.history.timeline.borrowed.title),
            content: t.rich(keys.table.actions.history.timeline.borrowed.content, {
                username: borrow.borrower?.username || borrow.borrower.username,
                title: borrow.item?.title || borrow.item.title,
                ...richRenderer
            }),
            type: 'create',
        });
    }

    // Renewals
    if (borrow.renewals && borrow.renewals.length > 0) {
        borrow.renewals.forEach((renewal, index) => {
            const date = renewal.renewedAt ? new Date(renewal.renewedAt) : null;
            timelineData.push({
                date: date ? format(date, "PPP") : t(keys.table.actions.history.timeline.unknown),
                title: t(keys.table.actions.history.timeline.renewal.title, { index: index + 1 }),
                content: t.rich(keys.table.actions.history.timeline.renewal.content, {
                    date: renewal.newExpireTime ? format(new Date(renewal.newExpireTime), "PPP") : '...',
                    ...richRenderer
                }),
                type: 'renew',
            });
        });
    }

    // Return or Due
    if (borrow.returnTime) {
        timelineData.push({
            date: format(new Date(borrow.returnTime), "PPP"),
            title: t(keys.table.actions.history.timeline.returned.title),
            content: t(keys.table.actions.history.timeline.returned.content),
            type: 'return',
        });
    } else if (borrow.expireTime) {
        const expireDate = new Date(borrow.expireTime);
        const isOverdue = expireDate < new Date();
        const dateStr = format(expireDate, "PPP");

        if (isOverdue) {
            timelineData.push({
                date: dateStr,
                title: t(keys.table.actions.history.timeline.overdue.title),
                content: t.rich(keys.table.actions.history.timeline.overdue.content, {
                    date: dateStr,
                    ...richRenderer
                }),
                type: 'overdue',
            });
        } else {
            timelineData.push({
                date: dateStr,
                title: t(keys.table.actions.history.timeline.due.title),
                content: t.rich(keys.table.actions.history.timeline.due.content, {
                    date: dateStr,
                    ...richRenderer
                }),
                type: 'due',
            });
        }
    }

    const getIcon = (type: TimelineEntry['type']) => {
        switch (type) {
            case 'create': return <Play className="w-3 h-3 text-primary-foreground" fill="currentColor" />;
            case 'renew': return <Clock className="w-3 h-3 text-primary-foreground" />;
            case 'return': return <Check className="w-3 h-3 text-primary-foreground" />;
            case 'overdue': return <AlertCircle className="w-3 h-3 text-white" />;
            case 'due': return <Calendar className="w-3 h-3 text-primary-foreground" />;
        }
    };

    const getBgColor = (type: TimelineEntry['type']) => {
        switch (type) {
            case 'overdue': return 'bg-destructive';
            default: return 'bg-primary';
        }
    };

    const getBadgeVariant = (type: TimelineEntry['type']): "default" | "secondary" | "destructive" | "outline" => {
        if (type === 'create' || type === 'return') return 'default';
        if (type === 'overdue') return 'destructive';
        return 'outline';
    };

    return (
        <div className={cn("p-4 pl-1", className)}>
            <div className="ml-3">
                {timelineData.map((entry, index) => {
                    const isLast = index === timelineData.length - 1;
                    return (
                        <div key={index} className={cn(
                            "relative pl-8 border-l border-border",
                            isLast ? "border-l-transparent pb-0" : "pb-8"
                        )}>
                            <span className={cn(
                                "absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 top-0 ring-8 ring-background",
                                getBgColor(entry.type)
                            )}>
                                {getIcon(entry.type)}
                            </span>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="flex items-center text-sm font-semibold text-foreground">
                                        <Badge variant={getBadgeVariant(entry.type)} className="text-xs font-normal">
                                            {entry.title}
                                        </Badge>
                                    </h3>
                                    <time className="text-[10px] font-normal leading-none text-muted-foreground whitespace-nowrap">
                                        {entry.date}
                                    </time>
                                </div>
                                <div className="text-sm text-foreground/80">
                                    {entry.content}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
