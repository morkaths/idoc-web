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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { Input } from '@repo/ui/components/input';
import { PasswordInput } from '@/components/password-input';
import { type UserRequest, UserRequestSchema, UserStatus, type RoleResponse, type UserResponse } from '@/types';
import { RolesCombobox } from './roles-combobox';

const UserFormSchema = UserRequestSchema.extend({
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
  initialData?: Partial<UserResponse>;
  onSubmit: (data: UserRequest) => void;
  roles: RoleResponse[];
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
      status: initialData?.status ?? UserStatus.Active,
      roles: initialData?.roles?.map((role) => String(role.id)) ?? [],
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg max-h-[90vh] overflow-y-auto'>
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
              const { confirmPassword, ...rest } = data;
              const payload: UserRequest = {
                ...rest,
                id: initialData?.id,
              };

              if (!payload.password) {
                delete payload.password;
              }

              onSubmit(payload);
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
              name="status"
              render={({ field }) => (
                <div className="grid gap-3">
                  <FormLabel htmlFor="status">Status</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value?.toString() ?? ''}
                    defaultValue={field.value?.toString() ?? ''}
                  >
                    <FormControl>
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserStatus.Active.toString()}>Active</SelectItem>
                      <SelectItem value={UserStatus.Inactive.toString()}>Inactive</SelectItem>
                      <SelectItem value={UserStatus.Banned.toString()}>Banned</SelectItem>
                    </SelectContent>
                  </Select>
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
                    roles={roles.map(r => ({
                      id: String(r.id),
                      code: r.code ?? '',
                      name: r.name ?? ''
                    }))}
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
