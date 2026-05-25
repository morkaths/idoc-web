import { useQueryClient } from '@tanstack/react-query';
import type { LoanResponse } from '@/types';
import type { Table } from '@tanstack/react-table';
import { FileSpreadsheet, Undo2 } from 'lucide-react';
import { useReturnBorrow } from '@/hooks/data/useBorrow';
import { useLocale } from '@/hooks/ui/useLocale';
import { DataTableBulkActions } from '@/components/data-table/data-table-bulk-actions';

type Props = {
  table: Table<LoanResponse>;
};

export function BorrowsTableBulkActions({ table }: Props) {
  const { t, keys } = useLocale('library');
  const qc = useQueryClient();
  const returnMut = useReturnBorrow();

  return (
    <DataTableBulkActions
      table={table}
      entityName={t(keys.table.entity)}
      actions={[
        {
          key: 'return',
          icon: <Undo2 />,
          label: t(keys.table.bulkActions.return.label),
          onClick: async (items) => {
            await Promise.all(items.map((it) => returnMut.mutateAsync({ id: it.id, data: undefined })));
            await qc.invalidateQueries({ queryKey: ['borrows'] });
          },
          variant: 'outline',
          tooltip: t(keys.table.bulkActions.return.tooltip),
          confirm: true,
          confirmWord: 'RETURN',
          confirmDesc: t(keys.table.bulkActions.return.confirmDesc),
        },
        {
          key: 'export',
          icon: <FileSpreadsheet />,
          label: t(keys.table.bulkActions.export.label),
          onClick: async () => {},
          variant: 'default',
          tooltip: t(keys.table.bulkActions.export.tooltip),
          confirm: true,
          confirmWord: 'EXPORT',
          confirmDesc: t(keys.table.bulkActions.export.confirmDesc),
        },
      ]}
    />
  );
}

export default BorrowsTableBulkActions;
