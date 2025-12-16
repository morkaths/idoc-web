import React, { useState } from 'react';
import type { Author } from '@/types';
import useDialogState from '@/hooks/ui/useDialogState';

type DialogType = 'create' | 'update' | 'delete' | 'import';

type AuthorsContextType = {
  open: DialogType | null;
  setOpen: (str: DialogType | null) => void;
  currentRow: Author | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Author | null>>;
};

const AuthorsContext = React.createContext<AuthorsContextType | null>(null);

export function AuthorsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null);
  const [currentRow, setCurrentRow] = useState<Author | null>(null);

  return (
    <AuthorsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </AuthorsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthorsContext = () => {
  const ctx = React.useContext(AuthorsContext);

  if (!ctx) {
    throw new Error('useAuthorsContext has to be used within <AuthorsProvider>');
  }

  return ctx;
};
