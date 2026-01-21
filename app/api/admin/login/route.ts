import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/lib/auth-stateless";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { password } = body;

    if (password === "5550555") {
        // 24 hours
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const session = await encrypt({ user: "admin", expires });

        cookies().set("admin_session", session, {
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
}
