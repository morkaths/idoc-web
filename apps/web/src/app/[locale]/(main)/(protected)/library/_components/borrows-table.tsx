'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { BorrowStatus } from '@/types';
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useBorrowHistory } from '@/hooks/data/useBorrow';
import { KEYS, useLocale } from '@/hooks/ui/useLocale';
import { useTableUrlState } from '@/hooks/ui/useTableUrlState';
import { buildBorrowFindParams } from './borrow-query.utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table';
import { DataTablePagination, DataTableToolbar } from '@/components/data-table';
import { borrowsColumns } from './borrows-columns';
import BorrowsTableBulkActions from './borrows-table-bulk-actions';

export function BorrowsTable() {
  const { t, keys } = useLocale('library');
  const columns = useMemo(() => borrowsColumns(t, keys), [t, keys]);
  const router = useRouter();
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const search = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

  const navigate = useCallback(
    (opts: any) => {
      const params = typeof opts.search === 'function' ? opts.search(search) : opts.search;
      const queryString = new URLSearchParams(params as Record<string, string>).toString();
      router.replace(`${pathname}?${queryString}`, { scroll: false });
    },
    [router, pathname, search]
  );

  const {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: true, key: 'q' },
    columnFilters: [{ columnId: 'status', searchKey: 'status', type: 'array' }],
  });

  const page = typeof pagination.pageIndex === 'number' ? pagination.pageIndex + 1 : 1;
  const limit = typeof pagination.pageSize === 'number' ? pagination.pageSize : 10;

  const borrowParams = useMemo(
    () => buildBorrowFindParams(page, limit, globalFilter ?? '', sorting, columnFilters),
    [page, limit, globalFilter, sorting, columnFilters]
  );

  // fetch server-side page
  const { data: borrowsData, isFetching: isBorrowsFetching } = useBorrowHistory(borrowParams);
  const borrows = borrowsData?.data ?? [];
  const borrowPagination = borrowsData?.pagination;

  const table = useReactTable({
    data: borrows,
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
    pageCount: borrowPagination?.pages ?? 0,
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
  }, [globalFilter, onPaginationChange, pagination.pageSize]);

  useEffect(() => {
    ensurePageInRange(table.getPageCount());
  }, [table.getPageCount(), ensurePageInRange]);

  return (
    <div className={cn('max-sm:has-[div[role="toolbar"]]:mb-16', 'flex flex-1 flex-col gap-4')}>
      <DataTableToolbar
        table={table}
        searchPlaceholder={t(keys.search.placeholder)}
        filters={[
          {
            columnId: 'status',
            title: t(keys.table.columns.status),
            options: [
              { label: 'Borrowed', value: BorrowStatus.BORROWED },
              { label: 'Returned', value: BorrowStatus.RETURNED },
              { label: 'Overdue', value: BorrowStatus.OVERDUE },
            ],
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
                    className={cn(header.column.columnDef.meta?.className)}
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
                      className={cn(cell.column.columnDef.meta?.className)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  {isBorrowsFetching ? t(KEYS.common.states.loading) : t(KEYS.common.states.noData)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} className='mt-auto' />
      <BorrowsTableBulkActions table={table} />
    </div>
  );
}

export default BorrowsTable;
