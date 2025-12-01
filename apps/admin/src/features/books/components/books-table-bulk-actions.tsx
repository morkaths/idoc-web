import type { Table } from '@tanstack/react-table'
import DataTableBulkActions from '@/components/data-table-bulk-actions'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteBook } from '@/hooks/data/useBook'
import type { Book } from '@/types'

type Props = {
  table: Table<Book>
}

export function BooksTableBulkActions({ table }: Props) {
  const qc = useQueryClient()
  const deleteMut = useDeleteBook()

  return (
    <DataTableBulkActions
      table={table}
      entityName='book'
      onBulkDelete={async (items) => {
        await Promise.all(items.map((it) => deleteMut.mutateAsync((it as any)._id)))
        await qc.invalidateQueries({ queryKey: ['books'] })
      }}
    />
  )
}

export default BooksTableBulkActions