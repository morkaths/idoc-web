import { CategoriesDialogs } from './components/categories-dialogs';
import { CategoriesPrimaryButtons } from './components/categories-primary-buttons';
import { CategoriesProvider } from './components/categories-provider';
import { CategoriesTable } from './components/categories-table';

export function Categories() {
  return (
    <CategoriesProvider>
      <div className='flex flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-4 sm:gap-6'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Categories</h2>
            <p className='text-muted-foreground'>Manage your categories</p>
          </div>
          <CategoriesPrimaryButtons />
        </div>
        <CategoriesTable />
      </div>
      <CategoriesDialogs />
    </CategoriesProvider>
  );
}
