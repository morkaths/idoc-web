'use client';

import React from 'react';
import { FileIcon } from 'lucide-react';

interface FilePreviewProps {
  file: File;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  const isImage = file.type.startsWith('image/');
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isImage) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isImage]);

  return (
    <div className='border-border/80 bg-muted/50 flex max-w-[200px] items-center gap-2 rounded-md border p-2 text-xs select-none'>
      {isImage && previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt={file.name}
          className='h-8 w-8 shrink-0 rounded-md object-cover'
        />
      ) : (
        <FileIcon className='text-primary h-8 w-8 shrink-0' />
      )}
      <div className='overflow-hidden'>
        <p className='text-foreground truncate font-medium'>{file.name}</p>
        <p className='text-muted-foreground text-[10px]'>{(file.size / 1024).toFixed(1)} KB</p>
      </div>
    </div>
  );
};

export default FilePreview;
