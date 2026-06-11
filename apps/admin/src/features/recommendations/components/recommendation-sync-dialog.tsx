'use client';

import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/dialog';

interface RecommendationSyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

/**
 * A dialog to confirm synchronizing recommendation interaction data.
 */
export function RecommendationSyncDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: RecommendationSyncDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <RefreshCw className='text-primary h-5 w-5' />
            Sync Recommendation Data
          </DialogTitle>
          <DialogDescription>
            This action will synchronize all user interactions, book metadata, and reading logs with
            the recommendation engine database. This might take a few moments.
          </DialogDescription>
        </DialogHeader>

        <div className='text-muted-foreground py-4 text-sm'>
          Are you sure you want to proceed with the synchronization?
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' type='button' disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Sync Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
