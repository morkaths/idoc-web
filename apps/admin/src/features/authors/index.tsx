import { AuthorsDialogs } from './components/authors-dialogs';
import { AuthorsPrimaryButtons } from './components/authors-primary-buttons';
import { AuthorsProvider } from './components/authors-provider';
import { AuthorsTable } from './components/authors-table';

export function Authors() {
  return (
    <AuthorsProvider>
      <div className='flex flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-4 sm:gap-6'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Authors</h2>
            <p className='text-muted-foreground'>Manage your authors</p>
          </div>
          <AuthorsPrimaryButtons />
        </div>
        <AuthorsTable />
      </div>
      <AuthorsDialogs />
    </AuthorsProvider>
  );
}
