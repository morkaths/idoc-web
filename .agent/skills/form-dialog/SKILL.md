---
name: Form Dialog Pattern
description: How to create React Hook Form + Zod validated dialogs for create/edit operations
---

# Form Dialog Pattern

This skill covers implementing mutate (create/edit) dialogs using React Hook Form, Zod validation, and Radix UI Dialog, following the pattern in `apps/admin/src/features/*/components/*-mutate-dialog.tsx`.

## Dependencies

- `react-hook-form` — Form state management
- `@hookform/resolvers/zod` — Zod schema resolver
- `zod` — Schema validation
- `@repo/ui/components/dialog` — Radix UI dialog primitives
- `@repo/ui/components/form` — Form, FormField, FormControl, FormLabel, FormMessage
- `sonner` — Toast notifications

## Template

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Entity, EntityRequest } from '@/types';
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
import { Input } from '@repo/ui/components/input';
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form';
import { toast } from 'sonner';

// ─── SCHEMA ─────────────────────────────────────────────────────────────────────

const EntityFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  // Add more fields...
});

type EntityFormValues = z.infer<typeof EntityFormSchema>;

// ─── PROPS ──────────────────────────────────────────────────────────────────────

type EntityMutateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<Entity>;
  onSubmit: (data: EntityRequest) => void;
};

// ─── COMPONENT ──────────────────────────────────────────────────────────────────

export function EntityMutateDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: EntityMutateDialogProps) {
  const isEditing = !!initialData?.id;

  const form = useForm<EntityFormValues>({
    resolver: zodResolver(EntityFormSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
    },
  });

  const handleFormSubmit = async (data: EntityFormValues) => {
    try {
      onSubmit({
        ...data,
        id: initialData?.id,
      });
      onOpenChange(false);
      form.reset();
    } catch {
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Entity' : 'Add Entity'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the entity information below.'
              : 'Enter the information for the new entity.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div className='grid gap-4 py-4'>
              {/* Standard text field */}
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

              {/* Add more FormFields here... */}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline' type='button'>
                  Cancel
                </Button>
              </DialogClose>
              <Button type='submit'>
                {isEditing ? 'Save changes' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

## Key Conventions

### Form Structure

1. **Schema first**: Define Zod schema at the top of the file
2. **Type inference**: Use `z.infer<typeof Schema>` for form values type
3. **defaultValues**: Always provide defaults, using `initialData?.field ?? ''` pattern
4. **Reset on close**: Call `form.reset()` after successful submit

### Field Pattern

Each form field follows this structure:

```tsx
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <div className="grid gap-3">
      <FormLabel htmlFor="fieldName">Label</FormLabel>
      <FormControl>
        <Input id="fieldName" {...field} />
      </FormControl>
      <FormMessage />
    </div>
  )}
/>
```

### File Upload Pattern

For forms with file uploads, handle them in the submit handler:

```typescript
const handleFormSubmit = async (data: EntityFormValues) => {
  try {
    if (imageFile) {
      toast.loading("Uploading image...", { id: "upload" });
      const url = await uploadImage.mutateAsync({
        file: imageFile,
        folder: "entities",
      });
      data.imageUrl = url;
      toast.success("Image uploaded!", { id: "upload" });
    }
    onSubmit(data);
  } catch {
    toast.error("Upload failed!", { id: "upload" });
  }
};
```

### Toast Notifications

- Use `toast.loading()` with an ID for upload progress
- Use `toast.success()` / `toast.error()` with the same ID to replace loading toast
- User-facing messages in **Vietnamese** for error cases

### Grid Layouts

- Single column: `grid gap-3`
- Two columns: `grid grid-cols-1 md:grid-cols-2 gap-3`
- Three columns: `grid grid-cols-1 md:grid-cols-3 gap-3`
- Four columns with sidebar: `grid grid-cols-1 md:grid-cols-4 gap-3`
