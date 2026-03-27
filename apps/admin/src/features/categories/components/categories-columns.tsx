import { type ColumnDef } from '@tanstack/react-table';
import type { CategoryResponse } from '@/types';
import { Checkbox } from '@repo/ui/components/checkbox';
import { DataTableColumnHeader } from '@/components/data-table';
import Highlight from '@/components/highlight';
import { CategoriesTableRowActions } from './categories-table-row-actions';

export const categoriesColumns: ColumnDef<CategoryResponse>[] = [
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
        accessorKey: 'slug',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Slug' />,
        cell: ({ row, table }) => {
            const slug = String(row.getValue('slug') ?? '');
            const query = String(table.getState().globalFilter ?? '');
            return (
                <div className='max-w-32 truncate font-medium'>
                    <Highlight text={slug} query={query} />
                </div>
            );
        },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
        enableSorting: false,
        cell: ({ row, table }) => {
            const translations = row.original.translations as { lang: string; name: string }[] | undefined;
            const translation = translations?.find(t => t.lang === 'en') ?? translations?.[0];
            const name = translation?.name ?? '';
            const query = String(table.getState().globalFilter ?? '');
            return (
                <div className='max-w-48 truncate'>
                    <Highlight text={name} query={query} />
                </div>
            );
        },
    },
    {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Description' />,
        enableSorting: false,
        cell: ({ row, table }) => {
            const translations = row.original.translations as { lang: string; description?: string }[] | undefined;
            const translation = translations?.find(t => t.lang === 'en') ?? translations?.[0];
            const description = translation?.description ?? '';
            const query = String(table.getState().globalFilter ?? '');
            return (
                <div className='max-w-70 truncate text-xs text-muted-foreground'>
                    <Highlight text={description} query={query} />
                </div>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <CategoriesTableRowActions row={row} />,
    },
];