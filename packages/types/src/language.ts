import ISO6391 from 'iso-639-1';

export type LanguageCode = string;

export interface Language {
  label: string;
  value: LanguageCode;
  country: string;
  enabled: boolean;
  hreflang: string;
  flag: string;
}

const REGION_OVERRIDE: Record<string, string> = {
  en: 'GB',
  ar: 'SA',
};

export const Locales = ['vi', 'en', 'ja'] as const;
export type Locale = (typeof Locales)[number];
const SUPPORTED = new Set<string>(Locales);

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

export const Languages: Language[] = ISO6391.getAllCodes()
  .map(code => {
    const isSupported = SUPPORTED.has(code);
    const name = ISO6391.getName(code);
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    const region = REGION_OVERRIDE[code] || new Intl.Locale(code).maximize().region;
    const countryName = region && region !== '001' ? regionNames.of(region) : label;
    const flag = region && region !== '001' ? region.toLowerCase() : code;

    return {
      label,
      value: code,
      country: countryName || label,
      enabled: isSupported,
      hreflang: `${code}-${region ? region : code.toUpperCase()}`,
      flag,
    };
  })
  .sort((a, b) => {
    if (a.enabled !== b.enabled) return a.enabled ? -1 : 1;
    return a.label.localeCompare(b.label);
  });
