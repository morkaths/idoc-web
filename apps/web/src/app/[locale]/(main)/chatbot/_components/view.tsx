'use client';

import React from 'react';
import { useChat } from '@/context/chat-provider';
import { PanelLeftOpenIcon } from 'lucide-react';
import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import { ChatInput, ChatMessage, ChatMessageList } from '@/components/chat';
import { AI_MODELS } from '@/components/chat/data/chatbot-data';
import { ChatSidebar } from './sidebar';
import { WelcomeScreen } from './welcome-screen';

export const ChatbotView = () => {
  const { t, keys } = useLocale('chatbot');

  // UI state
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [inputValue, setInputValue] = React.useState('');

  const {
    selectedModelId,
    setSelectedModelId,
    conversations,
    activeConversationId,
    activeConversation,
    isLoading,
    createNewChat,
    deleteChat,
    handleSendMessage,
    handleRegenerateMessage,
    handleRenameConversation,
    setActiveConversationId,
  } = useChat();

  const activeModel = React.useMemo(() => {
    return AI_MODELS.find((m) => m.id === selectedModelId) || AI_MODELS[0];
  }, [selectedModelId]);

  // Send prompt from suggestions
  const sendSuggestedPrompt = (promptText: string) => {
    if (isLoading) return;
    handleSendMessage(promptText);
  };

  // Submit new message
  const onSubmitMessage = async () => {
    if (isLoading) return;
    const content = inputValue.trim();
    if (!content) return;

    setInputValue('');
    await handleSendMessage(content);
  };

  const messages = activeConversation ? activeConversation.messages : [];

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

          {/* Bottom input section */}
          <div className='from-background via-background shrink-0 bg-gradient-to-t to-transparent p-4 pt-6 md:p-6'>
            <div className='mx-auto w-full max-w-2xl'>
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
