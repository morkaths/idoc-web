import React, { useState } from 'react';
import type { BookResponse } from '@/types';
import useDialogState from '@/hooks/ui/useDialogState';

type DialogType = 'create' | 'update' | 'delete' | 'import';

type BooksContextType = {
  open: DialogType | null;
  setOpen: (str: DialogType | null) => void;
  currentRow: BookResponse | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<BookResponse | null>>;
};

const BooksContext = React.createContext<BooksContextType | null>(null);

export function BooksProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null);
  const [currentRow, setCurrentRow] = useState<BookResponse | null>(null);

  return (
    <BooksContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </BooksContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBooksContext = () => {
  const ctx = React.useContext(BooksContext);

  if (!ctx) {
    throw new Error('useBooksContext has to be used within <BooksProvider>');
  }

  return ctx;
};
