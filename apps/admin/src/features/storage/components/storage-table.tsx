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
import { useSearchFiles } from '@/hooks/data/useFile';
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
import { storageColumns as columns } from './storage-columns';
import { buildStorageFindParams } from './storage-query.utils';
import StorageTableBulkActions from './storage-table-bulk-actions';

const route = getRouteApi('/_authenticated/storage/');

export function StorageTable() {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);
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
    columnFilters: [{ columnId: 'contentType', searchKey: 'contentType', type: 'array' }],
  });

  const page = typeof pagination.pageIndex === 'number' ? pagination.pageIndex + 1 : 1;
  const limit = typeof pagination.pageSize === 'number' ? pagination.pageSize : 10;

  const storageParams = useMemo(
    () => buildStorageFindParams(page, limit, globalFilter ?? '', sorting, columnFilters),
    [page, limit, globalFilter, sorting, columnFilters]
  );

  // fetch server-side page
  const { data: filesData, isFetching: isFilesFetching } = useSearchFiles(storageParams);
  const files = filesData?.data ?? [];
  const filesPagination = filesData?.pagination;

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: files,
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
    pageCount: filesPagination?.pages ?? 0,
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
        searchPlaceholder='Search files by name...'
        filters={[
          {
            columnId: 'contentType',
            title: 'File Type',
            options: [
              { label: 'PDF Document', value: 'application/pdf' },
              { label: 'CSV Sheet', value: 'text/csv' },
              { label: 'PNG Image', value: 'image/png' },
              { label: 'JPEG Image', value: 'image/jpeg' },
              { label: 'WebP Image', value: 'image/webp' },
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
                  {isFilesFetching ? 'Loading...' : 'No files found.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} className='mt-auto' />
      <StorageTableBulkActions table={table} />
    </div>
  );
}

export default StorageTable;
