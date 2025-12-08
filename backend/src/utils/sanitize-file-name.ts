import { basename, extname } from "node:path";

export function sanitizeFileName(fileName: string) {
  const extName = extname(fileName);
  const baseName = basename(fileName, extName);
  const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9]/g, "");

  return sanitizedBaseName.concat(extName);
}
