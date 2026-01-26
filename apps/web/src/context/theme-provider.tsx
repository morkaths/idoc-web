"use client";

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { getCookie, setCookie, removeCookie } from '@/lib/cookies';
import { themeColors, themeConfig } from '@/components/layout/data/theme-data';

export type Mode = "dark" | "light" | "system";
type ColorKey = string;
type ResolvedMode = "dark" | "light";

const DEFAULT_MODE: Mode = themeConfig.defaults.mode;
const DEFAULT_COLOR: ColorKey = themeConfig.defaults.color;
const MODE_COOKIE_NAME = 'idoc_web_mode';
const COLOR_COOKIE_NAME = 'idoc_web_color';
const RADIUS_COOKIE_NAME = 'idoc_web_radius';
const FONT_COOKIE_NAME = 'idoc_web_font';
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
  const [mode, _setMode] = useState<Mode>(() => {
    try {
      const saved = getCookie(storageKey) as Mode;
      return saved || defaultMode;
    } catch {
      return defaultMode;
    }
  });

  const [radius, _setRadius] = useState<string>(() => {
    try {
      return getCookie(RADIUS_COOKIE_NAME) || themeConfig.defaults.radius;
    } catch {
      return themeConfig.defaults.radius;
    }
  });

  const [font, _setFont] = useState<string>(() => {
    try {
      return getCookie(FONT_COOKIE_NAME) || themeConfig.defaults.font;
    } catch {
      return themeConfig.defaults.font;
    }
  });

  const [color, _setColor] = useState<ColorKey>(() => {
    try {
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

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      // 1. Handle Dark Mode Class
      root.classList.remove('dark', 'light');
      if (resolvedMode === 'dark') {
        root.classList.add('dark');
      }

      // 2. Handle CSS Variables
      const selectedColor = themeColors[color];
      if (selectedColor) {
        const styles = resolvedMode === 'dark' ? selectedColor.styles.dark : selectedColor.styles.light;
        Object.entries(styles).forEach(([key, value]) => {
          if (typeof value === 'string' && key !== 'radius' && key !== 'font-sans') {
            root.style.setProperty(`--${key}`, value);
          }
        });
      }

      // 3. Radius and Font
      root.style.setProperty('--radius', radius);
      root.style.setProperty('--font-sans', font);
    };

    applyTheme();

    const handleSystemChange = () => {
      if (mode === 'system') applyTheme();
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [mode, color, radius, font, resolvedMode]);

  const setMode = (m: Mode) => {
    setCookie(storageKey, m, THEME_COOKIE_MAX_AGE);
    _setMode(m);
  };

  const setColor = (c: ColorKey) => {
    if (!themeColors[c]) return;
    setCookie(colorStorageKey, c, THEME_COOKIE_MAX_AGE);
    _setColor(c);
  };

  const setRadius = (r: string) => {
    setCookie(RADIUS_COOKIE_NAME, r, THEME_COOKIE_MAX_AGE);
    _setRadius(r);
  };

  const setFont = (f: string) => {
    setCookie(FONT_COOKIE_NAME, f, THEME_COOKIE_MAX_AGE);
    _setFont(f);
  };

  const resetTheme = () => {
    try {
      removeCookie(storageKey);
      removeCookie(colorStorageKey);
      removeCookie(RADIUS_COOKIE_NAME);
      removeCookie(FONT_COOKIE_NAME);
    } catch {}
    _setMode(DEFAULT_MODE);
    _setColor(DEFAULT_COLOR);
    _setRadius(themeConfig.defaults.radius);
    _setFont(themeConfig.defaults.font);
  };

  const contextValue: ThemeProviderState = {
    defaultMode,
    resolvedMode,
    mode,
    setMode,
    resetTheme,
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

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
