import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type Row } from '@tanstack/react-table';
import { Author } from '@/types';
import { Trash2 } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { useAuthorsContext } from './authors-provider';

type AuthorsTableRowActionsProps<TData> = {
  row: Row<TData>;
};

export function AuthorsTableRowActions<TData>({ row }: AuthorsTableRowActionsProps<TData>) {
  const author = row.original as Author;
  const ctx = useAuthorsContext();
  if (!ctx) throw new Error('AuthorsTableRowActions must be used inside AuthorsProvider');
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
            setCurrentRow(author);
            setOpen('update');
          }}
        >
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(author);
            setOpen('import');
          }}
        >
          Make a copy
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(author);
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

export default AuthorsTableRowActions;
