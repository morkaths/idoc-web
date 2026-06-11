import { useState } from 'react';
import { format } from 'date-fns';
import { type TrainingTarget } from '@repo/types';
import { Sparkles } from 'lucide-react';
import { type DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import {
  useRecommendationSync,
  useRecommendationTrain,
  useRecommendationMetrics,
} from '@/hooks/data/useRecommendation';
import { DateRangePicker } from '@/components/form/date-range-picker';
import { OnlineMetrics } from './components/online-metrics';
import { RecommendationHeader } from './components/recommendation-header';
import { RecommendationSyncDialog } from './components/recommendation-sync-dialog';
import { RecommendationTrainDialog } from './components/recommendation-train-dialog';

export function Recommendations() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [isTrainOpen, setIsTrainOpen] = useState(false);

  const startDateStr = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined;
  const endDateStr = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined;

  const syncMutation = useRecommendationSync();
  const trainMutation = useRecommendationTrain();
  const { data: metricsData, isLoading: isMetricsLoading } = useRecommendationMetrics(
    startDateStr,
    endDateStr
  );

  const handleSync = () => {
    syncMutation.mutate(undefined, {
      onSuccess: (data) => {
        toast.success(`Synced ${data.data?.count || 0} items successfully!`);
      },
      onError: () => {
        toast.error('Đồng bộ dữ liệu thất bại.');
      },
    });
  };

  const handleTrain = (target: TrainingTarget) => {
    trainMutation.mutate(target, {
      onSuccess: () => {
        toast.success(`Bắt đầu huấn luyện cho target ${target}.`);
      },
      onError: () => {
        toast.error('Khởi động huấn luyện thất bại.');
      },
    });
  };

  const response = metricsData;
  const dataObj = Array.isArray(response) ? response[0] : response;

  return (
    <div className='flex flex-col gap-6'>
      <RecommendationHeader
        onSyncClick={() => setIsSyncOpen(true)}
        onTrainClick={() => setIsTrainOpen(true)}
        isSyncing={syncMutation.isPending}
        isTraining={trainMutation.isPending}
      />

      <div className='flex flex-col gap-3 border-b pb-4 lg:flex-row lg:items-center lg:justify-between'>
        <div>
          <h2 className='text-lg font-semibold'>Online Metrics</h2>
          <p className='text-muted-foreground text-sm'>
            Real-time recommendation performance monitoring.
          </p>
        </div>
        <div className='flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center'>
          <span className='text-sm font-medium lg:whitespace-nowrap'>Date Range:</span>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {isMetricsLoading || dataObj ? (
        <OnlineMetrics
          isLoading={isMetricsLoading}
          onlineMetrics={dataObj?.onlineMetrics ?? []}
          strategyDistribution={dataObj?.strategyDistribution ?? []}
        />
      ) : (
        <div className='flex h-[400px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed'>
          <Sparkles className='text-muted-foreground h-10 w-10 opacity-20' />
          <p className='text-muted-foreground text-lg font-medium'>No online metrics available</p>
        </div>
      )}

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
