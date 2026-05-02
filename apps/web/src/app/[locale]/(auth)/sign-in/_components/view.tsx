'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocale } from '@/hooks/ui/useLocale';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { SignInForm } from './form';

export function SignInView() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || undefined;
  const { t, keys } = useLocale('auth');

  return (
    <Card className='gap-4'>
      <CardHeader>
        <CardTitle className='text-lg tracking-tight'>{t(keys.signIn.title)}</CardTitle>
        <CardDescription>{t(keys.signIn.description)}</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm redirectTo={redirect} />
      </CardContent>
      <CardFooter className='flex flex-col gap-2'>
        <p className='text-muted-foreground text-center text-sm'>
          {t(keys.signIn.footer)}{' '}
          <Link
            href='/sign-up'
            className='hover:text-primary font-medium underline underline-offset-4'
          >
            {t(keys.signUp.submit)}
          </Link>
        </p>
        <p className='text-muted-foreground px-8 text-center text-sm'>
          {t(keys.signIn.terms)}{' '}
          <Link href='/terms' className='hover:text-primary underline underline-offset-4'>
            {t(keys.signIn.tos)}
          </Link>{' '}
          {t(keys.signIn.and)}{' '}
          <Link href='/privacy' className='hover:text-primary underline underline-offset-4'>
            {t(keys.signIn.privacy)}
          </Link>
          .
        </p>
      </CardFooter>
    </Card>
  );
}
