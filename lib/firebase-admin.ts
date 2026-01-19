import "server-only";
import { getApps, initializeApp, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// We will use the environment variables we populated from the JSON file
const serviceAccount = {
    projectId: 'mo3d-613f6', // process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

export function createFirebaseAdminApp() {
    if (getApps().length > 0) {
        return getApp();
    }

    // Check if we have the keys
    if (!serviceAccount.clientEmail || !serviceAccount.privateKey) {
        console.error("Missing Firebase Admin Keys");
        throw new Error("Missing Firebase Admin Keys");
    }

    return initializeApp({
        credential: cert(serviceAccount),
    });
}

const adminApp = createFirebaseAdminApp();
const adminDb = getFirestore(adminApp);
const adminAuth = getAuth(adminApp);

export { adminDb, adminAuth };
