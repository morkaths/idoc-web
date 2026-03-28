import { FileResponse } from '@/types';
import { FileArchive, FileCode, FilePlay, FileText, Sheet, Trash2 } from 'lucide-react';

export function FileItem({
  file,
  progress = 100,
  onDelete,
}: {
  file: FileResponse | File;
  progress?: number;
  onDelete?: () => void;
}) {
  const url = file instanceof File ? URL.createObjectURL(file) : file.url;
  const size = file.size;
  const name = file instanceof File ? file.name : file.originalname;
  const ext = name.split('.').pop()?.toLowerCase() || '';

  function getFileIcon(ext: string) {
    switch (ext) {
      case 'xls':
      case 'xlsx':
        return <Sheet className='h-4 w-4 text-green-500' />;
      case 'zip':
      case 'rar':
        return <FileArchive className='h-4 w-4 text-yellow-500' />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'mp4':
      case 'mov':
      case 'avi':
      case 'mp3':
      case 'wav':
        return <FilePlay className='h-4 w-4 text-indigo-500' />;
      case 'js':
      case 'ts':
      case 'json':
      case 'html':
      case 'css':
        return <FileCode className='h-4 w-4 text-orange-500' />;
      default:
        return <FileText className='text-muted-foreground h-4 w-4' />;
    }
  }

  return (
    <div className='border-border rounded-lg border p-2' key={name}>
      <div className='flex items-center gap-3 px-2'>
        <div className='bg-muted flex h-8 w-8 items-center justify-center overflow-hidden rounded-sm'>
          {getFileIcon(ext)}
        </div>
        <div className='flex min-w-0 flex-1 items-center'>
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary max-w-60 truncate text-sm font-semibold underline'
          >
            {name}
          </a>
          <span className='text-muted-foreground text-xs whitespace-nowrap'>
            {Math.round(size / 1024)} KB
          </span>
        </div>
        {onDelete && (
          <button
            type='button'
            className='bg-transparent hover:text-red-500'
            onClick={onDelete}
            aria-label='Remove file'
          >
            <Trash2 className='h-4 w-4' />
          </button>
        )}
      </div>
      <div className='mt-2 flex items-center gap-2'>
        <div className='bg-muted h-2 flex-1 overflow-hidden rounded-full'>
          <div
            className='bg-primary h-full transition-all'
            style={{
              width: `${progress}%`,
            }}
          ></div>
        </div>
        <span className='text-muted-foreground min-w-8 text-right text-xs whitespace-nowrap'>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
