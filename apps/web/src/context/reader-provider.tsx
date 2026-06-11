'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  useCallback,
} from 'react';
import { type Theme, type Flow } from '../components/viewers/data/setting-data';

interface ReaderSettings {
  fontSize: number;
  fontFamily: string;
  theme: Theme;
  flow: Flow;
}

interface ReaderContextType {
  settings: ReaderSettings;
  setFontSize: (size: number) => void;
  setFontFamily: (font: string) => void;
  setTheme: (theme: Theme) => void;
  setFlow: (flow: Flow) => void;
  getEpubLocations: (key: string) => string | null;
  saveEpubLocations: (key: string, locations: string) => void;
}

const DEFAULT_SETTINGS: ReaderSettings = {
  fontSize: 100,
  fontFamily: 'Origin',
  theme: 'light',
  flow: 'paginated',
};

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

const STORAGE_KEY = 'idoc-reader-settings';

export function ReaderProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        } catch (_e) {
          // Silently fail if settings are corrupted
        }
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Lưu settings vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setFontSize = useCallback(
    (fontSize: number) => setSettings((s) => ({ ...s, fontSize })),
    []
  );
  const setFontFamily = useCallback(
    (fontFamily: string) => setSettings((s) => ({ ...s, fontFamily })),
    []
  );
  const setTheme = useCallback((theme: Theme) => setSettings((s) => ({ ...s, theme })), []);
  const setFlow = useCallback((flow: Flow) => setSettings((s) => ({ ...s, flow })), []);

  // Các hàm tiện ích quản lý EPUB Locations (Ổn định tham chiếu bằng useCallback)
  const getEpubLocations = useCallback((key: string) => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  }, []);

  const saveEpubLocations = useCallback((key: string, locations: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, locations);
    } catch (_e) {
      // Silently fail if storage is full or restricted
    }
  }, []);

  return (
    <ReaderContext.Provider
      value={{
        settings,
        setFontSize,
        setFontFamily,
        setTheme,
        setFlow,
        getEpubLocations,
        saveEpubLocations,
      }}
    >
      {children}
    </ReaderContext.Provider>
  );
}

export function useReaderSettings() {
  const context = useContext(ReaderContext);
  if (context === undefined) {
    throw new Error('useReaderSettings phải được sử dụng trong ReaderProvider');
  }
  return context;
}
