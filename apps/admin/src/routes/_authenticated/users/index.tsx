import z from 'zod';
import { createFileRoute } from '@tanstack/react-router';
import { Users } from '@/features/users';
import { UserStatus, RoleType } from '@repo/types';

const usersSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  query: z.string().optional().catch(''),
  status: z
    .preprocess(
      (val) => (Array.isArray(val) ? val : val ? [val] : []),
      z.array(z.enum(Object.values(UserStatus)))
    )
    .catch([]),
  role: z
    .preprocess(
      (val) => (Array.isArray(val) ? val : val ? [val] : []),
      z.array(z.enum(Object.values(RoleType)))
    )
    .catch([]),
});

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: usersSearchSchema,
  component: Users,
});
