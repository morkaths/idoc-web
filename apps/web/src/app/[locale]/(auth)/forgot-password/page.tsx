import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { ForgotPasswordForm } from './_components/form';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Recover your iDoc account password',
};

export default function ForgotPasswordPage() {
  return (
    <Card className='gap-4'>
      <CardHeader>
        <CardTitle className='text-lg tracking-tight'>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we will send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
      <CardFooter className='flex flex-col gap-2'>
        <p className='text-muted-foreground text-center text-sm'>
          Remember your password?{' '}
          <Link
            href='/sign-in'
            className='hover:text-primary font-medium underline underline-offset-4'
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
