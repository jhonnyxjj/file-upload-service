import { z } from "zod";

export const UploadImageSchema = z.object({
  name: z.string().min(1),
  contentType: z.string().regex(/^image\//),
  fileBuffer: z.any(),
  compressionLevel: z.enum(['low', 'medium', 'high']).default('medium'),
});

export type UploadImageOutputDTO = {
  url: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: string;
};
export type UploadImageInputDTO = z.input<typeof UploadImageSchema>;
