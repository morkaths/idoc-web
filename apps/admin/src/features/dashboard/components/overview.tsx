import type { MonthlyOverviewStat } from '@/types';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Skeleton } from '@repo/ui/components/skeleton';

interface OverviewProps {
  data?: MonthlyOverviewStat[];
  isLoading?: boolean;
}

export const Overview = ({ data, isLoading }: OverviewProps) => {
  if (isLoading) {
    return <Skeleton className='h-[350px] w-full' />;
  }

  if (!data || data.length === 0) {
    return (
      <div className='text-muted-foreground flex h-[350px] items-center justify-center text-sm'>
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <XAxis dataKey='name' stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          direction='ltr'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey='total' fill='currentColor' radius={[4, 4, 0, 0]} className='fill-primary' />
      </BarChart>
    </ResponsiveContainer>
  );
};
