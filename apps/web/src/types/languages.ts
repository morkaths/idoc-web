export type Language = 'vi' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja';

export type SupportedLanguages = {
    label: string;
    value: Language;
    country: string;
    enabled: boolean;
    hreflang: string;
    flag: string;
};
