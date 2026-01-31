import { createFileRoute } from '@tanstack/react-router';
import { Borrows } from '@/features/borrows';

export const Route = createFileRoute('/_authenticated/borrows/')({
  component: Borrows,
});