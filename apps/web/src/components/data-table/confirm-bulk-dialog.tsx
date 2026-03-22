import { useState } from 'react';
import { type Table } from '@tanstack/react-table';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useLocale } from '@/hooks/ui/useLocale';

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
  confirmWord = 'CONFIRM',
  confirmDesc,
  itemName = 'item',
  action = 'Confirm',
  onConfirm,
}: ConfirmBulkDialogProps<T>) {
  const { t, keys } = useLocale('common');
  const [value, setValue] = useState('');
  const count = table ? table.getFilteredSelectedRowModel().rows.length : (selectedCount ?? 0);
  const entityLabel = count > 1 ? `${itemName}s` : itemName;

  const handleConfirm = async () => {
    if (confirmWord && value.trim() !== confirmWord) {
      toast.error(t(keys.table.typeToConfirm, { word: confirmWord }));
      return;
    }

    try {
      await toast.promise(
        Promise.resolve().then(() => onConfirm()),
        {
          loading: `${action} ${count} ${entityLabel}...`,
          success: () => {
            if (table) table.resetRowSelection();
            onOpenChange(false);
            return t(keys.table.actionSucceeded, {
              action,
              count,
              entity: entityLabel
            });
          },
          error: t(keys.table.actionFailed, { action }),
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
          {t(keys.table.defaultConfirmTitle, { action, count, entity: entityLabel })}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p>
            {confirmDesc || t(keys.table.defaultConfirmDesc, {
              action: action.toLowerCase(),
              entity: entityLabel
            })}
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span>{t(keys.table.confirmByTyping, { word: confirmWord })}</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t(keys.table.typeToConfirm)}
              className='placeholder:text-muted-foreground/50'
            />
          </Label>

          <Alert variant='destructive' className='border-dashed'>
            <AlertTitle>{t(keys.table.warning)}</AlertTitle>
            <AlertDescription>
              {t(keys.table.operationRisk)}
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
