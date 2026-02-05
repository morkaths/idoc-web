'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from "next/navigation";
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { useBorrowHistory } from '@/hooks/data/useBorrow';
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
import { borrowsColumns } from './borrows-columns';
import { KEYS, useLocale } from '@/hooks/ui/useLocale';
import BorrowsTableBulkActions from './borrows-table-bulk-actions';

export function BorrowsTable() {
  const { t, keys } = useLocale('library');
  const columns = useMemo(() => borrowsColumns(t, keys), [t, keys]);
  const router = useRouter();
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
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: true, key: 'q' },
    search: {},
    navigate: (opts) => {
      if (opts?.search) {
        const params = new URLSearchParams(opts.search as Record<string, string>).toString();
        router.replace(`?${params}`);
      }
    },
  });

  const page = typeof pagination.pageIndex === 'number' ? pagination.pageIndex + 1 : 1;
  const limit = typeof pagination.pageSize === 'number' ? pagination.pageSize : 10;

  const borrowParams = useMemo(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFilter]);

  useEffect(() => {
    ensurePageInRange(table.getPageCount());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getPageCount(), ensurePageInRange]);

  return (
    <div className={cn('max-sm:has-[div[role="toolbar"]]:mb-16', 'flex flex-1 flex-col gap-4')}>
      <DataTableToolbar
        table={table}
        searchPlaceholder={t(keys.search.placeholder)}
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