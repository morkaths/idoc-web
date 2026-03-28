import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui/components/dialog';
import { Button } from '@repo/ui/components/button';
import { useFolders, useCreateFolder } from '@/hooks/data/useFolder';
import { useCreateBookmark } from '@/hooks/data/useBookmark';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Input } from '@repo/ui/components/input';
import { ScrollArea } from '@repo/ui/components/scroll-area';
import { toast } from 'sonner';
import { useLocale } from '@/hooks/ui/useLocale';

type BookmarkDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bookId: string | undefined;
};

export function BookmarkDialog({
    open,
    onOpenChange,
    bookId,
}: BookmarkDialogProps) {
    const { t, keys, KEYS } = useLocale('books');
    const { data: folders, isLoading } = useFolders({ limit: 100 }, { enabled: open, staleTime: 0 });
    const [newFolderName, setNewFolderName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const { mutate: createFolder, status: createFolderStatus } = useCreateFolder();
    const { mutate: createBookmark } = useCreateBookmark();

    const handleSelectFolder = (folder?: string) => {
        if (!bookId) return;

        createBookmark(
            {
                item: bookId,
                folder: folder,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                    toast.success(t(keys.view.bookmark.success));
                },
                onError: (error) => {
                    console.error("Failed to bookmark:", error);
                    toast.error(t(keys.view.bookmark.error));
                }
            }
        );
    };

    const handleCreateFolder = () => {
        if (!newFolderName.trim()) return;

        createFolder(
            { name: newFolderName },
            {
                onSuccess: (data) => {
                    if (data) {
                        handleSelectFolder(data.id);
                        setNewFolderName('');
                        setIsCreating(false);
                    } else {
                        toast.error('Failed to create folder. Please try again.');
                    }
                },
                onError: (err: any) => {
                    toast.error(err?.message || 'An error occurred while creating the folder.');
                }
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t(keys.view.bookmark.title)}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-4 mt-2">
                        <Button
                            className="w-full justify-start"
                            onClick={() => handleSelectFolder(undefined)}
                        >
                            <Icon icon="mdi:bookmark-outline" className="mr-2 h-4 w-4" />
                            {t(keys.view.bookmark.readingList)}
                        </Button>

                        <div className="relative my-1">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">{t(keys.view.bookmark.orAddToFolder)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            {isLoading ? (
                                <div className="flex justify-center py-4">
                                    <Icon icon="mdi:loading" className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : folders?.data && folders.data.length > 0 ? (
                                <>
                                    <ScrollArea className="h-[180px] w-full rounded-md border p-2">
                                        <div className="flex flex-col gap-1">
                                            {folders.data.map((folder) => (
                                                <Button
                                                    key={folder.id}
                                                    variant="ghost"
                                                    className="justify-start font-normal w-full group"
                                                    onClick={() => handleSelectFolder(folder.id)}
                                                >
                                                    <Icon icon="mdi:folder-outline" className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                                    <span className="truncate">{folder.name}</span>
                                                    <span className="ml-auto text-xs text-muted-foreground flex-shrink-0">
                                                        {folder.itemCount || 0} {t(folder.itemCount === 1 ? KEYS.common.item : KEYS.common.items)}
                                                    </span>
                                                </Button>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                    {!isCreating && (
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start border-dashed text-muted-foreground hover:text-foreground"
                                            onClick={() => setIsCreating(true)}
                                        >
                                            <Icon icon="mdi:plus" className="mr-2 h-4 w-4" />
                                            {t(KEYS.common.actions.create || 'Create new folder')}
                                        </Button>
                                    )}
                                </>
                            ) : (
                                !isCreating && (
                                    <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground bg-muted/20 rounded-md border border-dashed">
                                        <Icon icon="mdi:folder-open-outline" className="h-8 w-8 mb-2 opacity-20" />
                                        <p className="text-xs">{t(keys.view.folder.empty)}</p>
                                    </div>
                                )
                            )}

                            {(isCreating || (folders && folders.data.length === 0 && !isLoading)) && (
                                <div className="flex items-center gap-2 mt-1">
                                    <Input
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        placeholder="New folder name..."
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleCreateFolder();
                                            if (e.key === 'Escape') {
                                                if (folders && folders.data.length > 0) setIsCreating(false);
                                            }
                                        }}
                                        className="h-9"
                                    />
                                    <Button
                                        size="icon"
                                        className="h-9 w-9 shrink-0"
                                        onClick={handleCreateFolder}
                                        disabled={!newFolderName.trim() || createFolderStatus === 'pending'}
                                    >
                                        {createFolderStatus === 'pending' ? <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" /> : <Icon icon="mdi:check" className="h-4 w-4" />}
                                    </Button>
                                    {folders && folders.data.length > 0 && (
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-9 w-9 shrink-0"
                                            onClick={() => setIsCreating(false)}
                                        >
                                            <Icon icon="mdi:close" className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
