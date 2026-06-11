import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/handle-server-error';
import { showSubmittedData } from '@/lib/show-submitted-data';
import { useCreateCategory, useDeleteCategory, useUpdateCategory } from '@/hooks/data/useCategory';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ImportDialog } from '@/components/import-dialog';
import { CategoriesMutateDialog } from './categories-mutate-dialog';
import { useCategoriesContext } from './categories-provider';

export function CategoriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCategoriesContext();
  const createCategoryMut = useCreateCategory();
  const updateCategoryMut = useUpdateCategory();
  const deleteCategoryMut = useDeleteCategory();

  return (
    <>
      <CategoriesMutateDialog
        key='category-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
        onSubmit={async (data) => {
          const promise = createCategoryMut.mutateAsync(data);
          toast.promise(promise, {
            loading: 'Creating category...',
            success: (res) => {
              setOpen(null);
              return res.message;
            },
            error: (err) => getErrorMessage(err, 'Failed to create category'),
          });
          await promise;
        }}
      />

      <ImportDialog
        key='categories-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <CategoriesMutateDialog
            key={`category-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            initialData={currentRow}
            onSubmit={async (data) => {
              const promise = updateCategoryMut.mutateAsync({ id: currentRow.id!, data });
              toast.promise(promise, {
                loading: 'Updating category...',
                success: (res) => {
                  setOpen(null);
                  setTimeout(() => setCurrentRow(null), 500);
                  return res.message;
                },
                error: (err) => getErrorMessage(err, 'Failed to update category'),
              });
              await promise;
            }}
          />

          <ConfirmDialog
            key='category-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            handleConfirm={() => {
              toast.promise(deleteCategoryMut.mutateAsync(currentRow.id!), {
                loading: 'Deleting category...',
                success: (res) => {
                  setOpen(null);
                  setTimeout(() => setCurrentRow(null), 500);
                  showSubmittedData(currentRow, 'The following category has been deleted:');
                  return res.message;
                },
                error: (err) => getErrorMessage(err, 'Failed to delete category'),
              });
            }}
            className='max-w-md'
            title={`Delete this category: ${currentRow.translations?.[0]?.name || currentRow.id} ?`}
            desc={
              <>
                You are about to delete a category with the ID <strong>{currentRow.id}</strong>.
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
