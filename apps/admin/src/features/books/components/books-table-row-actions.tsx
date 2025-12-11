import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '@repo/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { BookSchema } from '@/types/schema'
import { useBooksContext } from './books-provider'

type BooksTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function BooksTableRowActions<TData>({ row }: BooksTableRowActionsProps<TData>) {
  const book = BookSchema.parse(row.original)
  const ctx = useBooksContext()
  if (!ctx) throw new Error('BooksTableRowActions must be used inside BooksProvider')
  const { setOpen, setCurrentRow } = ctx

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='data-[state=open]:bg-muted flex h-8 w-8 p-0'>
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-40'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(book)
            setOpen('update')
          }}
        >
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(book)
            setOpen('import')
          }}
        >
          Make a copy
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(book)
            setOpen('delete')
          }}
        >
          Delete
          <span className='ml-auto'>
            <Trash2 size={16} />
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default BooksTableRowActions