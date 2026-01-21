# MO Project

This is a Next.js application integrated with Firebase (Auth, Firestore, Storage) and Firebase Admin SDK.

## Getting Started

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment on Vercel

To deploy this app on [Vercel](https://vercel.com), you must configure the following Environment Variables in your Vercel Project Settings.

### Client-Side Variables (Public)
These are required for the frontend to connect to Firebase.

| Variable | Description |
| copy | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Your Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Your Firebase Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your Firebase App ID |

### Server-Side Variables (Secret)
These are used by the Firebase Admin SDK on the server side. **Do not expose these to the client.**

| Variable | Description |
| --- | --- |
| `FIREBASE_CLIENT_EMAIL` | From your Firebase Service Account JSON |
| `FIREBASE_PRIVATE_KEY` | From your Firebase Service Account JSON (copy the entire private key string, including `-----BEGIN PRIVATE KEY...`) |

**Important for Vercel:**
The `FIREBASE_PRIVATE_KEY` often contains newline characters (`\n`). In Vercel, copy the key exactly as it appears in your JSON file. The application code is configured to handle the newlines correctly.

## Build and Check

To verify the build locally before deploying:

```bash
npm run build
```
