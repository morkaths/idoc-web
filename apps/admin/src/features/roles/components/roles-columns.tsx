import { type ColumnDef } from '@tanstack/react-table';
import type { RoleResponse } from '@/types';
import { Checkbox } from '@repo/ui/components/checkbox';
import { DataTableColumnHeader } from '@/components/data-table';
import Highlight from '@/components/highlight';
import { RolesTableRowActions } from './roles-table-row-actions';

export const rolesColumns: ColumnDef<RoleResponse>[] = [
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
    accessorKey: 'code',
    meta: { className: 'ps-4' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Code' />,
    cell: ({ row, table }) => {
      const code = String(row.getValue('code') ?? '');
      const query = String(table.getState().globalFilter ?? '');
      return (
        <div className='max-w-32 truncate font-medium'>
          <Highlight text={code} query={query} />
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    enableSorting: false,
    meta: { className: 'ps-4' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({ row, table }) => {
      const name = row.original.name ?? '';
      const query = String(table.getState().globalFilter ?? '');
      return (
        <div className='max-w-48 truncate'>
          <Highlight text={name} query={query} />
        </div>
      );
    },
  },
  {
    accessorKey: 'permissions',
    enableSorting: false,
    meta: { className: 'ps-4' },
    header: ({ column }) => <DataTableColumnHeader column={column} title='Permissions' />,
    cell: ({ row }) => {
      const permissions = row.original.permissions ?? [];
      return (
        <div className='flex flex-wrap gap-1 max-w-100'>
          {permissions.length === 0
            ? <span className='text-xs text-muted-foreground'>No permissions</span>
            : permissions.slice(0, 3).map((p) => (
              <span key={p.id} className='px-2 py-0.5 rounded bg-muted text-xs'>{p.name}</span>
            ))}
          {permissions.length > 3 && (
            <span className='text-xs text-muted-foreground'>+{permissions.length - 3} more</span>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <RolesTableRowActions row={row} />,
  },
];