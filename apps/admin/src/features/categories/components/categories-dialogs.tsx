import { showSubmittedData } from '@/lib/show-submitted-data';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { ImportDialog } from '@/components/import-dialog';
import { CategoriesMutateDialog } from './categories-mutate-dialog';
import { useCategoriesContext } from './categories-provider';
import { useCreateCategory, useDeleteCategory, useUpdateCategory } from '@/hooks/data/useCategory';
import { toast } from 'sonner';

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
          toast.promise(
            createCategoryMut.mutateAsync(data),
            {
              loading: 'Creating category...',
              success: () => {
                setOpen(null);
                return 'Category created successfully!';
              },
              error: (err) => err?.message || 'Failed to create category',
            }
          );
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
              toast.promise(
                updateCategoryMut.mutateAsync({ id: currentRow._id!, data }),
                {
                  loading: 'Updating category...',
                  success: () => {
                    setOpen(null);
                    setTimeout(() => setCurrentRow(null), 500);
                    return 'Category updated successfully!';
                  },
                  error: (err) => err?.message || 'Failed to update category',
                }
              );
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
              toast.promise(
                deleteCategoryMut.mutateAsync(currentRow._id!),
                {
                  loading: 'Deleting category...',
                  success: () => {
                    setOpen(null);
                    setTimeout(() => setCurrentRow(null), 500);
                    showSubmittedData(currentRow, 'The following category has been deleted:');
                    return 'Category deleted successfully!';
                  },
                  error: (err) => err?.message || 'Failed to delete category',
                }
              );
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