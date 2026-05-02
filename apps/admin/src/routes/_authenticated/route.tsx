import { createFileRoute, redirect } from '@tanstack/react-router';
import { RoleType } from '@/types';
import { toast } from 'sonner';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const { auth } = context;
    if (!auth.user || !auth.token) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.pathname,
        },
      });
    }
    const isAllowed = auth.user.role === RoleType.ADMIN || auth.user.role === RoleType.STAFF;
    if (!isAllowed) {
      toast.error('You do not have access to the admin page!');
      await auth.logout();
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.pathname,
        },
      });
    }
  },
  component: AuthenticatedLayout,
});
