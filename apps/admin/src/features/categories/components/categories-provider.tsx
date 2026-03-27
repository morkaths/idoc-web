import React, { useState } from 'react';
import type { CategoryResponse } from '@/types';
import useDialogState from '@/hooks/ui/useDialogState';

type DialogType = 'create' | 'update' | 'delete' | 'import';

type CategoriesContextType = {
  open: DialogType | null;
  setOpen: (str: DialogType | null) => void;
  currentRow: CategoryResponse | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<CategoryResponse | null>>;
};

const CategoriesContext = React.createContext<CategoriesContextType | null>(null);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null);
  const [currentRow, setCurrentRow] = useState<CategoryResponse | null>(null);

  return (
    <CategoriesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CategoriesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCategoriesContext = () => {
  const ctx = React.useContext(CategoriesContext);

  if (!ctx) {
    throw new Error('useCategoriesContext has to be used within <CategoriesProvider>');
  }

  return ctx;
};