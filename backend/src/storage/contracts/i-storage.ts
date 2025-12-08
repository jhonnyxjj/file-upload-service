import { UploadStreamInput } from "../types";

export interface IStorageAdapter {
  uploadStream({ path, contentType, stream }: UploadStreamInput): Promise<{ url: string }>;
}
