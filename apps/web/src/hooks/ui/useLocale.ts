import { useTranslations } from 'next-intl';
import en from '../../../locales/en.json';

// --- Types ---
type DeepKeys<T> = {
    [K in keyof T]: T[K] extends object ? DeepKeys<T[K]> : string;
};

// --- Utils ---
/**
 * Recursively maps JSON object structure to dot-notation definition strings.
 * e.g. { auth: { login: "..." } } -> { auth: { login: "auth.login" } }
 */
const createKeyMap = (obj: any, prefix = ''): any =>
    Object.keys(obj).reduce((acc, key) => {
        const value = obj[key];
        const path = prefix ? `${prefix}.${key}` : key;
        acc[key] = typeof value === 'object' ? createKeyMap(value, path) : path;
        return acc;
    }, {} as any);

// --- Constants ---
export const KEYS = createKeyMap(en) as DeepKeys<typeof en>;

// --- Hook ---
export function useLocale<Name extends keyof IntlMessages>(namespace: Name) {
    return {
        t: useTranslations(),
        tCommon: useTranslations('common'),
        keys: KEYS[namespace] as DeepKeys<IntlMessages[Name]>,
        KEYS
    };
}
