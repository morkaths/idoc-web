import z from 'zod';
import { createFileRoute } from '@tanstack/react-router';
import { Categories } from '@/features/categories';

const categoriesSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  query: z.string().optional().catch(''),
  lang: z
    .preprocess((val) => (Array.isArray(val) ? val : val ? [val] : []), z.array(z.string()))
    .catch([]),
});

export const Route = createFileRoute('/_authenticated/categories/')({
  validateSearch: categoriesSearchSchema,
  component: Categories,
});
