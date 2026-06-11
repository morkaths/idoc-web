import { createFileRoute, redirect } from '@tanstack/react-router';
import { RoleType } from '@/types';
import { ForgotPassword } from '@/features/auth/forgot-password';

export const Route = createFileRoute('/(auth)/forgot-password')({
  beforeLoad: ({ context }) => {
    const { auth } = context;
    if (auth.user && auth.token) {
      const isAllowed = auth.user.role === RoleType.ADMIN || auth.user.role === RoleType.STAFF;
      if (isAllowed) {
        throw redirect({
          to: '/',
        });
      }
    }
  },
  component: ForgotPassword,
});
