import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui/components/dialog';
import { Button } from '@repo/ui/components/button';
import { useCollections, useCreateCollection } from '@/hooks/data/useCollection';
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
    const { t, keys } = useLocale('books');
    const { data: collections, isLoading } = useCollections({ limit: 50 }, { enabled: open });
    const [newCollectionName, setNewCollectionName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const { mutate: createCollection } = useCreateCollection();
    const { mutate: createBookmark } = useCreateBookmark();

    const handleSelectCollection = (collectionId?: string) => {
        if (!bookId) return;

        createBookmark(
            {
                itemId: bookId,
                collectionId,
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

    const handleCreateCollection = () => {
        if (!newCollectionName.trim()) return;

        createCollection(
            { name: newCollectionName },
            {
                onSuccess: (data) => {
                    if (data) {
                        handleSelectCollection(data.id);
                        setNewCollectionName('');
                        setIsCreating(false);
                    } else {
                        toast.error('Failed to create collection. Please try again.');
                    }
                },
                onError: () => {
                    toast.error('An error occurred while creating the collection.');
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
                            onClick={() => handleSelectCollection(undefined)}
                        >
                            <Icon icon="mdi:bookmark-outline" className="mr-2 h-4 w-4" />
                            Save to Reading List
                        </Button>

                        <div className="relative my-1">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or add to Collection</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            {isLoading ? (
                                <div className="flex justify-center py-4">
                                    <Icon icon="mdi:loading" className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : collections?.data && collections.data.length > 0 ? (
                                <ScrollArea className="h-[180px] w-full rounded-md border p-2">
                                    <div className="flex flex-col gap-1">
                                        {collections.data.map((collection) => (
                                            <Button
                                                key={collection.id}
                                                variant="ghost"
                                                className="justify-start font-normal w-full"
                                                onClick={() => handleSelectCollection(collection.id)}
                                            >
                                                <Icon icon="mdi:folder-outline" className="mr-2 h-4 w-4 text-muted-foreground" />
                                                <span className="truncate">{collection.name}</span>
                                                <span className="ml-auto text-xs text-muted-foreground flex-shrink-0">
                                                    {collection.itemCount || 0} items
                                                </span>
                                            </Button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            ) : !isCreating && (
                                <div className="flex flex-col items-center justify-center py-2 text-center text-muted-foreground">
                                    <p className="text-xs">{t(keys.view.collection.empty)}</p>
                                </div>
                            )}

                            {isCreating || (collections && collections.data.length === 0 && !isLoading) ? (
                                <div className="flex items-center gap-2">
                                    <Input
                                        value={newCollectionName}
                                        onChange={(e) => setNewCollectionName(e.target.value)}
                                        placeholder="New collection name..."
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleCreateCollection();
                                            if (e.key === 'Escape') {
                                                if (collections && collections.data.length > 0) setIsCreating(false);
                                            }
                                        }}
                                    />
                                    <Button size="icon" onClick={handleCreateCollection} disabled={!newCollectionName.trim()}>
                                        <Icon icon="mdi:check" className="h-4 w-4" />
                                    </Button>
                                    {collections && collections.data.length > 0 && (
                                        <Button size="icon" variant="ghost" onClick={() => setIsCreating(false)}>
                                            <Icon icon="mdi:close" className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full justify-start border-dashed text-muted-foreground hover:text-foreground"
                                    onClick={() => setIsCreating(true)}
                                >
                                    <Icon icon="mdi:plus" className="mr-2 h-4 w-4" />
                                    Create new collection
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
