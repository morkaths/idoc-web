import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type Row } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { useRolesContext } from './roles-provider';
import { type Role } from '@/types';

type RolesTableRowActionsProps<TData> = {
    row: Row<TData>;
};

export function RolesTableRowActions<TData>({ row }: RolesTableRowActionsProps<TData>) {
    const role = row.original as Role;
    const ctx = useRolesContext();
    if (!ctx) throw new Error('RolesTableRowActions must be used inside RolesProvider');
    const { setOpen, setCurrentRow } = ctx;

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='data-[state=open]:bg-muted flex h-8 w-8 p-0'>
                    <DotsHorizontalIcon className='h-4 w-4' />
                    <span className='sr-only'>Open menu</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-40'>
                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(role);
                        setOpen('update');
                    }}
                >
                    Edit
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(role);
                        setOpen('delete');
                    }}
                >
                    Delete
                    <span className='ml-auto'>
                        <Trash2 size={16} />
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default RolesTableRowActions;