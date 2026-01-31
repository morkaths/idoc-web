import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

import { authMiddleware } from './middlewares/auth-middleware';
import { localeMiddleware } from './middlewares/locale-middleware';

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log(`[Proxy] Pathname: ${pathname}`);

  // 1. Kiểm tra Auth trước
  const authResponse = authMiddleware(req);
  if (authResponse) {
    console.log(`[Proxy] Auth redirect to: ${authResponse.headers.get('location')}`);
    return authResponse;
  }

  // 2. Kiểm tra & Redirect Locale (Manual handling)
  const localeResponse = localeMiddleware(req);
  if (localeResponse) {
    console.log(`[Proxy] Locale redirect to: ${localeResponse.headers.get('location')}`);
    return localeResponse;
  }

  // 3. Chạy next-intl middleware để xử lý context i18n (Header, etc.)
  // Lưu ý: localeMiddleware ở trên đã đảm bảo URL có prefix locale, 
  // nên intlMiddleware sẽ chỉ làm nhiệm vụ setup context, không redirect loop.
  const response = intlMiddleware(req as any) || NextResponse.next();

  // 4. Lưu đường dẫn vào header
  response.headers.set('x-current-path', pathname);

  console.log(`[Proxy] Proceeding with response for: ${pathname}`);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|static|.*\\..*).*)'],
};