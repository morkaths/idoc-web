import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type Row } from '@tanstack/react-table';
import type { CategoryResponse } from '@/types';
import { Trash2 } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { useCategoriesContext } from './categories-provider';

type CategoriesTableRowActionsProps<TData> = {
  row: Row<TData>;
};

export function CategoriesTableRowActions<TData>({ row }: CategoriesTableRowActionsProps<TData>) {
  const category = row.original as CategoryResponse;
  const ctx = useCategoriesContext();
  if (!ctx) throw new Error('CategoriesTableRowActions must be used inside CategoriesProvider');
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
            setCurrentRow(category);
            setOpen('update');
          }}
        >
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(category);
            setOpen('import');
          }}
        >
          Make a copy
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(category);
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

export default CategoriesTableRowActions;