import { createFileRoute, redirect } from '@tanstack/react-router';
import { RoleType } from '@/types';
import { toast } from 'sonner';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { UserApi } from '@/apis/user.api';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const { auth } = context;

    if (!auth.token) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.pathname,
        },
      });
    }

    try {
      const response = await UserApi.me();
      const user = response.data;

      if (!user) {
        throw new Error('User data is missing');
      }

      auth.setUser(user);

      const isAllowed = user.role === RoleType.ADMIN || user.role === RoleType.STAFF;
      if (!isAllowed) {
        toast.error('You do not have access to the admin page!');
        throw redirect({
          to: '/sign-in',
          search: {
            redirect: location.pathname,
          },
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'NavigationError') {
        throw error;
      }

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
