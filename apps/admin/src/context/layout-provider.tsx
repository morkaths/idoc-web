import { createContext, useContext, useState } from 'react';
import { getCookie, setCookie } from '@/lib/cookies';

export type Collapsible = 'offcanvas' | 'icon' | 'none';
export type Variant = 'inset' | 'sidebar' | 'floating';

// Cookie constants following the pattern from sidebar.tsx
const LAYOUT_COLLAPSIBLE_COOKIE_NAME = 'layout_collapsible';
const LAYOUT_VARIANT_COOKIE_NAME = 'layout_variant';
const LAYOUT_HEADER_FIXED_COOKIE_NAME = 'layout_header_fixed';
const LAYOUT_MAIN_FIXED_COOKIE_NAME = 'layout_main_fixed';
const LAYOUT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Default values
const DEFAULT_VARIANT = 'inset';
const DEFAULT_COLLAPSIBLE = 'icon';

// New defaults for header/main fixed behaviour
const DEFAULT_HEADER_FIXED = true;
const DEFAULT_MAIN_FIXED = false;

type LayoutContextType = {
  resetLayout: () => void;

  defaultCollapsible: Collapsible;
  collapsible: Collapsible;
  setCollapsible: (collapsible: Collapsible) => void;

  defaultVariant: Variant;
  variant: Variant;
  setVariant: (variant: Variant) => void;

  headerFixed: boolean;
  setHeaderFixed: (v: boolean) => void;
  mainFixed: boolean;
  setMainFixed: (v: boolean) => void;
};

const LayoutContext = createContext<LayoutContextType | null>(null);

type LayoutProviderProps = {
  children: React.ReactNode;
};

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [collapsible, _setCollapsible] = useState<Collapsible>(() => {
    const saved = getCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME);
    return (saved as Collapsible) || DEFAULT_COLLAPSIBLE;
  });

  const [variant, _setVariant] = useState<Variant>(() => {
    const saved = getCookie(LAYOUT_VARIANT_COOKIE_NAME);
    return (saved as Variant) || DEFAULT_VARIANT;
  });

  const [headerFixed, _setHeaderFixed] = useState<boolean>(() => {
    const saved = getCookie(LAYOUT_HEADER_FIXED_COOKIE_NAME);
    return saved !== undefined ? saved === '1' : DEFAULT_HEADER_FIXED;
  });
  const [mainFixed, _setMainFixed] = useState<boolean>(() => {
    const saved = getCookie(LAYOUT_MAIN_FIXED_COOKIE_NAME);
    return saved !== undefined ? saved === '1' : DEFAULT_MAIN_FIXED;
  });

  const setCollapsible = (newCollapsible: Collapsible) => {
    _setCollapsible(newCollapsible);
    setCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME, newCollapsible, LAYOUT_COOKIE_MAX_AGE);
  };

  const setVariant = (newVariant: Variant) => {
    _setVariant(newVariant);
    setCookie(LAYOUT_VARIANT_COOKIE_NAME, newVariant, LAYOUT_COOKIE_MAX_AGE);
  };

  const setHeaderFixed = (v: boolean) => _setHeaderFixed(v);
  const setMainFixed = (v: boolean) => _setMainFixed(v);

  const resetLayout = () => {
    setCollapsible(DEFAULT_COLLAPSIBLE);
    setVariant(DEFAULT_VARIANT);
  };

  const contextValue: LayoutContextType = {
    resetLayout,
    defaultCollapsible: DEFAULT_COLLAPSIBLE,
    collapsible,
    setCollapsible,
    defaultVariant: DEFAULT_VARIANT,
    variant,
    setVariant,
    headerFixed,
    setHeaderFixed,
    mainFixed,
    setMainFixed,
  };

  return <LayoutContext.Provider value={contextValue}>{children}</LayoutContext.Provider>;
}

// Define the hook for the provider
// eslint-disable-next-line react-refresh/only-export-components
export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
