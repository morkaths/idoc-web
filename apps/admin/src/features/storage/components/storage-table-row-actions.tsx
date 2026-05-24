import { useState } from 'react';
import { type Row } from '@tanstack/react-table';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Download, Trash2, Copy, Link, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { FileResponse } from '@/types';
import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { FileApi } from '@/apis/file.api';
import { useStorageContext } from './storage-provider';

type StorageTableRowActionsProps<TData> = {
  row: Row<TData>;
};

export function StorageTableRowActions<TData>({ row }: StorageTableRowActionsProps<TData>) {
  const file = row.original as FileResponse;
  const ctx = useStorageContext();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!ctx) throw new Error('StorageTableRowActions must be used inside StorageProvider');
  const { setOpen, setCurrentRow } = ctx;

  const copyToClipboard = (text: string, successMessage: string) => {
    navigator.clipboard.writeText(text);
    toast.success(successMessage);
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    try {
      setIsDownloading(true);
      const blob = await FileApi.download(file.id);
      if (!blob) throw new Error('Failed to download file.');
      const downloadUrl = URL.createObjectURL(blob);
      const linkEl = document.createElement('a');
      linkEl.href = downloadUrl;
      linkEl.download = file.fileName;
      document.body.appendChild(linkEl);
      linkEl.click();
      document.body.removeChild(linkEl);
      URL.revokeObjectURL(downloadUrl);
      toast.success('File downloaded successfully!');
    } catch {
      toast.error('Failed to download file.');
    } finally {
      setIsDownloading(false);
    }
  };

  const apiDownloadUrl = `${window.location.origin}/api/v1/files/${file.id}/download`;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='data-[state=open]:bg-muted flex h-8 w-8 p-0'>
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuItem
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <Download className='mr-2 h-4 w-4' />
          )}
          Download
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => copyToClipboard(file.id, 'File ID copied to clipboard!')}
        >
          <Copy className='mr-2 h-4 w-4' />
          Copy ID
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => copyToClipboard(apiDownloadUrl, 'Download URL copied to clipboard!')}
        >
          <Link className='mr-2 h-4 w-4' />
          Copy Link
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(file);
            setOpen('delete');
          }}
          className='text-red-600 focus:text-red-600'
        >
          Delete
          <span className='ml-auto'>
            <Trash2 size={16} />
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default StorageTableRowActions;
