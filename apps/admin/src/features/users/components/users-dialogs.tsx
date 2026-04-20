import { UsersMutateDialog } from './users-mutate-dialog';
import { UsersInviteDialog } from './users-invite-dialog';
import { useUsersContext } from './users-provider';
import { useRoles } from '@/hooks/data/useRole';
import { useCreateUser, useDeleteUser, useUpdateUser } from '@/hooks/data/useUser';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from 'sonner';

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsersContext();
  const { data } = useRoles();
  const roles = data?.data ?? [];
  const createUserMut = useCreateUser();
  const updateUserMut = useUpdateUser();
  const deleteUserMut = useDeleteUser();
  return (
    <>
      <UsersMutateDialog
        key='user-add'
        open={open === 'add'}
        onOpenChange={(open) => setOpen(open ? 'add' : null)}
        roles={roles}
        onSubmit={(data) => {
          return toast.promise(
            createUserMut.mutateAsync(data),
            {
              loading: 'Creating user...',
              success: () => {
                setOpen(null);
                return 'User created successfully!';
              },
              error: (err) => err?.message || 'Failed to create user',
            }
          );
        }}
      />

      <UsersInviteDialog
        key='user-invite'
        open={open === 'invite'}
        onOpenChange={() => setOpen('invite')}
        roles={roles}
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
            roles={roles}
            onSubmit={(data) => {
              return toast.promise(
                updateUserMut.mutateAsync({ id: currentRow.id!, data }),
                {
                  loading: 'Updating user...',
                  success: () => {
                    setOpen(null);
                    setTimeout(() => setCurrentRow(null), 500);
                    return 'User updated successfully!';
                  },
                  error: (err) => err?.message || 'Failed to update user',
                }
              );
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
              toast.promise(
                deleteUserMut.mutateAsync(currentRow.id),
                {
                  loading: 'Deleting user...',
                  success: () => {
                    setOpen(null);
                    setTimeout(() => setCurrentRow(null), 500);
                    // showSubmittedData(currentRow, 'The following user has been deleted:');
                    return 'User deleted successfully!';
                  },
                  error: (err) => err?.message || 'Failed to delete user',
                }
              );
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
