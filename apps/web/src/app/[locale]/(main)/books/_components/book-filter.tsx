'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import { Form, FormField, FormLabel, FormControl, FormMessage } from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import {
  type BookFilterState,
  bookFilterFormSchema,
  DEFAULT_BOOK_FILTER,
} from './book-query.utils';
import { CategoriesCombobox } from './categories-combobox';
import { LanguagesCombobox } from './languages-combobox';

export interface BookFilterProps {
  filter: BookFilterState;
  onFilter: (params: BookFilterState) => void;
  onReset: () => void;
}

export default function BookFilter({ filter, onFilter, onReset }: BookFilterProps) {
  const { t, keys } = useLocale('books');

  const form = useForm<BookFilterState>({
    resolver: zodResolver(bookFilterFormSchema),
    defaultValues: filter,
  });

  useEffect(() => {
    form.reset(filter ?? DEFAULT_BOOK_FILTER);
  }, [filter, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFilter)} className='space-y-4'>
        {/* Search */}
        <FormField
          control={form.control}
          name='query'
          render={({ field }) => (
            <div className='grid gap-3'>
              <FormLabel htmlFor='search'>{t(keys.sidebar.filter.search.label)}</FormLabel>
              <FormControl>
                <Input
                  id='search'
                  placeholder={t(keys.sidebar.filter.search.placeholder)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </div>
          )}
        />
        {/* Categories (multi-select) */}
        <FormField
          control={form.control}
          name='categories'
          render={({ field }) => (
            <div className='grid gap-3'>
              <FormLabel htmlFor='categories'>{t(keys.sidebar.filter.categories.label)}</FormLabel>
              <FormControl>
                <CategoriesCombobox value={field.value || []} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </div>
          )}
        />
        {/* Languages (multi-select) */}
        <FormField
          control={form.control}
          name='languages'
          render={({ field }) => (
            <div className='grid gap-3'>
              <FormLabel htmlFor='languages'>{t(keys.sidebar.filter.languages.label)}</FormLabel>
              <FormControl>
                <LanguagesCombobox value={field.value || []} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </div>
          )}
        />
        {/* Reset & Submit */}
        <div className='flex gap-2'>
          <Button
            variant='outline'
            type='button'
            className='flex-1'
            onClick={() => {
              form.reset(DEFAULT_BOOK_FILTER);
              onReset();
            }}
          >
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
