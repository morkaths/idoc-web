import { toast } from 'sonner';
import { showSubmittedData } from '@/lib/show-submitted-data';
import { getErrorMessage } from '@/lib/handle-server-error';
import { useCreateBook, useDeleteBook, useUpdateBook } from '@/hooks/data/useBook';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ImportDialog } from '@/components/import-dialog';
import { BooksMutateDialog } from './books-mutate-dialog';
import { useBooksContext } from './books-provider';

export function BooksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useBooksContext();
  const createBookMut = useCreateBook();
  const updateBookMut = useUpdateBook();
  const deleteBookMut = useDeleteBook();

  return (
    <>
      <BooksMutateDialog
        key='book-create'
        open={open === 'create'}
        onOpenChange={(val) => setOpen(val ? 'create' : null)}
        onSubmit={async (data) => {
          const promise = createBookMut.mutateAsync(data);
          toast.promise(promise, {
            loading: 'Creating book...',
            success: (res) => res.message,
            error: (err) => getErrorMessage(err, 'Failed to create book'),
          });
          await promise;
        }}
      />

      <ImportDialog
        key='books-import'
        open={open === 'import'}
        onOpenChange={(val) => setOpen(val ? 'import' : null)}
      />

      {currentRow && (
        <>
          <BooksMutateDialog
            key={`book-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={(val) => {
              setOpen(val ? 'update' : null);
              if (!val) setTimeout(() => setCurrentRow(null), 500);
            }}
            initialData={currentRow}
            onSubmit={async (data) => {
              const promise = updateBookMut.mutateAsync({ id: currentRow.id!, data });
              toast.promise(promise, {
                loading: 'Updating book...',
                success: (res) => res.message,
                error: (err) => getErrorMessage(err, 'Failed to update book'),
              });
              await promise;
            }}
          />

          <ConfirmDialog
            key='book-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={(val) => {
              setOpen(val ? 'delete' : null);
              if (!val) setTimeout(() => setCurrentRow(null), 500);
            }}
            handleConfirm={async () => {
              const promise = deleteBookMut.mutateAsync(currentRow.id!);
              toast.promise(promise, {
                loading: 'Deleting book...',
                success: (res) => {
                  showSubmittedData(currentRow, 'The following book has been deleted:');
                  return res.message;
                },
                error: (err) => getErrorMessage(err, 'Failed to delete book'),
              });
              await promise;
              setOpen(null);
              setTimeout(() => setCurrentRow(null), 500);
            }}
            className='max-w-md'
            title={`Delete this book: ${currentRow.title || currentRow.id} ?`}
            desc={
              <>
                You are about to delete a book with the ID <strong>{currentRow.id}</strong>.<br />
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
