import z from 'zod';
import { createFileRoute } from '@tanstack/react-router';
import { Storage } from '@/features/storage';

const storageSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  query: z.string().optional().catch(''),
  contentType: z
    .preprocess((val) => (Array.isArray(val) ? val : val ? [val] : []), z.array(z.string()))
    .optional()
    .catch([]),
});

export const Route = createFileRoute('/_authenticated/storage/')({
  validateSearch: storageSearchSchema,
  component: Storage,
});
