'use client';

import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@repo/ui/components/dialog';
import { Input } from '@repo/ui/components/input';

interface RenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleValue: string;
  onChangeTitle: (value: string) => void;
  onSave: () => void;
}

export const RenameDialog = ({
  open,
  onOpenChange,
  titleValue,
  onChangeTitle,
  onSave,
}: RenameDialogProps) => {
  const { t, keys } = useLocale('chatbot');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle className='text-sm font-semibold'>{t(keys.sidebar.renameTitle)}</DialogTitle>
        </DialogHeader>
        <div className='py-3'>
          <Input
            type='text'
            value={titleValue}
            onChange={(e) => onChangeTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSave();
            }}
            className='w-full text-xs'
            autoFocus
          />
        </div>
        <DialogFooter className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)} className='h-8 text-xs'>
            {t(keys.sidebar.cancel)}
          </Button>
          <Button onClick={onSave} className='h-8 text-xs'>
            {t(keys.sidebar.save)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
