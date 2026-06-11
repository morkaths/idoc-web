import { type ColumnDef } from '@tanstack/react-table';
import { BorrowStatus, type BorrowResponse } from '@/types';
import { Badge } from '@repo/ui/components/badge';
import { Checkbox } from '@repo/ui/components/checkbox';
import { DataTableColumnHeader } from '@/components/data-table';
import Highlight from '@/components/highlight';
import { BookCoverCell } from './book-cover-cell';
import { BorrowsTableRowActions } from './borrows-table-row-actions';

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
    accessorKey: 'book',
    enableSorting: false,
    meta: { className: 'ps-4' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Book' />,
    cell: ({ row, table }) => {
      const book = row.original.book;
      const title = book?.title ?? '-';
      const query = String(table.getState().globalFilter ?? '');
      const authors =
        book?.authors && book.authors.length > 0
          ? book.authors.map((a) => a.name).join(', ')
          : 'Unknown Author';
      return (
        <div className='flex max-w-48 items-center gap-2'>
          <BookCoverCell src={book?.coverUrl} title={title} />
          <div className='flex flex-col truncate'>
            <span className='truncate font-medium'>
              <Highlight text={title} query={query} />
            </span>
            <span className='text-muted-foreground truncate text-xs'>
              <Highlight text={authors} query={query} />
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'user',
    enableSorting: false,
    meta: { className: 'ps-4' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='User' />,
    cell: ({ row, table }) => {
      const user = row.original.user;
      const username = user?.username ?? '-';
      const email = user?.email ?? '-';
      const query = String(table.getState().globalFilter ?? '');
      return (
        <div className='flex max-w-48 flex-col'>
          <span className='truncate font-medium'>
            <Highlight text={username} query={query} />
          </span>
          <span className='text-muted-foreground truncate text-xs'>
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
    accessorKey: 'borrowedDate',
    meta: { className: 'ps-4' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Borrowed Date' />,
    cell: ({ row }) => {
      const d = row.getValue('borrowedDate') as string | Date | undefined;
      const date = d ? (d instanceof Date ? d : new Date(String(d))) : null;
      return <span>{date && !isNaN(date.getTime()) ? date.toLocaleDateString() : '-'}</span>;
    },
  },
  {
    accessorKey: 'dueDate',
    meta: { className: 'ps-4' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Due Date' />,
    cell: ({ row }) => {
      const d = row.getValue('dueDate') as string | Date | undefined;
      const date = d ? (d instanceof Date ? d : new Date(String(d))) : null;
      return <span>{date && !isNaN(date.getTime()) ? date.toLocaleDateString() : '-'}</span>;
    },
  },
  {
    accessorKey: 'returnDate',
    meta: { className: 'ps-4' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Return Date' />,
    cell: ({ row }) => {
      const d = row.getValue('returnDate') as string | Date | undefined;
      const date = d ? (d instanceof Date ? d : new Date(String(d))) : null;
      return <span>{date && !isNaN(date.getTime()) ? date.toLocaleDateString() : '-'}</span>;
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
        case BorrowStatus.BORROWED:
          color = 'default';
          break;
        case BorrowStatus.OVERDUE:
          color = 'destructive';
          break;
        case BorrowStatus.RETURNED:
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
