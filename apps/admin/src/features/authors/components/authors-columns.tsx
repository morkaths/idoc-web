import { type ColumnDef } from '@tanstack/react-table';
import type { Author } from '@/types';
import { Checkbox } from '@repo/ui/components/checkbox';
import { DataTableColumnHeader } from '@/components/data-table';
import Highlight from '@/components/highlight';
import { AuthorsTableRowActions } from './authors-table-row-actions';
import { AuthorAvatar } from './author-avatar';

export const authorsColumns: ColumnDef<Author>[] = [
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
        accessorKey: 'name',
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
        accessorKey: 'avatarUrl',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Avatar' />,
        enableSorting: false,
        cell: ({ row }) => {
            const avatarUrl = row.original.avatarUrl;
            const name = row.original.name;
            return <AuthorAvatar src={avatarUrl} name={name} />;
        },
    },
    {
        accessorKey: 'birthDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Birth Date' />,
        cell: ({ row }) => {
            const birthDate = row.original.birthDate;
            return birthDate ? (
                <span>{typeof birthDate === 'string' ? new Date(birthDate).toLocaleDateString() : birthDate.toLocaleDateString()}</span>
            ) : null;
        },
    },
    {
        accessorKey: 'nationality',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Nationality' />,
        cell: ({ row, table }) => {
            const nationality = row.original.nationality ?? '';
            const query = String(table.getState().globalFilter ?? '');
            return (
                <div className='max-w-32 truncate'>
                    <Highlight text={nationality} query={query} />
                </div>
            );
        },
    },
    // {
    //     accessorKey: 'bio',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title='Bio' />,
    //     enableSorting: false,
    //     cell: ({ row, table }) => {
    //         const bio = row.original.bio ?? '';
    //         const query = String(table.getState().globalFilter ?? '');
    //         return (
    //             <div className='max-w-70 truncate text-xs text-muted-foreground'>
    //                 <Highlight text={bio} query={query} />
    //             </div>
    //         );
    //     },
    // },
    {
        id: 'actions',
        cell: ({ row }) => <AuthorsTableRowActions row={row} />,
    },
];
