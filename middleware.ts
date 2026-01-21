import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = "mo3d-super-secret-key-change-this-in-prod";
const key = new TextEncoder().encode(SECRET_KEY);

async function decrypt(input: string): Promise<Record<string, unknown>> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Handle Admin Routes (Auth Protection, No i18n routing)
    if (pathname.startsWith("/admin")) {
        // Allow access to login page and logout API
        if (pathname === "/admin/login" || pathname.startsWith("/api/")) {
            return NextResponse.next();
        }

        const cookie = request.cookies.get("admin_session")?.value;

        if (!cookie) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        try {
            await decrypt(cookie);
            return NextResponse.next();
        } catch (err) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    // 2. Handle API routes - pass through
    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    // 3. Handle static files - pass through
    if (pathname.includes(".")) {
        return NextResponse.next();
    }

    // 4. Simple locale handling - manual redirect to /en if no locale
    const locales = ['en', 'ar'];
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
        // Redirect to /en for any path without a locale
        const url = new URL(`/en${pathname}`, request.url);
        url.search = request.nextUrl.search;
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|.*\\..*).*)', '/']
};
