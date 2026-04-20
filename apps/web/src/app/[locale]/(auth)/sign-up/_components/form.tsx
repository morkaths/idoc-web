'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleRegister, handleGoogleLogin } from '@/actions/auth';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { IconFacebook, IconGmail } from '@/assets/brand-icons';
import { useLocale, KEYS } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { PasswordInput } from '@/components/password-input';

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: KEYS.auth.form.email.validation.emailRequired })
      .email({ message: KEYS.auth.form.email.validation.invalidEmail }),
    username: z
      .string()
      .min(1, { message: KEYS.auth.form.username.validation.usernameRequired })
      .min(3, { message: KEYS.auth.form.username.validation.usernameLength }),
    password: z
      .string()
      .min(1, { message: KEYS.auth.form.password.validation.passwordRequired })
      .min(7, { message: KEYS.auth.form.password.validation.passwordMin }),
    confirmPassword: z
      .string()
      .min(1, { message: KEYS.auth.form.confirmPassword.validation.passwordRequired }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: KEYS.auth.form.confirmPassword.validation.passwordsNotMatch,
    path: ['confirmPassword'],
  });

export function SignUpForm({ className, ...props }: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t, tCommon, keys } = useLocale('auth');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (isLoading) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('username', data.username);
    formData.append('password', data.password);

    return toast.promise(handleRegister(formData), {
      loading: t(keys.form.states.signUp.loading),
      success: (result) => {
        if (result.success) {
          router.replace('/sign-in');
          return t(keys.form.states.signUp.success);
        }
        throw new Error(result.error || t(keys.form.states.signUp.error));
      },
      error: (err) => {
        return err.message;
      },
      finally: () => {
        setIsLoading(false);
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <fieldset disabled={isLoading} className='contents'>
          <div className='grid gap-3'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(keys.form.username.label)}</FormLabel>
                  <FormControl>
                    <Input placeholder={t(keys.form.username.placeholder)} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(keys.form.email.label)}</FormLabel>
                  <FormControl>
                    <Input placeholder={t(keys.form.email.placeholder)} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(keys.form.password.label)}</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder={t(keys.form.password.placeholder)} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(keys.form.confirmPassword.label)}</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder={t(keys.form.confirmPassword.placeholder)} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={isLoading}>
              {t(keys.signUp.submit)}
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background text-muted-foreground px-2'>{t(keys.signIn.or)}</span>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-2'>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                disabled={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  toast.promise(handleGoogleLogin(), {
                    loading: t(keys.form.states.googleSignIn.loading),
                    success: () => t(keys.form.states.googleSignIn.success),
                    error: (err) => err.message || t(keys.form.states.googleSignIn.error),
                  });
                }}
              >
                <IconGmail className='h-4 w-4' /> Google
              </Button>
              <Button variant='outline' className='w-full' type='button' disabled={isLoading}>
                <IconFacebook className='h-4 w-4' /> Facebook
              </Button>
            </div>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
