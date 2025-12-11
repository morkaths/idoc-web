// ...existing code...
import { BooksPrimaryButtons } from './components/books-primary-buttons'
import { BooksProvider } from './components/books-provider'
import { BooksTable } from './components/books-table'

export function Books() {
  return (
    <BooksProvider>
      <div className='flex flex-col gap-4 sm:gap-6'>
        {/* ===== Top Heading ===== */}
        <div className='flex flex-wrap items-end justify-between gap-4 sm:gap-6'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Books</h2>
            <p className='text-muted-foreground'>Manage your books</p>
          </div>
          <BooksPrimaryButtons />
        </div>

        {/* ===== Content ===== */}
        <BooksTable />
      </div>
    </BooksProvider>
  )
}
