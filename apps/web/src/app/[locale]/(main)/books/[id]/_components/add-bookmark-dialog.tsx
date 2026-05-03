'use client';

import { useState } from 'react';
import { useMyFolders, useCreateFolder } from '@/hooks/data/useFolder';

import { useCreateBookmark, useUpdateBookmark, useBookmarkStatus } from '@/hooks/data/useBookmark';
import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { Input } from '@repo/ui/components/input';
import { useSession } from 'next-auth/react';
import { Plus, FolderPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type AddBookmarkDialogProps = {
  bookId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddBookmarkDialog({ bookId, open, onOpenChange }: AddBookmarkDialogProps) {
  const { data: session } = useSession();
  const { t, keys } = useLocale('book');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data fetching
  const { data: foldersData, isLoading: foldersLoading } = useMyFolders({}, { enabled: open && !!session?.user });

  const { data: bookmarkStatus } = useBookmarkStatus([bookId], { enabled: open && !!session?.user });

  // Mutations
  const createFolderMut = useCreateFolder();
  const createBookmarkMut = useCreateBookmark();
  const updateBookmarkMut = useUpdateBookmark();

  const folders = foldersData?.data || [];
  const currentBookmark = bookmarkStatus?.[bookId];

  const handleSave = async () => {
    if (!selectedFolder && !currentBookmark) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (currentBookmark) {
        await updateBookmarkMut.mutateAsync({
          id: currentBookmark.id,
          data: { folderId: selectedFolder || undefined },
        });
      } else {
        await createBookmarkMut.mutateAsync({
          bookId: bookId,
          folderId: selectedFolder,
        });
      }
      toast.success(t(keys.bookmarks.success));
      onOpenChange(false);
    } catch (error: unknown) {
      const err = error as Record<string, unknown>;
      toast.error((err?.message as string) || t(keys.bookmarks.error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const folder = await createFolderMut.mutateAsync({
        name: newFolderName,
      });
      if (folder.data) {
        setSelectedFolder(folder.data.id);
      }
      setShowCreateFolder(false);
      setNewFolderName('');
      toast.success('Folder created');
    } catch (error: unknown) {
      const err = error as Record<string, unknown>;
      toast.error((err?.message as string) || 'Failed to create folder');
    }
  };

  const folderObj = currentBookmark?.folder as Record<string, unknown> | undefined;
  const currentFolderId = (folderObj?.id as string) || (typeof currentBookmark?.folder === 'string' ? currentBookmark.folder : '');
  const currentFolderName = (folderObj?.name as string) || folders.find(f => f.id === currentFolderId)?.name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t(keys.bookmarks.title)}</DialogTitle>
          <DialogDescription>{t(keys.bookmarks.description)}</DialogDescription>
        </DialogHeader>

        <fieldset disabled={isSubmitting} className='contents'>
          <div className='grid gap-4 py-4'>
            {showCreateFolder ? (
              <div className='flex items-center gap-2'>
                <Input
                  placeholder='Folder name...'
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  autoFocus
                />
                <Button size='sm' onClick={handleCreateFolder} disabled={createFolderMut.isPending}>
                  {createFolderMut.isPending ? <Loader2 className='animate-spin' /> : <Plus className='h-4 w-4' />}
                </Button>
                <Button size='sm' variant='ghost' onClick={() => setShowCreateFolder(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <Select
                  value={selectedFolder || currentFolderId || ''}
                  onValueChange={setSelectedFolder}
                >
                  <SelectTrigger className='flex-1'>
                    <SelectValue placeholder={t(keys.bookmarks.placeholder)} />
                  </SelectTrigger>
                  <SelectContent>
                    {folders.length === 0 && !foldersLoading && (
                      <div className='text-muted-foreground p-2 text-center text-sm'>
                        {t(keys.bookmarks.empty)}
                      </div>
                    )}
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => setShowCreateFolder(true)}
                  title={t(keys.bookmarks.create)}
                >
                  <FolderPlus className='h-4 w-4' />
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className='flex items-center justify-between sm:justify-between'>
            <div className='text-muted-foreground text-xs'>
              {currentFolderName && (
                <span>Current: {currentFolderName}</span>
              )}
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Save
              </Button>
            </div>
          </DialogFooter>
        </fieldset>
      </DialogContent>
    </Dialog>
  );
}
