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
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';

const formSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: 'Please upload a file',
    })
    .refine((files) => ['text/csv'].includes(files?.[0]?.type ?? ''), 'Please upload csv format.'),
});

type ImportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onImport?: (file: File) => void;
};

export function ImportDialog({
  open,
  onOpenChange,
  title = 'Import Data',
  description = 'Import data quickly from a CSV file.',
  onImport,
}: ImportDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { file: undefined },
  });

  const fileRef = form.register('file');

  const onSubmit = () => {
    const file = form.getValues('file');
    if (file && file[0]) {
      onImport?.(file[0]);
    }
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        form.reset();
      }}
    >
      <DialogContent className='gap-2 sm:max-w-sm'>
        <DialogHeader className='text-start'>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='import-form' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='file'
              render={() => (
                <FormItem className='my-2'>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input type='file' {...fileRef} className='h-8 py-0' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button variant='outline'>Close</Button>
          </DialogClose>
          <Button type='submit' form='import-form'>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
