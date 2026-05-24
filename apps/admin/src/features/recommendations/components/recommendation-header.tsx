import { RefreshCw, Play, Loader2 } from 'lucide-react';
import { Button } from '@repo/ui/components/button';

interface RecommendationHeaderProps {
  onSyncClick: () => void;
  onTrainClick: () => void;
  isSyncing: boolean;
  isTraining: boolean;
}

/**
 * Renders the top header for recommendation management page,
 * containing simple buttons to trigger sync and train modals.
 */
export function RecommendationHeader({
  onSyncClick,
  onTrainClick,
  isSyncing,
  isTraining,
}: RecommendationHeaderProps) {
  return (
    <div className='flex flex-wrap items-end justify-between gap-4'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Recommendation Management</h2>
        <p className='text-muted-foreground'>
          Synchronize data, train AI models, and monitor performance metrics.
        </p>
      </div>
      <div className='flex flex-wrap items-center gap-3'>
        <Button
          variant='outline'
          onClick={onSyncClick}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <RefreshCw className='mr-2 h-4 w-4' />
          )}
          Sync Data
        </Button>
        <Button onClick={onTrainClick} disabled={isTraining}>
          {isTraining ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <Play className='mr-2 h-4 w-4' />
          )}
          Train Model
        </Button>
      </div>
    </div>
  );
}
