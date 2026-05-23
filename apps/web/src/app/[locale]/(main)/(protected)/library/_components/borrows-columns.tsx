import type { LoanResponse } from '@/types';
import { BorrowStatus } from '@/types';
import { type ColumnDef } from '@tanstack/react-table';
import { ImageOff } from 'lucide-react';
import { Badge } from '@repo/ui/components/badge';
import { Checkbox } from '@repo/ui/components/checkbox';
import { AppImage } from '@/components/app-image';
import { DataTableColumnHeader } from '@/components/data-table';
import Highlight from '@/components/highlight';
import { BorrowsTableRowActions } from './borrows-table-row-actions';

const CoverCell = ({ src, title }: { src?: string; title: string }) => {
  if (!src) {
    return (
      <div className='bg-muted/20 text-muted-foreground flex h-15 w-10 items-center justify-center rounded-md border'>
        <ImageOff className='h-4 w-4 opacity-50' />
      </div>
    );
  }

  return (
    <div
      className='relative h-15 w-10 overflow-hidden border'
      style={{ borderRadius: 'var(--radius-img)' }}
    >
      <AppImage src={src} alt={title} fill sizes='40px' className='object-cover' loading='lazy' />
    </div>
  );
};

export interface BorrowTranslationKeys {
  table: {
    columns: {
      cover: string;
      book: string;
      renewals: string;
      borrowedDate: string;
      dueDate: string;
      returnDate: string;
      status: string;
    };
    states: {
      borrowed: string;
      active: string;
      overdue: string;
      returned: string;
    };
  };
}

export const borrowsColumns = (
  t: (key: string) => string,
  keys: BorrowTranslationKeys
): ColumnDef<LoanResponse>[] => [
  {
    id: 'select',
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
  },
  {
    id: 'coverUrl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t(keys.table.columns.cover)} />
    ),
    meta: { title: t(keys.table.columns.cover), className: 'ps-4' },
    cell: ({ row }) => {
      const book = row.original.book;
      const src = book?.coverUrl;
      const title = book?.title ?? '-';
      return <CoverCell src={src} title={title} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'book',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t(keys.table.columns.book)} />
    ),
    meta: { title: t(keys.table.columns.book), className: 'ps-4' },
    cell: ({ row, table }) => {
      const book = row.original.book;
      const title = book?.title ?? '-';
      const query = String(table.getState().globalFilter ?? '');
      return (
        <div className='max-w-32 truncate' title={title}>
          <Highlight text={title} query={query} />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'renewals',
    header: ({ column }) => (
      <div className='w-full text-center'>
        <DataTableColumnHeader
          column={column}
          title={t(keys.table.columns.renewals)}
          className='justify-center'
        />
      </div>
    ),
    meta: { title: t(keys.table.columns.renewals) },
    cell: ({ row }) => {
      const count = row.original.renewals?.length ?? 0;
      return <span className='block w-full text-center'>{count}</span>;
    },
  },
  {
    accessorKey: 'borrowedDate',
    header: ({ column }) => (
      <div className='w-full text-center'>
        <DataTableColumnHeader
          column={column}
          title={t(keys.table.columns.borrowedDate)}
          className='justify-center'
        />
      </div>
    ),
    meta: { title: t(keys.table.columns.borrowedDate) },
    cell: ({ row }) => {
      const d = row.getValue('borrowedDate') as string | Date | undefined;
      const date = d ? (d instanceof Date ? d : new Date(String(d))) : null;
      return (
        <span className='block w-full text-center'>
          {date && !isNaN(date.getTime()) ? date.toLocaleDateString() : '-'}
        </span>
      );
    },
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
      <div className='w-full text-center'>
        <DataTableColumnHeader
          column={column}
          title={t(keys.table.columns.dueDate)}
          className='justify-center'
        />
      </div>
    ),
    meta: { title: t(keys.table.columns.dueDate) },
    cell: ({ row }) => {
      const d = row.getValue('dueDate') as string | Date | undefined;
      const date = d ? (d instanceof Date ? d : new Date(String(d))) : null;
      return (
        <span className='block w-full text-center'>
          {date && !isNaN(date.getTime()) ? date.toLocaleDateString() : '-'}
        </span>
      );
    },
  },
  {
    accessorKey: 'returnDate',
    header: ({ column }) => (
      <div className='w-full text-center'>
        <DataTableColumnHeader
          column={column}
          title={t(keys.table.columns.returnDate)}
          className='justify-center'
        />
      </div>
    ),
    meta: { title: t(keys.table.columns.returnDate) },
    cell: ({ row }) => {
      const d = row.getValue('returnDate') as string | Date | undefined;
      const date = d ? (d instanceof Date ? d : new Date(String(d))) : null;
      return (
        <span className='block w-full text-center'>
          {date && !isNaN(date.getTime()) ? date.toLocaleDateString() : '-'}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <div className='w-full text-center'>
        <DataTableColumnHeader
          column={column}
          title={t(keys.table.columns.status)}
          className='justify-center'
        />
      </div>
    ),
    meta: { title: t(keys.table.columns.status) },
    cell: ({ row }) => {
      const status = row.getValue('status') as BorrowStatus | string;
      let color: 'default' | 'destructive' | 'outline' = 'default';
      let label = status;

      switch (status) {
        case BorrowStatus.BORROWED:
          color = 'default';
          label = t(keys.table.states.borrowed);
          break;
        case BorrowStatus.OVERDUE:
          color = 'destructive';
          label = t(keys.table.states.overdue);
          break;
        case BorrowStatus.RETURNED:
          color = 'outline';
          label = t(keys.table.states.returned);
          break;
        default:
          color = 'default';
          label = status;
      }
      return (
        <div className='flex justify-center'>
          <Badge variant={color} className='text-xs capitalize'>
            {label}
          </Badge>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <BorrowsTableRowActions row={row} />,
  },
];
