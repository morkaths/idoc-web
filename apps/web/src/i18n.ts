import { getRequestConfig } from 'next-intl/server';

import { SUPPORTED_LANGUAGES } from './constants/languages';

export const locales = SUPPORTED_LANGUAGES.filter(l => l.enabled).map(l => l.value);
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'vi';

export default getRequestConfig(async ({ locale: incomingLocale }) => {
    const locale = (incomingLocale && locales.includes(incomingLocale as any))
        ? incomingLocale
        : defaultLocale;

    return {
        locale: locale as Locale,
        messages: (await import(`../locales/${locale}.json`)).default,
        timeZone: 'Asia/Ho_Chi_Minh',
        onError(error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(`[i18n-error] ${error.message}`);
            }
        },
        getMessageFallback({ key, namespace }) {
            return `[${namespace ? `${namespace}.` : ''}${key}]`;
        },
    };
});
