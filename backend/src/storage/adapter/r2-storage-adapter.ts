import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
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
  ) { }

  public async downloadStream(path: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string }> {
    const filePath = sanitizeFileName(path);
    try {
      const { Body, ContentType } = await this.s3.send(new GetObjectCommand({
        Key: filePath,
        Bucket: this.bucketName,
      }));

      if (!Body) {
        throw new Error(`File not found: ${filePath}`);
      }

      return { stream: Body as NodeJS.ReadableStream, contentType: ContentType || 'application/octet-stream' };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      throw new Error(`Falha ao baixar arquivo "${filePath}" do bucket "${this.bucketName}": ${message}`);
    }
  }

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
      
      const url = filePath; 

      return { url: url };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      throw new Error(`Falha ao enviar arquivo "${filePath}" para o bucket "${this.bucketName}": ${message}`);

    }
  }
}


