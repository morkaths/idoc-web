import { useEffect, useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@repo/ui/components/dialog';
import { useReviews } from '@/hooks/data/useReview';
import type { BorrowResponse, ReviewResponse } from '@/types';
import { Textarea } from '@repo/ui/components/textarea';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormLabel, FormMessage } from '@repo/ui/components/form';
import { KEYS, useLocale } from '@/hooks/ui/useLocale';

export const ReviewFormSchema = z.object({
    rating: z.number().min(1, "Please select a rating"),
    content: z.string().optional(),
});

export type ReviewForm = z.infer<typeof ReviewFormSchema>;

interface ReviewMutateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    borrow: BorrowResponse;
    onSubmit: (data: ReviewForm, existingReview?: ReviewResponse) => Promise<void>;
}

export function ReviewMutateDialog({
    open,
    onOpenChange,
    borrow,
    onSubmit,
}: ReviewMutateDialogProps) {
    const { t, keys } = useLocale('library');
    const { data: session } = useSession();

    // Fetch existing review
    const { data: reviewsData } = useReviews(
        {
            filters: [
                { field: 'user', value: session?.user?.id },
                { field: 'item', value: borrow.item?.id }
            ]
        },
        { enabled: !!session?.user?.id && !!borrow.item?.id && open }
    );
    const existingReview = reviewsData?.data?.[0];

    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ReviewForm>({
        resolver: zodResolver(ReviewFormSchema),
        defaultValues: {
            rating: 0,
            content: "",
        },
    });

    // Reset form when dialog opens or existing review changes
    useEffect(() => {
        if (open) {
            form.reset({
                rating: existingReview?.rating ?? 0,
                content: existingReview?.content ?? "",
            });
        }
    }, [open, existingReview, form]);

    const handleSubmit = async (data: ReviewForm) => {
        try {
            setIsSubmitting(true);
            await onSubmit(data, existingReview);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{existingReview ? t(keys.review.update) : t(keys.review.create)}</DialogTitle>
                    <DialogDescription>
                        {borrow.item?.title ? t(keys.review.description, { title: borrow.item.title }) : t(keys.review.fallback)}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <div className="flex flex-col gap-2">
                                    <FormLabel>{t(keys.review.rating.label)}</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    disabled={isSubmitting}
                                                    className="focus:outline-none transition-all hover:scale-110 p-1 rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        field.onChange(star);
                                                    }}
                                                >
                                                    <Star
                                                        className={`w-8 h-8 transition-colors ${star <= field.value
                                                            ? 'fill-amber-400 text-amber-400'
                                                            : 'fill-transparent text-muted-foreground/30'
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage>
                                        {t(keys.review.rating.error)}
                                    </FormMessage>
                                    {field.value > 0 && (
                                        <span className="text-sm text-muted-foreground animate-in fade-in">
                                            {field.value === 5 ? t(keys.review.rating.value.excellent) :
                                                field.value === 4 ? t(keys.review.rating.value.good) :
                                                    field.value === 3 ? t(keys.review.rating.value.neutral) :
                                                        field.value === 2 ? t(keys.review.rating.value.poor) :
                                                            t(keys.review.rating.value.terrible)}
                                        </span>
                                    )}
                                </div>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <div className="grid gap-2">
                                    <FormLabel htmlFor="review-content">{t(keys.review.content.label)}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            id="review-content"
                                            className="min-h-[120px] resize-none"
                                            placeholder={t(keys.review.content.placeholder)}
                                            disabled={isSubmitting}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" type="button" disabled={isSubmitting}>
                                    {t(KEYS.common.actions.cancel)}
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {existingReview ? t(keys.review.actions.update) : t(keys.review.actions.submit)}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
