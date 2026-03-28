import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import type { BorrowResponse } from '@/types';
import { Checkbox } from '@repo/ui/components/checkbox';
import { DataTableColumnHeader } from '@/components/data-table';
import Highlight from '@/components/highlight';
import { Badge } from '@repo/ui/components/badge';
import { BorrowsTableRowActions } from './borrows-table-row-actions';
import { ImageOff } from 'lucide-react';

const CoverCell = ({ src, title }: { src?: string; title: string }) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className='bg-muted/20 text-muted-foreground flex h-15 w-10 items-center justify-center rounded-md border'>
        <ImageOff className="h-4 w-4 opacity-50" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className='h-15 w-10 rounded object-cover border'
      style={{ borderRadius: 'var(--radius-img)' }}
      loading='lazy'
      onError={() => setError(true)}
    />
  );
};

export const borrowsColumns = (t: any, keys: any): ColumnDef<BorrowResponse>[] => [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title={t(keys.table.columns.cover)} />,
    meta: { title: t(keys.table.columns.cover) },
    cell: ({ row }) => {
      const item = row.original.item;
      const src = item?.coverUrl;
      const title = item?.title ?? '-';
      return <CoverCell src={src} title={title} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'item',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t(keys.table.columns.item)} />,
    meta: { title: t(keys.table.columns.item) },
    cell: ({ row, table }) => {
      const item = row.original.item;
      const title = item?.title ?? '-';
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
      <div className='text-center w-full'>
        <DataTableColumnHeader column={column} title={t(keys.table.columns.renewals)} />
      </div>
    ),
    meta: { title: t(keys.table.columns.renewals) },
    cell: ({ row }) => {
      const count = row.original.renewals?.length ?? 0;
      return <span className='block text-center w-full'>{count}</span>;
    },
  },
  {
    accessorKey: 'borrowTime',
    header: ({ column }) => (
      <div className="text-center w-full">
        <DataTableColumnHeader column={column} title={t(keys.table.columns.borrowTime)} />
      </div>
    ),
    meta: { title: t(keys.table.columns.borrowTime) },
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
        <DataTableColumnHeader column={column} title={t(keys.table.columns.expireTime)} />
      </div>
    ),
    meta: { title: t(keys.table.columns.expireTime) },
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
        <DataTableColumnHeader column={column} title={t(keys.table.columns.returnTime)} />
      </div>
    ),
    meta: { title: t(keys.table.columns.returnTime) },
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
        <DataTableColumnHeader column={column} title={t(keys.table.columns.status)} />
      </div>
    ),
    meta: { title: t(keys.table.columns.status) },
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      let color: 'default' | 'destructive' | 'outline' = 'default';
      let label = status;

      switch (status) {
        case 'active':
          color = 'default';
          label = t(keys.table.states.active);
          break;
        case 'overdue':
          color = 'destructive';
          label = t(keys.table.states.overdue);
          break;
        case 'returned':
          color = 'outline';
          label = t(keys.table.states.returned);
          break;
        default:
          color = 'default';
          label = status;
      }
      return (
        <div className="flex justify-center">
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