import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { jwtVerify } from "jose";

const SECRET_KEY = "mo3d-super-secret-key-change-this-in-prod";
const key = new TextEncoder().encode(SECRET_KEY);

async function decrypt(input: string): Promise<Record<string, unknown>> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

const intlMiddleware = createMiddleware({
    locales: ['en', 'ar'],
    defaultLocale: 'en'
});

export async function middleware(request: NextRequest) {
    // 1. Handle Admin Routes (Auth Protection, No i18n routing)
    if (request.nextUrl.pathname.startsWith("/admin")) {
        // Allow access to login page and logout API
        if (request.nextUrl.pathname === "/admin/login" || request.nextUrl.pathname.startsWith("/api/")) {
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

    // 2. Handle Public Routes (i18n Routing)
    // Exclude API routes and public files from i18n middleware
    if (
        request.nextUrl.pathname.startsWith("/api") ||
        request.nextUrl.pathname.includes(".") // Files like robots.txt, favicon.ico
    ) {
        return NextResponse.next();
    }

    return intlMiddleware(request);
}

export const config = {
    // Matcher: Admin routes AND Internationalized routes
    matcher: ['/((?!_next|.*\\..*).*)']
};
