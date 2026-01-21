import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    cookies().set("admin_session", "", {
        expires: new Date(0),
        path: '/'
    });
    return NextResponse.json({ success: true });
}
