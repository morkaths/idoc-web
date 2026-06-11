import { createContext, useContext, useState, useEffect } from 'react';

type ChatContextType = {
  selectedModelId: string;
  setSelectedModelId: (modelId: string) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

type ChatProviderProps = {
  children: React.ReactNode;
};

const LOCAL_STORAGE_KEY = 'idoc_chat_model';
const DEFAULT_MODEL_ID = 'gemini-1.5-flash';

export function ChatProvider({ children }: ChatProviderProps) {
  const [selectedModelId, setSelectedModelIdState] = useState<string>(DEFAULT_MODEL_ID);

  // Load selected model from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setTimeout(() => {
          setSelectedModelIdState(saved);
        }, 0);
      }
    }
  }, []);

  const setSelectedModelId = (modelId: string) => {
    setSelectedModelIdState(modelId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, modelId);
    }
  };

  return (
    <ChatContext.Provider value={{ selectedModelId, setSelectedModelId }}>
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
