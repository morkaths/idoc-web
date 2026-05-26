import { useMemo } from 'react';
import { format, subDays, isSameDay } from 'date-fns';
import type { CloudinaryUsageResponse, FileResponse, StorageUsageResponse } from '@/types';
import {
  FolderOpen,
  PieChart,
  HardDrive,
  TrendingUp,
  Cloud,
  Zap,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@repo/ui/components/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { DEFAULT_CLOUDINARY_LIMITS, FILE_CATEGORIES_CONFIG } from '../data/data';
import type { CloudinaryRawResponse } from '../data/schema';
import { formatBytes } from './storage-columns';

type StorageDashboardStatsProps = {
  allFiles: FileResponse[];
  isLoading: boolean;
  /** Real-time usage data from /storage/usage API */
  usageData?: StorageUsageResponse;
  isUsageLoading?: boolean;
};

export function StorageDashboardStats({
  allFiles,
  isLoading,
  usageData,
  isUsageLoading,
}: StorageDashboardStatsProps) {
  const fileStats = useMemo(() => {
    if (!allFiles || allFiles.length === 0) {
      return {
        totalSize: 0,
        totalCount: 0,
        averageSize: 0,
        largestFile: null,
        categories: {
          documents: { size: 0, count: 0, percentage: 0 },
          images: { size: 0, count: 0, percentage: 0 },
          sheets: { size: 0, count: 0, percentage: 0 },
          media: { size: 0, count: 0, percentage: 0 },
          others: { size: 0, count: 0, percentage: 0 },
        },
        folders: {} as Record<string, { size: 0; count: 0; percentage: 0 }>,
        last7Days: [] as Array<{ dateStr: string; label: string; count: number }>,
      };
    }

    const totalSize = allFiles.reduce((acc, f) => acc + (f.size || 0), 0);
    const totalCount = allFiles.length;
    const averageSize = totalCount > 0 ? totalSize / totalCount : 0;

    let largestFile = allFiles[0];

    const categories = {
      documents: { size: 0, count: 0, percentage: 0 },
      images: { size: 0, count: 0, percentage: 0 },
      sheets: { size: 0, count: 0, percentage: 0 },
      media: { size: 0, count: 0, percentage: 0 },
      others: { size: 0, count: 0, percentage: 0 },
    };

    const folders: Record<string, { size: number; count: number; percentage: number }> = {};

    allFiles.forEach((file) => {
      if (file.size > largestFile.size) largestFile = file;

      const mime = file.contentType.toLowerCase();
      if (mime === 'application/pdf' || mime.includes('epub') || mime.startsWith('text/')) {
        categories.documents.size += file.size;
        categories.documents.count += 1;
      } else if (mime.startsWith('image/')) {
        categories.images.size += file.size;
        categories.images.count += 1;
      } else if (mime.includes('sheet') || mime.includes('excel') || mime.includes('csv')) {
        categories.sheets.size += file.size;
        categories.sheets.count += 1;
      } else if (mime.startsWith('video/') || mime.startsWith('audio/')) {
        categories.media.size += file.size;
        categories.media.count += 1;
      } else {
        categories.others.size += file.size;
        categories.others.count += 1;
      }

      const folderPath = file.objectKey.split('/');
      const folderName = folderPath.length > 1 ? folderPath[0] : 'general';
      if (!folders[folderName]) {
        folders[folderName] = { size: 0, count: 0, percentage: 0 };
      }
      folders[folderName].size += file.size;
      folders[folderName].count += 1;
    });

    Object.keys(categories).forEach((key) => {
      const cat = categories[key as keyof typeof categories];
      cat.percentage = totalSize > 0 ? (cat.size / totalSize) * 100 : 0;
    });

    Object.keys(folders).forEach((key) => {
      const folder = folders[key];
      folder.percentage = totalSize > 0 ? (folder.size / totalSize) * 100 : 0;
    });

    const last7Days = Array.from({ length: 7 }).map((_, index) => {
      const date = subDays(new Date(), 6 - index);
      const dateStr = format(date, 'yyyy-MM-dd');
      const label = format(date, 'EEE');
      const count = allFiles.filter((f) => isSameDay(new Date(f.createdAt), date)).length;
      return { dateStr, label, count };
    });

    return { totalSize, totalCount, averageSize, largestFile, categories, folders, last7Days };
  }, [allFiles]);

  if (isLoading || isUsageLoading) {
    return (
      <div className='grid animate-pulse gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='bg-muted h-[180px] rounded-xl' />
        ))}
      </div>
    );
  }

  const getProgressColorClass = (percentage: number) => {
    if (percentage > 80) return 'bg-rose-500';
    if (percentage > 50) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  // S3 data
  const s3 = usageData?.s3;
  const isS3Connected = s3?.connected ?? false;

  const cld = usageData?.cloudinary as CloudinaryUsageResponse & {
    storage?: number;
    bandwidth?: number;
    totalResources?: number;
    credits?: number;
    plan?: string;
    rawUsage?: CloudinaryRawResponse;
  };
  const isCldConnected = cld?.connected ?? false;

  // Storage
  const cldStorageUsed = cld?.storageUsage ?? cld?.storage ?? cld?.rawUsage?.storage?.usage ?? 0;
  const cldStorageLimit =
    cld?.storageLimit && cld.storageLimit > 0
      ? cld.storageLimit
      : cld?.rawUsage?.storage?.limit && cld.rawUsage.storage.limit > 0
        ? cld.rawUsage.storage.limit
        : DEFAULT_CLOUDINARY_LIMITS.STORAGE;
  const cldStoragePct =
    cld?.storageLimit && cld.storageLimit > 0 && cld?.storageUsedPercent !== undefined
      ? cld.storageUsedPercent
      : cldStorageLimit > 0
        ? Math.min((cldStorageUsed / cldStorageLimit) * 100, 100)
        : 0;

  // Bandwidth
  const cldBandwidthUsed =
    cld?.bandwidthUsage ?? cld?.bandwidth ?? cld?.rawUsage?.bandwidth?.usage ?? 0;
  const cldBandwidthLimit =
    cld?.bandwidthLimit && cld.bandwidthLimit > 0
      ? cld.bandwidthLimit
      : cld?.rawUsage?.bandwidth?.limit && cld.rawUsage.bandwidth.limit > 0
        ? cld.rawUsage.bandwidth.limit
        : DEFAULT_CLOUDINARY_LIMITS.BANDWIDTH;
  const cldBandwidthPct =
    cld?.bandwidthLimit && cld.bandwidthLimit > 0 && cld?.bandwidthUsedPercent !== undefined
      ? cld.bandwidthUsedPercent
      : cldBandwidthLimit > 0
        ? Math.min((cldBandwidthUsed / cldBandwidthLimit) * 100, 100)
        : 0;

  // Transformations
  const cldTransformUsed = cld?.transformationsUsage ?? cld?.rawUsage?.transformations?.usage ?? 0;
  const cldTransformLimit =
    cld?.transformationsLimit && cld.transformationsLimit > 0
      ? cld.transformationsLimit
      : cld?.rawUsage?.transformations?.limit && cld.rawUsage.transformations.limit > 0
        ? cld.rawUsage.transformations.limit
        : DEFAULT_CLOUDINARY_LIMITS.TRANSFORMATIONS;
  const cldTransformPct =
    cld?.transformationsLimit &&
    cld.transformationsLimit > 0 &&
    cld?.transformationsUsedPercent !== undefined
      ? cld.transformationsUsedPercent
      : cldTransformLimit > 0
        ? Math.min((cldTransformUsed / cldTransformLimit) * 100, 100)
        : 0;

  // Requests
  const cldRequestsUsed = cld?.requestsUsage ?? cld?.rawUsage?.requests ?? 0;
  const cldRequestsLimit =
    cld?.requestsLimit && cld.requestsLimit > 0
      ? cld.requestsLimit
      : DEFAULT_CLOUDINARY_LIMITS.REQUESTS;
  const cldRequestsPct =
    cld?.requestsLimit && cld.requestsLimit > 0 && cld?.requestsUsedPercent !== undefined
      ? cld.requestsUsedPercent
      : cldRequestsLimit > 0
        ? Math.min((cldRequestsUsed / cldRequestsLimit) * 100, 100)
        : 0;

  // Credits
  const cldCreditsUsed = cld?.creditsUsage ?? cld?.rawUsage?.credits?.usage ?? 0;
  const cldCreditsLimit =
    cld?.creditsLimit && cld.creditsLimit > 0
      ? cld.creditsLimit
      : cld?.rawUsage?.credits?.limit && cld.rawUsage.credits.limit > 0
        ? cld.rawUsage.credits.limit
        : DEFAULT_CLOUDINARY_LIMITS.CREDITS;
  const cldCreditsPct =
    cld?.creditsLimit && cld.creditsLimit > 0 && cld?.creditsUsedPercent !== undefined
      ? cld.creditsUsedPercent
      : cld?.rawUsage?.credits?.used_percent !== undefined
        ? cld.rawUsage.credits.used_percent * 100
        : cldCreditsLimit > 0
          ? Math.min((cldCreditsUsed / cldCreditsLimit) * 100, 100)
          : 0;

  // Other details
  const cldPlan = cld?.plan ?? cld?.rawUsage?.plan ?? 'Unknown';
  const cldTotalResources = cld?.totalResources ?? cld?.rawUsage?.resources ?? 0;
  const cldDerived = cld?.derivedResources ?? cld?.rawUsage?.derived_resources ?? 0;
  const cldMaxImg =
    cld?.maxImageSizeBytes ??
    cld?.rawUsage?.media_limits?.image_max_size_bytes ??
    DEFAULT_CLOUDINARY_LIMITS.IMAGE_MAX_SIZE;
  const cldMaxVid =
    cld?.maxVideoSizeBytes ??
    cld?.rawUsage?.media_limits?.video_max_size_bytes ??
    DEFAULT_CLOUDINARY_LIMITS.VIDEO_MAX_SIZE;
  const cldLastUpdated =
    cld?.lastUpdated ?? cld?.rawUsage?.last_updated ?? new Date().toISOString();

  return (
    <div className='space-y-6'>
      {/* Row 1 – Cloud provider cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {/* Card 1: S3 Overview */}
        <Card className='border-border/60 group hover:border-primary relative overflow-hidden border shadow-sm transition-colors duration-150'>
          <div className='absolute top-0 right-0 p-3 opacity-10'>
            <HardDrive size={56} />
          </div>
          <CardHeader className='pb-2'>
            <div className='flex min-w-0 flex-col gap-1'>
              <CardTitle className='text-muted-foreground text-sm font-medium'>
                S3 Storage
              </CardTitle>
              {s3 && (
                <Badge
                  variant='outline'
                  className={cn(
                    'h-4 w-fit px-1 text-[10px] font-semibold',
                    isS3Connected
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300'
                  )}
                >
                  {isS3Connected ? 'Connected' : 'Offline'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className='space-y-3'>
            {s3 ? (
              <>
                <div>
                  <span className='text-2xl font-bold tracking-tight'>
                    {formatBytes(s3.totalSize)}
                  </span>
                  <span className='text-muted-foreground ml-1 text-xs'>total used</span>
                </div>
                <div className='grid grid-cols-2 gap-x-2 gap-y-2.5 border-t pt-2.5 text-[11px]'>
                  <div>
                    <span className='text-muted-foreground block text-[10px] tracking-wider uppercase'>
                      Files
                    </span>
                    <span className='font-semibold'>
                      {(s3.totalFiles ?? 0).toLocaleString()} active
                    </span>
                  </div>
                  <div>
                    <span className='text-muted-foreground block text-[10px] tracking-wider uppercase'>
                      Avg Size
                    </span>
                    <span className='font-semibold'>{formatBytes(s3.averageFileSize)}</span>
                  </div>
                  <div>
                    <span className='text-muted-foreground block text-[10px] tracking-wider uppercase'>
                      Pending
                    </span>
                    <span className='font-semibold text-amber-600 dark:text-amber-400'>
                      {s3.pendingFiles} items
                    </span>
                  </div>
                  <div>
                    <span className='text-muted-foreground block text-[10px] tracking-wider uppercase'>
                      Deleted
                    </span>
                    <span className='font-semibold text-rose-600 dark:text-rose-400'>
                      {s3.deletedFiles} items
                    </span>
                  </div>
                </div>
                <div className='text-muted-foreground flex flex-col gap-0.5 border-t border-dashed pt-1 text-[10px]'>
                  <div className='flex items-center gap-1 truncate'>
                    <Globe className='h-3 w-3 shrink-0' />
                    <span className='truncate'>
                      {s3.bucketName} ({s3.region})
                    </span>
                  </div>
                  {s3.endpoint && (
                    <div className='flex items-center gap-1 truncate italic opacity-70'>
                      <div className='h-3 w-3' />
                      <span className='truncate'>{s3.endpoint}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className='text-muted-foreground flex items-center gap-2 py-4 text-xs'>
                <AlertCircle className='h-4 w-4' />
                <span>S3 data unavailable</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 2: Cloudinary Storage */}
        <Card className='border-border/60 group hover:border-primary relative overflow-hidden border shadow-sm transition-colors duration-150'>
          <div className='absolute top-0 right-0 p-3 opacity-10 transition-transform'>
            <Cloud size={56} />
          </div>
          <CardHeader className='pb-2'>
            <div className='flex min-w-0 flex-col gap-1'>
              <CardTitle className='text-muted-foreground text-sm font-medium'>
                Cloudinary Storage
              </CardTitle>
              {cld && (
                <Badge
                  variant='outline'
                  className={cn(
                    'h-4 w-fit px-1 text-[10px] font-semibold',
                    isCldConnected
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300'
                  )}
                >
                  {isCldConnected ? 'Connected' : 'Offline'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className='space-y-3'>
            {cld ? (
              <>
                <div>
                  <span className='text-2xl font-bold tracking-tight'>
                    {formatBytes(cldStorageUsed)}
                  </span>
                  <span className='text-muted-foreground ml-1 text-xs'>
                    / {formatBytes(cldStorageLimit)}
                  </span>
                </div>
                <div className='space-y-1.5'>
                  <div className='bg-secondary h-2 w-full overflow-hidden rounded-full'>
                    <div
                      className={`h-full transition-all duration-500 ${getProgressColorClass(cldStoragePct)}`}
                      style={{ width: `${cldStoragePct}%` }}
                    />
                  </div>
                  <div className='text-muted-foreground flex justify-between text-[10px] font-medium'>
                    <span>{(cldStoragePct ?? 0).toFixed(1)}% consumed</span>
                    <span>{cldTotalResources.toLocaleString()} resources</span>
                  </div>
                </div>
                <div className='flex flex-wrap gap-1.5 border-t border-dashed pt-1.5'>
                  <div className='rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'>
                    {cldPlan} Plan
                  </div>
                  <div className='flex items-center gap-1 rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400'>
                    Cloudinary
                  </div>
                </div>
              </>
            ) : (
              <div className='text-muted-foreground flex items-center gap-2 py-4 text-xs'>
                <AlertCircle className='h-4 w-4' />
                <span>Cloudinary data unavailable</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Cloudinary Quotas */}
        <Card className='border-border/60 group hover:border-primary relative overflow-hidden border shadow-sm transition-colors duration-150'>
          <div className='absolute top-0 right-0 p-3 opacity-10 transition-transform'>
            <Zap size={56} />
          </div>
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-sm font-medium'>
              Service Quotas
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3.5'>
            {cld ? (
              <>
                {/* Bandwidth */}
                <div className='space-y-1'>
                  <div className='flex justify-between text-[10px] font-medium'>
                    <span>Bandwidth</span>
                    <span>
                      {formatBytes(cldBandwidthUsed)} / {formatBytes(cldBandwidthLimit)}
                    </span>
                  </div>
                  <div className='bg-secondary h-1.5 w-full overflow-hidden rounded-full'>
                    <div
                      className={`h-full transition-all duration-300 ${getProgressColorClass(cldBandwidthPct)}`}
                      style={{ width: `${cldBandwidthPct}%` }}
                    />
                  </div>
                </div>

                {/* Transformations */}
                <div className='space-y-1'>
                  <div className='flex justify-between text-[10px] font-medium'>
                    <span>Transformations</span>
                    <span>
                      {cldTransformUsed.toLocaleString()} / {cldTransformLimit.toLocaleString()}
                    </span>
                  </div>
                  <div className='bg-secondary h-1.5 w-full overflow-hidden rounded-full'>
                    <div
                      className={`h-full transition-all duration-300 ${getProgressColorClass(cldTransformPct)}`}
                      style={{ width: `${cldTransformPct}%` }}
                    />
                  </div>
                </div>

                {/* API Requests */}
                <div className='space-y-1'>
                  <div className='flex justify-between text-[10px] font-medium'>
                    <span>API Requests</span>
                    <span>
                      {cldRequestsUsed.toLocaleString()} / {cldRequestsLimit.toLocaleString()}
                    </span>
                  </div>
                  <div className='bg-secondary h-1.5 w-full overflow-hidden rounded-full'>
                    <div
                      className={`h-full transition-all duration-300 ${getProgressColorClass(cldRequestsPct)}`}
                      style={{ width: `${cldRequestsPct}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className='text-muted-foreground flex items-center gap-2 py-4 text-xs'>
                <AlertCircle className='h-4 w-4' />
                <span>Quota data unavailable</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 4: Credits & Limits */}
        <Card className='border-border/60 group hover:border-primary relative overflow-hidden border shadow-sm transition-colors duration-150'>
          <div className='absolute top-0 right-0 p-3 opacity-10 transition-transform'>
            <PieChart size={56} />
          </div>
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-sm font-medium'>
              Credits & Limits
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3.5'>
            {cld ? (
              <>
                <div className='space-y-1'>
                  <div className='flex justify-between text-[10px] font-medium'>
                    <span>Account Credits</span>
                    <span>
                      {cldCreditsUsed.toFixed(2)} / {cldCreditsLimit}
                    </span>
                  </div>
                  <div className='bg-secondary h-1.5 w-full overflow-hidden rounded-full'>
                    <div
                      className={`h-full transition-all duration-300 ${getProgressColorClass(cldCreditsPct)}`}
                      style={{ width: `${cldCreditsPct}%` }}
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-2 border-t pt-2 text-[10px]'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Max Image Size</span>
                    <span className='font-semibold'>{formatBytes(cldMaxImg)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Max Video Size</span>
                    <span className='font-semibold'>{formatBytes(cldMaxVid)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Derived Assets</span>
                    <span className='font-semibold'>{cldDerived.toLocaleString()}</span>
                  </div>
                </div>

                <div className='text-muted-foreground text-right text-[9px] italic'>
                  Last updated: {new Date(cldLastUpdated).toLocaleString()}
                </div>
              </>
            ) : (
              <div className='text-muted-foreground flex items-center gap-2 py-4 text-xs'>
                <AlertCircle className='h-4 w-4' />
                <span>Limits data unavailable</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2 – File analysis */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {/* Card 5: File Format Allocation */}
        <Card className='border-border/60 col-span-2 border shadow-sm'>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-1.5 text-sm font-semibold'>
              <PieChart className='h-4.5 w-4.5 text-indigo-500' /> File Format Allocation
            </CardTitle>
            <CardDescription>Breakdown of space occupied by file categories</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4 pt-2'>
            {FILE_CATEGORIES_CONFIG.map((cat) => {
              const stat = fileStats.categories[cat.id as keyof typeof fileStats.categories];
              const Icon = cat.icon;
              return (
                <div key={cat.id} className='space-y-1.5'>
                  <div className='flex justify-between text-xs font-medium'>
                    <span className='flex items-center gap-1.5'>
                      <Icon className={`h-3.5 w-3.5 ${cat.iconColor}`} /> {cat.label}
                    </span>
                    <span className='text-muted-foreground'>
                      {stat.count} files | {formatBytes(stat.size)} ({stat.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className='bg-secondary h-2 w-full overflow-hidden rounded-full'>
                    <div
                      className={`${cat.barColor} h-full transition-all duration-300`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Card 6: Upload Activity – last 7 days */}
        <Card className='border-border/60 border shadow-sm'>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-1.5 text-sm font-semibold'>
              <TrendingUp className='h-4.5 w-4.5 text-emerald-500' /> Upload Activity
            </CardTitle>
            <CardDescription>Assets uploaded in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className='flex h-[180px] items-end justify-between gap-1 px-6 pt-6 pb-2'>
            {fileStats.last7Days.map((day) => {
              const maxCount = Math.max(...fileStats.last7Days.map((d) => d.count), 1);
              const heightPercent = (day.count / maxCount) * 100;
              return (
                <div key={day.dateStr} className='group flex flex-1 flex-col items-center gap-2'>
                  <span className='text-muted-foreground text-[10px] font-semibold opacity-0 transition-opacity group-hover:opacity-100'>
                    {day.count}
                  </span>
                  <div className='bg-secondary flex h-[80px] w-5 items-end overflow-hidden rounded-t-sm sm:w-6'>
                    <div
                      className='bg-primary/80 group-hover:bg-primary w-full rounded-t-sm transition-all duration-300'
                      style={{ height: `${heightPercent || 5}%` }}
                    />
                  </div>
                  <span className='text-muted-foreground text-[10px] font-semibold'>
                    {day.label}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Card 7: Folder Breakdown */}
        <Card className='border-border/60 group hover:border-primary relative overflow-hidden border shadow-sm transition-colors duration-150'>
          <div className='absolute top-0 right-0 p-3 opacity-10 transition-transform'>
            <FolderOpen size={56} />
          </div>
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground flex items-center gap-1.5 text-sm font-medium'>
              <FolderOpen className='h-4 w-4' /> Folder Utilization
            </CardTitle>
          </CardHeader>
          <CardContent className='max-h-[120px] space-y-2 overflow-y-auto pr-1'>
            {Object.keys(fileStats.folders).length === 0 ? (
              <p className='text-muted-foreground py-3 text-center text-xs italic'>
                No folders mapped yet
              </p>
            ) : (
              Object.keys(fileStats.folders).map((key) => {
                const folder = fileStats.folders[key];
                return (
                  <div key={key} className='flex items-center justify-between text-xs'>
                    <span className='text-primary max-w-[100px] truncate font-medium'>{key}/</span>
                    <div className='text-muted-foreground flex items-center gap-2'>
                      <span>{folder.count} files</span>
                      <span>({formatBytes(folder.size)})</span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default StorageDashboardStats;
