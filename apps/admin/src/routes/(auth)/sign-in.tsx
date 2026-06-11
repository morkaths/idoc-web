import { z } from 'zod';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { RoleType } from '@/types';
import { SignIn } from '@/features/auth/sign-in';

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute('/(auth)/sign-in')({
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
  component: SignIn,
  validateSearch: searchSchema,
});
