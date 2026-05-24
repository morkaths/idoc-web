import { useQueryClient } from '@tanstack/react-query';
import type { Table } from '@tanstack/react-table';
import type { FileResponse } from '@/types';
import { useDeleteFile } from '@/hooks/data/useFile';
import DataTableBulkActions from '@/components/data-table/data-table-bulk-actions';

type Props = {
  table: Table<FileResponse>;
};

export function StorageTableBulkActions({ table }: Props) {
  const qc = useQueryClient();
  const deleteMut = useDeleteFile();

  return (
    <DataTableBulkActions
      table={table}
      entityName='file'
      onBulkDelete={async (items) => {
        await Promise.all(items.map((it) => deleteMut.mutateAsync(it.id)));
        await qc.invalidateQueries({ queryKey: ['files'] });
      }}
    />
  );
}

export default StorageTableBulkActions;
