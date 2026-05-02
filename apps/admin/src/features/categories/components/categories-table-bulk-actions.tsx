import { useQueryClient } from '@tanstack/react-query';
import type { Table } from '@tanstack/react-table';
import type { CategoryResponse } from '@/types';
import { useDeleteCategory } from '@/hooks/data/useCategory';
import DataTableBulkActions from '@/components/data-table/data-table-bulk-actions';

type Props = {
  table: Table<CategoryResponse>;
};

export function CategoriesTableBulkActions({ table }: Props) {
  const qc = useQueryClient();
  const deleteMut = useDeleteCategory();

  return (
    <DataTableBulkActions
      table={table}
      entityName='category'
      onBulkDelete={async (items) => {
        await Promise.all(items.map((it) => deleteMut.mutateAsync(it.id)));
        await qc.invalidateQueries({ queryKey: ['categories'] });
      }}
    />
  );
}

export default CategoriesTableBulkActions;
