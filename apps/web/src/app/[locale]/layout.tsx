import { Devtools } from "../dev-tools";
import { locales } from '@/i18n';
import { Providers } from "../providers";
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
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

  return (
    <Providers locale={locale} messages={messages}>
      {children}
      <Devtools />
    </Providers>
  );
}