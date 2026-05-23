'use client';
'use no memo';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
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
import { useTableUrlState, type NavigateFn } from '@/hooks/ui/useTableUrlState';
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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const search = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);
  const searchRef = useRef(search);
  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  const navigate = useCallback(
    (opts: Parameters<NavigateFn>[0]) => {
      const currentSearch = searchRef.current;
      const searchVal = opts.search;
      const params =
        typeof searchVal === 'function'
          ? searchVal(currentSearch)
          : searchVal === true
            ? currentSearch
            : searchVal;

      const queryString = new URLSearchParams(params as Record<string, string>).toString();
      router.replace(`${pathname}?${queryString}`, { scroll: false });
    },
    [router, pathname]
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
  const tableResetKey = useMemo(
    () => JSON.stringify({ globalFilter: globalFilter ?? '', columnFilters }),
    [globalFilter, columnFilters]
  );

  const borrowParams = useMemo(
    () => buildBorrowFindParams(page, limit, globalFilter ?? '', sorting, columnFilters),
    [page, limit, globalFilter, sorting, columnFilters]
  );

  // fetch server-side page
  const { data: borrowsData, isFetching: isBorrowsFetching } = useBorrowHistory(borrowParams);
  const borrows = borrowsData?.data ?? [];
  const borrowPagination = borrowsData?.pagination;

  // Handle page reset on filter change if needed
  // Note: useTableUrlState already handles resetting to page 1 on filter changes
  useEffect(() => {
    if (globalFilter && pagination.pageIndex !== 0) {
      onPaginationChange?.((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    }
  }, [globalFilter, onPaginationChange, pagination.pageIndex]);

  useEffect(() => {
    if (borrowPagination?.pages && borrowPagination.pages > 0) {
      ensurePageInRange(borrowPagination.pages);
    }
  }, [borrowPagination?.pages, ensurePageInRange]);

  return (
    <div className={cn('max-sm:has-[div[role="toolbar"]]:mb-16', 'flex flex-1 flex-col gap-4')}>
      <BorrowsTableContent
        key={tableResetKey}
        columns={columns}
        borrows={borrows}
        borrowPaginationPages={borrowPagination?.pages ?? 0}
        isBorrowsFetching={isBorrowsFetching}
        sorting={sorting}
        setSorting={setSorting}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnFilters={columnFilters}
        globalFilter={globalFilter}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        onGlobalFilterChange={onGlobalFilterChange}
        onColumnFiltersChange={onColumnFiltersChange}
        t={t}
        keys={keys}
      />
    </div>
  );
}

type BorrowsTableContentProps = {
  columns: ReturnType<typeof borrowsColumns>;
  borrows: ReturnType<typeof useBorrowHistory>['data'] extends infer T ? T extends { data?: infer D } ? D extends Array<unknown> ? D : never : never : never;
  borrowPaginationPages: number;
  isBorrowsFetching: boolean;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
  columnFilters: ReturnType<typeof useTableUrlState>['columnFilters'];
  globalFilter?: string;
  pagination: ReturnType<typeof useTableUrlState>['pagination'];
  onPaginationChange: ReturnType<typeof useTableUrlState>['onPaginationChange'];
  onGlobalFilterChange?: ReturnType<typeof useTableUrlState>['onGlobalFilterChange'];
  onColumnFiltersChange: ReturnType<typeof useTableUrlState>['onColumnFiltersChange'];
  t: ReturnType<typeof useLocale<'library'>>['t'];
  keys: ReturnType<typeof useLocale<'library'>>['keys'];
};

function BorrowsTableContent({
  columns,
  borrows,
  borrowPaginationPages,
  isBorrowsFetching,
  sorting,
  setSorting,
  columnVisibility,
  setColumnVisibility,
  columnFilters,
  globalFilter,
  pagination,
  onPaginationChange,
  onGlobalFilterChange,
  onColumnFiltersChange,
  t,
  keys,
}: BorrowsTableContentProps) {
  const [rowSelection, setRowSelection] = useState({});

  // TanStack Table intentionally returns unstable functions here.
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
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
    },
    manualPagination: true,
    pageCount: borrowPaginationPages,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange,
    onGlobalFilterChange,
    onColumnFiltersChange,
  });

  return (
    <>
      <DataTableToolbar
        table={table}
        searchPlaceholder={t(keys.search.placeholder)}
        filters={[
          {
            columnId: 'status',
            title: t(keys.table.columns.status),
            options: [
              { label: t(keys.table.states.borrowed), value: BorrowStatus.BORROWED },
              { label: t(keys.table.states.returned), value: BorrowStatus.RETURNED },
              { label: t(keys.table.states.overdue), value: BorrowStatus.OVERDUE },
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
    </>
  );
}

export default BorrowsTable;
