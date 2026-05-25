import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TrainingTarget } from '@repo/types';
import { toast } from 'sonner';

export const TrainFormSchema = z.object({
  target: z.nativeEnum(TrainingTarget),
});

export type TrainFormValues = z.infer<typeof TrainFormSchema>;

export interface UseRecommendationTrainFormProps {
  onOpenChange: (open: boolean) => void;
  onSubmit: (target: TrainingTarget) => void;
}

/**
 * Custom hook to handle training target form setup, validation and submission.
 * @param {UseRecommendationTrainFormProps} props - Properties containing form callbacks.
 * @returns {object} Form state and submit handler.
 */
export function useRecommendationTrainForm({
  onOpenChange,
  onSubmit,
}: UseRecommendationTrainFormProps) {
  const form = useForm<TrainFormValues>({
    resolver: zodResolver(TrainFormSchema),
    defaultValues: {
      target: TrainingTarget.ALL,
    },
  });

  const handleFormSubmit = async (data: TrainFormValues) => {
    try {
      onSubmit(data.target);
      onOpenChange(false);
    } catch {
      toast.error('Failed to start training. Please try again.');
    }
  };

  return {
    form,
    handleFormSubmit,
  };
}
