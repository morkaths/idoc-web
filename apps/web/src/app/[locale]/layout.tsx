import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import { getMessages, setRequestLocale, getTimeZone } from 'next-intl/server';
import { Devtools } from '../dev-tools';
import { Providers } from '../providers';

export function generateStaticParams() {
  return locales.map((locale: string) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages({ locale });
  const timeZone = await getTimeZone();

  return (
    <Providers locale={locale} messages={messages} timeZone={timeZone}>
      {children}
      <Devtools />
    </Providers>
  );
}
