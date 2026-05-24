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
import { BorrowStatus } from '@/types';
import { cn } from '@/lib/utils';
import { useBorrows } from '@/hooks/data/useBorrow';
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
import { borrowsColumns as columns } from './borrows-columns';
import { buildBorrowFindParams } from './borrows-query.utils';
import BorrowsTableBulkActions from './borrows-table-bulk-actions';

const route = getRouteApi('/_authenticated/borrows/');

export function BorrowsTable() {
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
    columnFilters: [{ columnId: 'status', searchKey: 'status', type: 'array' }],
  });

  const page = typeof pagination.pageIndex === 'number' ? pagination.pageIndex + 1 : 1;
  const limit = typeof pagination.pageSize === 'number' ? pagination.pageSize : 10;

  const borrowParams = useMemo(
    () => buildBorrowFindParams(page, limit, globalFilter ?? '', sorting, columnFilters),
    [page, limit, globalFilter, sorting, columnFilters]
  );

  const { data: borrowsData, isFetching: isBorrowsFetching } = useBorrows(borrowParams);
  const borrows = borrowsData?.data ?? [];
  const borrowPagination = borrowsData?.pagination;

  // eslint-disable-next-line react-hooks/incompatible-library
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
        searchPlaceholder='Search borrows...'
        filters={[
          {
            columnId: 'status',
            title: 'Status',
            options: [
              { label: 'Borrowed', value: BorrowStatus.BORROWED },
              { label: 'Returned', value: BorrowStatus.RETURNED },
              { label: 'Overdue', value: BorrowStatus.OVERDUE },
              { label: 'Canceled', value: BorrowStatus.CANCELED },
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
                  {isBorrowsFetching ? 'Loading...' : 'No results.'}
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
