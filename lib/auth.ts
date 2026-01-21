import { cookies } from "next/headers";
import { encrypt, decrypt } from "./auth-stateless";

export { encrypt, decrypt };

export async function login(formData: FormData) {
    if (formData.get("password") === "5550555") {
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const session = await encrypt({ user: "admin", expires });

        cookies().set("admin_session", session, { expires, httpOnly: true });
        return true;
    }
    return false;
}

export async function logout() {
    cookies().set("admin_session", "", { expires: new Date(0) });
}

export async function getSession() {
    const session = cookies().get("admin_session")?.value;
    if (!session) return null;
    return await decrypt(session);
}
