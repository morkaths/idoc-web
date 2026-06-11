import { Sparkles, AlertCircle, Info } from 'lucide-react';

/**
 * Returns icon config based on notification type.
 */
export const getNotificationConfig = (type: string) => {
  switch (type) {
    case 'RECOMMENDER_TRAINED_SUCCESS':
      return {
        Icon: Sparkles,
        iconClass: 'text-emerald-600 dark:text-emerald-400',
      };
    case 'RECOMMENDER_TRAINED_FAILURE':
      return {
        Icon: AlertCircle,
        iconClass: 'text-rose-600 dark:text-rose-400',
      };
    default:
      return {
        Icon: Info,
        iconClass: 'text-blue-600 dark:text-blue-400',
      };
  }
};
