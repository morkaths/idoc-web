import { useState } from 'react';
import { RecommendationStrategy } from '@repo/types';
import { Sparkles, RefreshCw, Play, BarChart3, TrendingUp, Target, Zap } from 'lucide-react';
import { Loader2 } from 'lucide-react';
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
import { toast } from 'sonner';
import {
  useRecommendationSync,
  useRecommendationTrain,
  useRecommendationMetrics,
} from '@/hooks/data/useRecommendation';
import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';

export function Recommendations() {
  const [strategy, setStrategy] = useState<RecommendationStrategy>(RecommendationStrategy.HYBRID);

  const syncMutation = useRecommendationSync();
  const trainMutation = useRecommendationTrain();
  const { data: metricsData, isLoading: isEvalLoading } = useRecommendationMetrics();

  const handleSync = () => {
    syncMutation.mutate(undefined, {
      onSuccess: (data) => {
        toast.success(`Synced ${data.data?.count || 0} items successfully!`);
      },
      onError: () => {
        toast.error('Failed to sync recommendation data.');
      },
    });
  };

  const handleTrain = () => {
    trainMutation.mutate(strategy, {
      onSuccess: () => {
        toast.success(`Started training for ${strategy} strategy.`);
      },
      onError: () => {
        toast.error('Failed to start training.');
      },
    });
  };

  let target = 'all';
  if (strategy === RecommendationStrategy.CBF) target = 'cbf';
  else if (strategy === RecommendationStrategy.IBCF) target = 'ibcf';

  const response = metricsData?.data;
  // @ts-ignore - The response could be an array if misaligned, but typically object
  const dataObj = Array.isArray(response) ? response[0] : response;
  const offlineMetrics = dataObj?.offline_metrics || [];
  const evalData = offlineMetrics.find((m: any) => m.target === target) || offlineMetrics.find((m: any) => m.target === 'all') || offlineMetrics[0];

  const metrics = evalData?.metrics || null;
  const sparsity = evalData?.sparsity || null;

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Recommendation Management</h2>
          <p className='text-muted-foreground'>
            Synchronize data, train AI models, and monitor performance metrics.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' onClick={handleSync} disabled={syncMutation.isPending}>
            {syncMutation.isPending ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <RefreshCw className='mr-2 h-4 w-4' />
            )}
            Sync Data
          </Button>
          <Button onClick={handleTrain} disabled={trainMutation.isPending}>
            {trainMutation.isPending ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Play className='mr-2 h-4 w-4' />
            )}
            Train Model
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Strategy Evaluation</CardTitle>
          <CardDescription>
            Select a strategy to view its performance metrics and analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-6 flex items-center gap-4'>
            <span className='text-sm font-medium'>Target Strategy:</span>
            <Select
              value={strategy}
              onValueChange={(v) => setStrategy(v as RecommendationStrategy)}
            >
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Select strategy' />
              </SelectTrigger>
              <SelectContent>
                {Object.values(RecommendationStrategy).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isEvalLoading ? (
            <div className='flex h-[400px] items-center justify-center'>
              <Loader2 className='text-primary h-8 w-8 animate-spin' />
            </div>
          ) : metrics ? (
            <div className='space-y-6'>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <MetricCard
                  title='Precision@K'
                  value={(metrics.precisionAtK * 100).toFixed(2) + '%'}
                  icon={Target}
                  description='Relevance of top recommendations'
                />
                <MetricCard
                  title='Recall@K'
                  value={(metrics.recallAtK * 100).toFixed(2) + '%'}
                  icon={TrendingUp}
                  description='Ability to find all relevant items'
                />
                <MetricCard
                  title='NDCG@K'
                  value={metrics.ndcgAtK.toFixed(4)}
                  icon={BarChart3}
                  description='Normalized Discounted Cumulative Gain'
                />
                <MetricCard
                  title='Hit Rate'
                  value={(metrics.hitRate * 100).toFixed(2) + '%'}
                  icon={Zap}
                  description='Presence of at least one relevant item'
                />
              </div>

              {sparsity && sparsity.frequencyBuckets && (
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
                        <BarChart data={sparsity.frequencyBuckets}>
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
                            formatter={(v: any) => [`${((v || 0) * 100).toFixed(2)}%`, 'NDCG']}
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
              )}
            </div>
          ) : (
            <div className='flex h-[400px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed'>
              <Sparkles className='text-muted-foreground h-10 w-10 opacity-20' />
              <p className='text-muted-foreground text-lg font-medium'>
                No evaluation data available
              </p>
              <p className='text-muted-foreground text-sm'>
                Train the model first to generate metrics.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  icon: any;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='text-muted-foreground h-4 w-4' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-muted-foreground mt-1 text-xs'>{description}</p>
      </CardContent>
    </Card>
  );
}
