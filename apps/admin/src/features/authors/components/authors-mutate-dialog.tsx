import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthorRequestSchema, type AuthorResponse, type AuthorRequest } from '@/types';
import { toast } from 'sonner';
import { handleServerError } from '@/lib/handle-server-error';
import { useUploadImage } from '@/hooks/data/useImage';
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
import { Textarea } from '@repo/ui/components/textarea';
import { DatePicker } from '@/components/form/date-picker';
import { ImageUpload } from '@/components/form/image-upload';
import { LanguageSelect } from './language-select';

type AuthorsMutateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<AuthorResponse>;
  onSubmit: (data: AuthorRequest & { id?: string }) => Promise<void>;
};

export function AuthorsMutateDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: AuthorsMutateDialogProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const uploadImage = useUploadImage();
  const form = useForm<AuthorRequest>({
    resolver: zodResolver(AuthorRequestSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      avatar: initialData?.avatar ?? '',
      dob: initialData?.dob ? new Date(initialData.dob) : undefined,
      nationality: initialData?.nationality ?? '',
      bio: initialData?.bio ?? '',
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>{initialData?.id ? 'Edit Author' : 'Add Author'}</DialogTitle>
          <DialogDescription>
            {initialData?.id
              ? 'Update the author information below.'
              : 'Enter the information for the new author.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              if (isSubmitting) return;
              setIsSubmitting(true);

              let avatar = data.avatar || '';
              try {
                if (avatarFile) {
                  toast.loading('Uploading avatar...', { id: 'upload-image' });
                  try {
                    const uploadResult = await uploadImage.mutateAsync({
                      file: avatarFile,
                      folder: 'authors',
                    });
                    avatar = uploadResult.data || '';
                    toast.success('Avatar uploaded!', { id: 'upload-image' });
                  } catch (error) {
                    handleServerError(error, {
                      toastId: 'upload-image',
                      fallback: 'Failed to upload avatar',
                    });
                    throw error;
                  }
                }

                let dob: Date | undefined = undefined;
                if (data.dob instanceof Date) {
                  dob = data.dob;
                } else if (typeof data.dob === 'string' || typeof data.dob === 'number') {
                  const d = new Date(data.dob);
                  dob = isNaN(d.getTime()) ? undefined : d;
                }

                const { avatar: _unused, ...rest } = data;
                const payload = {
                  ...rest,
                  avatar,
                  dob,
                };

                await onSubmit({
                  ...payload,
                  id: initialData?.id,
                });
                onOpenChange(false);
                form.reset();
                setAvatarFile(null);
              } catch (error) {
                if (error instanceof Error && error.message !== 'upload-image') {
                  handleServerError(error);
                }
              } finally {
                setIsSubmitting(false);
              }
            })}
          >
            <fieldset disabled={isSubmitting} className='space-y-4'>
              <div className='mb-3 grid grid-cols-1 md:grid-cols-3'>
                <FormField
                  control={form.control}
                  name='avatar'
                  render={({ field }) => (
                    <div className='flex flex-col items-center justify-start md:row-span-3'>
                      <FormLabel className='mb-3'>Avatar</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={(file, previewUrl) => {
                            setAvatarFile(file);
                            field.onChange(previewUrl || '');
                          }}
                          label='Upload avatar'
                          maxSizeMB={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  )}
                />

                <div className='grid grid-cols-1 gap-3 md:col-span-2'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <div className='grid gap-3'>
                        <FormLabel htmlFor='name'>Name</FormLabel>
                        <FormControl>
                          <Input id='name' {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='dob'
                    render={({ field }) => (
                      <div className='grid gap-3'>
                        <FormLabel htmlFor='dob'>Birth Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={field.onChange}
                            placeholder='Pick a date'
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='nationality'
                    render={({ field }) => (
                      <div className='grid gap-3'>
                        <FormLabel htmlFor='nationality'>Nationality</FormLabel>
                        <FormControl>
                          <LanguageSelect
                            id='nationality'
                            value={field.value || ''}
                            onChange={field.onChange}
                            name={field.name}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <div className='mb-3 grid gap-3'>
                    <FormLabel htmlFor='bio'>Bio</FormLabel>
                    <FormControl>
                      <Textarea id='bio' {...field} rows={3} />
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
