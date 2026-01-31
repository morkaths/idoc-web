import { Plus } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { useBorrowsContext } from './borrows-provider';

export function BorrowsPrimaryButtons() {
  const { setOpen } = useBorrowsContext();
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>Create</span> <Plus size={18} />
      </Button>
    </div>
  );
}