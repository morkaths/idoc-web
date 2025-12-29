import React, { useState } from 'react';
import type { Borrow } from '@/types';
import useDialogState from '@/hooks/ui/useDialogState';

type DialogType = 'export' | 'return' | 'extend';

type BorrowsContextType = {
  open: DialogType | null;
  setOpen: (str: DialogType | null) => void;
  currentRow: Borrow | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Borrow | null>>;
};

const BorrowsContext = React.createContext<BorrowsContextType | null>(null);

export function BorrowsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null);
  const [currentRow, setCurrentRow] = useState<Borrow | null>(null);

  return (
    <BorrowsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </BorrowsContext.Provider>
  );
}

export const useBorrowsContext = () => {
  const ctx = React.useContext(BorrowsContext);

  if (!ctx) {
    throw new Error('useBorrowsContext has to be used within <BorrowsProvider>');
  }

  return ctx;
};