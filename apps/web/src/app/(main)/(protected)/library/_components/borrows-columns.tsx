import { type ColumnDef } from '@tanstack/react-table';
import type { Borrow } from '@/types';
import { Checkbox } from '@repo/ui/components/checkbox';
import { DataTableColumnHeader } from '@/components/data-table';
import Highlight from '@/components/highlight';
import { Badge } from '@repo/ui/components/badge';
import { BorrowsTableRowActions } from './borrows-table-row-actions';
import Image from 'next/image';

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
    id: 'cover',
    header: () => <span>Cover</span>,
    cell: ({ row }) => {
      const coverUrl = row.original.item?.coverUrl;
      return (
        <Image
          src={coverUrl || "/images/book-cover-placeholder.png"}
          alt="Book cover"
          width={48}
          height={64}
          className="w-12 h-16 object-cover rounded"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'item',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Item' />,
    cell: ({ row, table }) => {
      const item = row.original.item;
      const title = item?.title ?? '-';
      const query = String(table.getState().globalFilter ?? '');
      return (
        <div className='max-w-32 truncate'>
          <Highlight text={title} query={query} />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'renewals',
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