import { env } from "../env";
import { R2Storage } from "../infra/r2";
import { createR2Client } from "../infra/r2";

export function makeR2StorageAdapter() {
  const client = createR2Client();
  const bucketName = env.CLOUDFLARE_BUCKET;
  
  const storage = new R2Storage(client, bucketName);
  
  return storage;
}
