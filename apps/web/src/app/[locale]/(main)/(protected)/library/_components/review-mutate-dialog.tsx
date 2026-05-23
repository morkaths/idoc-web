import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { LoanResponse, ReviewResponse } from '@/types';
import { Star, Loader2 } from 'lucide-react';
import { useReviews } from '@/hooks/data/useReview';
import { KEYS, useLocale } from '@/hooks/ui/useLocale';
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
import { Form, FormControl, FormField, FormLabel, FormMessage } from '@repo/ui/components/form';
import { Textarea } from '@repo/ui/components/textarea';

export const ReviewFormSchema = z.object({
  rating: z.number().min(1, 'Please select a rating'),
  content: z.string().optional(),
});

export type ReviewForm = z.infer<typeof ReviewFormSchema>;

interface ReviewMutateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  borrow: LoanResponse;
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
  const { data: reviewsData } = useReviews(
    {
      filters: [
        { field: 'user', value: session?.user?.id },
        { field: 'book', value: borrow.book?.id },
      ],
    },
    { enabled: !!session?.user?.id && !!borrow.book?.id && open }
  );
  const existingReview = reviewsData?.data?.[0];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewForm>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: {
      rating: 0,
      content: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        rating: existingReview?.rating ?? 0,
        content: existingReview?.content ?? '',
      });
    }
  }, [open, existingReview, form]);

  const handleSubmit = async (data: ReviewForm) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data, existingReview);
    } catch {
      // Error is handled by the caller or assumed to be silent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>
            {existingReview ? t(keys.review.update) : t(keys.review.create)}
          </DialogTitle>
          <DialogDescription>
            {borrow.book?.title
              ? t(keys.review.description, { title: borrow.book.title })
              : t(keys.review.fallback)}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6 py-4'>
            <fieldset disabled={isSubmitting} className='space-y-6'>
              <FormField
                control={form.control}
                name='rating'
                render={({ field }) => (
                  <div className='flex flex-col gap-2'>
                    <FormLabel>{t(keys.review.rating.label)}</FormLabel>
                    <FormControl>
                      <div className='flex items-center gap-1'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type='button'
                            disabled={isSubmitting}
                            className='hover:bg-muted/50 rounded-md p-1 transition-all hover:scale-110 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                            onClick={(e) => {
                              e.preventDefault();
                              field.onChange(star);
                            }}
                          >
                            <Star
                              className={`h-8 w-8 transition-colors ${
                                star <= field.value
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-muted-foreground/30 fill-transparent'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage>{t(keys.review.rating.error)}</FormMessage>
                    {field.value > 0 && (
                      <span className='text-muted-foreground animate-in fade-in text-sm'>
                        {field.value === 5
                          ? t(keys.review.rating.value.excellent)
                          : field.value === 4
                            ? t(keys.review.rating.value.good)
                            : field.value === 3
                              ? t(keys.review.rating.value.neutral)
                              : field.value === 2
                                ? t(keys.review.rating.value.poor)
                                : t(keys.review.rating.value.terrible)}
                      </span>
                    )}
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <div className='grid gap-2'>
                    <FormLabel htmlFor='review-content'>{t(keys.review.content.label)}</FormLabel>
                    <FormControl>
                      <Textarea
                        id='review-content'
                        className='min-h-[120px] resize-none'
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
                  <Button variant='outline' type='button' disabled={isSubmitting}>
                    {t(KEYS.common.actions.cancel)}
                  </Button>
                </DialogClose>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                  {existingReview ? t(keys.review.actions.update) : t(keys.review.actions.submit)}
                </Button>
              </DialogFooter>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
