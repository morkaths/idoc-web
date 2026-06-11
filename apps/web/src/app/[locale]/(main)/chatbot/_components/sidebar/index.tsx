'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useLocale } from '@/hooks/ui/useLocale';
import { Skeleton } from '@repo/ui/components/skeleton';
import { RenameDialog } from './rename-dialog';
import { SidebarHeader } from './sidebar-header';
import { SidebarItem } from './sidebar-item';

interface Conversation {
  id: string;
  title: string;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onCreateNewChat: () => void;
  onDeleteChat: (id: string, e: React.MouseEvent) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
}

export const ChatSidebar = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateNewChat,
  onDeleteChat,
  onRenameChat,
  sidebarOpen,
  onCloseSidebar,
}: ChatSidebarProps) => {
  const { t, keys } = useLocale('chatbot');
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const [renameConversationId, setRenameConversationId] = React.useState<string | null>(null);
  const [renameTitleValue, setRenameTitleValue] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isListLoading, setIsListLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsListLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenRenameDialog = (id: string, currentTitle: string) => {
    setRenameConversationId(id);
    setRenameTitleValue(currentTitle);
    setRenameDialogOpen(true);
  };

  const handleSaveRename = () => {
    if (renameConversationId && renameTitleValue.trim()) {
      onRenameChat(renameConversationId, renameTitleValue.trim());
    }
    setRenameDialogOpen(false);
    setRenameConversationId(null);
  };

  return (
    <div
      className={cn(
        'border-border bg-background flex shrink-0 flex-col border-r transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-0 overflow-hidden border-r-0'
      )}
    >
      <SidebarHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateNewChat={onCreateNewChat}
        onCloseSidebar={onCloseSidebar}
      />

      <div className='scrollbar-thin flex-1 space-y-1 overflow-y-auto p-2'>
        {isListLoading ? (
          Array.from({ length: 5 }).map((_, idx) => {
            const widths = ['w-3/4', 'w-1/2', 'w-2/3', 'w-4/5', 'w-3/5'];
            const widthClass = widths[idx % widths.length];
            return (
              <div key={idx} className='flex items-center gap-2 rounded px-3 py-2.5'>
                <Skeleton className={cn('h-3.5 rounded-sm', widthClass)} />
              </div>
            );
          })
        ) : filteredConversations.length === 0 ? (
          <div className='text-muted-foreground py-8 text-center text-xs'>
            {searchQuery ? t(keys.sidebar.noResults) : t(keys.sidebar.noConversations)}
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <SidebarItem
              key={conv.id}
              conv={conv}
              isActive={conv.id === activeConversationId}
              onSelect={() => onSelectConversation(conv.id)}
              onRenameClick={() => handleOpenRenameDialog(conv.id, conv.title)}
              onDeleteClick={(e) => onDeleteChat(conv.id, e)}
            />
          ))
        )}
      </div>

      <RenameDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        titleValue={renameTitleValue}
        onChangeTitle={setRenameTitleValue}
        onSave={handleSaveRename}
      />
    </div>
  );
};
