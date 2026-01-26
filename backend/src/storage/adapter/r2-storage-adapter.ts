import type { S3Client } from "@aws-sdk/client-s3";
import { sanitizeFileName } from "../../utils";
import { Upload } from "@aws-sdk/lib-storage";
import { type UploadStreamInput } from "../types";
import type { IStorageAdapter } from "../contracts";

/**
 * Adapter que implementa IStorageAdapter para Cloudflare R2.
 * Encapsula a complexidade do AWS SDK S3 Client.
 * @pattern Adapter
 */
export class R2StorageAdapter implements IStorageAdapter {
  constructor(
    private readonly s3: S3Client,
    private readonly bucketName: string,
    private readonly publicUrl: string,
  ) { }

  public async uploadStream(input: UploadStreamInput): Promise<{ url: string }> {
    const filePath = sanitizeFileName(input.path);
    try {
      const uploadFile = new Upload({
        client: this.s3,
        params: {
          Key: filePath,
          Bucket: this.bucketName,
          Body: input.stream,
          ContentType: input.contentType,
        },
      });

      await uploadFile.done();
      const publicUrl = new URL(filePath, this.publicUrl).toString();

      return { url: publicUrl };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      throw new Error(`Falha ao enviar arquivo "${filePath}" para o bucket "${this.bucketName}": ${message}`);

    }
  }
}


