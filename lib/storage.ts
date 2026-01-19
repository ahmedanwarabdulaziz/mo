import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;

if (!accountId || !accessKeyId || !secretAccessKey) {
    // In a real app we might not throw here to allow building without env vars, but for dev it warns us.
    console.warn("Missing Cloudflare R2 environment variables");
}

export const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: accessKeyId || '',
        secretAccessKey: secretAccessKey || '',
    },
});

export const R2_BUCKET_NAME = process.env.CLOUDFLARE_BUCKET_NAME || 'mo3d';
export const R2_PUBLIC_URL = process.env.CLOUDFLARE_PUBLIC_URL || '';
