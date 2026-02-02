import { env } from "../env";
import { R2StorageAdapter } from "../storage/adapter";
import { createR2Client } from "../storage/adapter/ client";

export function makeR2StorageAdapter() {
  const client = createR2Client();
  const bucketName = env.CLOUDFLARE_BUCKET;
  
  const storage = new R2StorageAdapter(client, bucketName);
  
  return storage;
}
