import React, { useState } from 'react';
import type { RoleResponse } from '@/types';
import useDialogState from '@/hooks/ui/useDialogState';

type DialogType = 'create' | 'update' | 'delete' | 'import';

type RolesContextType = {
  open: DialogType | null;
  setOpen: (str: DialogType | null) => void;
  currentRow: RoleResponse | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<RoleResponse | null>>;
};

const RolesContext = React.createContext<RolesContextType | null>(null);

export function RolesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null);
  const [currentRow, setCurrentRow] = useState<RoleResponse | null>(null);

  return (
    <RolesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RolesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRolesContext = () => {
  const ctx = React.useContext(RolesContext);

  if (!ctx) {
    throw new Error('useRolesContext has to be used within <RolesProvider>');
  }

  return ctx;
};