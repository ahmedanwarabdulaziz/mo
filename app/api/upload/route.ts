import { NextRequest, NextResponse } from "next/server";
import { getR2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/storage";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { decrypt } from "@/lib/auth-stateless";

export async function POST(request: NextRequest) {
    // 1. Verify Auth
    const cookie = request.cookies.get("admin_session")?.value;

    console.log("Upload auth check:", {
        hasCookie: !!cookie,
        cookieLength: cookie?.length,
        allCookies: request.cookies.getAll().map(c => c.name)
    });

    if (!cookie) {
        console.error("No admin_session cookie found");
        return NextResponse.json({ error: "Unauthorized - No session cookie" }, { status: 401 });
    }

    try {
        await decrypt(cookie);
        console.log("Auth successful");
    } catch (e) {
        console.error("Auth failed:", e);
        return NextResponse.json({ error: "Unauthorized - Invalid session" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileExtension = file.name.split(".").pop();
        const fileName = `uploads/${uuidv4()}.${fileExtension}`;

        // 2. Upload to R2
        await getR2Client().send(
            new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: fileName,
                Body: buffer,
                ContentType: file.type,
            })
        );

        // 3. Construct Public URL
        const url = `${R2_PUBLIC_URL}/${fileName}`;

        return NextResponse.json({ success: true, url });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({
            error: "Upload failed",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
