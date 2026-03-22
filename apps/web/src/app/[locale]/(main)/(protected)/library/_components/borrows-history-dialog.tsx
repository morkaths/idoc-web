'use client';

import { useState } from 'react';
import { type Borrow } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@repo/ui/components/dialog";
import { Badge } from "@repo/ui/components/badge";
import { useParams } from "next/navigation";
import { useLocale } from "@/hooks/ui/useLocale";
import { BorrowTimeline } from "./borrows-timeline";
import { ImageOff } from 'lucide-react';

const CoverImage = ({ src, title }: { src?: string; title: string }) => {
    const [error, setError] = useState(false);

    if (!src || error) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-muted/20 text-muted-foreground">
                <ImageOff className="h-6 w-6 opacity-50" />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={title}
            className="h-full w-full object-cover"
            onError={() => setError(true)}
            loading="lazy"
        />
    );
};

type BorrowsHistoryDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    borrow: Borrow | null;
};

export function BorrowsHistoryDialog({ open, onOpenChange, borrow }: BorrowsHistoryDialogProps) {
    const { t, keys } = useLocale('library');
    const { locale } = useParams();

    if (!borrow) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>{t(keys.table.actions.history.title)}</DialogTitle>
                    <DialogDescription>
                        {t(keys.table.actions.history.description)}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-start gap-4 p-6 border-b bg-muted/10">
                    <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md border bg-background shadow-sm">
                        <CoverImage
                            src={borrow.item?.coverUrl}
                            title={borrow.item?.title || "Book Cover"}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg leading-tight truncate" title={borrow.item?.title}>
                            {borrow.item?.title || t(keys.table.actions.history.unknownTitle)}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {borrow.item?.authors?.length
                                ? borrow.item.authors.map(a => a.name).join(", ")
                                : t(keys.table.actions.history.unknownAuthor)}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {borrow.item?.categories?.length
                                ? borrow.item.categories.map((c, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs px-2 py-0 h-5 font-normal">
                                        {c.translations?.find(tr => tr.lang === locale)?.name || c.translations?.[0]?.name}
                                    </Badge>
                                ))
                                : <span className="text-xs text-muted-foreground">{t(keys.table.actions.history.noCategory)}</span>}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                            ID: <span className="font-mono">{borrow.item?.id}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <BorrowTimeline borrow={borrow} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
