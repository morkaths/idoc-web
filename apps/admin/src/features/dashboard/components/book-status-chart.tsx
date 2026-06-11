import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Skeleton } from '@repo/ui/components/skeleton';

interface BookStatusChartProps {
  available: number;
  outOfStock: number;
  isLoading?: boolean;
}

export const BookStatusChart = ({ available, outOfStock, isLoading }: BookStatusChartProps) => {
  if (isLoading) {
    return <Skeleton className='h-[300px] w-full rounded-xl' />;
  }

  const total = available + outOfStock;

  if (total === 0) {
    return (
      <div className='text-muted-foreground flex h-[300px] items-center justify-center text-sm'>
        No book data available
      </div>
    );
  }

  const data = [
    { name: 'Available', value: available, color: 'var(--color-chart-2)' },
    { name: 'Out of Stock', value: outOfStock, color: 'var(--color-destructive)' },
  ];

  return (
    <ResponsiveContainer width='100%' height={300}>
      <PieChart>
        <Pie
          data={data}
          cx='50%'
          cy='50%'
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey='value'
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            borderRadius: 'var(--radius)',
            color: 'var(--color-foreground)',
          }}
          formatter={(value: string | number | readonly (string | number)[] | undefined) => [`${value} books`, 'Count']}
        />
        <Legend verticalAlign='bottom' height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};
