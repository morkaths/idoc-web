import { BorrowsDialogs } from './components/borrows-dialogs';
import { BorrowsPrimaryButtons } from './components/borrows-primary-buttons';
import { BorrowsProvider } from './components/borrows-provider';
import { BorrowsTable } from './components/borrows-table';

export function Borrows() {
  return (
    <BorrowsProvider>
      <div className='flex flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-4 sm:gap-6'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Borrows</h2>
            <p className='text-muted-foreground'>Manage your borrows</p>
          </div>
          <BorrowsPrimaryButtons />
        </div>
        <BorrowsTable />
      </div>
      <BorrowsDialogs />
    </BorrowsProvider>
  );
}