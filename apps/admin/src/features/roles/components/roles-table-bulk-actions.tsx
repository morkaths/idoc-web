import { useQueryClient } from '@tanstack/react-query';
import type { Table } from '@tanstack/react-table';
import type { Role } from '@/types';
import { useDeleteRole } from '@/hooks/data/useRole';
import DataTableBulkActions from '@/components/data-table/data-table-bulk-actions';

type Props = {
  table: Table<Role>;
};

export function RolesTableBulkActions({ table }: Props) {
  const qc = useQueryClient();
  const deleteMut = useDeleteRole();

  return (
    <DataTableBulkActions
      table={table}
      entityName='role'
      onBulkDelete={async (items) => {
        await Promise.all(items.map((it) => deleteMut.mutateAsync(it.id)));
        await qc.invalidateQueries({ queryKey: ['roles'] });
      }}
    />
  );
}

export default RolesTableBulkActions;