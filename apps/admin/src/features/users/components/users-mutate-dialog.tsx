'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { PasswordInput } from '@/components/password-input';
import { type Role, type User } from '@/types';
import { RolesCombobox } from './roles-combobox';

const UserFormSchema = z
  .object({
    username: z.string().min(1, 'Username is required.'),
    email: z.string().min(1, 'Email is required.').email('Invalid email address.'),
    roles: z.array(z.string()).min(1, 'Select at least one role'),
    password: z.string().optional().or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => !data.password || data.password.length >= 6,
    { message: 'Password must be at least 6 characters long.', path: ['password'] }
  )
  .refine(
    (data) => !data.password || data.password === data.confirmPassword,
    { message: "Passwords don't match.", path: ['confirmPassword'] }
  );

type UserForm = z.infer<typeof UserFormSchema>;

type UsersMutateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<User>;
  onSubmit: (data: Partial<User>) => void;
  roles: Role[];
};

export function UsersMutateDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  roles,
}: UsersMutateDialogProps) {
  const form = useForm<UserForm>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      username: initialData?.username ?? '',
      email: initialData?.email ?? '',
      roles: initialData?.roles?.map((role) => String(role.id)) ?? [],
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{initialData?.id ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogDescription>
            {initialData?.id
              ? 'Update the user information below.'
              : 'Enter the information for the new user.'
            }
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='user-form'
            onSubmit={form.handleSubmit((data) => {
              onSubmit({
                ...initialData,
                username: data.username,
                email: data.email,
                roleIds: data.roles,
                ...(data.password ? { password: data.password } : {}),
              });
              onOpenChange(false);
              form.reset();
            })}
            className='space-y-4 px-0.5'
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <div className="grid gap-3">
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <FormControl>
                    <Input id="username" placeholder="john_doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <div className="grid gap-3">
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input id="email" placeholder="john.doe@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <div className="grid gap-3">
                  <FormLabel htmlFor="roles">Roles</FormLabel>
                  <RolesCombobox
                    roles={roles.map(r => ({ ...r, id: String(r.id) }))}
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <div className="grid gap-3">
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <PasswordInput id="password" placeholder="e.g., S3cur3P@ssw0rd" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <div className="grid gap-3">
                  <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput id="confirmPassword" placeholder="e.g., S3cur3P@ssw0rd" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type='submit'>
                {initialData?.id ? "Save changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
