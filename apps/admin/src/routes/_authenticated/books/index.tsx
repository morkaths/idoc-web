import z from 'zod';
import { createFileRoute } from '@tanstack/react-router';
import { Books } from '@/features/books';

const booksSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  query: z.string().optional().catch(''),
  category: z
    .preprocess((val) => (Array.isArray(val) ? val : val ? [val] : []), z.array(z.string()))
    .optional()
    .catch([]),
  language: z
    .preprocess((val) => (Array.isArray(val) ? val : val ? [val] : []), z.array(z.string()))
    .optional()
    .catch([]),
});

export const Route = createFileRoute('/_authenticated/books/')({
  validateSearch: booksSearchSchema,
  component: Books,
});
