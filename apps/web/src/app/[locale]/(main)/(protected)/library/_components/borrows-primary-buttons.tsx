'use client';

import { Plus, Download } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { useBorrowsContext } from './borrows-provider';
import { useLocale } from '@/hooks/ui/useLocale';

export function BorrowsPrimaryButtons() {
  const { setOpen } = useBorrowsContext();
  const { t, keys } = useLocale('library');

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{t(keys.table.actions.mutate.create.submit)}</span> <Plus size={18} />
      </Button>
      <Button variant='outline' className='space-x-1' onClick={() => setOpen('export')}>
        <span>{t(keys.table.bulkActions.export.label)}</span> <Download size={18} />
      </Button>
    </div>
  );
}
