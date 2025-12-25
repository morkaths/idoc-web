import z from 'zod';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Users } from '@/features/users';
import { useAuthStore } from '@/stores/auth-store';
import { RoleCode } from '@/types';

const usersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  username: z.string().optional().catch(''),
});

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: usersSearchSchema,
  beforeLoad: () => {
    const { auth } = useAuthStore.getState();
    if (!auth.user || !auth.token) {
      throw redirect({ to: '/sign-in' });
    }
    const allowed = auth.user.roles?.some(
      role =>
        role.code === RoleCode.Staff ||
        role.code === RoleCode.Manager ||
        role.code === RoleCode.Admin
    );
    if (!allowed) {
      throw redirect({ to: '/403' });
    }
  },
  component: Users,
});
