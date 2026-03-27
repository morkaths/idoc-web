import { useQueryClient } from '@tanstack/react-query';
import type { Table } from '@tanstack/react-table';
import type { BookResponse } from '@/types';
import { useDeleteBook } from '@/hooks/data/useBook';
import DataTableBulkActions from '@/components/data-table/data-table-bulk-actions';

type Props = {
  table: Table<BookResponse>;
};

export function BooksTableBulkActions({ table }: Props) {
  const qc = useQueryClient();
  const deleteMut = useDeleteBook();

  return (
    <DataTableBulkActions
      table={table}
      entityName='book'
      onBulkDelete={async (items) => {
        await Promise.all(items.map((it) => deleteMut.mutateAsync(it.id)));
        await qc.invalidateQueries({ queryKey: ['books'] });
      }}
    />
  );
}

export default BooksTableBulkActions;
