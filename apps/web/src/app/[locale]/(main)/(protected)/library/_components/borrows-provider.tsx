import React, { useState } from 'react';
import type { LoanResponse } from '@/types';
import useDialogState from '@/hooks/ui/useDialogState';

type DialogType = 'create' | 'edit' | 'return' | 'extend' | 'history' | 'review' | 'export';

type BorrowsContextType = {
  open: DialogType | null;
  setOpen: (str: DialogType | null) => void;
  currentRow: LoanResponse | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<LoanResponse | null>>;
};

const BorrowsContext = React.createContext<BorrowsContextType | null>(null);

export function BorrowsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null);
  const [currentRow, setCurrentRow] = useState<LoanResponse | null>(null);

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
