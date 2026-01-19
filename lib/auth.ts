import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = "mo3d-super-secret-key-change-this-in-prod"; // In prod, use env var
const key = new TextEncoder().encode(SECRET_KEY);

export async function encrypt(payload: Record<string, unknown>) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(key);
}

export async function decrypt(input: string): Promise<Record<string, unknown>> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function login(formData: FormData) {
    // Check against the hardcoded master password
    if (formData.get("password") === "5550555") {
        // Create the session
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        const session = await encrypt({ user: "admin", expires });

        // Save the session in a cookie
        cookies().set("admin_session", session, { expires, httpOnly: true });
        return true;
    }
    return false;
}

export async function logout() {
    // Destroy the session
    cookies().set("admin_session", "", { expires: new Date(0) });
}

export async function getSession() {
    const session = cookies().get("admin_session")?.value;
    if (!session) return null;
    return await decrypt(session);
}
