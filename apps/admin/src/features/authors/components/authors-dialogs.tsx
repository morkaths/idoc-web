import { ConfirmDialog } from '@/components/confirm-dialog';
import { ImportDialog } from '@/components/import-dialog';
import { AuthorsMutateDialog } from './authors-mutate-dialog';
import { useAuthorsContext } from './authors-provider';
import { useCreateAuthor, useDeleteAuthor, useUpdateAuthor } from '@/hooks/data/useAuthor';
import { toast } from 'sonner';

export function AuthorsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useAuthorsContext();
  const createAuthorMut = useCreateAuthor();
  const updateAuthorMut = useUpdateAuthor();
  const deleteAuthorMut = useDeleteAuthor();

  return (
    <>
      <AuthorsMutateDialog
        key='author-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
        onSubmit={async (data) => {
          toast.promise(
            createAuthorMut.mutateAsync(data),
            {
              loading: 'Creating author...',
              success: () => {
                setOpen(null);
                return 'Author created successfully!';
              },
              error: (err) => err?.message || 'Failed to create author',
            }
          );
        }}
      />

      <ImportDialog
        key='authors-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <AuthorsMutateDialog
            key={`author-update-${currentRow._id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            initialData={currentRow}
            onSubmit={async (data) => {
              toast.promise(
                updateAuthorMut.mutateAsync({ id: currentRow._id!, data }),
                {
                  loading: 'Updating author...',
                  success: () => {
                    setOpen(null);
                    setTimeout(() => setCurrentRow(null), 500);
                    return 'Author updated successfully!';
                  },
                  error: (err) => err?.message || 'Failed to update author',
                }
              );
            }}
          />

          <ConfirmDialog
            key='author-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            handleConfirm={() => {
              toast.promise(
                deleteAuthorMut.mutateAsync(currentRow._id!),
                {
                  loading: 'Deleting author...',
                  success: () => {
                    setOpen(null);
                    setTimeout(() => setCurrentRow(null), 500);
                    return 'Author deleted successfully!';
                  },
                  error: (err) => err?.message || 'Failed to delete author',
                }
              );
            }}
            className='max-w-md'
            title={`Delete this author: ${currentRow.name || currentRow._id} ?`}
            desc={
              <>
                You are about to delete an author with the ID <strong>{currentRow._id}</strong>.<br />
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
