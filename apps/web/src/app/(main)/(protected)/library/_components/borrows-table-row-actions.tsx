import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type Row } from '@tanstack/react-table';
import { type Borrow, BorrowSchema } from '@/types/schema';
import { Clock, Eye, Undo2 } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { useBorrowsContext } from './borrows-provider';
import { useState } from 'react';
import { useBook } from '@/hooks/data/useBook';
import { useFile } from '@/hooks/data/useFile';
import { FilePreviewDialog } from '@/components/file-preview-dialog';

type BorrowsTableRowActionsProps<TData> = {
  row: Row<TData>;
};

export function BorrowsTableRowActions<TData>({ row }: BorrowsTableRowActionsProps<TData>) {
  const original = row.original as unknown as Borrow;
  const safeBorrow = {
    ...original,
    count: typeof original.count === 'number' ? original.count : 1,
    borrower: original.borrower
      ? {
        ...original.borrower,
        id: String(original.borrower.id ?? ''),
        status: typeof original.borrower.status === 'number'
          ? original.borrower.status
          : 1,
        password: typeof original.borrower.password === 'string'
          ? original.borrower.password
          : '', // chuyển null/undefined thành chuỗi rỗng
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
        _id: String(original.item._id ?? ''),
      }
      : undefined,
  };
  const borrow = BorrowSchema.parse(safeBorrow);
  const ctx = useBorrowsContext();
  if (!ctx) throw new Error('BorrowsTableRowActions must be used inside BorrowsProvider');
  const { setOpen, setCurrentRow } = ctx;
  const [openPreview, setOpenPreview] = useState(false);
  const { data: book } = useBook(borrow.item?._id || "");
  const { data: file } = useFile(book?.fileKey || "");


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
              setOpenPreview(true);
            }}
          >
            View file
            <span className="ml-auto"><Eye /></span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(borrow);
              setOpen('extend');
            }}
          >
            Extend
            <span className='ml-auto'>
              <Clock size={16} />
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(borrow);
              setOpen('return');
            }}
          >
            Return
            <span className='ml-auto'>
              <Undo2 size={16} />
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <FilePreviewDialog
        open={openPreview}
        onOpenChange={setOpenPreview}
        fileUrl={file?.url || ""}
        fileName={file?.filename || book?.title || "Xem tài liệu"}
        mode="simple"
      />
    </>
  );
}

export default BorrowsTableRowActions;