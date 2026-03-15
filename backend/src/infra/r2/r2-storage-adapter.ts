import { S3Client, GetObjectCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import { sanitizeFileName } from "../../utils";
import { Upload } from "@aws-sdk/lib-storage";
import { type UploadStreamInput } from "./types";
import { IStorageR2 } from "./contracts";
import { env } from "../../env";

export class R2Storage implements IStorageR2 {
  constructor(
    private readonly client: S3Client,
    private readonly bucketName: string,
  ) { }

  private getPublicUrl(path: string): string {
    if (env.CLOUDFLARE_PUBLIC_URL) {
      return `${env.CLOUDFLARE_PUBLIC_URL}/${path}`;
    }
    return `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${this.bucketName}/${path}`;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.client.send(new HeadBucketCommand({
        Bucket: this.bucketName,
      }));
      return true;
    } catch {
      return false;
    }
  }

  public async downloadStream(path: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string }> {
    const filePath = sanitizeFileName(path);
    try {
      const { Body, ContentType } = await this.client.send(new GetObjectCommand({
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

  public async uploadStream(input: UploadStreamInput): Promise<{ path: string }> {
    const filePath = sanitizeFileName(input.path);
    try {
      const uploadFile = new Upload({
        client: this.client,
        params: {
          Key: filePath,
          Bucket: this.bucketName,
          Body: input.stream,
          ContentType: input.contentType,
        },
      });

      await uploadFile.done();
      
      const url = this.getPublicUrl(filePath);
      return { path: url };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      throw new Error(`Falha ao enviar arquivo "${filePath}" para o bucket "${this.bucketName}": ${message}`);
    }
  }
}
