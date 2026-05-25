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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { DateRangePicker } from '@/components/form/date-range-picker';
import { RecommendationHeader } from './components/recommendation-header';
import { MetricCard } from './components/metric-card';
import { SparsityAnalysis } from './components/sparsity-analysis';
import { RecommendationSyncDialog } from './components/recommendation-sync-dialog';
import { RecommendationTrainDialog } from './components/recommendation-train-dialog';
import { OnlineMetrics } from './components/online-metrics';

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
  const offlineMetrics = dataObj?.offlineMetrics || [];
  
  // Find model matching selected strategy target, case-insensitively
  const evalData =
    offlineMetrics.find(
      (m: any) =>
        (m.target || m.modelName)?.toLowerCase() === target.toLowerCase()
    ) ||
    offlineMetrics.find(
      (m: any) =>
        (m.target || m.modelName)?.toLowerCase() === 'all'
    ) ||
    offlineMetrics.find(
      (m: any) =>
        (m.target || m.modelName)?.toLowerCase() === strategy.toLowerCase()
    ) ||
    offlineMetrics[0];

  // Map and extract available metrics from flat or nested structure
  const metrics = evalData
    ? {
        precisionAtK: evalData.precisionAtK ?? evalData.metrics?.precisionAtK ?? 0,
        recallAtK: evalData.recallAtK ?? evalData.metrics?.recallAtK ?? 0,
        ndcgAtK: evalData.ndcgAtK ?? evalData.metrics?.ndcgAtK ?? 0,
        hitRate: evalData.hitRate ?? evalData.metrics?.hitRate ?? undefined,
        rmse: evalData.rmse ?? evalData.metrics?.rmse,
        mae: evalData.mae ?? evalData.metrics?.mae,
        coverage: evalData.coverage ?? evalData.metrics?.coverage,
      }
    : null;

  const sparsity = evalData?.sparsity || null;

  const formatPercentage = (val: number | undefined) => {
    if (val === undefined || isNaN(val)) return 'N/A';
    return (val * 100).toFixed(2) + '%';
  };

  const formatDecimal = (val: number | undefined, decimals = 4) => {
    if (val === undefined || isNaN(val)) return 'N/A';
    return val.toFixed(decimals);
  };

  return (
    <div className='flex flex-col gap-6'>
      <RecommendationHeader
        onSyncClick={() => setIsSyncOpen(true)}
        onTrainClick={() => setIsTrainOpen(true)}
        isSyncing={syncMutation.isPending}
        isTraining={trainMutation.isPending}
      />

      <Tabs defaultValue='offline' className='w-full space-y-6'>
        <div className='flex items-center justify-between border-b pb-2'>
          <TabsList>
            <TabsTrigger value='offline'>Offline Evaluation</TabsTrigger>
            <TabsTrigger value='online'>Online Metrics</TabsTrigger>
          </TabsList>

          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium'>Date Range:</span>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
        </div>

        <TabsContent value='offline' className='space-y-6 mt-0'>
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
                      value={formatPercentage(metrics.precisionAtK)}
                      icon={Target}
                      description='Relevance of top recommendations'
                    />
                    <MetricCard
                      title='Recall@K'
                      value={formatPercentage(metrics.recallAtK)}
                      icon={TrendingUp}
                      description='Ability to find all relevant items'
                    />
                    <MetricCard
                      title='NDCG@K'
                      value={formatDecimal(metrics.ndcgAtK)}
                      icon={BarChart3}
                      description='Normalized Discounted Cumulative Gain'
                    />
                    <MetricCard
                      title='Hit Rate'
                      value={formatPercentage(metrics.hitRate)}
                      icon={Zap}
                      description='Presence of at least one relevant item'
                    />
                    {metrics.rmse !== undefined && (
                      <MetricCard
                        title='RMSE'
                        value={formatDecimal(metrics.rmse)}
                        icon={BarChart3}
                        description='Root Mean Squared Error'
                      />
                    )}
                    {metrics.mae !== undefined && (
                      <MetricCard
                        title='MAE'
                        value={formatDecimal(metrics.mae)}
                        icon={BarChart3}
                        description='Mean Absolute Error'
                      />
                    )}
                    {metrics.coverage !== undefined && (
                      <MetricCard
                        title='Coverage'
                        value={formatPercentage(metrics.coverage)}
                        icon={Target}
                        description='Catalog Coverage'
                      />
                    )}
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
        </TabsContent>

        <TabsContent value='online' className='mt-0'>
          {isEvalLoading ? (
            <div className='flex h-[400px] items-center justify-center'>
              <Loader2 className='text-primary h-8 w-8 animate-spin' />
            </div>
          ) : dataObj ? (
            <OnlineMetrics
              onlineMetrics={dataObj.onlineMetrics || []}
              strategyDistribution={dataObj.strategyDistribution || []}
            />
          ) : (
            <div className='flex h-[400px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed'>
              <Sparkles className='text-muted-foreground h-10 w-10 opacity-20' />
              <p className='text-muted-foreground text-lg font-medium'>
                No online metrics available
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

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

