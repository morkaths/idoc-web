'use client';

import Link from 'next/link';
import { useLocale } from '@/hooks/ui/useLocale';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { SignUpForm } from './form';

export function SignUpView() {
  const { t, keys } = useLocale('auth');
  return (
    <Card className='gap-4'>
      <CardHeader>
        <CardTitle className='text-lg tracking-tight'>{t(keys.signUp.title)}</CardTitle>
        <CardDescription>
          {t(keys.signUp.description)} <br />
          {t(keys.signIn.footer)}{' '}
          <Link href='/sign-in' className='hover:text-primary underline underline-offset-4'>
            {t(keys.signIn.submit)}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter>
        <p className='text-muted-foreground px-8 text-center text-sm'>
          {t(keys.signUp.terms)}{' '}
          <Link href='/terms' className='hover:text-primary underline underline-offset-4'>
            {t(keys.signUp.tos)}
          </Link>{' '}
          {t(keys.signUp.and)}{' '}
          <Link href='/privacy' className='hover:text-primary underline underline-offset-4'>
            {t(keys.signUp.privacy)}
          </Link>
          .
        </p>
      </CardFooter>
    </Card>
  );
}
