import { createContext, useContext, useState } from 'react'
import useHotkeys from '@/hooks/ui/useHotkeys'
import { CommandMenu } from '@/components/command-menu'

type SearchContextType = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchContext = createContext<SearchContextType | null>(null)

type SearchProviderProps = {
  children: React.ReactNode
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [open, setOpen] = useState(false)

  useHotkeys([
    {
      key: 'k',
      meta: true, // Cmd (Mac)
      handler: () => setOpen((o) => !o),
      preventDefault: true,
    },
    {
      key: 'k',
      ctrl: true, // Ctrl (Windows/Linux)
      handler: () => setOpen((o) => !o),
      preventDefault: true,
    },
  ])

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandMenu />
    </SearchContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSearch = () => {
  const searchContext = useContext(SearchContext)

  if (!searchContext) {
    throw new Error('useSearch has to be used within SearchProvider')
  }

  return searchContext
}
