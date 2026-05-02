'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import { Form, FormControl, FormField, FormLabel, FormMessage } from '@repo/ui/components/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useLocale } from '@/hooks/ui/useLocale';
import {
  BookSortField,
  bookSortSchema,
  DEFAULT_BOOK_SORT_FIELD,
  DEFAULT_BOOK_SORT_ORDER,
  type BookSortState,
} from './book-query.utils';
import { SortDirection } from '@repo/types';

export interface BookSortProps {
  sort: BookSortState;
  onSort: (params: BookSortState) => void;
  onReset: () => void;
}

export default function BookSort({ sort, onSort, onReset }: BookSortProps) {
  const { t, keys } = useLocale('books');

  const form = useForm<BookSortState>({
    resolver: zodResolver(bookSortSchema),
    defaultValues: sort,
  });

  // Sync form with external props
  useEffect(() => {
    form.reset(sort);
  }, [sort, form]);

  const SORT_OPTIONS = useMemo(
    () => [
      { value: BookSortField.TITLE, label: t(keys.sidebar.sort.fields.title) },
      { value: BookSortField.CREATED_AT, label: t(keys.sidebar.sort.fields.createdAt) },
      { value: BookSortField.UPDATED_AT, label: t(keys.sidebar.sort.fields.updatedAt) },
      { value: BookSortField.PUBLISHED_DATE, label: t(keys.sidebar.sort.fields.publishedDate) },
      { value: BookSortField.RATING, label: t(keys.sidebar.sort.fields.rating) },
      { value: BookSortField.TOTAL_REVIEWS, label: t(keys.sidebar.sort.fields.totalReviews) },
    ],
    [t, keys]
  );

  const handleReset = () => {
    form.reset({
      sortBy: DEFAULT_BOOK_SORT_FIELD,
      sortOrder: DEFAULT_BOOK_SORT_ORDER,
    });
    onReset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSort)} className='space-y-4'>
        {/* Sort by field */}
        <FormField
          control={form.control}
          name='sortBy'
          render={({ field }) => (
            <div className='grid gap-3'>
              <FormLabel>{t(keys.sidebar.sort.label)}</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </div>
          )}
        />

        {/* Sort direction */}
        <FormField
          control={form.control}
          name='sortOrder'
          render={({ field }) => (
            <div className='grid gap-3'>
              <FormLabel>{t(keys.sidebar.sort.direction)}</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SortDirection.DESC}>{t(keys.sidebar.sort.order.desc)}</SelectItem>
                    <SelectItem value={SortDirection.ASC}>{t(keys.sidebar.sort.order.asc)}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </div>
          )}
        />

        {/* Actions */}
        <div className='flex gap-2'>
          <Button variant='outline' type='button' className='flex-1' onClick={handleReset}>
            {t(keys.sidebar.actions.reset)}
          </Button>
          <Button type='submit' className='flex-1' disabled={form.formState.isSubmitting}>
            {t(keys.sidebar.actions.submit)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
