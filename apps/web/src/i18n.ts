import { Locales } from '@/types';
import { getRequestConfig } from 'next-intl/server';

export const locales = [...Locales];
export type Locale = (typeof Locales)[number];
export const defaultLocale: Locale = 'en';

function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Record<string, unknown>
): T {
  const output = { ...target };

  if (target && typeof target === 'object' && source && typeof source === 'object') {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
        if (targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
          output[key as keyof T] = deepMerge(
            targetValue as Record<string, unknown>,
            sourceValue as Record<string, unknown>
          ) as T[keyof T];
        } else {
          output[key as keyof T] = sourceValue as T[keyof T];
        }
      } else {
        output[key as keyof T] = sourceValue as T[keyof T];
      }
    });
  }

  return output;
}

export default getRequestConfig(async ({ locale: incomingLocale }) => {
  const locale =
    incomingLocale && locales.includes(incomingLocale as Locale)
      ? (incomingLocale as Locale)
      : defaultLocale;

  const fallbackMessages = (await import(`../locales/en.json`)).default;
  if (locale === 'en') {
    return {
      locale,
      messages: fallbackMessages,
      timeZone: 'Asia/Ho_Chi_Minh',
    };
  }

  let currentMessages = {};
  try {
    currentMessages = (await import(`../locales/${locale}.json`)).default;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`[i18n] Failed to load messages for ${locale}`, error);
  }

  return {
    locale,
    messages: deepMerge(fallbackMessages, currentMessages),
    timeZone: 'Asia/Ho_Chi_Minh',
    onError(error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error(`[i18n-error] ${error.message}`);
      }
    },
    getMessageFallback({ key, namespace }) {
      return `[${namespace ? `${namespace}.` : ''}${key}]`;
    },
  };
});
