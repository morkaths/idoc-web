import { useEffect, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { type Table } from '@tanstack/react-table';
import { useDebounce } from '@/hooks/ui/useDebounce';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { DataTableFacetedFilter } from './faceted-filter';
import { DataTableViewOptions } from './view-options';

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  searchPlaceholder?: string;
  searchKey?: string;
  filters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
};

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filter...',
  searchKey,
  filters = [],
}: DataTableToolbarProps<TData>) {
  const [search, setSearch] = useState(() => {
    if (searchKey) {
      return (table.getColumn(searchKey)?.getFilterValue() as string) ?? '';
    }
    return (table.getState().globalFilter as string) ?? '';
  });
  const debouncedSearch = useDebounce(search, 500);
  const isFiltered = table.getState().columnFilters.length > 0 || table.getState().globalFilter;

  useEffect(() => {
    if (searchKey) {
      const column = table.getColumn(searchKey);
      if (column) {
        const currentVal = (column.getFilterValue() as string) ?? '';
        if (debouncedSearch !== currentVal) {
          column.setFilterValue(debouncedSearch);
        }
      }
    } else {
      const currentVal = (table.getState().globalFilter as string) ?? '';
      if (debouncedSearch !== currentVal) {
        table.setGlobalFilter(debouncedSearch);
      }
    }
  }, [debouncedSearch, searchKey, table]);

  // Sync search input with table state if it changes externally (e.g. reset or browser navigation)
  useEffect(() => {
    const externalVal = searchKey
      ? ((table.getColumn(searchKey)?.getFilterValue() as string) ?? '')
      : ((table.getState().globalFilter as string) ?? '');

    if (externalVal !== debouncedSearch) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearch(externalVal);
    }
  }, [table, searchKey, debouncedSearch]);

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className='h-8 w-37.5 lg:w-62.5'
        />
        <div className='flex gap-x-2'>
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId);
            if (!column) return null;
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            );
          })}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter('');
              setSearch('');
            }}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ms-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
