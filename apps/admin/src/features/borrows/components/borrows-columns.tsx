import { type ColumnDef } from '@tanstack/react-table';
import type { Borrow } from '@/types';
import { Checkbox } from '@repo/ui/components/checkbox';
import { DataTableColumnHeader } from '@/components/data-table';
import Highlight from '@/components/highlight';
import { Badge } from '@repo/ui/components/badge';
import { BorrowsTableRowActions } from './borrows-table-row-actions';

export const borrowsColumns: ColumnDef<Borrow>[] = [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title='Item' />,
    cell: ({ row, table }) => {
      const item = row.original.item;
      const title = item?.title ?? '-';
      const query = String(table.getState().globalFilter ?? '');
      const authors = item?.authors && item.authors.length > 0
        ? item.authors.map((a) => a.name).join(', ')
        : 'Unknown Author';
      return (
        <div className='flex items-center gap-2 max-w-48'>
          <img
            src={item?.coverUrl || '/images/book-cover-placeholder.png'}
            alt={title}
            className='h-10 w-7 rounded object-cover border'
          />
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
    header: ({ column }) => <DataTableColumnHeader column={column} title='Borrower' />,
    cell: ({ row, table }) => {
      const borrower = row.original.borrower;
      const username = borrower?.username ?? '-';
      const email = borrower?.email ?? '-';
      const query = String(table.getState().globalFilter ?? '');
      return (
        <div className='flex flex-col max-w-32 truncate'>
          <span className='font-medium'>
            <Highlight text={username} query={query} />
          </span>
          <span className='text-xs text-muted-foreground'>
            <Highlight text={email} query={query} />
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'renewals',
    enableSorting: false,
    header: ({ column }) => (
      <div className='text-center w-full'>
        <DataTableColumnHeader column={column} title='Renewals' />
      </div>
    ),
    cell: ({ row }) => {
      const count = row.original.renewals?.length ?? 0;
      return <span className='block text-center w-full'>{count}</span>;
    },
  },
  {
    accessorKey: 'borrowTime',
    header: ({ column }) => (
      <div className="text-center w-full">
        <DataTableColumnHeader column={column} title='Borrow Date' />
      </div>
    ),
    cell: ({ row }) => {
      const d = row.getValue('borrowTime') as string | Date | undefined;
      const date = d ? (d instanceof Date ? d : new Date(String(d))) : null;
      return (
        <span className="block text-center w-full">
          {date && !isNaN(date.getTime()) ? date.toLocaleDateString() : '-'}
        </span>
      );
    },
  },
  {
    accessorKey: 'expireTime',
    header: ({ column }) => (
      <div className="text-center w-full">
        <DataTableColumnHeader column={column} title='Expire Date' />
      </div>
    ),
    cell: ({ row }) => {
      const d = row.getValue('expireTime') as string | Date | undefined;
      const date = d ? (d instanceof Date ? d : new Date(String(d))) : null;
      return (
        <span className="block text-center w-full">
          {date && !isNaN(date.getTime()) ? date.toLocaleDateString() : '-'}
        </span>
      );
    },
  },
  {
    accessorKey: 'returnTime',
    header: ({ column }) => (
      <div className="text-center w-full">
        <DataTableColumnHeader column={column} title='Return Date' />
      </div>
    ),
    cell: ({ row }) => {
      const d = row.getValue('returnTime') as string | Date | undefined;
      const date = d ? (d instanceof Date ? d : new Date(String(d))) : null;
      return (
        <span className="block text-center w-full">
          {date && !isNaN(date.getTime()) ? date.toLocaleDateString() : '-'}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <div className="text-center w-full">
        <DataTableColumnHeader column={column} title='Status' />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      let color: 'default' | 'destructive' | 'outline' = 'default';
      switch (status) {
        case 'active':
          color = 'default';
          break;
        case 'overdue':
          color = 'destructive';
          break;
        case 'returned':
          color = 'outline';
          break;
        default:
          color = 'default';
      }
      return (
        <div className="flex justify-center">
          <Badge variant={color} className='text-xs capitalize'>
            {status}
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