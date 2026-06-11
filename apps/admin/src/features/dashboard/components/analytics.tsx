import type { DashboardStatsResponse } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Skeleton } from '@repo/ui/components/skeleton';
import { AnalyticsChart } from './analytics-chart';

interface AnalyticsProps {
  data?: DashboardStatsResponse['analytics'];
  isLoading?: boolean;
}

export const Analytics = ({ data, isLoading }: AnalyticsProps) => {
  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>Weekly clicks and unique visitors</CardDescription>
        </CardHeader>
        <CardContent className='px-6'>
          <AnalyticsChart data={data?.weeklyTraffic} isLoading={isLoading} />
        </CardContent>
      </Card>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Clicks</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='text-muted-foreground h-4 w-4'
            >
              <path d='M3 3v18h18' />
              <path d='M7 15l4-4 4 4 4-6' />
            </svg>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='space-y-2'>
                <Skeleton className='h-8 w-[80px]' />
                <Skeleton className='h-4 w-[120px]' />
              </div>
            ) : (
              <>
                <div className='text-2xl font-bold'>{data?.totalClicks.value}</div>
                <p className='text-muted-foreground text-xs'>{data?.totalClicks.change}</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Unique Visitors</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='text-muted-foreground h-4 w-4'
            >
              <circle cx='12' cy='7' r='4' />
              <path d='M6 21v-2a6 6 0 0 1 12 0v2' />
            </svg>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='space-y-2'>
                <Skeleton className='h-8 w-[80px]' />
                <Skeleton className='h-4 w-[120px]' />
              </div>
            ) : (
              <>
                <div className='text-2xl font-bold'>{data?.uniqueVisitors.value}</div>
                <p className='text-muted-foreground text-xs'>{data?.uniqueVisitors.change}</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Bounce Rate</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='text-muted-foreground h-4 w-4'
            >
              <path d='M3 12h6l3 6 3-6h6' />
            </svg>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='space-y-2'>
                <Skeleton className='h-8 w-[80px]' />
                <Skeleton className='h-4 w-[120px]' />
              </div>
            ) : (
              <>
                <div className='text-2xl font-bold'>{data?.bounceRate.value}</div>
                <p className='text-muted-foreground text-xs'>{data?.bounceRate.change}</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Avg. Session</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='text-muted-foreground h-4 w-4'
            >
              <circle cx='12' cy='12' r='10' />
              <path d='M12 6v6l4 2' />
            </svg>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='space-y-2'>
                <Skeleton className='h-8 w-[80px]' />
                <Skeleton className='h-4 w-[120px]' />
              </div>
            ) : (
              <>
                <div className='text-2xl font-bold'>{data?.avgSession.value}</div>
                <p className='text-muted-foreground text-xs'>{data?.avgSession.change}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <Card className='col-span-1 lg:col-span-4'>
          <CardHeader>
            <CardTitle>Referrers</CardTitle>
            <CardDescription>Top sources driving traffic</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList
              items={data?.referrers || []}
              barClass='bg-primary'
              valueFormatter={(n) => `${n}`}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <CardTitle>Devices</CardTitle>
            <CardDescription>How users access your app</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList
              items={data?.devices || []}
              barClass='bg-muted-foreground'
              valueFormatter={(n) => `${n}%`}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface SimpleBarListProps {
  items: { name: string; value: number }[];
  valueFormatter: (n: number) => string;
  barClass: string;
  isLoading?: boolean;
}

const SimpleBarList = ({ items, valueFormatter, barClass, isLoading }: SimpleBarListProps) => {
  if (isLoading) {
    return (
      <div className='space-y-4'>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='space-y-2'>
            <Skeleton className='h-3 w-[80px]' />
            <Skeleton className='h-2 w-full' />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <div className='text-muted-foreground py-4 text-center text-sm'>No data available</div>;
  }

  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className='space-y-3'>
      {items.map((i) => {
        const width = `${Math.round((i.value / max) * 100)}%`;
        return (
          <li key={i.name} className='flex items-center justify-between gap-3'>
            <div className='min-w-0 flex-1'>
              <div className='text-muted-foreground mb-1 truncate text-xs'>{i.name}</div>
              <div className='bg-muted h-2.5 w-full rounded-full'>
                <div className={`h-2.5 rounded-full ${barClass}`} style={{ width }} />
              </div>
            </div>
            <div className='ps-2 text-xs font-medium tabular-nums'>{valueFormatter(i.value)}</div>
          </li>
        );
      })}
    </ul>
  );
};
