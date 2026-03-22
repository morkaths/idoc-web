import { getRequestConfig } from 'next-intl/server';

import { SUPPORTED_LANGUAGES } from './constants/languages';

export const locales = SUPPORTED_LANGUAGES.filter(l => l.enabled).map(l => l.value);
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'vi';

/**
 * Deep merge two objects.
 */
function deepMerge(target: any, source: any) {
    const output = { ...target };
    if (target && typeof target === 'object' && source && typeof source === 'object') {
        Object.keys(source).forEach((key) => {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

export default getRequestConfig(async ({ locale: incomingLocale }) => {
    const locale = (incomingLocale && locales.includes(incomingLocale as any))
        ? incomingLocale
        : defaultLocale;

    // Tải messages tiếng Anh làm base fallback
    const fallbackmsg = (await import(`../locales/en.json`)).default;

    // Tải messages của ngôn ngữ hiện tại
    const currentmsg = (await import(`../locales/${locale}.json`)).default;

    // Merge: Ngôn ngữ hiện tại đè lên tiếng Anh
    const messages = locale === 'en' ? fallbackmsg : deepMerge(fallbackmsg, currentmsg);

    return {
        locale: locale as Locale,
        messages,
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
