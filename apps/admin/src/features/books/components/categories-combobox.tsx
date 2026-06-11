import { useEffect, useId, useMemo, useState } from 'react';
import type { CategoryResponse } from '@/types';
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';
import { useCategories } from '@/hooks/data/useCategory';
import { useDebounce } from '@/hooks/ui/useDebounce';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/components/command';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover';

type CategoriesComboboxProps = {
  value: string[];
  onChange: (categories: string[]) => void;
  initialCategories?: CategoryResponse[];
};

export function CategoriesCombobox({
  value,
  onChange,
  initialCategories = [],
}: CategoriesComboboxProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  const categoryParams = useMemo(
    () => ({
      page,
      query: debouncedQuery,
    }),
    [page, debouncedQuery]
  );

  const shouldFetch = open || value.length > 0;
  const { data, isLoading } = useCategories(categoryParams, { enabled: shouldFetch });
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  const categoryMap = useMemo(() => {
    const map = new Map<string, CategoryResponse>();
    initialCategories.forEach((c) => map.set(c.id, c));
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [initialCategories, categories]);

  const pagination = Array.isArray(data?.pagination) ? data.pagination[0] : data?.pagination;
  const total = pagination?.total ?? 0;
  const limited = pagination?.limit ?? 10;
  const hasMore = page * limited < total;

  useEffect(() => {
    if (!data?.data) return;

    // Use a microtask to avoid synchronous setState in effect
    Promise.resolve().then(() => {
      if (page === 1) {
        setCategories(data.data);
      } else {
        setCategories((prev) => {
          const prevIds = new Set(prev.map((a) => a.id));
          const newCategories = data.data.filter((a) => !prevIds.has(a.id));
          return [...prev, ...newCategories];
        });
      }
    });
  }, [data?.data, page]);

  const handleSearch = (val: string) => {
    setQuery(val);
    setPage(1);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && hasMore && !isLoading) {
      setPage((p) => p + 1);
    }
  };

  const toggleSelection = (category: CategoryResponse) => {
    if (value.includes(category.id)) {
      onChange(value.filter((id) => id !== category.id));
    } else {
      onChange([...value, category.id]);
    }
  };

  const removeSelection = (category: CategoryResponse) => {
    onChange(value.filter((id) => id !== category.id));
  };

  return (
    <div className='w-full space-y-2'>
      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='h-auto min-h-8 w-full justify-between hover:bg-transparent'
          >
            <div className='flex flex-wrap items-center gap-1 pr-2.5'>
              {value.length > 0 ? (
                value.map((categoryId) => {
                  const category = categoryMap.get(categoryId);
                  return category ? (
                    <Badge key={category.id} variant='outline' className='rounded-sm'>
                      {category?.slug ?? ''}
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-4'
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelection(category);
                        }}
                        asChild
                      >
                        <span>
                          <XIcon className='size-3' />
                        </span>
                      </Button>
                    </Badge>
                  ) : null;
                })
              ) : (
                <span className='text-muted-foreground'>Select categories...</span>
              )}
            </div>
            <ChevronsUpDownIcon className='text-muted-foreground/80 shrink-0' aria-hidden='true' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-(--radix-popper-anchor-width) p-0'>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder='Search category...'
              value={query}
              onValueChange={handleSearch}
            />
            <CommandList className='max-h-60 overflow-y-auto' onScroll={handleScroll}>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.id}
                    onSelect={() => toggleSelection(category)}
                  >
                    <span className='truncate'>{category.slug}</span>
                    {value.includes(category.id) && <CheckIcon size={16} className='ml-auto' />}
                  </CommandItem>
                ))}
                {isLoading && <div className='p-2 text-center text-xs'>Loading...</div>}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
