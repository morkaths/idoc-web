import { showSubmittedData } from '@/lib/show-submitted-data';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ImportDialog } from '@/components/import-dialog';
import { CategoriesMutateDialog } from './categories-mutate-dialog';
import { useCategoriesContext } from './categories-provider';
import { useCreateCategory, useUpdateCategory } from '@/hooks/data/useCategory';

export function CategoriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCategoriesContext();
  const createCategoryMut = useCreateCategory();
  const updateCategoryMut = useUpdateCategory();

  return (
    <>
      <CategoriesMutateDialog
        key='category-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
        onSubmit={async (data) => {
          await createCategoryMut.mutateAsync(data);
          setOpen(null);
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
            key={`category-update-${currentRow._id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            initialData={currentRow}
            onSubmit={async (data) => {
              await updateCategoryMut.mutateAsync({ id: currentRow._id!, data });
              setOpen(null);
              setTimeout(() => setCurrentRow(null), 500);
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
              setOpen(null);
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
              showSubmittedData(currentRow, 'The following category has been deleted:');
            }}
            className='max-w-md'
            title={`Delete this category: ${currentRow.translations?.[0]?.name || currentRow._id} ?`}
            desc={
              <>
                You are about to delete a category with the ID <strong>{currentRow._id}</strong>.<br />
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