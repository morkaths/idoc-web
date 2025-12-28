import { type ColumnDef } from '@tanstack/react-table';
import type { User } from '@/types';
import { Checkbox } from '@repo/ui/components/checkbox';
import { DataTableColumnHeader } from '@/components/data-table';
import Highlight from '@/components/highlight';
import { UsersTableRowActions } from './users-table-row-actions';
import { BriefcaseBusiness, ShieldCheck, User2, UserCog } from 'lucide-react';
import { Badge } from '@repo/ui/components/badge';

export const usersColumns: ColumnDef<User>[] = [
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
    accessorKey: 'username',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Username' />,
    cell: ({ row, table }) => {
      const username = String(row.getValue('username') ?? '');
      const query = String(table.getState().globalFilter ?? '');
      return (
        <div className='max-w-32 truncate font-medium'>
          <Highlight text={username} query={query} />
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    cell: ({ row, table }) => {
      const email = row.original.email ?? '';
      const query = String(table.getState().globalFilter ?? '');
      return (
        <div className='max-w-48 truncate'>
          <Highlight text={email} query={query} />
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const status = row.original.status;
      let label = 'Inactive';
      let className = 'bg-gray-100 text-gray-500 border border-gray-200';
      if (status === 1) {
        label = 'Active';
        className = 'bg-green-100 text-green-700 border border-green-200';
      } else if (status === -1) {
        label = 'Banned';
        className = 'bg-red-100 text-red-700 border border-red-200';
      }
      return (
        <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${className}`}>
          {label}
        </span>
      );
    },
  },
  {
    accessorKey: 'roles',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Role' />,
    cell: ({ row }) => {
      const roles = row.original.roles ?? [];
      const maxShow = 2;
      return (
        <div className='max-w-65 overflow-x-auto'>
          <div className='flex items-center gap-1 whitespace-nowrap'>
            {roles.slice(0, maxShow).map((role) => {
              let icon = <User2 className="w-3.5 h-3.5 mr-1" />;
              if (role.code === 'admin') icon = <ShieldCheck className="w-3.5 h-3.5 mr-1" />;
              else if (role.code === 'manager') icon = <BriefcaseBusiness className="w-3.5 h-3.5 mr-1" />;
              else if (role.code === 'staff') icon = <UserCog className="w-3.5 h-3.5 mr-1" />;
              return (
                <Badge key={role.id} variant='outline' className='text-xs flex items-center'>
                  {icon}
                  {role.name}
                </Badge>
              );
            })}
            {roles.length > maxShow && (
              <Badge variant='outline' className='text-xs'>
                +{roles.length - maxShow}
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <UsersTableRowActions row={row} />,
  },
];