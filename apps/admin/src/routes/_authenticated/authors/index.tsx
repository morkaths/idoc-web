import { createFileRoute } from '@tanstack/react-router';
import { Authors } from '@/features/authors';

export const Route = createFileRoute('/_authenticated/authors/')({
  component: Authors,
});
