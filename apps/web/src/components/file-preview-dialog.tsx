'use client';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui/components/dialog';

const PdfViewer = dynamic(() => import('@/components/viewers/pdf-viewer'), { ssr: false });

type FilePreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileUrl: string;
  title?: string;
  mode?: 'full' | 'simple';
};

export function FilePreviewDialog({
  open,
  onOpenChange,
  fileUrl,
  title,
  mode = 'simple',
}: FilePreviewDialogProps) {
  useEffect(() => {
    if (!open) return;
    if (!fileUrl) {
      toast.error('File not found or file error!');
    } else if (
      !fileUrl.match(/\.pdf(\?|$)/i) &&
      !fileUrl.match(/\.(doc|docx|xls|xlsx|ppt|pptx)(\?|$)/i)
    ) {
      toast.error('This file type is not supported for preview!');
    }
  }, [open, fileUrl]);

  let content = null;
  if (!fileUrl) {
    content = (
      <div className='text-muted-foreground py-10 text-center'>File not found or file error.</div>
    );
  } else if (
    !fileUrl.match(/\.pdf(\?|$)/i) &&
    !fileUrl.match(/\.(doc|docx|xls|xlsx|ppt|pptx)(\?|$)/i)
  ) {
    content = (
      <div className='text-muted-foreground py-10 text-center'>
        File type not supported for preview.
      </div>
    );
  } else {
    content = fileUrl.match(/\.pdf(\?|$)/i) ? (
      <PdfViewer fileUrl={fileUrl} mode={mode} />
    ) : (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
        width='100%'
        height='100%'
        className='rounded'
        title='Book file'
        style={{ minHeight: 400, height: '100%' }}
        onError={() => toast.error('Không thể tải file này!')}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='h-[90vh]! w-[80vw]! max-w-[90vw]! p-0'>
        <DialogHeader className='px-6 pt-6 pb-2'>
          <DialogTitle className='text-lg font-semibold'>{title || 'No title'}</DialogTitle>
        </DialogHeader>
        <div
          className='flex w-full items-center justify-center border-t'
          style={{ ['--scale-factor' as never]: 1, minHeight: 500, height: '80vh' }}
        >
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
