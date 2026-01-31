import en from './locales/en.json';

type Messages = typeof en;

declare global {
    // Giúp TypeScript nhận diện các khóa dịch khi dùng useTranslations()
    interface IntlMessages extends Messages { }
}
