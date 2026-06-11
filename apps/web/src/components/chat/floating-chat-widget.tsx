'use client';

import { useRouter, usePathname } from 'next/navigation';
import React from 'react';
import { cn } from '@/lib/utils';
import { SparklesIcon, MinusIcon, Maximize2Icon, Trash2 } from 'lucide-react';
import SiriOrb from '../siri-orb';
import { HighlightedText } from '@repo/ui/components/highlighted-text';
import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import { useTheme } from '@/context/theme-provider';
import { useChat } from '@/context/chat-provider';
import { WIDGET_SUGGESTIONS, ORB_THEME_COLORS } from './data/chatbot-data';
import { ChatInput } from './chat-input';
import { ChatMessage } from './chat-message';
import { ChatMessageList } from './chat-message-list';

export interface FloatingChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  title?: string;
}

/**
 * FloatingChatButton renders the circular trigger at the bottom-right corner.
 * Shows an animated SiriOrb when closed, an X icon when the window is open.
 */
export const FloatingChatButton = ({ isOpen, onClick, title }: FloatingChatButtonProps) => {
  const pathname = usePathname();
  const isChatbotPage = pathname.endsWith('/chatbot') || pathname.includes('/chatbot/');
  const { resolvedMode } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (isChatbotPage || isOpen) return null;

  if (!mounted) {
    return (
      <button
        type='button'
        title={title}
        className='relative z-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background border border-border shadow-sm'
      />
    );
  }

  const isDark = resolvedMode === 'dark';
  const orbColors = isDark ? ORB_THEME_COLORS.dark : ORB_THEME_COLORS.light;

  return (
    <button
      type='button'
      onClick={onClick}
      title={title}
      className={cn(
        'relative z-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-lg hover:scale-105 active:scale-95 transition-all duration-200',
        isDark
          ? 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900 text-white'
          : 'bg-white border-zinc-200 hover:bg-zinc-50 text-black'
      )}
    >
      <SiriOrb size='32px' colors={orbColors} />
    </button>
  );
};

export interface FloatingChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * FloatingChatWindow component renders the chat dialogue popup window.
 */
