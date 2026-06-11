import z from 'zod';
import { createFileRoute } from '@tanstack/react-router';
import { Authors } from '@/features/authors';

const authorsSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  query: z.string().optional().catch(''),
  nationality: z
    .preprocess((val) => (Array.isArray(val) ? val : val ? [val] : []), z.array(z.string()))
    .optional()
    .catch([]),
});

export const Route = createFileRoute('/_authenticated/authors/')({
  validateSearch: authorsSearchSchema,
  component: Authors,
});
