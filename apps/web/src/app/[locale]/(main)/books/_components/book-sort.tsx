'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import { Form, FormField, FormLabel, FormControl, FormMessage } from '@repo/ui/components/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';

const SortSchema = z.object({
  sortBy: z.string().default('createdAt').optional(),
  sortOrder: z.enum(['desc', 'asc']).default('desc').optional(),
});

type SortForm = z.infer<typeof SortSchema>;

export interface BookSortProps {
  sort?: Partial<SortForm>;
  onSort: (params: SortForm) => void;
  onReset: () => void;
}

export default function BookSort({ sort, onSort, onReset }: BookSortProps) {
  const { t, keys } = useLocale('books');
  const form = useForm<SortForm>({
    resolver: zodResolver(SortSchema),
    defaultValues: {
      sortBy: sort?.sortBy || 'createdAt',
      sortOrder: sort?.sortOrder || 'desc',
    },
  });

  const SORT_OPTIONS = [
    { value: 'title', label: t(keys.sidebar.sort.fields.title) },
    { value: 'createdAt', label: t(keys.sidebar.sort.fields.createdAt) },
    { value: 'updatedAt', label: t(keys.sidebar.sort.fields.updatedAt) },
    { value: 'publishedYear', label: t(keys.sidebar.sort.fields.publishedYear) },
    { value: 'price', label: t(keys.sidebar.sort.fields.price) },
    { value: 'pages', label: t(keys.sidebar.sort.fields.pages) },
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          onSort(data);
        })}
        className='space-y-4'
      >
        {/* Sort by */}
        <FormField
          control={form.control}
          name='sortBy'
          render={({ field }) => (
            <div className='grid gap-3'>
              <FormLabel htmlFor='sortBy'>{t(keys.sidebar.sort.label)}</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((col) => (
                      <SelectItem key={col.value} value={col.value}>
                        {col.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </div>
          )}
        />
        {/* Sort order */}
        <FormField
          control={form.control}
          name='sortOrder'
          render={({ field }) => (
            <div className='grid gap-3'>
              <FormLabel htmlFor='sortOrder'>{t(keys.sidebar.sort.direction)}</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='desc'>{t(keys.sidebar.sort.order.desc)}</SelectItem>
                    <SelectItem value='asc'>{t(keys.sidebar.sort.order.asc)}</SelectItem>
                  </SelectContent>
                </Select>
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
              form.reset({ sortBy: 'createdAt', sortOrder: 'desc' });
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
