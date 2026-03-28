import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { BorrowStatus, type BorrowResponse } from '@/types';
import { ImageOff } from 'lucide-react';
import { Badge } from '@repo/ui/components/badge';
import { Checkbox } from '@repo/ui/components/checkbox';
import { DataTableColumnHeader } from '@/components/data-table';
import Highlight from '@/components/highlight';
import { BorrowsTableRowActions } from './borrows-table-row-actions';

const BookCoverCell = ({ src, title }: { src?: string; title: string }) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className='bg-muted/20 text-muted-foreground flex h-10 w-7 flex-shrink-0 items-center justify-center rounded-md border'>
        <ImageOff className='h-4 w-4 opacity-50' />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className='h-10 w-7 flex-shrink-0 rounded object-cover border'
      loading='lazy'
      onError={() => setError(true)}
    />
  );
};

export const borrowsColumns: ColumnDef<BorrowResponse>[] = [
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
    accessorKey: 'item',
    enableSorting: false,
    meta: { className: 'ps-4' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Item' />,
    cell: ({ row, table }) => {
      const item = row.original.item;
      const title = item?.title ?? '-';
      const query = String(table.getState().globalFilter ?? '');
      const authors =
        item?.authors && item.authors.length > 0
          ? item.authors.map((a) => a.name).join(', ')
          : 'Unknown Author';
      return (
        <div className='flex items-center gap-2 max-w-48'>
          <BookCoverCell src={item?.coverUrl} title={title} />
          <div className='flex flex-col truncate'>
            <span className='truncate font-medium'>
              <Highlight text={title} query={query} />
            </span>
            <span className='truncate text-xs text-muted-foreground'>
              <Highlight text={authors} query={query} />
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'borrower',
    enableSorting: false,
    meta: { className: 'ps-4' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Borrower' />,
    cell: ({ row, table }) => {
      const borrower = row.original.borrower;
      const username = borrower?.username ?? '-';
      const email = borrower?.email ?? '-';
      const query = String(table.getState().globalFilter ?? '');
      return (
        <div className='flex flex-col max-w-48'>
          <span className='truncate font-medium'>
            <Highlight text={username} query={query} />
          </span>
          <span className='truncate text-xs text-muted-foreground'>
            <Highlight text={email} query={query} />
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'renewals',
    enableSorting: false,
    meta: { className: 'ps-4' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Renewals' />,
    cell: ({ row }) => {
      const count = row.original.renewals?.length ?? 0;
      return <span>{count}</span>;
    },
  },
  {
    accessorKey: 'borrowTime',
    meta: { className: 'ps-4' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Borrow Date' />,
    cell: ({ row }) => {
      const d = row.getValue('borrowTime') as string | Date | undefined;
      const date = d ? (d instanceof Date ? d : new Date(String(d))) : null;
      return (
        <span>{date && !isNaN(date.getTime()) ? date.toLocaleDateString() : '-'}</span>
      );
    },
  },
  {
    accessorKey: 'expireTime',
    meta: { className: 'ps-4' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Expire Date' />,
    cell: ({ row }) => {
      const d = row.getValue('expireTime') as string | Date | undefined;
      const date = d ? (d instanceof Date ? d : new Date(String(d))) : null;
      return (
        <span>{date && !isNaN(date.getTime()) ? date.toLocaleDateString() : '-'}</span>
      );
    },
  },
  {
    accessorKey: 'returnTime',
    meta: { className: 'ps-4' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Return Date' />,
    cell: ({ row }) => {
      const d = row.getValue('returnTime') as string | Date | undefined;
      const date = d ? (d instanceof Date ? d : new Date(String(d))) : null;
      return (
        <span>{date && !isNaN(date.getTime()) ? date.toLocaleDateString() : '-'}</span>
      );
    },
  },
  {
    accessorKey: 'status',
    meta: { className: 'ps-4' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      let color: 'default' | 'destructive' | 'outline' = 'default';
      switch (status) {
        case BorrowStatus.Active:
          color = 'default';
          break;
        case BorrowStatus.Overdue:
          color = 'destructive';
          break;
        case BorrowStatus.Returned:
          color = 'outline';
          break;
        default:
          color = 'default';
      }
      return (
        <Badge variant={color} className='text-xs capitalize'>
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <BorrowsTableRowActions row={row} />,
  },
];