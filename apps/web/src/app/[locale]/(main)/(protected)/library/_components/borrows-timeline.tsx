'use client';

import { cn } from "@/lib/utils";
import { type Borrow } from "@/types/schema";
import { format } from "date-fns";
import { Badge } from "@repo/ui/components/badge";
import { Calendar, Check, Clock, AlertCircle, Play } from "lucide-react";

type TimelineEntry = {
    date: string;
    title: string;
    content: string;
    type: 'create' | 'renew' | 'return' | 'due' | 'overdue';
};

interface BorrowTimelineProps {
    borrow: Borrow;
    className?: string;
}

export const BorrowTimeline = ({ borrow, className }: BorrowTimelineProps) => {
    const timelineData: TimelineEntry[] = [];

    // Created
    if (borrow.createdAt) {
        timelineData.push({
            date: format(new Date(borrow.createdAt), "PPP"),
            title: "Borrowed",
            content: `User <strong>${borrow.borrower?.username || borrow.userId}</strong> borrowed <strong>${borrow.item?.title || borrow.itemId}</strong>.`,
            type: 'create',
        });
    }

    // Renewals
    if (borrow.renewals && borrow.renewals.length > 0) {
        borrow.renewals.forEach((renewal, index) => {
            const date = renewal.renewedAt ? new Date(renewal.renewedAt) : null;
            timelineData.push({
                date: date ? format(date, "PPP") : "Unknown Date",
                title: `Renewal #${index + 1}`,
                content: `Extended until <strong>${renewal.newExpireTime ? format(new Date(renewal.newExpireTime), "PPP") : '...'}</strong>.`,
                type: 'renew',
            });
        });
    }

    // Return or Due
    if (borrow.returnTime) {
        timelineData.push({
            date: format(new Date(borrow.returnTime), "PPP"),
            title: "Returned",
            content: `Item was returned.`,
            type: 'return',
        });
    } else if (borrow.expireTime) {
        const expireDate = new Date(borrow.expireTime);
        const isOverdue = expireDate < new Date();
        timelineData.push({
            date: format(expireDate, "PPP"),
            title: isOverdue ? "Overdue" : "Due Date",
            content: isOverdue ? `<span class="text-destructive">Item is overdue since ${format(expireDate, "PPP")}.</span>` : `Item is due on ${format(expireDate, "PPP")}.`,
            type: isOverdue ? 'overdue' : 'due',
        });
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
                                    <h3 className="flex items-center text-base font-semibold text-foreground">
                                        <Badge variant={getBadgeVariant(entry.type)} className="text-sm font-normal">
                                            {entry.title}
                                        </Badge>
                                    </h3>
                                    <time className="text-xs font-normal leading-none text-muted-foreground whitespace-nowrap">
                                        {entry.date}
                                    </time>
                                </div>
                                <div
                                    className="text-sm text-foreground/80 dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: entry.content }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
