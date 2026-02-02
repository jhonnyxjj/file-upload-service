import { UploadStreamInput } from "../types";

export interface IStorageAdapter {
  uploadStream(input: UploadStreamInput): Promise<{ url: string }>;
  downloadStream(path: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string }>;
}
