"use client";

import { useState } from 'react';
import { useSession } from "next-auth/react";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { IconFacebook, IconGmail } from '@/assets/brand-icons';
import { handleGoogleLogin, handleCredentialsLogin } from '@/actions/auth';
import { cn } from '@/lib/utils';
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
import { useLocale, KEYS } from '@/hooks/ui/useLocale';

const formSchema = z.object({
  email: z.string()
    .min(1, { message: KEYS.auth.form.email.validation.emailRequired })
    .email({ message: KEYS.auth.form.email.validation.invalidEmail }),
  password: z
    .string()
    .min(1, { message: KEYS.auth.form.password.validation.passwordRequired })
    .min(6, { message: KEYS.auth.form.password.validation.passwordMin }),
});

interface SignInFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string;
}

export function SignInForm({ className, redirectTo, ...props }: SignInFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { update } = useSession();
  const { t, keys } = useLocale('auth');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    toast.promise(
      handleCredentialsLogin(formData),
      {
        loading: t(keys.form.states.signIn.loading),
        success: async (result) => {
          setIsLoading(false);
          if (result.success) {
            await update();
            router.refresh();
            const targetPath = redirectTo || '/?login=success';
            router.replace(targetPath);
            return t(keys.form.states.signIn.success);
          }
          throw new Error(result.error || t(keys.form.states.signIn.error));
        },
        error: (err) => {
          setIsLoading(false);
          return err?.message;
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{t(keys.form.email.label)}</FormLabel>
              <FormControl>
                <Input placeholder={t(keys.form.email.placeholder)} {...field} />
              </FormControl>
              <FormMessage>
                {fieldState.error?.message && t(fieldState.error.message)}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field, fieldState }) => (
            <FormItem className='relative'>
              <FormLabel>{t(keys.form.password.label)}</FormLabel>
              <FormControl>
                <PasswordInput placeholder={t(keys.form.password.placeholder)} {...field} />
              </FormControl>
              <FormMessage>
                {fieldState.error?.message && t(fieldState.error.message)}
              </FormMessage>
              <Link
                href='/forgot-password'
                className='text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75'
              >
                {t(keys.forgotPassword.title)}
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          {t(keys.signIn.submit)}
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
            <IconGmail className='h-4 w-4 mr-2' /> Google
          </Button>
          <Button
            variant='outline'
            type='button'
            disabled={isLoading}
          >
            <IconFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  );
}
