import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE_KEY } from "@/config/env";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE_KEY)?.value;

  if (!token && !request.nextUrl.pathname.startsWith("/sign-in") && !request.nextUrl.pathname.startsWith("/sign-up")) {
    const signinUrl = new URL("/sign-in", request.url);
    signinUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/(main)/(protected)/:path*",
  ],
};