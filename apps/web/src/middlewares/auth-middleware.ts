import { type NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/i18n';
import env from '@/config/env';

const AUTH_PATHS = ['/sign-in', '/sign-up'];

/**
 * Kiểm tra quyền truy cập của người dùng dựa trên token và route
 * @param req - Đối tượng NextRequest
 * @returns NextResponse nếu cần redirect, ngược lại trả về null
 */
export function authMiddleware(req: NextRequest): NextResponse | null {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get(env.cookie.token)?.value;
    const pathWithoutLocale = pathname.replace(new RegExp(`^/(${locales.join('|')})`), '') || '/';
    
    const isAuthPage = AUTH_PATHS.some((path) => pathWithoutLocale.startsWith(path));
    if (token && isAuthPage) {
        const locale = locales.find((l: string) => pathname.startsWith(`/${l}`)) || defaultLocale;
        return NextResponse.redirect(new URL(`/${locale}/`, req.url));
    }

    return null;
}
