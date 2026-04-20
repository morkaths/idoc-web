'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BorrowRequestSchema, type BorrowResponse, type BorrowRequest } from '@/types';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { DatePicker } from '@/components/form/date-picker';
import { ItemCombobox } from './items-combobox';
import { UserCombobox } from './users-combobox';

type BorrowsMutateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<BorrowResponse>;
  onSubmit: (data: Partial<BorrowRequest>) => void;
};

export function BorrowsMutateDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: BorrowsMutateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<BorrowRequest>({
    resolver: zodResolver(BorrowRequestSchema),
    defaultValues: {
      borrower: initialData?.borrower?.id ?? '',
      item: initialData?.item?.id ?? '',
      expireTime: initialData?.expireTime ? new Date(initialData.expireTime) : undefined,
      status: initialData?.status,
      note: initialData?.note ?? '',
    },
  });

  return (
    <Dialog modal={true} open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-100'>
        <DialogHeader>
          <DialogTitle>{initialData?.id ? 'Edit Borrow' : 'Add Borrow'}</DialogTitle>
          <DialogDescription>
            {initialData?.id
              ? 'Update the borrow information below.'
              : 'Enter the information for the new borrow.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              if (isSubmitting) return;
              setIsSubmitting(true);
              try {
                await onSubmit({
                  id: initialData?.id,
                  ...data,
                  expireTime: data.expireTime ? new Date(data.expireTime) : undefined,
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
                name='borrower'
                render={({ field, fieldState }) => (
                  <div className='grid gap-3'>
                    <FormLabel htmlFor='borrower'>User</FormLabel>
                    <UserCombobox
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name='item'
                render={({ field, fieldState }) => (
                  <div className='grid gap-3'>
                    <FormLabel htmlFor='item'>Item</FormLabel>
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
                name='expireTime'
                render={({ field }) => (
                  <div className='grid gap-3'>
                    <FormLabel htmlFor='expireTime'>Expire Time</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={field.onChange}
                        placeholder='Pick a date'
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <div className='mb-3 grid gap-3'>
                    <FormLabel htmlFor='status'>Status</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id='status' className='w-full'>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value='active'>Active</SelectItem>
                            <SelectItem value='returned'>Returned</SelectItem>
                            <SelectItem value='overdue'>Overdue</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name='note'
                render={({ field }) => (
                  <div className='mb-3 grid gap-3'>
                    <FormLabel htmlFor='note'>Note</FormLabel>
                    <FormControl>
                      <Input id='note' {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='outline' type='button'>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (initialData?.id ? 'Save changes' : 'Create')}
                </Button>
              </DialogFooter>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
