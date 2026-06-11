'use client';

import React from 'react';
import { PanelLeftOpenIcon } from 'lucide-react';
import { ChatbotApi } from '@/apis';
import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import { AI_MODELS, type AIModel } from '@/components/chat/data/chatbot-data';
import { ChatInput, ChatMessage, ChatMessageList } from '@/components/chat';
import { ChatSidebar } from './sidebar';
import { WelcomeScreen } from './welcome-screen';

// Define Message types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Define Conversation types
interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export const ChatbotView = () => {
  const { t, keys } = useLocale('chatbot');

  // UI state
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeModel, setActiveModel] = React.useState<AIModel>(AI_MODELS[0]);

  // Data state
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  // Load conversations from localstorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('idoc_chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Conversation[];
        setConversations(parsed);
        const firstConv = parsed[0];
        if (parsed.length > 0 && firstConv) {
          setActiveConversationId(firstConv.id);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse saved chats', e);
      }
    }
  }, []);

  // Save conversations to localstorage whenever they change
  const saveConversations = (updated: Conversation[]) => {
    setConversations(updated);
    localStorage.setItem('idoc_chats', JSON.stringify(updated));
  };

  const getActiveConversation = () => {
    return conversations.find((c) => c.id === activeConversationId) || null;
  };

  // Create new conversation
  const createNewChat = () => {
    const newChat: Conversation = {
      id: Math.random().toString(36).substring(7),
      title: t(keys.sidebar.newChat),
      messages: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [newChat, ...conversations];
    saveConversations(updated);
    setActiveConversationId(newChat.id);
  };

  // Delete conversation
  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.filter((c) => c.id !== id);
    saveConversations(updated);

    if (activeConversationId === id) {
      const firstUpdated = updated[0];
      if (updated.length > 0 && firstUpdated) {
        setActiveConversationId(firstUpdated.id);
      } else {
        setActiveConversationId(null);
      }
    }
  };

  // Send prompt from suggestions
  const sendSuggestedPrompt = (promptText: string) => {
    if (isLoading) return;
    handleSendMessage(promptText);
  };

  // Main send message logic with streaming support
  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputValue).trim();
    if (!content && textToSend === undefined) return;

    let currentConversationId = activeConversationId;
    let currentConversations = [...conversations];

    // 1. Create a conversation if none exists
    if (!currentConversationId || currentConversations.length === 0) {
      const newChat: Conversation = {
        id: Math.random().toString(36).substring(7),
        title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
        messages: [],
        createdAt: new Date().toISOString(),
      };
      currentConversations = [newChat, ...currentConversations];
      currentConversationId = newChat.id;
      setActiveConversationId(newChat.id);
    }

    // Find the active conversation
    const conversationIndex = currentConversations.findIndex((c) => c.id === currentConversationId);
    if (conversationIndex === -1) return;

    const conversation = currentConversations[conversationIndex];
    if (!conversation) return;

    // Update conversation title if it was default
    if (
      conversation.title === 'Cuộc hội thoại mới' ||
      conversation.title === 'New Conversation' ||
      conversation.title === t(keys.sidebar.newChat)
    ) {
      conversation.title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
    }

    // 2. Add user message
    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    conversation.messages = [...conversation.messages, userMessage];

    // Save state immediately
    saveConversations(currentConversations);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    // 3. Add temporary assistant placeholder for streaming
    const assistantMessageId = Math.random().toString(36).substring(7);
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };

    conversation.messages = [...conversation.messages, assistantMessage];
    saveConversations(currentConversations);

    try {
      // Call local API route /api/chat
      const streamGenerator = ChatbotApi.stream({
        content: textToSend || inputValue,
        provider: activeModel.provider,
        model: activeModel.model,
        sessionId: currentConversationId ?? undefined,
      });

      let accumulatedText = '';
      for await (const chunk of streamGenerator) {
        accumulatedText += chunk;
        setConversations((prev) => {
          const updated = [...prev];
          const convIdx = updated.findIndex((c) => c.id === currentConversationId);
          if (convIdx !== -1) {
            const targetConv = updated[convIdx];
            if (targetConv) {
              const msgIdx = targetConv.messages.findIndex((m) => m.id === assistantMessageId);
              if (msgIdx !== -1 && targetConv.messages[msgIdx]) {
                targetConv.messages[msgIdx].content = accumulatedText;
              }
            }
          }
          return updated;
        });
      }

      // Save final state to LocalStorage
      setConversations((prev) => {
        const updated = [...prev];
        const convIdx = updated.findIndex((c) => c.id === currentConversationId);
        if (convIdx !== -1) {
          const targetConv = updated[convIdx];
          if (targetConv) {
            const msgIdx = targetConv.messages.findIndex((m) => m.id === assistantMessageId);
            if (msgIdx !== -1 && targetConv.messages[msgIdx]) {
              targetConv.messages[msgIdx].content = accumulatedText;
            }
          }
        }
        localStorage.setItem('idoc_chats', JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error communicating with chatbot API', error);

      // Update with error message
      setConversations((prev) => {
        const updated = [...prev];
        const convIdx = updated.findIndex((c) => c.id === currentConversationId);
        if (convIdx !== -1) {
          const targetConv = updated[convIdx];
          if (targetConv) {
            const msgIdx = targetConv.messages.findIndex((m) => m.id === assistantMessageId);
            if (msgIdx !== -1 && targetConv.messages[msgIdx]) {
              targetConv.messages[msgIdx].content = t(keys.errorMessage);
            }
          }
        }
        localStorage.setItem('idoc_chats', JSON.stringify(updated));
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateMessage = async (messageId: string) => {
    if (isLoading) return;

    const currentConversationId = activeConversationId;
    const currentConversations = [...conversations];

    const conversationIndex = currentConversations.findIndex((c) => c.id === currentConversationId);
    if (conversationIndex === -1) return;

    const conversation = currentConversations[conversationIndex];
    if (!conversation) return;

    const msgIdx = conversation.messages.findIndex((m) => m.id === messageId);
    if (msgIdx === -1) return;

    const targetMessage = conversation.messages[msgIdx];
    if (!targetMessage) return;

    if (targetMessage.role === 'assistant') {
      const messagesBefore = conversation.messages.slice(0, msgIdx);
      const lastUserMessage = messagesBefore[messagesBefore.length - 1];
      if (!lastUserMessage || lastUserMessage.role !== 'user') return;

      const assistantMessageId = Math.random().toString(36).substring(7);
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
      };

      conversation.messages = [...messagesBefore, assistantMessage];
      saveConversations(currentConversations);
      setIsLoading(true);

      try {
        const streamGenerator = ChatbotApi.stream({
          content: lastUserMessage.content,
          provider: activeModel.provider,
          model: activeModel.model,
          sessionId: currentConversationId ?? undefined,
        });

        let accumulatedText = '';
        for await (const chunk of streamGenerator) {
          accumulatedText += chunk;
          setConversations((prev) => {
            const updated = [...prev];
            const convIdx = updated.findIndex((c) => c.id === currentConversationId);
            if (convIdx !== -1) {
              const targetConv = updated[convIdx];
              if (targetConv) {
                const msgIdx = targetConv.messages.findIndex(
                  (m) => m.id === assistantMessageId
                );
                if (msgIdx !== -1 && targetConv.messages[msgIdx]) {
                  targetConv.messages[msgIdx].content = accumulatedText;
                }
              }
            }
            return updated;
          });
        }

        setConversations((prev) => {
          const updated = [...prev];
          const convIdx = updated.findIndex((c) => c.id === currentConversationId);
          if (convIdx !== -1) {
            const targetConv = updated[convIdx];
            if (targetConv) {
              const msgIdx = targetConv.messages.findIndex((m) => m.id === assistantMessageId);
              if (msgIdx !== -1 && targetConv.messages[msgIdx]) {
                targetConv.messages[msgIdx].content = accumulatedText;
              }
            }
          }
          localStorage.setItem('idoc_chats', JSON.stringify(updated));
          return updated;
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error regenerating chatbot message', error);

        setConversations((prev) => {
          const updated = [...prev];
          const convIdx = updated.findIndex((c) => c.id === currentConversationId);
          if (convIdx !== -1) {
            const targetConv = updated[convIdx];
            if (targetConv) {
              const msgIdx = targetConv.messages.findIndex((m) => m.id === assistantMessageId);
              if (msgIdx !== -1 && targetConv.messages[msgIdx]) {
                targetConv.messages[msgIdx].content = t(keys.errorMessage);
              }
            }
          }
          localStorage.setItem('idoc_chats', JSON.stringify(updated));
          return updated;
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setInputValue(targetMessage.content);
    }
  };

  const activeConversation = getActiveConversation();
  const messages = activeConversation ? activeConversation.messages : [];

  const handleRenameConversation = (id: string, newTitle: string) => {
    const updated = conversations.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          title: newTitle,
        };
      }
      return c;
    });

    saveConversations(updated);
  };

  return (
    <div className='border-border bg-background flex h-[calc(100vh-3.5rem)] w-full overflow-hidden border-t xl:h-[calc(100vh-3rem)]'>
      {/* Sidebar - Chats history */}
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onCreateNewChat={createNewChat}
        onDeleteChat={deleteChat}
        onRenameChat={handleRenameConversation}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      {/* Main chat interface */}
      <div className='bg-background flex h-full min-w-0 flex-1 flex-col'>
        {/* Topbar of main chat interface */}
        <div className='border-border flex h-[60px] shrink-0 items-center justify-between border-b px-4'>
          <div className='flex items-center gap-3 overflow-hidden'>
            {!sidebarOpen && (
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setSidebarOpen(true)}
                className='text-muted-foreground hover:text-foreground h-9 w-9 rounded-lg'
                title='Expand Sidebar'
              >
                <PanelLeftOpenIcon className='h-4.5 w-4.5' />
              </Button>
            )}
            <h1 className='text-foreground truncate text-sm font-semibold'>
              {activeConversation ? activeConversation.title : t(keys.title)}
            </h1>
          </div>
        </div>

        {/* Messages List Area */}
        <div className='relative flex min-h-0 flex-1 flex-col justify-between overflow-hidden'>
          {messages.length === 0 ? (
            /* Welcome / Suggestions View */
            <WelcomeScreen onSendSuggestedPrompt={sendSuggestedPrompt} />
          ) : (
            /* Message List View */
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

          {/* Bottom input section */}
          <div className='from-background via-background shrink-0 bg-gradient-to-t to-transparent p-4 pt-6 md:p-6'>
            <div className='mx-auto w-full max-w-2xl'>
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSubmit={() => handleSendMessage()}
                isLoading={isLoading}
                selectedModelId={activeModel.id}
                onModelChange={(id) => {
                  const model = AI_MODELS.find((m) => m.id === id);
                  if (model) setActiveModel(model);
                }}
                showModelSelector={true}
                placeholder={t(keys.inputPlaceholder, { modelName: activeModel.name })}
              />
              <p className='text-muted-foreground mt-2 text-center text-[10px]'>
                {t(keys.disclaimer)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatbotView;
