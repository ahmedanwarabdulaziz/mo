import { S3Client } from "@aws-sdk/client-s3";

export function getR2Client() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;

    if (!accountId || !accessKeyId || !secretAccessKey) {
        throw new Error("Missing Cloudflare R2 environment variables");
    }

    return new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
}

export const R2_BUCKET_NAME = process.env.CLOUDFLARE_BUCKET_NAME || 'mo3d';
export const R2_PUBLIC_URL = process.env.CLOUDFLARE_PUBLIC_URL || '';
