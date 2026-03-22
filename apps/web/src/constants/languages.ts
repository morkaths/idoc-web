import type { Language, SupportedLanguages } from '@/types/languages';

export const SUPPORTED_LANGUAGES: Array<SupportedLanguages> = [
    {
        label: 'Tiếng Việt',
        value: 'vi',
        country: 'VN',
        enabled: true,
        hreflang: 'vi-VN',
        flag: 'fi fi-vn',
    },
    {
        label: 'English',
        value: 'en',
        country: 'US',
        enabled: true,
        hreflang: 'en-US',
        flag: 'fi fi-us',
    },
    {
        label: 'Español',
        value: 'es',
        country: 'ES',
        enabled: false,
        hreflang: 'es-ES',
        flag: 'fi fi-es',
    },
    {
        label: 'Français',
        value: 'fr',
        country: 'FR',
        enabled: false,
        hreflang: 'fr-FR',
        flag: 'fi fi-fr',
    },
    {
        label: 'Deutsch',
        value: 'de',
        country: 'DE',
        enabled: false,
        hreflang: 'de-DE',
        flag: 'fi fi-de',
    },
    {
        label: 'Italiano',
        value: 'it',
        country: 'IT',
        enabled: false,
        hreflang: 'it-IT',
        flag: 'fi fi-it',
    },
    {
        label: 'Português',
        value: 'pt',
        country: 'BR',
        enabled: false,
        hreflang: 'pt-BR',
        flag: 'fi fi-br',
    },
    {
        label: '日本語',
        value: 'ja',
        country: 'JP',
        enabled: true,
        hreflang: 'ja-JP',
        flag: 'fi fi-jp',
    },
];

export const languages: Language[] = SUPPORTED_LANGUAGES.map(lang => lang.value);
