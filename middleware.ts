import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow all admin pages and API routes to pass through
    if (pathname.startsWith("/admin") || pathname.startsWith("/api") || pathname.includes(".")) {
        return NextResponse.next();
    }

    // Simple locale handling - redirect root to /en
    const locales = ['en', 'ar'];
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale && pathname === '/') {
        return NextResponse.redirect(new URL('/en', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/(en|ar)/:path*', '/admin/:path*']
};
