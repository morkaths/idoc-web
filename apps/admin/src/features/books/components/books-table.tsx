'use client'

import { useEffect, useState, useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { useTableUrlState } from '@/hooks/ui/useTableUrlState'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { booksColumns as columns } from './books-columns'
import { useBooks } from '@/hooks/data/useBook'
import { useAllCategories } from '@/hooks/data/useCategory'
import BooksTableBulkActions from './books-table-bulk-actions'

const route = getRouteApi('/_authenticated/books/')

export function BooksTable() {
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // statuses for filter
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
    columnFilters: [
      { columnId: 'categories', searchKey: 'category', type: 'array' },
      { columnId: 'language', searchKey: 'language', type: 'array' }
    ],
  })

  // map react-table filters -> API filters
  const apiFilters = (() => {
    if (!columnFilters) return undefined
    if (Array.isArray(columnFilters)) {
      const normalized = (columnFilters as any[]).reduce((acc, f) => {
        const key = f.id ?? f.columnId ?? f.field
        if (key) acc[key] = f.value
        return acc
      }, {} as Record<string, any>)
      return Object.keys(normalized).length ? normalized : undefined
    }
    return Object.keys(columnFilters).length ? columnFilters : undefined
  })()

  // map react-table sorting -> API sort
  const apiSorts: Record<string, string>[] | undefined =
    sorting.length > 0
      ? sorting.map((s) => ({ field: String(s.id), dir: s.desc ? 'desc' : 'asc' }))
      : undefined;

  const page =
    typeof (pagination as any).page === 'number'
      ? (pagination as any).page
      : typeof (pagination as any).pageIndex === 'number'
        ? (pagination as any).pageIndex + 1
        : 1;
  const limit = pagination.pageSize ?? 10;

  // fetch server-side page
  const { data: booksData, isFetching: isBooksFetching } = useBooks({
    page,
    limit,
    query: globalFilter ?? "",
    filters: apiFilters,
    sorts: apiSorts,
  })
  const books = booksData?.books ?? []
  const bookPagination = booksData?.pagination

  const { data: categoriesData = [] } = useAllCategories();
  const categories = useMemo(() => {
    return categoriesData.map((c) => ({
      label: Array.isArray(c.translations)
        ? (c.translations.find(t => t.lang === 'en')?.name ?? c.translations[0]?.name ?? 'Unnamed')
        : 'Unnamed',
      value: c._id,
    }))
  }, [categoriesData]);

  const table = useReactTable({
    data: books,
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
    pageCount: bookPagination?.pages ?? 0,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange,
    onGlobalFilterChange,
    onColumnFiltersChange,
  })

  useEffect(() => {
    if (!onPaginationChange) return
    setRowSelection({})
    onPaginationChange((prev) => ({
      ...prev,
      pageIndex: 0,
      pageSize: pagination.pageSize ?? 10,
    }))
  }, [globalFilter]);

  useEffect(() => {
    ensurePageInRange(table.getPageCount())
  }, [table.getPageCount(), ensurePageInRange]);



  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4'
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder="Search books..."
        filters={[
          {
            columnId: 'categories',
            title: 'Category',
            options: categories,
          },
        ]}
      />
      <div className="overflow-hidden rounded-md border">
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
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {isBooksFetching ? 'Loading...' : 'No results.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} className="mt-auto" />
      <BooksTableBulkActions table={table} />
    </div>
  )
}

export default BooksTable