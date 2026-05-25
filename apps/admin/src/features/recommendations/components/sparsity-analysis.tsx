import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@repo/ui/components/chart';

interface BucketData {
  bucketName: string;
  ndcgAtK: number;
}

interface SparsityAnalysisProps {
  frequencyBuckets: BucketData[];
}

const chartConfig = {
  ndcgAtK: {
    label: 'NDCG@K',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

/**
 * Renders sparsity analysis (long-tail) performance metrics using Recharts.
 */
export function SparsityAnalysis({ frequencyBuckets }: SparsityAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Sparsity Analysis (Long-tail)</CardTitle>
        <CardDescription>
          Performance across different user activity levels.
        </CardDescription>
      </CardHeader>
      <CardContent className='pt-0'>
        <div className='h-[300px] w-full'>
          <ChartContainer config={chartConfig} className='h-[250px] w-full'>
            <BarChart data={frequencyBuckets}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} />
              <XAxis
                dataKey='bucketName'
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(v: unknown) => {
                      const value = typeof v === 'number' ? v : 0;
                      return [`${(value * 100).toFixed(2)}%`, 'NDCG@K'];
                    }}
                  />
                }
              />
              <Bar
                dataKey='ndcgAtK'
                fill='var(--color-ndcgAtK)'
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
