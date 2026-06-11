'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BorrowRequestSchema, type LoanResponse, type BorrowRequest } from '@/types';
import { useLocale } from '@/hooks/ui/useLocale';
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
import { ItemCombobox } from './items-combobox';

type BorrowsMutateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<LoanResponse>;
  onSubmit: (data: BorrowRequest) => void;
};

export function BorrowsMutateDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: BorrowsMutateDialogProps) {
  const { t, keys } = useLocale('library');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<BorrowRequest>({
    resolver: zodResolver(BorrowRequestSchema),
    defaultValues: {
      bookId: initialData?.book?.id ?? '',
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined,
      notes: initialData?.notes ?? '',
    },
  });

  const mutateKeys = keys.table.actions.mutate;
  const isEdit = !!initialData?.id;

  return (
    <Dialog modal={true} open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-100'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t(mutateKeys.update.title) : t(mutateKeys.create.title)}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? t(mutateKeys.update.description) : t(mutateKeys.create.description)}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              if (isSubmitting) return;
              setIsSubmitting(true);
              try {
                await onSubmit(data);
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
                name='bookId'
                render={({ field, fieldState }) => (
                  <div className='grid gap-3'>
                    <FormLabel htmlFor='bookId'>{t(mutateKeys.fields.book)}</FormLabel>
                    <ItemCombobox
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name='dueDate'
                render={({ field }) => (
                  <div className='grid gap-3'>
                    <FormLabel htmlFor='dueDate'>{t(mutateKeys.fields.dueDate)}</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={field.onChange}
                        placeholder={t(mutateKeys.fields.placeholder)}
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
                    <FormLabel htmlFor='notes'>{t(mutateKeys.fields.notes)}</FormLabel>
                    <FormControl>
                      <Input id='notes' {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='outline' type='button'>
                    {t(mutateKeys.cancel)}
                  </Button>
                </DialogClose>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting
                    ? t(mutateKeys.loading)
                    : isEdit
                      ? t(mutateKeys.update.submit)
                      : t(mutateKeys.create.submit)}
                </Button>
              </DialogFooter>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
