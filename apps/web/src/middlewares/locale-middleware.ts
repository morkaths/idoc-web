import { type NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/i18n';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

export function localeMiddleware(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale: string) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return null;

  const headers = { 'accept-language': req.headers.get('accept-language') || '' };
  const languages = new Negotiator({ headers }).languages();

  const locale = match(languages, locales, defaultLocale);
  req.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(req.nextUrl);
}
