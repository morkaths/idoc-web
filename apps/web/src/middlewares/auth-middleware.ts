import { type NextRequest, NextResponse } from 'next/server';
import env from '@/config/env';
import { locales, defaultLocale } from '@/i18n';

const AUTH_PATHS = ['/sign-in', '/sign-up'];

/**
 * Checks user access rights based on token and route.
 * @param req - The NextRequest object.
 * @returns NextResponse if redirect is needed, otherwise null.
 */
export function authMiddleware(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(env.cookie.accessToken)?.value;
  const pathWithoutLocale = pathname.replace(new RegExp(`^/(${locales.join('|')})`), '') || '/';

  const isAuthPage = AUTH_PATHS.some((path) => pathWithoutLocale.startsWith(path));
  if (token && isAuthPage) {
    const locale = locales.find((l: string) => pathname.startsWith(`/${l}`)) || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/`, req.url));
  }

  return null;
}
