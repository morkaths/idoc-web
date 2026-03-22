import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MailPlus, Send } from 'lucide-react';
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
import { Textarea } from '@repo/ui/components/textarea';
import { type Role } from '@/types';
import { RolesCombobox } from './roles-combobox';

const formSchema = z.object({
  email: z.string().email({ message: 'Email is required.' }),
  roles: z.array(z.string()).min(1, 'Select at least one role'),
  desc: z.string().optional(),
});

type UserInviteForm = z.infer<typeof formSchema>;

type UserInviteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: UserInviteForm) => void;
  roles: Role[];
};

export function UsersInviteDialog({
  open,
  onOpenChange,
  onSubmit,
  roles
}: UserInviteDialogProps) {
  const form = useForm<UserInviteForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', roles: [], desc: '' },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle className='flex items-center gap-2'>
            <MailPlus /> Invite User
          </DialogTitle>
          <DialogDescription>
            Invite new user to join your team by sending them an email invitation. Assign a role to
            define their access level.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='user-invite-form'
            onSubmit={form.handleSubmit(data => {
              onSubmit?.({
                ...data,
                email: data.email,
                roles: data.roles,
                desc: data.desc,
              });
              onOpenChange(false);
              form.reset();
            })} className='space-y-4'>
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
              name='roles'
              render={({ field }) => (
                <FormItem>
                  <RolesCombobox
                    roles={roles}
                    value={field.value || []}
                    onChange={field.onChange}
                  />
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
