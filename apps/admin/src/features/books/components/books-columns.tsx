import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import type { Book } from '@/types'
import { BooksTableRowActions } from './books-table-row-actions'
import Highlight from '@/components/highlight'

export const booksColumns: ColumnDef<Book>[] = [
  {
    id: 'select',
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
  },
  {
    accessorKey: 'isbn',
    header: ({ column }) => <DataTableColumnHeader column={column} title='ISBN' />,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row, table }) => {
      const isbn = String(row.getValue('isbn') ?? '')
      const query = String(table.getState().globalFilter ?? '')
      return (
        <div className='max-w-26 truncate sm:max-w-72 md:max-w-124'>
          <Highlight text={isbn} query={query} />
        </div>
      )
    },
  },
  {
    accessorKey: 'coverUrl',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Cover' />,
    enableSorting: false,
    enableHiding: true,
    cell: ({ row }) => {
      const src = (row.getValue('coverUrl') ?? row.original.coverUrl) as string | undefined
      const title = String(row.getValue('title') ?? '')
      return src ? (
        <img
          src={src}
          alt={title}
          className='w-12 h-16 object-cover rounded'
          style={{ borderRadius: 'var(--radius-img)' }}
          loading='lazy'
        />
      ) : (
        <div className='w-12 h-16 bg-muted/20 rounded-md flex items-center justify-center text-xs text-muted-foreground'>
          No image
        </div>
      )
    },
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Title' />,
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    cell: ({ row, table }) => {
      const title = row.getValue('title') as string
      const query = String(table.getState().globalFilter ?? '')
      const authors = Array.isArray(row.original.authors) ? row.original.authors : []
      const authorsText = authors.length ? authors.map(a => a.name).join(', ') : ''
      return (
        <div className='flex flex-col'>
          <span className='truncate font-medium max-w-32 sm:max-w-72 md:max-w-124'>
            <Highlight text={title} query={query} />
          </span>
          <small className='text-muted-foreground truncate max-w-32 sm:max-w-72 md:max-w-124'>
            <Highlight text={authorsText} query={query} />
          </small>
        </div>
      )
    },
  },
  {
    accessorKey: 'publishedDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Published' />,
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    cell: ({ row }) => {
      const d = row.getValue('publishedDate') as string | Date | undefined
      if (!d) return null
      const date = d instanceof Date ? d : new Date(String(d))
      return <div>{isNaN(date.getTime()) ? '' : date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Price' />,
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    enableHiding: true,
    cell: ({ row }) => {
      const p = row.getValue('price') as number | undefined
      return <div>{p == null ? '-' : `${p.toLocaleString()} $`}</div>
    },
  },
  // {
  //   accessorKey: 'tags',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='Tags' />,
  //   meta: { className: 'ps-1', tdClassName: 'ps-4' },
  //   cell: ({ row }) => {
  //     const tags = row.getValue('tags') as string[] | undefined
  //     if (!Array.isArray(tags) || tags.length === 0) return null
  //     return (
  //       <div className="max-w-[260px] overflow-x-auto">
  //         <div className='flex gap-1 items-center whitespace-nowrap'>
  //           {tags.slice(0, 2).map((t) => (
  //             <Badge key={t} variant='outline' className='text-xs'>
  //               {t}
  //             </Badge>
  //           ))}
  //           {tags.length > 2 && (
  //             <Badge variant='outline' className='text-xs'>
  //               +{tags.length - 2}
  //             </Badge>
  //           )}
  //         </div>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     const tags = row.getValue(id) as string[] | undefined
  //     if (!Array.isArray(tags)) return false
  //     return value.some((v: string) => tags.map(t => t.toLowerCase()).includes(String(v).toLowerCase()))
  //   },
  // },
  {
    accessorKey: 'language',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Language' />,
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    enableHiding: true,
    cell: ({ row }) => {
      const lang = row.getValue('language') as string
      return (
        <div className='flex items-center justify-center'>
          <span className={`fi fi-${String(lang).toLowerCase()}`} aria-hidden />
        </div>
      )
    },
  },
  {
    accessorKey: 'categories',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Categories' />,
    meta: { className: 'ps-1' },
    enableSorting: false,
    cell: ({ row }) => {
      const cats = row.getValue('categories') as { slug?: string }[] | undefined
      if (!Array.isArray(cats) || cats.length === 0) return null
      return (
        <div className="max-w-[260px] overflow-x-auto">
          <div className='flex gap-1 items-center whitespace-nowrap'>
            {cats.slice(0, 2).map((c, i) => (
              <Badge key={i} variant='outline' className='text-xs'>
                {c?.slug ?? '-'}
              </Badge>
            ))}
            {cats.length > 2 && (
              <Badge variant='outline' className='text-xs'>
                +{cats.length - 2}
              </Badge>
            )}
          </div>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <BooksTableRowActions row={row} />,
  },
]