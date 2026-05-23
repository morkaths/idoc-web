import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { cn, getPageNumbers } from '@/lib/utils';
import { type Table } from '@tanstack/react-table';
import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';

type DataTablePaginationProps<TData> = {
  table: Table<TData>;
  className?: string;
};

export function DataTablePagination<TData>({ table, className }: DataTablePaginationProps<TData>) {
  const { t, keys } = useLocale('common');
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div
      className={cn(
        'flex items-center justify-between overflow-clip px-2',
        '@max-2xl/content:flex-col-reverse @max-2xl/content:gap-4',
        className
      )}
      style={{ overflowClipMargin: 1 }}
    >
      <div className='flex w-full items-center justify-between'>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium @2xl/content:hidden'>
          {t(keys.pagination.page)} {currentPage} {t(keys.pagination.of)} {totalPages}
        </div>
        <div className='flex items-center gap-2 @max-2xl/content:flex-row-reverse'>
          <select
            value={`${table.getState().pagination.pageSize}`}
            onChange={(event) => {
              const newSize = Number(event.target.value);
              const currentSize = table.getState().pagination.pageSize;
              if (newSize !== currentSize) table.setPageSize(newSize);
            }}
            className={cn(
              'border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-[70px] rounded-md border px-2 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]'
            )}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <p className='hidden text-sm font-medium sm:block'>{t(keys.pagination.rowsPerPage)}</p>
        </div>
      </div>

      <div className='flex items-center sm:space-x-6 lg:space-x-8'>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium @max-3xl/content:hidden'>
          {t(keys.pagination.page)} {currentPage} {t(keys.pagination.of)} {totalPages}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='size-8 p-0 @max-md/content:hidden'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>{t(keys.pagination.first)}</span>
            <DoubleArrowLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='size-8 p-0'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>{t(keys.pagination.previous)}</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>

          {/* Page number buttons */}
          {pageNumbers.map((pageNumber, index) => (
            <div key={`${pageNumber}-${index}`} className='flex items-center'>
              {pageNumber === '...' ? (
                <span className='text-muted-foreground px-1 text-sm'>...</span>
              ) : (
                <Button
                  variant={currentPage === pageNumber ? 'default' : 'outline'}
                  className='h-8 min-w-8 px-2'
                  onClick={() => table.setPageIndex((pageNumber as number) - 1)}
                >
                  <span className='sr-only'>
                    {t(keys.pagination.page)} {pageNumber}
                  </span>
                  {pageNumber}
                </Button>
              )}
            </div>
          ))}

          <Button
            variant='outline'
            className='size-8 p-0'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>{t(keys.pagination.next)}</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='size-8 p-0 @max-md/content:hidden'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>{t(keys.pagination.last)}</span>
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
