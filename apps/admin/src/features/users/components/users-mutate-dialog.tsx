'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type UserRequest,
  UserRequestSchema,
  UserStatus,
  RoleType,
  type UserResponse,
} from '@/types';
import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/dialog';
import { Form, FormControl, FormField, FormLabel, FormMessage } from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { PasswordInput } from '@/components/password-input';

const UserFormSchema = UserRequestSchema.extend({
  password: z.string().optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
})
  .refine((data) => !data.password || data.password.length >= 6, {
    message: 'Password must be at least 6 characters long.',
    path: ['password'],
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

type UserForm = z.infer<typeof UserFormSchema>;

type UsersMutateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<UserResponse>;
  onSubmit: (data: UserRequest, id?: string) => void;
};

export function UsersMutateDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: UsersMutateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<UserForm>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      username: initialData?.username ?? '',
      email: initialData?.email ?? '',
      status: (initialData?.status as UserStatus) ?? UserStatus.ACTIVE,
      role: (initialData?.role as RoleType) ?? RoleType.USER,
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{initialData?.id ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogDescription>
            {initialData?.id
              ? 'Update the user information below.'
              : 'Enter the information for the new user.'}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='user-form'
            onSubmit={form.handleSubmit(async (data) => {
              if (isSubmitting) return;
              setIsSubmitting(true);
              const { confirmPassword, ...rest } = data;
              const payload: UserRequest = {
                ...rest,
              };

              if (!payload.password) {
                delete payload.password;
              }

              try {
                await onSubmit(payload, initialData?.id);
                onOpenChange(false);
                form.reset();
              } finally {
                setIsSubmitting(false);
              }
            })}
            className='space-y-4 px-0.5'
          >
            <fieldset disabled={isSubmitting} className='space-y-4'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <div className='grid gap-3'>
                    <FormLabel htmlFor='username'>Username</FormLabel>
                    <FormControl>
                      <Input id='username' placeholder='john_doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <div className='grid gap-3'>
                    <FormLabel htmlFor='email'>Email</FormLabel>
                    <FormControl>
                      <Input id='email' placeholder='john.doe@gmail.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <div className='grid gap-3'>
                    <FormLabel htmlFor='status'>Status</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value?.toString() ?? ''}
                      defaultValue={field.value?.toString() ?? ''}
                    >
                      <FormControl>
                        <SelectTrigger id='status' className='w-full'>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserStatus.ACTIVE.toString()}>Active</SelectItem>
                        <SelectItem value={UserStatus.INACTIVE.toString()}>Inactive</SelectItem>
                        <SelectItem value={UserStatus.BANNED.toString()}>Banned</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <div className='grid gap-3'>
                    <FormLabel htmlFor='role'>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger id='role' className='w-full'>
                          <SelectValue placeholder='Select role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={RoleType.ADMIN}>{RoleType.ADMIN}</SelectItem>
                        <SelectItem value={RoleType.USER}>{RoleType.USER}</SelectItem>
                        <SelectItem value={RoleType.STAFF}>{RoleType.STAFF}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <div className='grid gap-3'>
                    <FormLabel htmlFor='password'>Password</FormLabel>
                    <FormControl>
                      <PasswordInput id='password' placeholder='e.g., S3cur3P@ssw0rd' {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <div className='grid gap-3'>
                    <FormLabel htmlFor='confirmPassword'>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        id='confirmPassword'
                        placeholder='e.g., S3cur3P@ssw0rd'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='outline' type='button'>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : initialData?.id ? 'Save changes' : 'Create'}
                </Button>
              </DialogFooter>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
