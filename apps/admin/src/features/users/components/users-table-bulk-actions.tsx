import { useQueryClient } from '@tanstack/react-query';
import type { Table } from '@tanstack/react-table';
import type { User } from '@/types';
import { useDeleteUser } from '@/hooks/data/useUser';
import DataTableBulkActions from '@/components/data-table/data-table-bulk-actions';

type Props = {
  table: Table<User>;
};

export function UsersTableBulkActions({ table }: Props) {
  const qc = useQueryClient();
  const deleteMut = useDeleteUser();

  return (
    <DataTableBulkActions
      table={table}
      entityName='user'
      onBulkDelete={async (items) => {
        await Promise.all(items.map((it) => deleteMut.mutateAsync(it.id)));
        await qc.invalidateQueries({ queryKey: ['users'] });
      }}
    />
  );
}

export default UsersTableBulkActions;
