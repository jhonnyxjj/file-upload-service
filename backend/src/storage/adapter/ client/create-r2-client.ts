import { env } from "../../../env";
import { S3Client } from "@aws-sdk/client-s3";

export function createR2Client() {
  try {
    return new S3Client({
      region: "auto",
      endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
      },
    });
  } catch (error) {
    throw new Error(`Erro ao criar o client R2: ${error}`);
  }
}
