import { useFiles, useStorageUsage } from '@/hooks/data/useFile';
import { StorageDashboardStats } from './components/storage-dashboard-stats';
import { StorageDialogs } from './components/storage-dialogs';
import { StoragePrimaryButtons } from './components/storage-primary-buttons';
import { StorageProvider } from './components/storage-provider';
import { StorageTable } from './components/storage-table';

export function Storage() {
  // Fetch file list for local analysis (category breakdown, folder stats, upload activity)
  const { data: allFilesData, isLoading: isStatsLoading } = useFiles({ limit: 100 });
  const allFiles = allFilesData?.data ?? [];

  // Fetch real-time usage from S3 + Cloudinary via /storage/usage
  const { data: usageData, isLoading: isUsageLoading } = useStorageUsage();

  return (
    <StorageProvider>
      <div className='flex flex-col gap-5 sm:gap-6'>
        {/* Header Block */}
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Storage Dashboard</h2>
            <p className='text-muted-foreground'>
              Monitor application storage space, view format distributions and manage uploaded
              library assets.
            </p>
          </div>
          <StoragePrimaryButtons />
        </div>

        {/* Dashboard Statistics */}
        <StorageDashboardStats
          allFiles={allFiles}
          isLoading={isStatsLoading}
          usageData={usageData ?? undefined}
          isUsageLoading={isUsageLoading}
        />

        {/* File Manager Table */}
        <div className='space-y-4 border-t pt-4'>
          <div>
            <h3 className='text-lg font-semibold tracking-tight'>Media &amp; Library Assets</h3>
            <p className='text-muted-foreground text-sm'>
              Browse, search, download and delete individual assets.
            </p>
          </div>
          <StorageTable />
        </div>
      </div>
      <StorageDialogs />
    </StorageProvider>
  );
}

export default Storage;
export { StorageProvider } from './components/storage-provider';
