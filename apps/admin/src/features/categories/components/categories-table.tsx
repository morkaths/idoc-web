'use client';

import { useEffect, useState, useMemo } from 'react';
import { getRouteApi } from '@tanstack/react-router';
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/data/useCategory';
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
import { categoriesColumns as columns } from './categories-columns';
import CategoriesTableBulkActions from './categories-table-bulk-actions';

const route = getRouteApi('/_authenticated/categories/');

export function CategoriesTable() {
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
    globalFilter: { enabled: true, key: 'q' },
    columnFilters: [],
  });

  const page = typeof pagination.pageIndex === 'number' ? pagination.pageIndex + 1 : 1;
  const limit = typeof pagination.pageSize === 'number' ? pagination.pageSize : 10;

  const categoryParams = useMemo(() => {
    const apiSort = sorting[0]
      ? {
          sortBy: String(sorting[0].id),
          sortOrder: sorting[0].desc ? 'desc' : 'asc',
        }
      : undefined;

    return {
      page,
      limit,
      query: globalFilter ?? '',
      ...(apiSort || {}),
    };
  }, [page, limit, globalFilter, sorting]);

  // fetch server-side page
  const { data: categoriesData, isFetching: isCategoriesFetching } = useCategories(categoryParams);
  const categories = categoriesData?.data ?? [];
  const categoryPagination = categoriesData?.pagination;

  const table = useReactTable({
    data: categories,
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
    pageCount: categoryPagination?.pages ?? 0,
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
    if (!onPaginationChange) return;
    setRowSelection({});
    onPaginationChange((prev) => ({
      ...prev,
      pageIndex: 0,
      pageSize: pagination.pageSize ?? 10,
    }));
  }, [globalFilter]);

  useEffect(() => {
    ensurePageInRange(table.getPageCount());
  }, [table.getPageCount(), ensurePageInRange]);

  return (
    <div className={cn('max-sm:has-[div[role="toolbar"]]:mb-16', 'flex flex-1 flex-col gap-4')}>
      <DataTableToolbar
        table={table}
        searchPlaceholder='Search categories...'
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
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  {isCategoriesFetching ? 'Loading...' : 'No results.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} className='mt-auto' />
      <CategoriesTableBulkActions table={table} />
    </div>
  );
}

export default CategoriesTable;