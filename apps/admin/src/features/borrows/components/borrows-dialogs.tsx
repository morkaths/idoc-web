import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/handle-server-error';
import { showSubmittedData } from '@/lib/show-submitted-data';
import {
  useCreateBorrow,
  useUpdateBorrow,
  useDeleteBorrow,
  useExtendBorrow,
} from '@/hooks/data/useBorrow';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { BorrowsExtendDialog } from './borrows-extend-dialog';
import { BorrowsMutateDialog } from './borrows-mutate-dialog';
import { useBorrowsContext } from './borrows-provider';

export function BorrowsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useBorrowsContext();
  const createBorrowMut = useCreateBorrow();
  const updateBorrowMut = useUpdateBorrow();
  const extendBorrowMut = useExtendBorrow();
  const deleteBorrowMut = useDeleteBorrow();

  return (
    <>
      <BorrowsMutateDialog
        key='borrow-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
        onSubmit={(data) => {
          return toast.promise(createBorrowMut.mutateAsync(data), {
            loading: 'Creating borrow...',
            success: (res) => {
              setOpen(null);
              return res.message;
            },
            error: (err) => getErrorMessage(err, 'Failed to create borrow'),
          });
        }}
      />

      {currentRow && (
        <>
          <BorrowsExtendDialog
            key='borrows-extend'
            open={open === 'extend'}
            borrowedDate={currentRow.borrowedDate}
            dueDate={currentRow.dueDate}
            notes={currentRow.notes}
            onOpenChange={() => setOpen('extend')}
            onSubmit={(data) => {
              return toast.promise(extendBorrowMut.mutateAsync({ id: currentRow!.id!, ...data }), {
                loading: 'Extending borrow...',
                success: (res) => {
                  setOpen(null);
                  setCurrentRow(null);
                  return res.message;
                },
                error: (err) => getErrorMessage(err, 'Failed to extend borrow'),
              });
            }}
          />

          <BorrowsMutateDialog
            key={`borrow-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            initialData={currentRow}
            onSubmit={(data) => {
              return toast.promise(updateBorrowMut.mutateAsync({ id: currentRow.id!, data }), {
                loading: 'Updating borrow...',
                success: (res) => {
                  setOpen(null);
                  setTimeout(() => setCurrentRow(null), 500);
                  return res.message;
                },
                error: (err) => getErrorMessage(err, 'Failed to update borrow'),
              });
            }}
          />

          <ConfirmDialog
            key='borrow-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            handleConfirm={async () => {
              toast.promise(deleteBorrowMut.mutateAsync(currentRow.id!), {
                loading: 'Deleting borrow...',
                success: (res) => {
                  setOpen(null);
                  setTimeout(() => setCurrentRow(null), 500);
                  showSubmittedData(currentRow, 'The following borrow has been deleted:');
                  return res.message;
                },
                error: (err) => getErrorMessage(err, 'Failed to delete borrow'),
              });
            }}
            className='max-w-md'
            title={`Delete this borrow: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a borrow with the ID <strong>{currentRow.id}</strong>.<br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  );
}
