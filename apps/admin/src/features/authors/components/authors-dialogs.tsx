import { showSubmittedData } from '@/lib/show-submitted-data';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ImportDialog } from '@/components/import-dialog';
import { AuthorsMutateDialog } from './authors-mutate-dialog';
import { useAuthorsContext } from './authors-provider';
import { useCreateAuthor, useUpdateAuthor } from '@/hooks/data/useAuthor';

export function AuthorsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useAuthorsContext();
  const createAuthorMut = useCreateAuthor();
  const updateAuthorMut = useUpdateAuthor();

  return (
    <>
      <AuthorsMutateDialog
        key='author-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
        onSubmit={async (data) => {
          await createAuthorMut.mutateAsync(data);
          setOpen(null);
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
              await updateAuthorMut.mutateAsync({ id: currentRow._id!, data });
              setOpen(null);
              setTimeout(() => setCurrentRow(null), 500);
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
              setOpen(null);
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
              showSubmittedData(currentRow, 'The following author has been deleted:');
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
