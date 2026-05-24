import { useState } from 'react';
import { RecommendationStrategy, type TrainingTarget } from '@repo/types';
import { Sparkles, BarChart3, TrendingUp, Target, Zap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { type DateRange } from 'react-day-picker';
import {
  useRecommendationSync,
  useRecommendationTrain,
  useRecommendationMetrics,
} from '@/hooks/data/useRecommendation';
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
import { DateRangePicker } from '@/components/form/date-range-picker';
import { RecommendationHeader } from './components/recommendation-header';
import { MetricCard } from './components/metric-card';
import { SparsityAnalysis } from './components/sparsity-analysis';
import { RecommendationSyncDialog } from './components/recommendation-sync-dialog';
import { RecommendationTrainDialog } from './components/recommendation-train-dialog';

export function Recommendations() {
  const [strategy, setStrategy] = useState<RecommendationStrategy>(RecommendationStrategy.HYBRID);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [isTrainOpen, setIsTrainOpen] = useState(false);

  const startDateStr = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined;
  const endDateStr = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined;

  const syncMutation = useRecommendationSync();
  const trainMutation = useRecommendationTrain();
  const { data: metricsData, isLoading: isEvalLoading } = useRecommendationMetrics(
    startDateStr,
    endDateStr
  );

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

  const handleTrain = (target: TrainingTarget) => {
    trainMutation.mutate(target, {
      onSuccess: () => {
        toast.success(`Started training for ${target} target.`);
      },
      onError: () => {
        toast.error('Failed to start training.');
      },
    });
  };

  let target = 'all';
  if (strategy === RecommendationStrategy.CBF) target = 'cbf';
  else if (strategy === RecommendationStrategy.IBCF) target = 'ibcf';

  const response = metricsData;
  const dataObj = Array.isArray(response) ? response[0] : response;
  const offlineMetrics = dataObj?.offline_metrics || [];
  const evalData =
    offlineMetrics.find((m: { target?: string }) => m.target === target) ||
    offlineMetrics.find((m: { target?: string }) => m.target === 'all') ||
    offlineMetrics[0];

  const metrics = evalData?.metrics || null;
  const sparsity = evalData?.sparsity || null;

  return (
    <div className='flex flex-col gap-6'>
      <RecommendationHeader
        onSyncClick={() => setIsSyncOpen(true)}
        onTrainClick={() => setIsTrainOpen(true)}
        isSyncing={syncMutation.isPending}
        isTraining={trainMutation.isPending}
      />

      <Card>
        <CardHeader>
          <CardTitle>Strategy Evaluation</CardTitle>
          <CardDescription>
            Select a strategy to view its performance metrics and analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-6 flex flex-wrap items-center gap-6'>
            <div className='flex items-center gap-2'>
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

            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium'>Date Range:</span>
              <DateRangePicker value={dateRange} onChange={setDateRange} />
            </div>
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
                <SparsityAnalysis frequencyBuckets={sparsity.frequencyBuckets} />
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

      <RecommendationSyncDialog
        open={isSyncOpen}
        onOpenChange={setIsSyncOpen}
        onConfirm={handleSync}
        isLoading={syncMutation.isPending}
      />

      <RecommendationTrainDialog
        open={isTrainOpen}
        onOpenChange={setIsTrainOpen}
        onSubmit={handleTrain}
        isLoading={trainMutation.isPending}
      />
    </div>
  );
}

