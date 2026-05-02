import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/handle-server-error';
import { useCreateUser, useDeleteUser, useUpdateUser } from '@/hooks/data/useUser';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { UsersInviteDialog } from './users-invite-dialog';
import { UsersMutateDialog } from './users-mutate-dialog';
import { useUsersContext } from './users-provider';

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsersContext();
  const createUserMut = useCreateUser();
  const updateUserMut = useUpdateUser();
  const deleteUserMut = useDeleteUser();
  return (
    <>
      <UsersMutateDialog
        key='user-add'
        open={open === 'add'}
        onOpenChange={(open) => setOpen(open ? 'add' : null)}
        onSubmit={(data) => {
          return toast.promise(createUserMut.mutateAsync(data), {
            loading: 'Creating user...',
            success: (res) => {
              setOpen(null);
              return res.message;
            },
            error: (err) => getErrorMessage(err, 'Failed to create user'),
          });
        }}
      />

      <UsersInviteDialog
        key='user-invite'
        open={open === 'invite'}
        onOpenChange={() => setOpen('invite')}
        onSubmit={async () => {
          setOpen(null);
        }}
      />

      {currentRow && (
        <>
          <UsersMutateDialog
            key={`user-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={(open) => setOpen(open ? 'edit' : null)}
            initialData={currentRow}
            onSubmit={(data, id) => {
              return toast.promise(updateUserMut.mutateAsync({ id: id!, data }), {
                loading: 'Updating user...',
                success: (res) => {
                  setOpen(null);
                  setTimeout(() => setCurrentRow(null), 500);
                  return res.message;
                },
                error: (err) => getErrorMessage(err, 'Failed to update user'),
              });
            }}
          />

          <ConfirmDialog
            key='user-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            handleConfirm={async () => {
              toast.promise(deleteUserMut.mutateAsync(currentRow.id), {
                loading: 'Deleting user...',
                success: (res) => {
                  setOpen(null);
                  setTimeout(() => setCurrentRow(null), 500);
                  // showSubmittedData(currentRow, 'The following user has been deleted:');
                  return res.message;
                },
                error: (err) => getErrorMessage(err, 'Failed to delete user'),
              });
            }}
            className='max-w-md'
            title={`Delete this user: ${currentRow.username || currentRow.email} ?`}
            desc={
              <>
                You are about to delete a user with the ID <strong>{currentRow.id}</strong>.<br />
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
