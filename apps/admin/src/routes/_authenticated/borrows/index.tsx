import z from 'zod';
import { createFileRoute } from '@tanstack/react-router';
import { BorrowStatus } from '@/types';
import { Borrows } from '@/features/borrows';

const borrowsSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  query: z.string().optional().catch(''),
  status: z
    .preprocess(
      (val) => (Array.isArray(val) ? val : val ? [val] : []),
      z.array(z.nativeEnum(BorrowStatus))
    )
    .catch([]),
});

export const Route = createFileRoute('/_authenticated/borrows/')({
  validateSearch: borrowsSearchSchema,
  component: Borrows,
});
