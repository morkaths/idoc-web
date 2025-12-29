import { useState } from 'react';
import { type Table } from '@tanstack/react-table';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { ConfirmDialog } from '@/components/confirm-dialog';

type ConfirmBulkDialogProps<T> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table?: Table<T>;
  selectedCount?: number;
  confirmWord?: string;
  confirmDesc?: string;
  itemName?: string;
  onConfirm: () => Promise<void> | void;
  action?: string;
};

export function ConfirmBulkDialog<T>({
  open,
  onOpenChange,
  table,
  selectedCount,
  confirmWord = 'DELETE',
  confirmDesc,
  itemName = 'item',
  action = 'Delete',
  onConfirm,
}: ConfirmBulkDialogProps<T>) {
  const [value, setValue] = useState('');
  const count = table ? table.getFilteredSelectedRowModel().rows.length : (selectedCount ?? 0);

  const handleConfirm = async () => {
    if (confirmWord && value.trim() !== confirmWord) {
      toast.error(`Please type "${confirmWord}" to confirm.`);
      return;
    }

    try {
      await toast.promise(
        Promise.resolve().then(() => onConfirm()),
        {
          loading: `${action} ${count} ${count > 1 ? `${itemName}s` : itemName}...`,
          success: () => {
            if (table) table.resetRowSelection();
            onOpenChange(false);
            return `${action} ${count} ${count > 1 ? `${itemName}s` : itemName} successfully!`;
          },
          error: `${action} failed!`,
        }
      );
    } finally {
      setValue('');
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleConfirm}
      disabled={confirmWord ? value.trim() !== confirmWord : false}
      title={
        <span className='text-destructive'>
          {action} {count} {count > 1 ? `${itemName}s` : itemName}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p>
            {confirmDesc || `Are you sure you want to ${action.toLowerCase()} the selected ${itemName}${
              count > 1 ? 's' : ''
            }?`}
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span>Confirm by typing &quot;{confirmWord}&quot;:</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${confirmWord}" to confirm.`}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={action}
      destructive
    />
  );
}

export default ConfirmBulkDialog;
