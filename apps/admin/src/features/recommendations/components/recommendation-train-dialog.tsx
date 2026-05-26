'use client';

import { TrainingTarget } from '@repo/types';
import { Loader2, Play } from 'lucide-react';
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
import { Form, FormControl, FormField, FormLabel, FormMessage } from '@repo/ui/components/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { useRecommendationTrainForm } from '../data/use-recommendation-train-form';

interface RecommendationTrainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (target: TrainingTarget) => void;
  isLoading: boolean;
}

/**
 * A dialog to configure and execute recommendation model training.
 * @param {RecommendationTrainDialogProps} props - The component properties.
 */
export function RecommendationTrainDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: RecommendationTrainDialogProps) {
  const { form, handleFormSubmit } = useRecommendationTrainForm({
    onOpenChange,
    onSubmit,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Play className='text-primary h-5 w-5' />
            Train Recommendation Models
          </DialogTitle>
          <DialogDescription>
            Configure parameters and select target models to execute model training.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-6'>
            <div className='grid gap-4 py-2'>
              <FormField
                control={form.control}
                name='target'
                render={({ field }) => (
                  <div className='grid gap-3'>
                    <FormLabel htmlFor='target'>Training Target</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger id='target'>
                          <SelectValue placeholder='Select training target' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TrainingTarget.ALL}>All Models (CBF & IBCF)</SelectItem>
                        <SelectItem value={TrainingTarget.CBF}>Content-Based (CBF) Only</SelectItem>
                        <SelectItem value={TrainingTarget.IBCF}>
                          Collaborative (IBCF) Only
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                )}
              />

              <div className='bg-muted text-muted-foreground space-y-1 rounded-lg p-3 text-xs'>
                <p className='text-foreground font-semibold'>Model descriptions:</p>
                <p>
                  • <strong>CBF:</strong> Analyzes book metadata (genres, description, author) to
                  suggest similar content.
                </p>
                <p>
                  • <strong>IBCF:</strong> Collaborative approach based on user interaction
                  histories and ratings.
                </p>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline' type='button' disabled={isLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Start Training
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
