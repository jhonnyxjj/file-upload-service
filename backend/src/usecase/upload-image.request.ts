import { z } from "zod";
import { Readable } from "node:stream";

export const UploadImageSchema = z.object({
  name: z.string().min(1),
  contentType: z.string().regex(/^image\//),
  contentStream: z.instanceof(Readable),
});

export type UploadImageOutputDTO = {
  url: string;
};
export type UploadImageInputDTO = z.input<typeof UploadImageSchema>;
