'use client';

import { useRouter } from 'next/navigation';
import { useState, HTMLAttributes } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
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

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
});

interface ForgotPasswordFormProps extends HTMLAttributes<HTMLFormElement> {}

export function ForgotPasswordForm({ className, ...props }: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // TODO: Implement actual forgot password API call here
    const promise = new Promise((resolve) => setTimeout(() => resolve(true), 2000));

    toast.promise(promise, {
      loading: 'Sending reset link...',
      success: () => {
        setIsLoading(false);
        return `If an account exists for ${data.email}, you will receive a reset link shortly.`;
      },
      error: (err) => {
        setIsLoading(false);
        return 'Something went wrong. Please try again.';
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
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <Send className='mr-2 h-4 w-4' />}
          Send Reset Link
        </Button>
      </form>
    </Form>
  );
}
