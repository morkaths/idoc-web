'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RoleType } from '@/types';
import { Send } from 'lucide-react';
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
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { Textarea } from '@repo/ui/components/textarea';

const formSchema = z.object({
  email: z.string().email({ message: 'Email is required.' }),
  role: z.nativeEnum(RoleType),
  desc: z.string().optional(),
});

type UserInviteForm = z.infer<typeof formSchema>;

type UserInviteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: UserInviteForm) => void;
};

export function UsersInviteDialog({ open, onOpenChange, onSubmit }: UserInviteDialogProps) {
  const form = useForm<UserInviteForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', role: RoleType.USER, desc: '' },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Invite new user to join your team by sending them an email invitation. Assign a role to
            define their access level.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='user-invite-form'
            onSubmit={form.handleSubmit((data) => {
              onSubmit?.({
                ...data,
                email: data.email,
                role: data.role,
                desc: data.desc,
              });
              onOpenChange(false);
              form.reset();
            })}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='eg: john.doe@gmail.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
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
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='desc'
              render={({ field }) => (
                <FormItem className=''>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className='resize-none'
                      placeholder='Add a personal note to your invitation (optional)'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='gap-y-2'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button type='submit' form='user-invite-form'>
            Invite <Send />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
