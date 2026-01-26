import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { getCookie, setCookie, removeCookie } from '@/lib/cookies';
import { themeColors, themeConfig } from '@/components/layout/data/theme-data';

export type Mode = "dark" | "light" | "system";
type ColorKey = string;
type ResolvedMode = "dark" | "light";

const DEFAULT_MODE: Mode = themeConfig.defaults.mode;
const DEFAULT_COLOR: ColorKey = themeConfig.defaults.color;
const MODE_COOKIE_NAME = 'idoc_admin_mode';
const COLOR_COOKIE_NAME = 'idoc_admin_color';
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultMode?: Mode;
  defaultColor?: ColorKey;
  storageKey?: string;
  colorStorageKey?: string;
};

type ThemeProviderState = {
  defaultMode: Mode;
  resolvedMode: ResolvedMode;
  mode: Mode;
  setMode: (mode: Mode) => void;
  resetTheme: () => void;
  
  color: ColorKey;
  setColor: (color: ColorKey) => void;
  availableColors: string[];
  
  radius: string;
  setRadius: (radius: string) => void;

  font: string;
  setFont: (font: string) => void;
  availableFonts: { label: string; value: string }[];
};

const initialState: ThemeProviderState = {
  defaultMode: DEFAULT_MODE,
  resolvedMode: 'light',
  mode: DEFAULT_MODE,
  setMode: () => null,
  resetTheme: () => null,
  color: DEFAULT_COLOR,
  setColor: () => null,
  availableColors: [],
  radius: themeConfig.defaults.radius,
  setRadius: () => null,
  font: themeConfig.defaults.font,
  setFont: () => null,
  availableFonts: [],
};

const ThemeContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultMode = DEFAULT_MODE,
  defaultColor = DEFAULT_COLOR,
  storageKey = MODE_COOKIE_NAME,
  colorStorageKey = COLOR_COOKIE_NAME,
  ...props
}: ThemeProviderProps) {
  // --- MODE STATE (Light/Dark/System) ---
  const [mode, _setMode] = useState<Mode>(() => {
    try {
      return (getCookie(storageKey) as Mode) || defaultMode;
    } catch {
      return defaultMode;
    }
  });

  const [radius, _setRadius] = useState<string>(() => {
    try {
      return getCookie('idoc_admin_radius') || themeConfig.defaults.radius;
    } catch {
      return themeConfig.defaults.radius;
    }
  });

  const [font, _setFont] = useState<string>(() => {
    try {
      return getCookie('idoc_admin_font') || themeConfig.defaults.font;
    } catch {
      return themeConfig.defaults.font;
    }
  });

  // --- COLOR STATE (Color Scheme) ---
  const [color, _setColor] = useState<ColorKey>(() => {
    try {
      // Validate if the cookie value exists in our color presets
      const cookieColor = getCookie(colorStorageKey) as string;
      if (cookieColor && themeColors[cookieColor]) {
        return cookieColor;
      }
      return defaultColor;
    } catch {
      return defaultColor;
    }
  });

  const resolvedMode = useMemo((): ResolvedMode => {
    if (mode === 'system') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'light';
    }
    return mode as ResolvedMode;
  }, [mode]);

  // Apply Theme (Mode + Color + Radius + Font)
  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 1. Handle Class for Dark Mode
    const applyModeClass = () => {
      root.classList.remove('dark', 'light');

      if (mode === 'system') {
         if (mediaQuery.matches) root.classList.add('dark');
      } else if (mode === 'dark') {
         root.classList.add('dark');
      } 
      // 'light' is default, generally no class needed or you can add 'light'
    };

    // 2. Handle CSS Variables from Color
    const applyColorStyles = () => {
      // Determine effective mode for variable selection
      let effectiveMode: 'dark' | 'light';
      if (mode === 'system') {
        effectiveMode = mediaQuery.matches ? 'dark' : 'light';
      } else {
        effectiveMode = mode === 'dark' ? 'dark' : 'light';
      }

      const selectedColor = themeColors[color];
      if (!selectedColor) return;

      const styles = effectiveMode === 'dark' ? selectedColor.styles.dark : selectedColor.styles.light;

      // Inject variables
      Object.entries(styles).forEach(([key, value]) => {
        if (value && key !== 'radius' && key !== 'font-sans') {
            root.style.setProperty(`--${key}`, value);
        }
      });
      
      // Apply Radius and Font separately
      root.style.setProperty('--radius', radius);
      root.style.setProperty('--font-sans', font);
    };

    const applyAll = () => {
        applyModeClass();
        applyColorStyles();
    };

    applyAll();

    // Listen for system changes if mode is system
    const handleSystemChange = () => {
      if (mode === 'system') {
        applyAll();
      }
    };

    mediaQuery.addEventListener?.('change', handleSystemChange);
    return () => mediaQuery.removeEventListener?.('change', handleSystemChange);

  }, [mode, color, radius, font]);


  const setMode = (t: Mode) => {
    try {
      setCookie(storageKey, t, THEME_COOKIE_MAX_AGE);
    } catch {}
    _setMode(t);
  };

  const setColor = (p: ColorKey) => {
    if (!themeColors[p]) return; // Guard
    try {
      setCookie(colorStorageKey, p, THEME_COOKIE_MAX_AGE);
    } catch {}
    _setColor(p);
  };
  
  const setRadius = (r: string) => {
    try {
      setCookie('idoc_admin_radius', r, THEME_COOKIE_MAX_AGE);
    } catch {}
    _setRadius(r);
  };
  
  const setFont = (f: string) => {
    try {
      setCookie('idoc_admin_font', f, THEME_COOKIE_MAX_AGE);
    } catch {}
    _setFont(f);
  };

  const resetTheme = () => {
    try {
      removeCookie(storageKey);
      removeCookie(colorStorageKey);
      removeCookie('idoc_admin_radius');
      removeCookie('idoc_admin_font');
    } catch {}
    _setMode(DEFAULT_MODE);
    _setColor(DEFAULT_COLOR);
    _setRadius(themeConfig.defaults.radius);
    _setFont(themeConfig.defaults.font);
  };

  const contextValue: ThemeProviderState = {
    defaultMode,
    resolvedMode,
    resetTheme,
    mode,
    setMode,
    color,
    setColor,
    availableColors: Object.keys(themeColors),
    radius,
    setRadius,
    font,
    setFont,
    availableFonts: themeConfig.availableFonts,
  };

  return (
    <ThemeContext.Provider value={contextValue} {...props}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
