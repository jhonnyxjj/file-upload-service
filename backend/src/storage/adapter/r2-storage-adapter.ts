import { createR2Client } from "./ client";
import type { S3Client } from "@aws-sdk/client-s3";
import { sanitizeFileName } from "../../utils";
import { Upload } from "@aws-sdk/lib-storage";
import { type UploadStreamInput } from "../types";
import type { IStorageAdapter } from "../contracts";
import { env } from "../../env";

/**
 * Adapter que implementa IStorageAdapter para Cloudflare R2.
 * Encapsula a complexidade do AWS SDK S3 Client.
 * @pattern Adapter
 */
export class R2StorageAdapter implements IStorageAdapter {
  constructor(private readonly client: S3Client = createR2Client()) { }

  public async uploadStream(input: UploadStreamInput): Promise<{ url: string }> {
    const key = sanitizeFileName(input.path);
    try {
      const uploadFile = new Upload({
        client: this.client,
        params: {
          Key: key,
          Bucket: env.CLOUDFLARE_BUCKET,
          Body: input.stream,
          ContentType: input.contentType,
        },
      });

      await uploadFile.done();

      return {
        url: new URL(key, env.CLOUDFLARE_PUBLIC_URL).toString(),
      };
    } catch (error) {
      throw new Error(`Erro ao fazer upload da imagem: ${error}`);
    }
  }
}


