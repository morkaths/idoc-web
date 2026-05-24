import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/handle-server-error';
import { useDeleteFile } from '@/hooks/data/useFile';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { StorageMutateDialog } from './storage-mutate-dialog';
import { useStorageContext } from './storage-provider';

export function StorageDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useStorageContext();
  const deleteFileMut = useDeleteFile();

  const handleClose = (dialog: 'upload' | 'delete') => {
    setOpen(null);
    if (dialog === 'delete') {
      setTimeout(() => {
        setCurrentRow(null);
      }, 500);
    }
  };

  return (
    <>
      <StorageMutateDialog
        open={open === 'upload'}
        onOpenChange={(val) => !val && handleClose('upload')}
      />

      {currentRow && (
        <ConfirmDialog
          key='storage-file-delete'
          destructive
          open={open === 'delete'}
          onOpenChange={(val) => !val && handleClose('delete')}
          handleConfirm={() => {
            const promise = deleteFileMut.mutateAsync(currentRow.id);
            toast.promise(promise, {
              loading: 'Deleting file...',
              success: (res) => {
                handleClose('delete');
                return res.message || 'File deleted successfully!';
              },
              error: (err) => getErrorMessage(err, 'Failed to delete file'),
            });
          }}
          className='max-w-md'
          title={`Delete file: ${currentRow.fileName}?`}
          desc={
            <>
              You are about to delete file <strong>{currentRow.fileName}</strong> with ID <strong>{currentRow.id}</strong>.
              <br />
              This action cannot be undone.
            </>
          }
          confirmText='Delete'
        />
      )}
    </>
  );
}

export default StorageDialogs;
