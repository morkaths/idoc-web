import { useQueryClient } from '@tanstack/react-query';
import type { Table } from '@tanstack/react-table';
import type { Borrow } from '@/types';
import { useDeleteBorrow } from '@/hooks/data/useBorrow';
import DataTableBulkActions from '@/components/data-table/data-table-bulk-actions';

type Props = {
  table: Table<Borrow>;
};

export function BorrowsTableBulkActions({ table }: Props) {
  const qc = useQueryClient();
  const deleteMut = useDeleteBorrow();

  return (
    <DataTableBulkActions
      table={table}
      entityName='borrow'
      onBulkDelete={async (items) => {
        await Promise.all(items.map((it) => deleteMut.mutateAsync(it.id)));
        await qc.invalidateQueries({ queryKey: ['borrows'] });
      }}
    />
  );
}

export default BorrowsTableBulkActions;