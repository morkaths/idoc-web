'use client';

import { useEffect, useState, useMemo } from 'react';
import { UserSearch, Loader2 } from 'lucide-react';
import { getRouteApi } from '@tanstack/react-router';
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Languages } from '@/types';
import { cn } from '@/lib/utils';
import { useSearchAuthors } from '@/hooks/data/useAuthor';
import { useTableUrlState } from '@/hooks/ui/useTableUrlState';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table';
import { DataTablePagination, DataTableToolbar } from '@/components/data-table';
import { authorsColumns as columns } from './authors-columns';
import { buildAuthorFindParams } from './authors-query.utils';
import AuthorsTableBulkActions from './authors-table-bulk-actions';

const route = getRouteApi('/_authenticated/authors/');

export function AuthorsTable() {
  'use no memo';
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search: route.useSearch(),
    navigate: route.useNavigate(),
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: true, key: 'query' },
    columnFilters: [{ columnId: 'nationality', searchKey: 'nationality', type: 'array' }],
  });

  const page = typeof pagination.pageIndex === 'number' ? pagination.pageIndex + 1 : 1;
  const limit = typeof pagination.pageSize === 'number' ? pagination.pageSize : 10;

  const authorParams = useMemo(
    () => buildAuthorFindParams(page, limit, globalFilter ?? '', sorting, columnFilters),
    [page, limit, globalFilter, sorting, columnFilters]
  );

  // fetch server-side page
  const { data: authorsData, isFetching: isAuthorsFetching } = useSearchAuthors(authorParams);
  const authors = authorsData?.data ?? [];
  const authorPagination = authorsData?.pagination;

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: authors,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination: {
        pageIndex: Math.max(0, page - 1),
        pageSize: pagination.pageSize ?? 10,
      },
    },
    manualPagination: true,
    pageCount: authorPagination?.pages ?? 0,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange,
    onGlobalFilterChange,
    onColumnFiltersChange,
  });

  useEffect(() => {
    setRowSelection({});
  }, [globalFilter, columnFilters]);

  const pageCount = table.getPageCount();
  useEffect(() => {
    ensurePageInRange(pageCount);
  }, [pageCount, ensurePageInRange]);

  return (
    <div className={cn('max-sm:has-[div[role="toolbar"]]:mb-16', 'flex flex-1 flex-col gap-4')}>
      <DataTableToolbar
        table={table}
        searchPlaceholder='Search authors...'
        filters={[
          {
            columnId: 'nationality',
            title: 'Nationality',
            options: Languages.filter((l) => l.enabled).map((l) => ({
              label: l.label,
              value: l.value,
            })),
          },
        ]}
      />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.thClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='py-16 text-center'>
                  {isAuthorsFetching ? (
                    <Loader2 className='text-primary mx-auto h-5 w-5 animate-spin' />
                  ) : (
                    <div className='flex flex-col items-center gap-3'>
                      <div className='bg-muted rounded-full p-4'>
                        <UserSearch className='text-muted-foreground h-10 w-10' />
                      </div>
                      <div className='space-y-1'>
                        <p className='text-foreground font-medium'>No authors found</p>
                        <p className='text-muted-foreground text-sm'>
                          Try adjusting your search or filter to find what you&apos;re looking for.
                        </p>
                      </div>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} className='mt-auto' />
      <AuthorsTableBulkActions table={table} />
    </div>
  );
}

export default AuthorsTable;
