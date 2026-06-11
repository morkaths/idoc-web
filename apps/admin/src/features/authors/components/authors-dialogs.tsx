import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/handle-server-error';
import { useCreateAuthor, useDeleteAuthor, useUpdateAuthor } from '@/hooks/data/useAuthor';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ImportDialog } from '@/components/import-dialog';
import { AuthorsMutateDialog } from './authors-mutate-dialog';
import { useAuthorsContext } from './authors-provider';

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
        onOpenChange={(val) => setOpen(val ? 'create' : null)}
        onSubmit={async (data) => {
          const promise = createAuthorMut.mutateAsync(data);
          toast.promise(promise, {
            loading: 'Creating author...',
            success: (res) => res.message,
            error: (err) => getErrorMessage(err, 'Failed to create author'),
          });
          await promise;
        }}
      />

      <ImportDialog
        key='authors-import'
        open={open === 'import'}
        onOpenChange={(val) => setOpen(val ? 'import' : null)}
      />

      {currentRow && (
        <>
          <AuthorsMutateDialog
            key={`author-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={(val) => {
              setOpen(val ? 'update' : null);
              if (!val) setTimeout(() => setCurrentRow(null), 500);
            }}
            initialData={currentRow}
            onSubmit={async (data) => {
              const promise = updateAuthorMut.mutateAsync({ id: currentRow.id!, data });
              toast.promise(promise, {
                loading: 'Updating author...',
                success: (res) => res.message,
                error: (err) => getErrorMessage(err, 'Failed to update author'),
              });
              await promise;
            }}
          />

          <ConfirmDialog
            key='author-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={(val) => {
              setOpen(val ? 'delete' : null);
              if (!val) setTimeout(() => setCurrentRow(null), 500);
            }}
            handleConfirm={async () => {
              const promise = deleteAuthorMut.mutateAsync(currentRow.id!);
              toast.promise(promise, {
                loading: 'Deleting author...',
                success: (res) => res.message,
                error: (err) => getErrorMessage(err, 'Failed to delete author'),
              });
              await promise;
              setOpen(null);
              setTimeout(() => setCurrentRow(null), 500);
            }}
            className='max-w-md'
            title={`Delete this author: ${currentRow.name || currentRow.id} ?`}
            desc={
              <>
                You are about to delete an author with the ID <strong>{currentRow.id}</strong>.
                <br />
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
