"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@repo/ui/components/textarea";
import { Form, FormControl, FormField, FormLabel, FormMessage } from "@repo/ui/components/form";
import { BorrowRangePicker } from "./borrows-ranger-picker";
import { useLocale } from '@/hooks/ui/useLocale';

const BorrowFormSchema = z.object({
    expireTime: z.date()
        .refine(
            (val) => {
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                return val > now;
            },
            { message: "Expire date must be after today" }
        ),
    note: z.string().optional(),
});
type BorrowForm = z.infer<typeof BorrowFormSchema>;

type BorrowBookDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: BorrowForm) => void;
};

export function BorrowBookDialog({ open, onOpenChange, onSubmit }: BorrowBookDialogProps) {
    const { t, keys } = useLocale('book');
    const form = useForm<BorrowForm>({
        resolver: zodResolver(BorrowFormSchema),
        defaultValues: {
            expireTime: undefined,
            note: "",
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t(keys.borrow.title)}</DialogTitle>
                    <DialogDescription>
                        {t(keys.borrow.description)}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data) => {
                            onSubmit(data);
                        })}
                    >
                        <div className="grid gap-4 mb-4">
                            <FormField
                                control={form.control}
                                name="expireTime"
                                render={({ field }) => (
                                    <div className="grid gap-3">
                                        <FormLabel>{t(keys.borrow.expireTime.label)}</FormLabel>
                                        <FormControl>
                                            <BorrowRangePicker
                                                borrowTime={new Date()}
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
                                    <div className="grid gap-3">
                                        <FormLabel>{t(keys.borrow.note.label)}</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} rows={2} placeholder={t(keys.borrow.note.placeholder)} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" type="button">
                                    {t(keys.borrow.actions.cancel)}
                                </Button>
                            </DialogClose>
                            <Button type="submit">{t(keys.borrow.actions.confirm)}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}