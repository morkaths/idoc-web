import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { type NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/i18n';

export function localeMiddleware(req: NextRequest): NextResponse | null {
    const { pathname } = req.nextUrl;

    // 1. Kiểm tra xem route có tiền tố ngôn ngữ chưa
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return null;

    // 2. Nếu chưa có locale, xác định ngôn ngữ tốt nhất
    const headers = { 'accept-language': req.headers.get('accept-language') || '' };
    const languages = new Negotiator({ headers }).languages();

    const locale = match(languages, locales, defaultLocale);

    // 3. Redirect về ngôn ngữ mặc định/tốt nhất
    req.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(req.nextUrl);
}
