// ...existing code...
import React, { useState } from 'react'
import useDialogState from '@/hooks/ui/useDialogState'
import { Book } from '@/types'

type BooksDialogType = 'create' | 'update' | 'delete' | 'import'

type BooksContextType = {
  open: BooksDialogType | null
  setOpen: (str: BooksDialogType | null) => void
  currentRow: Book | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Book | null>>
}

const BooksContext = React.createContext<BooksContextType | null>(null)

export function BooksProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<BooksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Book | null>(null)

  return (
    <BooksContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </BooksContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBooksContext = () => {
  const ctx = React.useContext(BooksContext)

  if (!ctx) {
    throw new Error('useBooksContext has to be used within <BooksProvider>')
  }

  return ctx
}
// ...existing code...