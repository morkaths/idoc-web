import { createFileRoute } from '@tanstack/react-router';
import { Recommendations } from '@/features/recommendations';

export const Route = createFileRoute('/_authenticated/recommendations/')({
  component: Recommendations,
});
