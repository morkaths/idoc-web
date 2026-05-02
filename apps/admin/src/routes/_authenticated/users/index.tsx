import z from 'zod';
import { createFileRoute } from '@tanstack/react-router';
import { Users } from '@/features/users';
import { UserStatus, RoleType } from '@repo/types';

const usersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  query: z.string().optional().catch(''),
  status: z.array(z.enum(Object.values(UserStatus))).optional().catch([]),
  role: z.array(z.enum(Object.values(RoleType))).optional().catch([]),
});

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: usersSearchSchema,
  component: Users,
});
