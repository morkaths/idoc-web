import React, { useState } from 'react';
import type { AuthorResponse } from '@/types';
import useDialogState from '@/hooks/ui/useDialogState';

type DialogType = 'create' | 'update' | 'delete' | 'import';

type AuthorsContextType = {
  open: DialogType | null;
  setOpen: (str: DialogType | null) => void;
  currentRow: AuthorResponse | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<AuthorResponse | null>>;
};

const AuthorsContext = React.createContext<AuthorsContextType | null>(null);

export function AuthorsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null);
  const [currentRow, setCurrentRow] = useState<AuthorResponse | null>(null);

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
