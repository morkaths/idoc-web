export type LanguageCode = 'vi' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja';

export interface Language {
  label: string;
  value: LanguageCode;
  country: string;
  enabled: boolean;
  hreflang: string;
  flag: string;
}

export const Languages: Language[] = [
  { label: 'Tiếng Việt', value: 'vi', flag: 'vn', country: 'Vietnam', enabled: true, hreflang: 'vi-VN' },
  { label: 'English', value: 'en', flag: 'gb', country: 'United Kingdom', enabled: true, hreflang: 'en-US' },
  { label: 'Español', value: 'es', flag: 'es', country: 'Spain', enabled: false, hreflang: 'es-ES' },
  { label: 'Français', value: 'fr', flag: 'fr', country: 'France', enabled: false, hreflang: 'fr-FR' },
  { label: 'Deutsch', value: 'de', flag: 'de', country: 'Germany', enabled: false, hreflang: 'de-DE' },
  { label: 'Italiano', value: 'it', flag: 'it', country: 'Italy', enabled: false, hreflang: 'it-IT' },
  { label: 'Português', value: 'pt', flag: 'pt', country: 'Portugal', enabled: false, hreflang: 'pt-PT' },
  { label: '日本語', value: 'ja', flag: 'jp', country: 'Japan', enabled: false, hreflang: 'ja-JP' },
];

