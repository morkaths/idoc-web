import type en from './locales/en.json';

type Messages = typeof en;

declare global {
  // Giúp TypeScript nhận diện các khóa dịch khi dùng useTranslations()
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages {}
}
