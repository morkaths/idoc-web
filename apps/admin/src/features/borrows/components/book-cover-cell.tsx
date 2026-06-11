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
      <div className='bg-muted/20 text-muted-foreground flex h-10 w-7 flex-shrink-0 items-center justify-center rounded-md border'>
        <ImageOff className='h-4 w-4 opacity-50' />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className='h-10 w-7 flex-shrink-0 rounded border object-cover'
      loading='lazy'
      onError={() => setError(true)}
    />
  );
};
