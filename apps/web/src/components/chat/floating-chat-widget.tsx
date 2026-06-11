'use client';

import { useRouter, usePathname } from 'next/navigation';
import React from 'react';
import { cn } from '@/lib/utils';
import { ChatbotApi } from '@/apis';
import { SparklesIcon, MinusIcon, Maximize2Icon, Trash2 } from 'lucide-react';
import SiriOrb from '../siri-orb';
import { HighlightedText } from '@repo/ui/components/highlighted-text';
import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import { useTheme } from '@/context/theme-provider';
import { AI_MODELS, WIDGET_SUGGESTIONS, ORB_THEME_COLORS } from './data/chatbot-data';
import { ChatInput } from './chat-input';
import { ChatMessage } from './chat-message';
import { ChatMessageList } from './chat-message-list';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}


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

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedModelId, setSelectedModelId] = React.useState('gemini-1.5-flash');
  const [widgetSessionId, setWidgetSessionId] = React.useState<string | undefined>(undefined);

  const isDark = resolvedMode === 'dark';

  const headerOrbColors = isDark ? ORB_THEME_COLORS.dark : ORB_THEME_COLORS.light;

  // Load chat session from localstorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('idoc_floating_chat');
    if (saved) {
      try {
        setMessages(JSON.parse(saved) as Message[]);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse floating chat history', e);
      }
    }

    let sId = localStorage.getItem('idoc_floating_chat_session_id');
    if (!sId) {
      sId = Math.random().toString(36).substring(7);
      localStorage.setItem('idoc_floating_chat_session_id', sId);
    }
    setWidgetSessionId(sId);
  }, []);

  // Save chat session
  const saveMessages = (updated: Message[]) => {
    setMessages(updated);
    localStorage.setItem('idoc_floating_chat', JSON.stringify(updated));
  };

  const clearChat = () => {
    saveMessages([]);
    const newSId = Math.random().toString(36).substring(7);
    localStorage.setItem('idoc_floating_chat_session_id', newSId);
    setWidgetSessionId(newSId);
  };

  // Expand to full page chat and sync messages
  const handleExpand = () => {
    if (messages.length > 0) {
      const savedChats = localStorage.getItem('idoc_chats');
      let currentChats: Conversation[] = [];
      if (savedChats) {
        try {
          currentChats = JSON.parse(savedChats) as Conversation[];
        } catch (_e) { }
      }

      const firstUserMessage = messages.find((m) => m.role === 'user');
      const title = firstUserMessage
        ? firstUserMessage.content.substring(0, 30) +
        (firstUserMessage.content.length > 30 ? '...' : '')
        : t(keys.sidebar.newChat);

      const newChat: Conversation = {
        id: Math.random().toString(36).substring(7),
        title,
        messages: [...messages],
        createdAt: new Date().toISOString(),
      };

      const updatedChats = [newChat, ...currentChats];
      localStorage.setItem('idoc_chats', JSON.stringify(updatedChats));
      localStorage.removeItem('idoc_floating_chat');
    }

    router.push('/chatbot');
    onClose();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputValue).trim();
    if (!content && textToSend === undefined) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    saveMessages(updatedMessages);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    // Add assistant placeholder
    const assistantMessageId = Math.random().toString(36).substring(7);
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };

    const messagesWithPlaceholder = [...updatedMessages, assistantMessage];
    saveMessages(messagesWithPlaceholder);

    try {
      const foundModel = AI_MODELS.find((m) => m.id === selectedModelId);
      const streamGenerator = ChatbotApi.stream({
        content: textToSend || inputValue,
        provider: foundModel?.provider,
        model: foundModel?.model || selectedModelId,
        sessionId: widgetSessionId,
      });

      let accumulatedText = '';
      for await (const chunk of streamGenerator) {
        accumulatedText += chunk;
        setMessages((prev) => {
          const current = [...prev];
          const msgIdx = current.findIndex((m) => m.id === assistantMessageId);
          if (msgIdx !== -1 && current[msgIdx]) {
            current[msgIdx].content = accumulatedText;
          }
          return current;
        });
      }

      // Save final state
      setMessages((prev) => {
        const current = [...prev];
        const msgIdx = current.findIndex((m) => m.id === assistantMessageId);
        if (msgIdx !== -1 && current[msgIdx]) {
          current[msgIdx].content = accumulatedText;
        }
        localStorage.setItem('idoc_floating_chat', JSON.stringify(current));
        return current;
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in floating chat widget:', error);
      setMessages((prev) => {
        const current = [...prev];
        const msgIdx = current.findIndex((m) => m.id === assistantMessageId);
        if (msgIdx !== -1 && current[msgIdx]) {
          current[msgIdx].content = t(keys.errorMessage);
        }
        localStorage.setItem('idoc_floating_chat', JSON.stringify(current));
        return current;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateMessage = async (messageId: string) => {
    if (isLoading) return;

    const msgIdx = messages.findIndex((m) => m.id === messageId);
    if (msgIdx === -1) return;

    const targetMessage = messages[msgIdx];
    if (!targetMessage) return;

    if (targetMessage.role === 'assistant') {
      const messagesBefore = messages.slice(0, msgIdx);
      const lastUserMessage = messagesBefore[messagesBefore.length - 1];
      if (!lastUserMessage || lastUserMessage.role !== 'user') return;

      const assistantMessageId = Math.random().toString(36).substring(7);
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messagesBefore, assistantMessage];
      saveMessages(updatedMessages);
      setIsLoading(true);

      try {
        const foundModel = AI_MODELS.find((m) => m.id === selectedModelId);
        const streamGenerator = ChatbotApi.stream({
          content: lastUserMessage.content,
          provider: foundModel?.provider,
          model: foundModel?.model || selectedModelId,
          sessionId: widgetSessionId,
        });

        let accumulatedText = '';
        for await (const chunk of streamGenerator) {
          accumulatedText += chunk;
          setMessages((prev) => {
            const current = [...prev];
            const msgIdx = current.findIndex((m) => m.id === assistantMessageId);
            if (msgIdx !== -1 && current[msgIdx]) {
              current[msgIdx].content = accumulatedText;
            }
            return current;
          });
        }

        setMessages((prev) => {
          const current = [...prev];
          const msgIdx = current.findIndex((m) => m.id === assistantMessageId);
          if (msgIdx !== -1 && current[msgIdx]) {
            current[msgIdx].content = accumulatedText;
          }
          localStorage.setItem('idoc_floating_chat', JSON.stringify(current));
          return current;
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error in floating chat widget regenerate:', error);
        setMessages((prev) => {
          const current = [...prev];
          const msgIdx = current.findIndex((m) => m.id === assistantMessageId);
          if (msgIdx !== -1 && current[msgIdx]) {
            current[msgIdx].content = t(keys.errorMessage);
          }
          localStorage.setItem('idoc_floating_chat', JSON.stringify(current));
          return current;
        });
      } finally {
        setIsLoading(false);
      }
    } else if (targetMessage.role === 'user') {
      setInputValue(targetMessage.content);
    }
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
                    onClick={() => handleSendMessage(text)}
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
                createdAt={message.timestamp ? new Date(message.timestamp) : undefined}
                isLoading={
                  isLoading && index === messages.length - 1 && message.role === 'assistant'
                }
                onRetry={
                  message.role === 'assistant'
                    ? () => handleRegenerateMessage(message.id)
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
            onSubmit={() => handleSendMessage()}
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
