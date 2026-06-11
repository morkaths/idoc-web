import { Upload } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { useStorageContext } from './storage-provider';

export function StoragePrimaryButtons() {
  const { setOpen } = useStorageContext();
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('upload')}>
        <span>Upload Files</span> <Upload size={18} />
      </Button>
    </div>
  );
}

export default StoragePrimaryButtons;
