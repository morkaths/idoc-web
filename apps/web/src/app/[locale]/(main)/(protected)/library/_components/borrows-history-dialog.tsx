'use client';

import { type Borrow } from "@/types/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@repo/ui/components/dialog";
import { Badge } from "@repo/ui/components/badge";
import Image from "next/image";
import { BorrowTimeline } from "./borrows-timeline";

type BorrowsHistoryDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    borrow: Borrow | null;
};

export function BorrowsHistoryDialog({ open, onOpenChange, borrow }: BorrowsHistoryDialogProps) {
    if (!borrow) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Borrow History</DialogTitle>
                    <DialogDescription>
                        Timeline of events for this borrow record.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-start gap-4 p-6 border-b bg-muted/10">
                    <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md border bg-background shadow-sm">
                        <Image
                            src={borrow.item?.coverUrl || "/images/book-cover-placeholder.png"}
                            alt={borrow.item?.title || "Book Cover"}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg leading-tight truncate" title={borrow.item?.title}>
                            {borrow.item?.title || "Unknown Title"}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {borrow.item?.authors?.length
                                ? borrow.item.authors.map(a => a.name).join(", ")
                                : "Unknown Author"}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {borrow.item?.categories?.length
                                ? borrow.item.categories.map((c, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs px-2 py-0 h-5 font-normal">
                                        {c.translations?.find(t => t.lang === 'vi')?.name || c.translations?.[0]?.name}
                                    </Badge>
                                ))
                                : <span className="text-xs text-muted-foreground">No Category</span>}
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