export const FloatingChatWindow = ({ isOpen, onClose }: FloatingChatWindowProps) => {
  const { t, keys } = useLocale('chatbot');
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedMode } = useTheme();

  const isChatbotPage = pathname.endsWith('/chatbot') || pathname.includes('/chatbot/');

  const [inputValue, setInputValue] = React.useState('');

  const {
    selectedModelId,
    setSelectedModelId,
    conversations,
    activeConversationId,
    activeConversation,
    isLoading,
    createNewChat,
    handleSendMessage,
    handleRegenerateMessage,
    setActiveConversationId,
  } = useChat();

  const isDark = resolvedMode === 'dark';
  const headerOrbColors = isDark ? ORB_THEME_COLORS.dark : ORB_THEME_COLORS.light;

  const messages = activeConversation ? activeConversation.messages : [];

  // Default to active conversation if available on load
  React.useEffect(() => {
    if (!activeConversationId && conversations.length > 0 && conversations[0]) {
      setActiveConversationId(conversations[0].id);
    }
  }, [activeConversationId, conversations, setActiveConversationId]);

  const clearChat = () => {
    createNewChat();
  };

  // Expand to full page chat
  const handleExpand = () => {
    router.push('/chatbot');
    onClose();
  };

  const onSubmitMessage = async (contentOverride?: string) => {
    if (isLoading) return;
    const content = (contentOverride || inputValue).trim();
    if (!content) return;

    if (!contentOverride) {
      setInputValue('');
    }
    await handleSendMessage(content);
  };

  if (isChatbotPage || !isOpen) {
    return null;
  }

  return (
    <div className='border-border bg-background animate-in slide-in-from-bottom-6 mb-4 flex h-[520px] w-[350px] flex-col overflow-hidden rounded-md border duration-300 ease-out sm:w-[380px] shadow-2xl'>
      {/* Header */}
      <header className='bg-muted/30 flex h-14 shrink-0 items-center justify-between border-b px-4'>
        <div className='flex items-center gap-2.5'>
          <div className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm overflow-hidden',
            isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'
          )}>
            <SiriOrb size='32px' colors={headerOrbColors} />
          </div>
          <div className='text-left'>
            <h3 className='text-foreground text-xs font-bold flex items-center gap-1'>
              {t.rich(keys.widget.headerTitleText, {
                highlight: (chunks) => (
                  <HighlightedText delay={0.2} from='left'>
                    {chunks}
                  </HighlightedText>
                ),
              })}
            </h3>
            <span className='flex items-center gap-1 text-[10px] font-medium text-green-500'>
              <span className='inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500' />
              {t(keys.widget.online)}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-1'>
          {messages.length > 0 && (
            <Button
              variant='ghost'
              size='icon'
              onClick={clearChat}
              className='text-muted-foreground hover:text-destructive h-8 w-8 rounded-md'
              title={t(keys.widget.clear)}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          )}
          <Button
            variant='ghost'
            size='icon'
            onClick={handleExpand}
            className='text-muted-foreground hover:text-foreground h-8 w-8 rounded-md'
            title={t(keys.widget.openFullPage)}
          >
            <Maximize2Icon className='h-3.5 w-3.5' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            onClick={onClose}
            className='text-muted-foreground hover:text-foreground h-8 w-8 rounded-md'
            title={t(keys.widget.minimize)}
          >
            <MinusIcon className='h-4 w-4' />
          </Button>
        </div>
      </header>

      {/* Messages list */}
      <div className='bg-background/50 relative flex min-h-0 flex-1 flex-col justify-between overflow-hidden'>
        {messages.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center p-6 text-center'>
            <div className='bg-primary/10 text-primary mb-3 flex h-10 w-10 items-center justify-center rounded-md'>
              <SparklesIcon className='h-5 w-5 animate-pulse' />
            </div>
            <h4 className='text-foreground text-xs font-bold'>{t(keys.widget.headerTitle)}</h4>
            <p className='text-muted-foreground mt-1 max-w-[240px] text-[11px]'>
              {t(keys.widget.welcome)}
            </p>

            {/* Suggestions list */}
            <div className='mt-5 w-full space-y-2'>
              {WIDGET_SUGGESTIONS.map((item, idx) => {
                const label = t(keys.prompts[item.id].short);
                const text = t(keys.prompts[item.id].desc);
                return (
                  <button
                    key={idx}
                    onClick={() => onSubmitMessage(text)}
                    className='border-border/80 hover:border-primary/50 bg-background hover:bg-muted/30 group flex w-full items-center gap-2.5 rounded-md border p-2.5 text-left text-[11px] transition-all'
                  >
                    <item.icon className='text-primary h-3.5 w-3.5 shrink-0' />
                    <span className='text-muted-foreground group-hover:text-primary truncate font-medium'>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <ChatMessageList className='flex-1'>
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                id={message.id}
                role={message.role}
                content={message.content}
                books={message.books}
                createdAt={message.timestamp ? new Date(message.timestamp) : undefined}
                isLoading={
                  isLoading && index === messages.length - 1 && message.role === 'assistant'
                }
                onRetry={
                  message.role === 'assistant'
                    ? () => handleRegenerateMessage(message.id, setInputValue)
                    : undefined
                }
                onEdit={
                  message.role === 'user' ? () => setInputValue(message.content) : undefined
                }
              />
            ))}
          </ChatMessageList>
        )}

        {/* Input Form */}
        <div className='bg-background shrink-0 border-t p-3'>
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={(e) => {
              if (e) e.preventDefault();
              onSubmitMessage();
            }}
            isLoading={isLoading}
            selectedModelId={selectedModelId}
            onModelChange={setSelectedModelId}
            showModelSelector={true}
            showSuggestions={false}
            placeholder={t(keys.widget.placeholder)}
          />
        </div>
      </div>
    </div>
  );
};
