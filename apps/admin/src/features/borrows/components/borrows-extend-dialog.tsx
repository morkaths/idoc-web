'use client';

import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@repo/ui/components/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Form, FormControl, FormField, FormLabel, FormMessage } from '@repo/ui/components/form';
import { BorrowRangePicker } from './borrows-ranger-picker';
import { DatePicker } from '@/components/form/date-picker';

const ExtendFormSchema = z.object({
    extraDays: z.number().int().min(1, "Extra days must be at least 1"),
    borrowTime: z.union([z.date(), z.string(), z.number()]).optional(),
    expireTime: z.union([z.date(), z.string(), z.number()]).optional(),
    newExpireTime: z.union([z.date(), z.string(), z.number()]).optional(),
    note: z.string().optional(),
});
type ExtendForm = z.infer<typeof ExtendFormSchema>;

type BorrowsExtendDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    borrowTime?: Date | string | number;
    expireTime?: Date | string | number;
    note?: string;
    onSubmit: (data: { extraDays: number; note?: string }) => void;
};

export function BorrowsExtendDialog({
    open,
    onOpenChange,
    borrowTime,
    expireTime,
    note,
    onSubmit,
}: BorrowsExtendDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<ExtendForm>({
        resolver: zodResolver(ExtendFormSchema),
        defaultValues: {
            extraDays: 1,
            borrowTime: borrowTime,
            expireTime: expireTime,
            newExpireTime: expireTime,
            note: note,
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-100 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Extend Borrow</DialogTitle>
                    <DialogDescription>
                        Choose extra days or pick a new expire date for this borrow.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(async (data) => {
                            if (isSubmitting) return;
                            setIsSubmitting(true);
                            try {
                                const from = expireTime ? new Date(expireTime) : undefined;
                                const to = data.newExpireTime ? new Date(data.newExpireTime) : undefined;
                                let extraDays = 0;
                                if (from && to) {
                                    const diff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
                                    extraDays = diff > 0 ? diff : 0;
                                }
                                if (extraDays < 1) {
                                    form.setError("newExpireTime", { message: "Expire date must be at least 1 day after current expire date." });
                                    setIsSubmitting(false);
                                    return;
                                }
                                await onSubmit({
                                    extraDays,
                                    note: data.note,
                                });
                                onOpenChange(false);
                                form.reset();
                            } finally {
                                setIsSubmitting(false);
                            }
                        })}
                        className='space-y-4 px-0.5'
                    >
                        <fieldset disabled={isSubmitting} className='space-y-4'>
                            <FormField
                                control={form.control}
                                name="borrowTime"
                                render={({ field }) => (
                                    <div className="grid gap-3">
                                        <FormLabel htmlFor="borrowTime">Borrow Date</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={field.onChange}
                                                disabled
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="extraDays"
                                render={() => {
                                    const from = expireTime ? new Date(expireTime) : undefined;
                                    const toRaw = form.watch("newExpireTime");
                                    const to = toRaw ? new Date(toRaw) : undefined;
                                    let days = "";
                                    if (from && to) {
                                        const diff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
                                        days = diff > 0 ? diff.toString() : "0";
                                    }
                                    return (
                                        <div className="grid gap-3">
                                            <FormLabel htmlFor="extraDays">Extra Days</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="extraDays"
                                                    type="number"
                                                    value={days}
                                                    disabled
                                                    placeholder="Number of days to extend"
                                                    tabIndex={-1}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    );
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="newExpireTime"
                                render={({ field }) => (
                                    <div className="grid gap-3">
                                        <FormLabel htmlFor="newExpireTime">Borrow Range</FormLabel>
                                        <FormControl>
                                            <BorrowRangePicker
                                                borrowTime={expireTime ? new Date(expireTime) : new Date()}
                                                expireTime={field.value ? new Date(field.value) : undefined}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="note"
                                render={({ field }) => (
                                    <div className="grid gap-3 mb-3">
                                        <FormLabel htmlFor="note">Note</FormLabel>
                                        <FormControl>
                                            <textarea
                                                id="note"
                                                className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Extending...' : 'Extend'}
                                </Button>
                            </DialogFooter>
                        </fieldset>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}