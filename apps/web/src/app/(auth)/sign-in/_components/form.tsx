"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { IconFacebook, IconGmail } from '@/assets/brand-icons';
import { handleGoogleLogin, handleCredentialsLogin } from '@/actions/auth-actions';
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
import { useSession } from "next-auth/react";

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(6, 'Password must be at least 6 characters long'),
});

interface SignInFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string;
}

export function SignInForm({ className, redirectTo, ...props }: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

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
        loading: 'Signing in...',
        success: async (result) => {
          setIsLoading(false);
          if (result.success) {
            await update();
            router.refresh();
            const targetPath = redirectTo || '/?login=success';
            router.replace(targetPath);
            return 'Redirecting...';
          }
          throw new Error(result.error || 'Invalid credentials');
        },
        error: (err) => {
          setIsLoading(false);
          return err?.message || 'Error signing in';
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                href='/forgot-password'
                className='text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Sign in
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>Or continue with</span>
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
                loading: 'Redirecting to Google...',
                success: () => 'Redirecting...',
                error: 'Something went wrong',
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
