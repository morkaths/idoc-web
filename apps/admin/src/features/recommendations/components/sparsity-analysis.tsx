import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';

interface BucketData {
  bucketName: string;
  ndcgAtK: number;
}

interface SparsityAnalysisProps {
  frequencyBuckets: BucketData[];
}

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
          <ResponsiveContainer width='100%' height='100%'>
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
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                formatter={(v: unknown) => {
                  const value = typeof v === 'number' ? v : 0;
                  return [`${(value * 100).toFixed(2)}%`, 'NDCG'];
                }}
              />
              <Legend />
              <Bar
                dataKey='ndcgAtK'
                name='NDCG@K'
                fill='hsl(var(--primary))'
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
