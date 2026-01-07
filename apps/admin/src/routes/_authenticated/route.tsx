import { createFileRoute, redirect } from '@tanstack/react-router';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';
import { RoleCode } from '@/types';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
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
      toast.error('You do not have access to the admin page!');
      await auth.logout();
      throw redirect({ to: '/sign-in' });
    }
  },
  component: AuthenticatedLayout,
});
