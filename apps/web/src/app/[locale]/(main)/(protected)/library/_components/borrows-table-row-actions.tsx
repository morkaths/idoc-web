import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type Row } from '@tanstack/react-table';
import { type Borrow } from '@/types';
import { Clock, Eye, Undo2, History, Star } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { useBorrowsContext } from './borrows-provider';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/hooks/ui/useLocale';

type BorrowsTableRowActionsProps<TData> = {
  row: Row<TData>;
};

export function BorrowsTableRowActions<TData>({ row }: BorrowsTableRowActionsProps<TData>) {
  const { t, keys } = useLocale('library');
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
  const borrow = safeBorrow as Borrow;
  const ctx = useBorrowsContext();
  if (!ctx) throw new Error('BorrowsTableRowActions must be used inside BorrowsProvider');
  const { setOpen, setCurrentRow } = ctx;
  const router = useRouter();


  return (
    <>
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
              if (borrow.item?.id) {
                router.push(`/books/${borrow.item.id}/view`);
              }
            }}
          >
            {t(keys.table.actions.view.label)}
            <span className="ml-auto"><Eye /></span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(borrow);
              setOpen('review');
            }}
          >
            {t(keys.table.actions.review.label)}
            <span className="ml-auto"><Star size={16} /></span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(borrow);
              setOpen('history');
            }}
          >
            {t(keys.table.actions.history.label)}
            <span className="ml-auto"><History size={16} /></span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(borrow);
              setOpen('extend');
            }}
          >
            {t(keys.table.actions.extend.label)}
            <span className='ml-auto'>
              <Clock size={16} />
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => {
              setCurrentRow(borrow);
              setOpen('return');
            }}
          >
            {t(keys.table.actions.return.label)}
            <span className='ml-auto'>
              <Undo2 size={16} />
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default BorrowsTableRowActions;