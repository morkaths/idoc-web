import { RolesDialogs } from './components/roles-dialogs';
import { RolesPrimaryButtons } from './components/roles-primary-buttons';
import { RolesProvider } from './components/roles-provider';
import { RolesTable } from './components/roles-table';

export function Roles() {
  return (
    <RolesProvider>
      <div className='flex flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Role List</h2>
            <p className='text-muted-foreground'>Manage your roles and their permissions here.</p>
          </div>
          <RolesPrimaryButtons />
        </div>
        <RolesTable />
      </div>
      <RolesDialogs />
    </RolesProvider>
  );
}