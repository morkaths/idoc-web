import type { Metadata } from 'next';
import { NotFoundView } from './[locale]/(error)/404/_components/view';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from "@/context/theme-provider";
import { getMessages } from 'next-intl/server';
import { defaultLocale } from '@/i18n';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
    title: '404 - Page Not Found',
    description: 'The page you are looking for does not exist',
};

export default async function GlobalNotFound() {
    const messages = await getMessages({ locale: defaultLocale });

    return (
        <NextIntlClientProvider locale={defaultLocale} messages={messages}>
            <ThemeProvider>
                <NotFoundView />
                <Toaster />
            </ThemeProvider>
        </NextIntlClientProvider>
    );
}
