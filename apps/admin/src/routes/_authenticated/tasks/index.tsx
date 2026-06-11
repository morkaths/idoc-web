import z from 'zod';
import { createFileRoute } from '@tanstack/react-router';
import { Tasks } from '@/features/tasks';
import { priorities, statuses } from '@/features/tasks/data/data';

const taskSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  status: z
    .preprocess(
      (val) => (Array.isArray(val) ? val : val ? [val] : []),
      z.array(z.enum(statuses.map((status) => status.value)))
    )
    .optional()
    .catch([]),
  priority: z
    .preprocess(
      (val) => (Array.isArray(val) ? val : val ? [val] : []),
      z.array(z.enum(priorities.map((priority) => priority.value)))
    )
    .optional()
    .catch([]),
  filter: z.string().optional().catch(''),
});

export const Route = createFileRoute('/_authenticated/tasks/')({
  validateSearch: taskSearchSchema,
  component: Tasks,
});
