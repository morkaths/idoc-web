'use client';

import { useState, type HTMLAttributes } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
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

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: KEYS.auth.form.email.validation.emailRequired })
    .email({ message: KEYS.auth.form.email.validation.invalidEmail }),
});

type ForgotPasswordFormProps = HTMLAttributes<HTMLFormElement>;

export function ForgotPasswordForm({ className, ...props }: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { t, keys } = useLocale('auth');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (isLoading) return;
    setIsLoading(true);

    // TODO: Implement actual forgot password API call here
    const promise = new Promise((resolve) => setTimeout(() => resolve(true), 2000));

    return toast.promise(promise, {
      loading: t(keys.form.states.sendResetLink.loading),
      success: () => {
        return t(keys.form.states.sendResetLink.success, { email: data.email });
      },
      error: () => {
        return t(keys.form.states.sendResetLink.error);
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
              name='email'
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t(keys.form.email.label)}</FormLabel>
                  <FormControl>
                    <Input placeholder={t(keys.form.email.placeholder)} {...field} />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message && t(fieldState.error.message)}</FormMessage>
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={isLoading}>
              {isLoading ? <Loader2 className='animate-spin' /> : <Send className='mr-2 h-4 w-4' />}
              {t(keys.forgotPassword.submit)}
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
