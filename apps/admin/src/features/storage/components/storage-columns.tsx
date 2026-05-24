import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  FileText,
  FileImage,
  FileCode,
  FilePlay,
  FileArchive,
  Sheet,
} from 'lucide-react';
import type { FileResponse } from '@/types';
import { Checkbox } from '@repo/ui/components/checkbox';
import { Badge } from '@repo/ui/components/badge';
import { DataTableColumnHeader } from '@/components/data-table';
import Highlight from '@/components/highlight';
import { StorageTableRowActions } from './storage-table-row-actions';

/**
 * Format bytes to readable size string
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Get lucide icon based on content type
 */
export const getFileIcon = (contentType: string) => {
  const mime = contentType.toLowerCase();
  const iconProps = { className: 'h-4 w-4 shrink-0' };

  if (mime.startsWith('image/')) {
    return <FileImage {...iconProps} className={`${iconProps.className} text-blue-500`} />;
  }
  if (mime === 'application/pdf') {
    return <FileText {...iconProps} className={`${iconProps.className} text-red-500`} />;
  }
  if (mime.includes('sheet') || mime.includes('excel') || mime.includes('csv')) {
    return <Sheet {...iconProps} className={`${iconProps.className} text-green-500`} />;
  }
  if (mime.includes('zip') || mime.includes('rar') || mime.includes('compressed')) {
    return <FileArchive {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
  }
  if (mime.startsWith('video/') || mime.startsWith('audio/')) {
    return <FilePlay {...iconProps} className={`${iconProps.className} text-indigo-500`} />;
  }
  if (
    mime.includes('javascript') ||
    mime.includes('typescript') ||
    mime.includes('json') ||
    mime.includes('html') ||
    mime.includes('css')
  ) {
    return <FileCode {...iconProps} className={`${iconProps.className} text-orange-500`} />;
  }

  return <FileText {...iconProps} className={`${iconProps.className} text-muted-foreground`} />;
};

export const storageColumns: ColumnDef<FileResponse>[] = [
  {
    id: 'select',
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
  },
  {
    accessorKey: 'fileName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({ row, table }) => {
      const fileName = String(row.getValue('fileName') ?? '');
      const contentType = String(row.original.contentType ?? '');
      const query = String(table.getState().globalFilter ?? '');
      return (
        <div className='flex items-center gap-2 max-w-72 sm:max-w-96 md:max-w-124'>
          {getFileIcon(contentType)}
          <span className='truncate font-medium'>
            <Highlight text={fileName} query={query} />
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'contentType',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
    cell: ({ row }) => {
      const contentType = String(row.getValue('contentType') ?? 'unknown');
      return (
        <span className='text-muted-foreground text-xs whitespace-nowrap'>
          {contentType}
        </span>
      );
    },
  },
  {
    accessorKey: 'size',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Size' />,
    cell: ({ row }) => {
      const size = Number(row.getValue('size') ?? 0);
      return <span className='text-xs whitespace-nowrap'>{formatBytes(size)}</span>;
    },
  },
  {
    accessorKey: 'provider',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Provider' />,
    cell: ({ row }) => {
      const provider = String(row.getValue('provider') ?? 'local');
      return <Badge variant='outline'>{provider}</Badge>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const status = String(row.getValue('status') ?? '');
      const s = status.toLowerCase();
      let className = 'text-xs font-medium capitalize';
      if (s === 'active' || s === 'completed' || s === 'available') {
        className += ' bg-emerald-50 text-emerald-700';
      } else if (s === 'processing' || s === 'pending' || s === 'queued' || s === 'waiting') {
        className += ' bg-amber-50 text-amber-700';
      } else if (s === 'failed' || s === 'error' || s === 'rejected') {
        className += ' bg-rose-50 text-rose-700';
      } else if (s === 'archived' || s === 'deleted' || s === 'removed') {
        className += ' bg-gray-50 text-gray-700';
      } else {
        className += ' bg-secondary text-secondary-foreground';
      }

      return <Badge className={className}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Uploaded At' />,
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt');
      if (!createdAt) return <span>-</span>;
      return (
        <span className='text-muted-foreground text-xs whitespace-nowrap'>
          {format(new Date(createdAt as string | Date), 'yyyy-MM-dd HH:mm:ss')}
        </span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <StorageTableRowActions row={row} />,
  },
];
