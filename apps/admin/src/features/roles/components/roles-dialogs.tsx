import { RolesMutateDialog } from './roles-mutate-dialog';
import { useRolesContext } from './roles-provider';
import { usePermissions } from '@/hooks/data/usePermission';
import { useCreateRole, useUpdateRole, useDeleteRole } from '@/hooks/data/useRole';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from 'sonner';

export function RolesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRolesContext();
  const { data } = usePermissions();
  const permissions = data?.data ?? [];
  const createRoleMut = useCreateRole();
  const updateRoleMut = useUpdateRole();
  const deleteRoleMut = useDeleteRole();

  return (
    <>
      <RolesMutateDialog
        key='role-create'
        open={open === 'create'}
        onOpenChange={(open) => setOpen(open ? 'create' : null)}
        permissions={permissions}
        onSubmit={(data) => {
          return toast.promise(
            createRoleMut.mutateAsync(data),
            {
              loading: 'Creating role...',
              success: () => {
                setOpen(null);
                return 'Role created successfully!';
              },
              error: (err) => err?.message || 'Failed to create role',
            }
          );
        }}
      />

      {currentRow && (
        <>
          <RolesMutateDialog
            key={`role-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={(open) => setOpen(open ? 'update' : null)}
            initialData={currentRow}
            permissions={permissions}
            onSubmit={(data) => {
              return toast.promise(
                updateRoleMut.mutateAsync({ id: currentRow.id!, data }),
                {
                  loading: 'Updating role...',
                  success: () => {
                    setOpen(null);
                    setTimeout(() => setCurrentRow(null), 500);
                    return 'Role updated successfully!';
                  },
                  error: (err) => err?.message || 'Failed to update role',
                }
              );
            }}
          />

          <ConfirmDialog
            key='role-delete'
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
                deleteRoleMut.mutateAsync(currentRow.id),
                {
                  loading: 'Deleting role...',
                  success: () => {
                    setOpen(null);
                    setTimeout(() => setCurrentRow(null), 500);
                    return 'Role deleted successfully!';
                  },
                  error: (err) => err?.message || 'Failed to delete role',
                }
              );
            }}
            className='max-w-md'
            title={`Delete this role: ${currentRow.name || currentRow.code} ?`}
            desc={
              <>
                You are about to delete a role with the ID <strong>{currentRow.id}</strong>.<br />
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