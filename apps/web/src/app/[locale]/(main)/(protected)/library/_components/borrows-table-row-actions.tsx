import { useRouter } from 'next/navigation';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type LoanResponse } from '@/types';
import { type Row } from '@tanstack/react-table';
import { Clock, Eye, Undo2, History, Star } from 'lucide-react';
import { useLocale } from '@/hooks/ui/useLocale';
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
  const { t, KEYS } = useLocale('library');
  const borrow = row.original as unknown as LoanResponse;

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
              if (borrow.book?.id) {
                router.push(`/books/${borrow.book.id}/view`);
              }
            }}
          >
            {t(KEYS.common.actions.view)}
            <span className='ml-auto'>
              <Eye />
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(borrow);
              setOpen('review');
            }}
          >
            {t(KEYS.common.actions.review)}
            <span className='ml-auto'>
              <Star size={16} />
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(borrow);
              setOpen('history');
            }}
          >
            {t(KEYS.common.actions.history)}
            <span className='ml-auto'>
              <History size={16} />
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(borrow);
              setOpen('extend');
            }}
          >
            {t(KEYS.common.actions.extend)}
            <span className='ml-auto'>
              <Clock size={16} />
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className='text-destructive focus:text-destructive'
            onClick={() => {
              setCurrentRow(borrow);
              setOpen('return');
            }}
          >
            {t(KEYS.common.actions.return)}
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
