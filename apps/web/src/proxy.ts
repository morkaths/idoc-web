import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

import { authMiddleware } from './middlewares/auth-middleware';

export default async function proxy(req: NextRequest) {
  const { pathname, locale } = req.nextUrl;

  const authResponse = authMiddleware(req);
  if (authResponse) {
    return authResponse;
  }

  const response = intlMiddleware(req) || NextResponse.next();
  response.headers.set('Accept-Language', locale);
  response.headers.set('x-current-path', pathname);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|static|.*\\..*).*)'],
};