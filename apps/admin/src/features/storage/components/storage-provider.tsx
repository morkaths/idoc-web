import React, { useState } from 'react';
import type { FileResponse } from '@/types';
import useDialogState from '@/hooks/ui/useDialogState';

type DialogType = 'upload' | 'delete';

type StorageContextType = {
  open: DialogType | null;
  setOpen: (str: DialogType | null) => void;
  currentRow: FileResponse | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<FileResponse | null>>;
};

const StorageContext = React.createContext<StorageContextType | null>(null);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null);
  const [currentRow, setCurrentRow] = useState<FileResponse | null>(null);

  return (
    <StorageContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </StorageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStorageContext = () => {
  const ctx = React.useContext(StorageContext);

  if (!ctx) {
    throw new Error('useStorageContext has to be used within <StorageProvider>');
  }

  return ctx;
};
