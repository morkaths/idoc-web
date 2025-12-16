import { useQueryClient } from '@tanstack/react-query';
import type { Table } from '@tanstack/react-table';
import type { Author } from '@/types';
import { useDeleteAuthor } from '@/hooks/data/useAuthor';
import DataTableBulkActions from '@/components/data-table-bulk-actions';

type Props = {
  table: Table<Author>;
};

export function AuthorsTableBulkActions({ table }: Props) {
  const qc = useQueryClient();
  const deleteMut = useDeleteAuthor();

  return (
    <DataTableBulkActions
      table={table}
      entityName='author'
      onBulkDelete={async (items) => {
        await Promise.all(items.map((it) => deleteMut.mutateAsync(it._id)));
        await qc.invalidateQueries({ queryKey: ['authors'] });
      }}
    />
  );
}

export default AuthorsTableBulkActions;
