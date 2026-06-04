'use client';

import { PlusIcon, PanelLeftCloseIcon, Search } from 'lucide-react';
import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';

interface SidebarHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateNewChat: () => void;
  onCloseSidebar: () => void;
}

export const SidebarHeader = ({
  searchQuery,
  onSearchChange,
  onCreateNewChat,
  onCloseSidebar,
}: SidebarHeaderProps) => {
  const { t, keys } = useLocale('chatbot');

  return (
    <div className='border-border flex h-[60px] shrink-0 items-center gap-2 border-b px-3'>
      <div className='relative flex-1'>
        <Search className='text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2' />
        <Input
          type='text'
          placeholder={t(keys.sidebar.searchPlaceholder)}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className='border-border bg-background/50 focus-visible:ring-primary h-8 w-full pl-8 text-xs focus-visible:ring-1'
        />
      </div>
      <Button
        onClick={onCreateNewChat}
        variant='ghost'
        size='icon'
        className='text-muted-foreground hover:text-foreground h-8 w-8 shrink-0'
        title={t(keys.sidebar.newChat)}
      >
        <PlusIcon className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        onClick={onCloseSidebar}
        className='text-muted-foreground hover:text-foreground hidden h-8 w-8 shrink-0 md:flex'
        title={t(keys.sidebar.collapseSidebar)}
      >
        <PanelLeftCloseIcon className='h-4 w-4' />
      </Button>
    </div>
  );
};
