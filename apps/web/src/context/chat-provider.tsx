'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ChatbotApi, BookApi } from '@/apis';
import { type BookResponse } from '@/types';
import { useLocale } from '@/hooks/ui/useLocale';
import { AI_MODELS } from '@/components/chat/data/chatbot-data';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[];
  books?: BookResponse[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

type ChatContextType = {
  selectedModelId: string;
  setSelectedModelId: (modelId: string) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | null;
  isLoading: boolean;
  createNewChat: () => void;
  deleteChat: (id: string, e: React.MouseEvent) => void;
  handleSendMessage: (content: string) => Promise<void>;
  handleRegenerateMessage: (
    messageId: string,
    setInputValue?: (val: string) => void
  ) => Promise<void>;
  handleRenameConversation: (id: string, newTitle: string) => void;
  setActiveConversationId: (id: string | null) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

type ChatProviderProps = {
  children: React.ReactNode;
};

const LOCAL_STORAGE_KEY = 'idoc_chat_model';
const DEFAULT_MODEL_ID = 'gemini-1.5-flash';

export function ChatProvider({ children }: ChatProviderProps) {
  const { t, keys } = useLocale('chatbot');

  const [selectedModelId, setSelectedModelIdState] = useState<string>(DEFAULT_MODEL_ID);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Active AI Model based on selectedModelId
  const activeModel = useMemo(() => {
    return AI_MODELS.find((m) => m.id === selectedModelId) || AI_MODELS[0];
  }, [selectedModelId]);

  // Load selected model and conversations from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedModel = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedModel) {
        // Defer to avoid synchronous setState inside useEffect warning
        setTimeout(() => {
          setSelectedModelIdState(savedModel);
        }, 0);
      }

      const savedChats = localStorage.getItem('idoc_chats');
      if (savedChats) {
        try {
          const parsed = JSON.parse(savedChats) as Conversation[];
          setTimeout(() => {
            setConversations(parsed);
            if (parsed.length > 0 && parsed[0]) {
              setActiveConversationId(parsed[0].id);
            }
          }, 0);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Failed to parse saved chats', e);
        }
      }
    }
  }, []);

  const setSelectedModelId = (modelId: string) => {
    setSelectedModelIdState(modelId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, modelId);
    }
  };

  const saveConversations = (updated: Conversation[]) => {
    setConversations(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('idoc_chats', JSON.stringify(updated));
    }
  };

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

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
      if (updated.length > 0 && updated[0]) {
        setActiveConversationId(updated[0].id);
      } else {
        setActiveConversationId(null);
      }
    }
  };

  // Rename conversation
  const handleRenameConversation = (id: string, newTitle: string) => {
    const updated = conversations.map((c) => {
      if (c.id === id) {
        return { ...c, title: newTitle };
      }
      return c;
    });
    saveConversations(updated);
  };

  // Main send message logic with streaming support
  const handleSendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    let currentConversationId = activeConversationId;
    let currentConversations = [...conversations];

    // 1. Create a conversation if none exists
    if (!currentConversationId || currentConversations.length === 0) {
      const newChat: Conversation = {
        id: Math.random().toString(36).substring(7),
        title: trimmed.substring(0, 30) + (trimmed.length > 30 ? '...' : ''),
        messages: [],
        createdAt: new Date().toISOString(),
      };
      currentConversations = [newChat, ...currentConversations];
      currentConversationId = newChat.id;
      setActiveConversationId(newChat.id);
    }

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
      conversation.title = trimmed.substring(0, 30) + (trimmed.length > 30 ? '...' : '');
    }

    // 2. Add user message
    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    conversation.messages = [...conversation.messages, userMessage];

    // Save state immediately
    saveConversations(currentConversations);
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
      const streamGenerator = ChatbotApi.stream({
        content: trimmed,
        provider: activeModel.provider,
        model: activeModel.model,
        sessionId: currentConversationId ?? undefined,
      });

      let accumulatedText = '';
      for await (const chunk of streamGenerator) {
        if (chunk.startsWith('[SOURCES]')) {
          const jsonStr = chunk.replace('[SOURCES]', '').trim();
          try {
            const sourceIds = JSON.parse(jsonStr) as string[];
            BookApi.findByIds(sourceIds)
              .then((res) => {
                const books = (res.data || []).filter(Boolean) as BookResponse[];
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
                        targetConv.messages[msgIdx].sources = sourceIds;
                        targetConv.messages[msgIdx].books = books;
                      }
                    }
                  }
                  localStorage.setItem('idoc_chats', JSON.stringify(updated));
                  return updated;
                });
              })
              .catch((_e) => {
                // Silent catch
              });
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Failed to parse sources', e);
          }
        } else {
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
      }

      // Save final state
      setConversations((prev) => {
        const updated = [...prev];
        const convIdx = updated.findIndex((c) => c.id === currentConversationId);
        if (convIdx !== -1) {
          const targetConv = updated[convIdx];
          if (targetConv) {
            const msgIdx = targetConv.messages.findIndex((m) => m.id === assistantMessageId);
            if (msgIdx !== -1 && targetConv.messages[msgIdx]) {
              const currentMsg = targetConv.messages[msgIdx];
              if (currentMsg) {
                currentMsg.content = accumulatedText;
              }
            }
          }
        }
        localStorage.setItem('idoc_chats', JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error communicating with chatbot API', error);
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

  // Regenerate assistant message or retry
  const handleRegenerateMessage = async (
    messageId: string,
    setInputValue?: (val: string) => void
  ) => {
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
          if (chunk.startsWith('[SOURCES]')) {
            const jsonStr = chunk.replace('[SOURCES]', '').trim();
            try {
              const sourceIds = JSON.parse(jsonStr) as string[];
              BookApi.findByIds(sourceIds)
                .then((res) => {
                  const books = (res.data || []).filter(Boolean) as BookResponse[];
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
                          targetConv.messages[msgIdx].sources = sourceIds;
                          targetConv.messages[msgIdx].books = books;
                        }
                      }
                    }
                    localStorage.setItem('idoc_chats', JSON.stringify(updated));
                    return updated;
                  });
                })
                .catch((_e) => {
                  // Silent catch
                });
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error('Failed to parse sources', e);
            }
          } else {
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
        }

        setConversations((prev) => {
          const updated = [...prev];
          const convIdx = updated.findIndex((c) => c.id === currentConversationId);
          if (convIdx !== -1) {
            const targetConv = updated[convIdx];
            if (targetConv) {
              const msgIdx = targetConv.messages.findIndex((m) => m.id === assistantMessageId);
              if (msgIdx !== -1 && targetConv.messages[msgIdx]) {
                const currentMsg = targetConv.messages[msgIdx];
                if (currentMsg) {
                  currentMsg.content = accumulatedText;
                }
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
      if (setInputValue) {
        setInputValue(targetMessage.content);
      }
    }
  };

  return (
    <ChatContext.Provider
      value={{
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const chatContext = useContext(ChatContext);

  if (!chatContext) {
    throw new Error('useChat has to be used within ChatProvider');
  }

  return chatContext;
};
