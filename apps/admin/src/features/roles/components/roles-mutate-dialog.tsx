'use client';

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
import { type RoleResponse, type PermissionResponse, RoleRequest, RoleRequestSchema } from '@/types';
import { PermissionsCombobox } from './permissions-combobox';

type RolesMutateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<RoleResponse>;
  onSubmit: (data: RoleRequest) => void;
  permissions: PermissionResponse[];
};

export function RolesMutateDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  permissions,
}: RolesMutateDialogProps) {
  const form = useForm<RoleRequest>({
    resolver: zodResolver(RoleRequestSchema),
    defaultValues: {
      code: initialData?.code ?? '',
      name: initialData?.name ?? '',
      permissions: initialData?.permissions?.map((p) => String(p.id)) ?? [],
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg max-h-[90vh] overflow-y-auto'>
        <DialogHeader className='text-start'>
          <DialogTitle>{initialData?.id ? 'Edit Role' : 'Add Role'}</DialogTitle>
          <DialogDescription>
            {initialData?.id
              ? 'Update the role information below.'
              : 'Enter the information for the new role.'}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='role-form'
            onSubmit={form.handleSubmit((data) => {
              onSubmit({
                ...data,
                id: initialData?.id,
              });
              onOpenChange(false);
              form.reset();
            })}
            className='space-y-4 px-0.5'
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <div className="grid gap-3">
                  <FormLabel htmlFor="code">Code</FormLabel>
                  <FormControl>
                    <Input id="code" placeholder="e.g., admin" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <div className="grid gap-3">
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input id="name" placeholder="e.g., Administrator" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <div className="grid gap-3">
                  <FormLabel htmlFor="permissions">Permissions</FormLabel>
                  <PermissionsCombobox
                    permissions={permissions}
                    value={field.value || []}
                    onChange={field.onChange}
                  />
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