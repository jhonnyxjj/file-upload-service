import { UploadStreamInput } from "../types";

export interface IStorageR2 {
  uploadStream(input: UploadStreamInput): Promise<{ path: string }>;
  downloadStream(path: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string }>;
}
