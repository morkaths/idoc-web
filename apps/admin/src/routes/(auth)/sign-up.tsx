import { createFileRoute, redirect } from '@tanstack/react-router';
import { SignUp } from '@/features/auth/sign-up';
import { RoleType } from '@/types';

export const Route = createFileRoute('/(auth)/sign-up')({
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
  component: SignUp,
});
