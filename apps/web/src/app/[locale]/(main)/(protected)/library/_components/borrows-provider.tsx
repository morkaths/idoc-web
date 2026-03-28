import React, { useState } from 'react';
import type { BorrowResponse } from '@/types';
import useDialogState from '@/hooks/ui/useDialogState';

type DialogType = 'export' | 'return' | 'extend' | 'history' | 'review';

type BorrowsContextType = {
  open: DialogType | null;
  setOpen: (str: DialogType | null) => void;
  currentRow: BorrowResponse | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<BorrowResponse | null>>;
};

const BorrowsContext = React.createContext<BorrowsContextType | null>(null);

export function BorrowsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null);
  const [currentRow, setCurrentRow] = useState<BorrowResponse | null>(null);

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
