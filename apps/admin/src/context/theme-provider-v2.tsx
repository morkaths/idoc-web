import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

type Theme =
  | 'system'
  // Light modes
  | 'light'
  | 'sakura'
  | 'matcha'
  | 'latte'
  | 'cyberpunk'
  // Dark modes
  | 'dark'
  | 'dracula'
  | 'gruvbox'
  | 'nordic'
  | 'ocean'
type ResolvedTheme = Exclude<Theme, 'system'>

const DEFAULT_THEME: Theme = 'system'
const THEME_COOKIE_NAME = 'vite-ui-theme'
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  defaultTheme: Theme
  resolvedTheme: ResolvedTheme
  theme: Theme
  setTheme: (theme: Theme) => void
  resetTheme: () => void
}

const initialState: ThemeProviderState = {
  defaultTheme: DEFAULT_THEME,
  resolvedTheme: 'light',
  theme: DEFAULT_THEME,
  setTheme: () => null,
  resetTheme: () => null,
}

const ThemeContext = createContext<ThemeProviderState>(initialState)

const THEME_VARIANTS: ResolvedTheme[] = [
  'light',
  'sakura',
  'latte',
  'cyberpunk',
  'dark',
  'dracula',
  'gruvbox',
  'nordic',
  'matcha',
  'ocean',
]

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = THEME_COOKIE_NAME,
  ...props
}: ThemeProviderProps) {
  const [theme, _setTheme] = useState<Theme>(() => {
    try {
      return (getCookie(storageKey) as Theme) || defaultTheme
    } catch {
      return defaultTheme
    }
  })

  const resolvedTheme = useMemo((): ResolvedTheme => {
    if (theme === 'system') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      }
      return 'light'
    }
    return theme as ResolvedTheme
  }, [theme])

  useEffect(() => {
    const root = window.document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const clearAll = () => {
      root.classList.remove('dark')
      // remove theme-* classes
      THEME_VARIANTS.forEach((t) => {
        if (t !== 'dark' && t !== 'light') root.classList.remove(`theme-${t}`)
      })
      // optionally remove 'light' if you ever add it
      root.classList.remove('light')
    }

    const apply = () => {
      clearAll()
      if (theme === 'system') {
        if (mediaQuery.matches) {
          root.classList.add('dark')
        } else {
          // leave as default (light) — or add 'light' class if desired
        }
        return
      }

      if (theme === 'dark') {
        root.classList.add('dark')
        return
      }

      if (theme === 'light') {
        // keep default root variables (no extra class) or add 'light' class:
        // root.classList.add('light')
        return
      }

      // other named themes: add theme-{name}
      root.classList.add(`theme-${theme}`)
    }

    // initial apply
    apply()

    // listen to system changes only if using 'system'
    const handleChange = () => {
      if (theme === 'system') apply()
    }

    mediaQuery.addEventListener?.('change', handleChange)
    return () => mediaQuery.removeEventListener?.('change', handleChange)
  }, [theme])

  const setTheme = (t: Theme) => {
    try {
      setCookie(storageKey, t, THEME_COOKIE_MAX_AGE)
    } catch {
      /* ignore cookie set errors */
    }
    _setTheme(t)
  }

  const resetTheme = () => {
    try {
      removeCookie(storageKey)
    } catch {
      /* ignore */
    }
    _setTheme(DEFAULT_THEME)
  }

  const contextValue: ThemeProviderState = {
    defaultTheme,
    resolvedTheme,
    resetTheme,
    theme,
    setTheme,
  }

  return (
    <ThemeContext.Provider value={contextValue} {...props}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
