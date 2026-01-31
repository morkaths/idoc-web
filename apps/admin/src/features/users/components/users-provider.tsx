import React, { useState } from 'react';
import useDialogState from '@/hooks/ui/useDialogState';
import { type User } from '@/types';

type UsersDialogType = 'invite' | 'add' | 'edit' | 'delete';

type UsersContextType = {
  open: UsersDialogType | null;
  setOpen: (str: UsersDialogType | null) => void;
  currentRow: User | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>;
};

const UsersContext = React.createContext<UsersContextType | null>(null);

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null);
  const [currentRow, setCurrentRow] = useState<User | null>(null);

  return (
    <UsersContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </UsersContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsersContext = () => {
  const ctx = React.useContext(UsersContext);

  if (!ctx) {
    throw new Error('useUsersContext has to be used within <UsersProvider>');
  }

  return ctx;
};
