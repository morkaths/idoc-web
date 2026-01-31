import { useQueryClient } from '@tanstack/react-query';
import type { Table } from '@tanstack/react-table';
import type { Borrow } from '@/types';
import { useReturnBorrow } from '@/hooks/data/useBorrow';
import DataTableBulkActions from '@/components/data-table/data-table-bulk-actions';
import { FileSpreadsheet, Undo2 } from 'lucide-react';

type Props = {
  table: Table<Borrow>;
};

export function BorrowsTableBulkActions({ table }: Props) {
  const qc = useQueryClient();
  const returnMut = useReturnBorrow();

  return (
    <DataTableBulkActions
      table={table}
      entityName="borrow"
      actions={[
        {
          key: "return",
          icon: <Undo2 />,
          label: "Return",
          onClick: async (items) => {
            await Promise.all(items.map((it) => returnMut.mutateAsync(it.id)));
            await qc.invalidateQueries({ queryKey: ['borrows'] });
          },
          variant: "outline",
          tooltip: "Return selected borrows",
          confirm: true,
          confirmWord: "RETURN",
          confirmDesc: "Are you sure you want to return the selected borrows?",
        },
        {
          key: "export",
          icon: <FileSpreadsheet />,
          label: "Export",
          onClick: async () => {},
          variant: "default",
          tooltip: "Export selected borrows",
          confirm: true,
          confirmWord: "EXPORT",
          confirmDesc: "Are you sure you want to export the selected borrows?",
        },
      ]}
    />
  );
}

export default BorrowsTableBulkActions;