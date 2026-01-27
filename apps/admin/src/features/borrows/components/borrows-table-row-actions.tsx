import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type Row } from '@tanstack/react-table';
import { type Borrow, BorrowSchema } from '@/types/schema';
import { Trash2 } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { useBorrowsContext } from './borrows-provider';

type BorrowsTableRowActionsProps<TData> = {
  row: Row<TData>;
};

export function BorrowsTableRowActions<TData>({ row }: BorrowsTableRowActionsProps<TData>) {
  const original = row.original as unknown as Borrow;
  const safeBorrow = {
    ...original,
    renewals: original.renewals ?? [],
    borrower: original.borrower
      ? {
        ...original.borrower,
        id: String(original.borrower.id ?? ''),
        status: typeof original.borrower.status === 'number'
          ? original.borrower.status
          : 1,
        password: typeof original.borrower.password === 'string'
          ? original.borrower.password
          : '',
        roles: Array.isArray(original.borrower.roles)
          ? original.borrower.roles.map(role => ({
            ...role,
            id: typeof role.id === 'string'
              ? role.id
              : String(role.id ?? ''),
          }))
          : [],
      }
      : undefined,
    item: original.item
      ? {
        ...original.item,
        id: String(original.item.id ?? ''),
      }
      : undefined,
  };
  const borrow = BorrowSchema.parse(safeBorrow);
  const ctx = useBorrowsContext();
  if (!ctx) throw new Error('BorrowsTableRowActions must be used inside BorrowsProvider');
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
            setCurrentRow(borrow);
            setOpen('update');
          }}
        >
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(borrow);
            setOpen('extend');
          }}
        >
          Extend
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(borrow);
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

export default BorrowsTableRowActions;