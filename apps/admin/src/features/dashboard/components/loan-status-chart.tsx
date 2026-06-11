import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Skeleton } from '@repo/ui/components/skeleton';

interface LoanStatusChartProps {
  active: number;
  overdue: number;
  returned: number;
  canceled: number;
  isLoading?: boolean;
}

export const LoanStatusChart = ({
  active,
  overdue,
  returned,
  canceled,
  isLoading,
}: LoanStatusChartProps) => {
  if (isLoading) {
    return <Skeleton className='h-[300px] w-full rounded-xl' />;
  }

  const chartData = [
    { name: 'Active', value: active, color: 'var(--color-primary)' },
    { name: 'Overdue', value: overdue, color: 'var(--color-destructive)' },
    { name: 'Returned', value: returned, color: 'var(--color-chart-2)' },
    { name: 'Canceled', value: canceled, color: 'var(--color-muted-foreground)' },
  ];

  const total = active + overdue + returned + canceled;

  if (total === 0) {
    return (
      <div className='text-muted-foreground flex h-[300px] items-center justify-center text-sm'>
        No loan records available
      </div>
    );
  }

  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis
          dataKey='name'
          stroke='var(--color-muted-foreground)'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='var(--color-muted-foreground)'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            borderRadius: 'var(--radius)',
            color: 'var(--color-foreground)',
          }}
          formatter={(value: string | number | readonly (string | number)[] | undefined) => [`${value} loans`, 'Count']}
        />
        <Bar dataKey='value' radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
