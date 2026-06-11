import { useState } from 'react';
import { ImageOff } from 'lucide-react';

type BookCoverCellProps = {
  src?: string;
  title: string;
};

export const BookCoverCell = ({ src, title }: BookCoverCellProps) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className='bg-muted/20 text-muted-foreground flex h-15 w-10 items-center justify-center rounded-md border'>
        <ImageOff className='h-4 w-4 opacity-50' />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className='h-15 w-10 rounded border object-cover'
      style={{ borderRadius: 'var(--radius-img)' }}
      loading='lazy'
      onError={() => setError(true)}
    />
  );
};
