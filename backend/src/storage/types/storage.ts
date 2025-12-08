import { Readable } from "stream";

export type UploadStreamInput = {
  path: string;
  stream: Readable;
  contentType: string;
};
