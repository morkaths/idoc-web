import { toast } from 'sonner';
import { showSubmittedData } from '@/lib/show-submitted-data';
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
        onOpenChange={() => setOpen('create')}
        onSubmit={(data) => {
          return toast.promise(createBookMut.mutateAsync(data), {
            loading: 'Creating book...',
            success: () => {
              setOpen(null);
              return 'Book created successfully!';
            },
            error: (err) => err?.message || 'Failed to create book',
          });
        }}
      />

      <ImportDialog
        key='books-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <BooksMutateDialog
            key={`book-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            initialData={currentRow}
            onSubmit={(data) => {
              return toast.promise(updateBookMut.mutateAsync({ id: currentRow.id!, data }), {
                loading: 'Updating book...',
                success: () => {
                  setOpen(null);
                  setTimeout(() => setCurrentRow(null), 500);
                  return 'Book updated successfully!';
                },
                error: (err) => err?.message || 'Failed to update book',
              });
            }}
          />

          <ConfirmDialog
            key='book-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            handleConfirm={async () => {
              toast.promise(deleteBookMut.mutateAsync(currentRow.id!), {
                loading: 'Deleting book...',
                success: () => {
                  setOpen(null);
                  setTimeout(() => setCurrentRow(null), 500);
                  showSubmittedData(currentRow, 'The following book has been deleted:');
                  return 'Book deleted successfully!';
                },
                error: (err) => err?.message || 'Failed to delete book',
              });
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
