'use client';

import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KEYS, useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/dialog';
import { Form, FormControl, FormField, FormLabel, FormMessage } from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { DatePicker } from '@/components/form/date-picker';
import { BorrowRangePicker } from './borrows-ranger-picker';

const ExtendFormSchema = z.object({
  extraDays: z.number().int().min(1, 'Extra days must be at least 1').max(30, 'Extension cannot exceed 30 days'),
  borrowedDate: z.union([z.date(), z.string(), z.number()]).optional(),
  dueDate: z.union([z.date(), z.string(), z.number()]).optional(),
  newDueDate: z.union([z.date(), z.string(), z.number()]).optional(),
  notes: z.string().trim().optional().superRefine((val, ctx) => {
    if (val && val.split(/\s+/).filter(Boolean).length > 500) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Notes cannot exceed 500 words',
      });
    }
  }),
});
type ExtendForm = z.infer<typeof ExtendFormSchema>;

type BorrowsExtendDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  borrowedDate?: Date | string | number;
  dueDate?: Date | string | number;
  notes?: string;
  onSubmit: (data: { extraDays: number; notes?: string }) => void;
};

export function BorrowsExtendDialog({
  open,
  onOpenChange,
  borrowedDate,
  dueDate,
  notes,
  onSubmit,
}: BorrowsExtendDialogProps) {
  const { t, keys } = useLocale('library');
  const form = useForm<ExtendForm>({
    resolver: zodResolver(ExtendFormSchema),
    defaultValues: {
      extraDays: 1,
      borrowedDate: borrowedDate,
      dueDate: dueDate,
      newDueDate: dueDate,
      notes: notes,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-100'>
        <DialogHeader>
          <DialogTitle>{t(keys.table.actions.extend.title)}</DialogTitle>
          <DialogDescription>{t(keys.table.actions.extend.description)}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              if (isSubmitting) return;
              setIsSubmitting(true);
              try {
                const from = dueDate ? new Date(dueDate) : undefined;
                const to = data.newDueDate ? new Date(data.newDueDate) : undefined;
                let extraDays = 0;
                if (from && to) {
                  const diff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
                  extraDays = diff > 0 ? diff : 0;
                }
                if (extraDays < 1) {
                  form.setError('newDueDate', {
                    message: t(keys.table.actions.extend.fields.error),
                  });
                  setIsSubmitting(false);
                  return;
                }
                if (extraDays > 30) {
                  form.setError('newDueDate', {
                    message: t(keys.table.actions.extend.fields.maxError),
                  });
                  setIsSubmitting(false);
                  return;
                }
                await onSubmit({
                  extraDays,
                  notes: data.notes,
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
                name='borrowedDate'
                render={({ field }) => (
                  <div className='grid gap-3'>
                    <FormLabel htmlFor='borrowedDate'>
                      {t(keys.table.actions.extend.fields.borrowedDate)}
                    </FormLabel>
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
                name='extraDays'
                render={() => {
                  const from = dueDate ? new Date(dueDate) : undefined;
                  const toRaw = form.watch('newDueDate');
                  const to = toRaw ? new Date(toRaw) : undefined;
                  let days = '';
                  if (from && to) {
                    const diff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
                    days = diff > 0 ? diff.toString() : '0';
                  }
                  return (
                    <div className='grid gap-3'>
                      <FormLabel htmlFor='extraDays'>
                        {t(keys.table.actions.extend.fields.extraDays)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          id='extraDays'
                          type='number'
                          value={days}
                          disabled
                          placeholder={t(keys.table.actions.extend.fields.placeholder)}
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
                name='newDueDate'
                render={({ field }) => (
                  <div className='grid gap-3'>
                    <FormLabel htmlFor='newDueDate'>
                      {t(keys.table.actions.extend.fields.borrowRange)}
                    </FormLabel>
                    <FormControl>
                      <BorrowRangePicker
                        borrowedDate={dueDate ? new Date(dueDate) : new Date()}
                        dueDate={field.value ? new Date(field.value) : undefined}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <div className='mb-3 grid gap-3'>
                    <FormLabel htmlFor='notes'>{t(keys.table.actions.extend.fields.notes)}</FormLabel>
                    <FormControl>
                      <textarea
                        id='notes'
                        className='border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-20 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='outline' type='button'>
                    {t(KEYS.common.actions.cancel)}
                  </Button>
                </DialogClose>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? t(keys.table.actions.extend.loading) : t(keys.table.actions.extend.label)}
                </Button>
              </DialogFooter>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
