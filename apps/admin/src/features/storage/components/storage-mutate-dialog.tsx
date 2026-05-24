import { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/dialog';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { useUploadPresignedFile } from '@/hooks/data/useFile';
import { formatBytes } from './storage-columns';

type StorageMutateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

interface FileUploadState {
  file: File;
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  errorMsg?: string;
}

export function StorageMutateDialog({ open, onOpenChange }: StorageMutateDialogProps) {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [folder, setFolder] = useState<string>('general');
  const [uploadList, setUploadList] = useState<FileUploadState[]>([]);
  const [isUploadingAll, setIsUploadingAll] = useState(false);
  const uploadMut = useUploadPresignedFile();

  const handleBoxClick = () => {
    if (isUploadingAll) return;
    fileInputRef.current?.click();
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newItems: FileUploadState[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (uploadList.some((item) => item.file.name === file.name && item.file.size === file.size)) {
        continue;
      }
      newItems.push({
        file,
        status: 'idle',
        progress: 0,
      });
    }
    setUploadList((prev) => [...prev, ...newItems]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUploadingAll) return;
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    if (isUploadingAll) return;
    setUploadList((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    if (isUploadingAll) return;
    setUploadList([]);
  };

  const handleStartUpload = async () => {
    if (uploadList.length === 0 || isUploadingAll) return;

    setIsUploadingAll(true);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < uploadList.length; i++) {
      const item = uploadList[i];
      if (item.status === 'success') {
        successCount++;
        continue;
      }

      setUploadList((prev) => {
        const copy = [...prev];
        copy[i] = { ...copy[i], status: 'uploading', progress: 10 };
        return copy;
      });

      try {
        setUploadList((prev) => {
          const copy = [...prev];
          copy[i] = { ...copy[i], progress: 50 };
          return copy;
        });

        await uploadMut.mutateAsync({
          file: item.file,
          folder: folder.trim() || 'general',
        });

        setUploadList((prev) => {
          const copy = [...prev];
          copy[i] = { ...copy[i], status: 'success', progress: 100 };
          return copy;
        });
        successCount++;
      } catch (error) {
        setUploadList((prev) => {
          const copy = [...prev];
          copy[i] = {
            ...copy[i],
            status: 'error',
            progress: 0,
            errorMsg: error instanceof Error ? error.message : 'Upload failed',
          };
          return copy;
        });
        failCount++;
      }
    }

    setIsUploadingAll(false);
    await qc.invalidateQueries({ queryKey: ['files'] });

    if (failCount === 0) {
      toast.success(`Uploaded ${successCount} files successfully!`);
      setTimeout(() => {
        onOpenChange(false);
        setUploadList([]);
      }, 1000);
    } else {
      toast.error(`Uploaded ${successCount} successfully, ${failCount} failed.`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !isUploadingAll && onOpenChange(val)}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Upload files to the media storage. Specify a folder to keep files organized.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='folder'>Target Folder</Label>
            <Input
              id='folder'
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              placeholder='e.g., general, books, authors'
              disabled={isUploadingAll}
            />
          </div>

          <div
            className={`border-border flex flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center transition-colors ${
              isUploadingAll ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-accent/10'
            }`}
            onClick={handleBoxClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className='bg-muted mb-2 rounded-full p-3'>
              <Upload className='text-muted-foreground h-5 w-5' />
            </div>
            <p className='text-foreground text-sm font-medium'>
              Drag & drop files here, or click to browse
            </p>
            <p className='text-muted-foreground mt-1 text-xs'>
              Support files up to 20MB
            </p>
            <input
              type='file'
              ref={fileInputRef}
              className='hidden'
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              disabled={isUploadingAll}
            />
          </div>

          {uploadList.length > 0 && (
            <div className='max-h-60 overflow-y-auto border rounded-md p-3 space-y-2'>
              {uploadList.map((item, idx) => (
                <div key={idx} className='flex items-center justify-between gap-3 text-sm border-b pb-2 last:border-0 last:pb-0'>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='truncate font-medium block max-w-64 sm:max-w-80'>
                        {item.file.name}
                      </span>
                      <span className='text-muted-foreground text-xs whitespace-nowrap'>
                        ({formatBytes(item.file.size)})
                      </span>
                    </div>
                    {item.status === 'uploading' && (
                      <div className='bg-muted mt-1.5 h-1.5 overflow-hidden rounded-full w-full'>
                        <div
                          className='bg-primary h-full transition-all duration-300'
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                    {item.status === 'error' && item.errorMsg && (
                      <p className='text-red-500 text-xs mt-0.5 truncate'>{item.errorMsg}</p>
                    )}
                  </div>

                  <div className='flex items-center gap-2 shrink-0'>
                    {item.status === 'uploading' && (
                      <Loader2 className='text-primary h-4 w-4 animate-spin' />
                    )}
                    {item.status === 'success' && (
                      <CheckCircle className='text-green-500 h-4 w-4' />
                    )}
                    {item.status === 'error' && (
                      <AlertCircle className='text-red-500 h-4 w-4' />
                    )}
                    {item.status === 'idle' && (
                      <button
                        type='button'
                        onClick={() => removeFile(idx)}
                        className='text-muted-foreground hover:text-red-500 transition-colors'
                        aria-label='Remove file'
                      >
                        <X className='h-4 w-4' />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className='gap-2 sm:gap-0'>
          <DialogClose asChild>
            <Button variant='outline' type='button' disabled={isUploadingAll} onClick={clearAll}>
              Cancel
            </Button>
          </DialogClose>
          <div className='flex items-center gap-2'>
            {uploadList.length > 0 && !isUploadingAll && (
              <Button variant='ghost' onClick={clearAll} className='text-muted-foreground'>
                Clear List
              </Button>
            )}
            <Button
              type='button'
              onClick={handleStartUpload}
              disabled={uploadList.length === 0 || isUploadingAll}
            >
              {isUploadingAll ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Uploading...
                </>
              ) : (
                'Start Upload'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
