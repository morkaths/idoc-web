import z from 'zod';
import { createFileRoute } from '@tanstack/react-router';
import { UserStatus, RoleType } from '@repo/types';
import { Users } from '@/features/users';

const usersSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  query: z.string().optional().catch(''),
  status: z
    .preprocess(
      (val) => (Array.isArray(val) ? val : val ? [val] : []),
      z.array(z.enum(Object.values(UserStatus)))
    )
    .optional()
    .catch([]),
  role: z
    .preprocess(
      (val) => (Array.isArray(val) ? val : val ? [val] : []),
      z.array(z.enum(Object.values(RoleType)))
    )
    .optional()
    .catch([]),
});

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: usersSearchSchema,
  component: Users,
});
