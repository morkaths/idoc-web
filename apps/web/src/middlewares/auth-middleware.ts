import { type NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/i18n';
import env from '@/config/env';

const PROTECTED_PATHS = ['/library', '/profile', '/settings'];
const AUTH_PATHS = ['/sign-in', '/sign-up'];

/**
 * Kiểm tra quyền truy cập của người dùng dựa trên token và route
 * @param req - Đối tượng NextRequest
 * @returns NextResponse nếu cần redirect, ngược lại trả về null
 */
export function authMiddleware(req: NextRequest): NextResponse | null {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get(env.cookie.token)?.value;

    // Loại bỏ tiền tố ngôn ngữ (vd: /vi/library -> /library) để kiểm tra route
    const pathWithoutLocale = pathname.replace(new RegExp(`^/(${locales.join('|')})`), '') || '/';

    const isProtectedRoute = PROTECTED_PATHS.some((path) => pathWithoutLocale.startsWith(path));
    const isAuthPage = AUTH_PATHS.some((path) => pathWithoutLocale.startsWith(path));

    // Nếu truy cập route bảo vệ mà không có token, redirect về trang login
    if (!token && isProtectedRoute && !isAuthPage) {
        const locale = locales.find((l) => pathname.startsWith(`/${l}`)) || defaultLocale;
        const signinUrl = new URL(`/${locale}/sign-in`, req.url);
        signinUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(signinUrl);
    }

    return null;
}
