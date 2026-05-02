'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { FileResponse } from '@/types';
import { FileArchive, FileCode, FilePlay, FileText, Sheet, Trash2, Loader2 } from 'lucide-react';
import { FileApi } from '@/apis/file.api';

export function FileItem({
  file,
  progress = 100,
  onDelete,
}: {
  file: FileResponse | File;
  progress?: number;
  onDelete?: () => void;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [localUrl, setLocalUrl] = useState<string | null>(null);

  const isLocal = file instanceof File;
  const name = isLocal ? file.name : file.fileName;
  const size = file.size;
  const contentType = isLocal ? file.type : file.contentType;

  useEffect(() => {
    if (isLocal) {
      const url = URL.createObjectURL(file);
      setLocalUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isLocal]);

  const handleAction = useCallback(async () => {
    if (isDownloading) return;

    try {
      if (isLocal) {
        if (localUrl) window.open(localUrl, '_blank');
        return;
      }

      setIsDownloading(true);
      const blob = await FileApi.download(file.id);
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  }, [file, isDownloading, isLocal, localUrl]);

  const renderIcon = useMemo(() => {
    if (isDownloading) return <Loader2 className="h-4 w-4 animate-spin text-primary" />;

    const iconProps = { className: 'h-4 w-4' };
    const mime = contentType.toLowerCase();

    if (mime === 'application/pdf') return <FileText {...iconProps} className={`${iconProps.className} text-red-500`} />;
    if (mime.includes('sheet') || mime.includes('excel') || mime.includes('csv'))
      return <Sheet {...iconProps} className={`${iconProps.className} text-green-500`} />;
    if (mime.includes('zip') || mime.includes('rar') || mime.includes('compressed'))
      return <FileArchive {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
    if (mime.startsWith('image/') || mime.startsWith('video/') || mime.startsWith('audio/'))
      return <FilePlay {...iconProps} className={`${iconProps.className} text-indigo-500`} />;
    if (mime.includes('javascript') || mime.includes('typescript') || mime.includes('json') || mime.includes('html') || mime.includes('css'))
      return <FileCode {...iconProps} className={`${iconProps.className} text-orange-500`} />;

    return <FileText {...iconProps} className={`${iconProps.className} text-muted-foreground`} />;
  }, [contentType, isDownloading]);

  return (
    <div className='border-border rounded-lg border p-2' key={name}>
      <div className='flex items-center gap-3 px-2'>
        <div className='bg-muted flex h-8 w-8 items-center justify-center overflow-hidden rounded-sm'>
          {renderIcon}
        </div>
        <div className='flex min-w-0 flex-1 items-center gap-2'>
          <span
            role='button'
            tabIndex={0}
            onClick={handleAction}
            onKeyDown={(e) => e.key === 'Enter' && handleAction()}
            className={`text-primary max-w-60 truncate text-sm font-semibold underline cursor-pointer hover:opacity-80 transition-opacity ${
              isDownloading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {name}
          </span>
          <span className='text-muted-foreground text-xs whitespace-nowrap'>
            {Math.round(size / 1024)} KB
          </span>
        </div>
        {onDelete && (
          <button
            type='button'
            className='bg-transparent hover:text-red-500 transition-colors disabled:opacity-50'
            onClick={onDelete}
            disabled={isDownloading}
            aria-label='Remove file'
          >
            <Trash2 className='h-4 w-4' />
          </button>
        )}
      </div>
      <div className='mt-2 flex items-center gap-2'>
        <div className='bg-muted h-2 flex-1 overflow-hidden rounded-full'>
          <div
            className='bg-primary h-full transition-all duration-300'
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className='text-muted-foreground min-w-8 text-right text-xs whitespace-nowrap'>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
