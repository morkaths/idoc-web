import { NextRequest, NextResponse } from "next/server";
import env from "@/config/env";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(env.cookie.token)?.value;

  if (
    !token &&
    !request.nextUrl.pathname.startsWith("/sign-in") &&
    !request.nextUrl.pathname.startsWith("/sign-up")
  ) {
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