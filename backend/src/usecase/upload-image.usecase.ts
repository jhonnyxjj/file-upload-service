import { UploadImageInputDTO, UploadImageOutputDTO, UploadImageSchema } from "./upload-image.request";
import type { IStorageR2 } from "../infra/r2/contracts";
import { validateRequestInput } from "../utils";
import type { ImageCompressor } from "../infra/image/contracts";
import { Readable } from "node:stream";

export class UploadImageUseCase {
  constructor(
    private readonly storage: IStorageR2,
    private readonly compressor: ImageCompressor
  ) { }

  async execute(input: UploadImageInputDTO): Promise<UploadImageOutputDTO> {
    const validatedInput = validateRequestInput(
      UploadImageSchema,
      input,
    );

    try {
      // Create a stream from the buffer
      const stream = Readable.from(validatedInput.fileBuffer);
      
      const compressed = await this.compressor.compress({
        path: validatedInput.name,
        contentType: validatedInput.contentType,
        stream,
      }, validatedInput.compressionLevel);

      const result = await this.storage.uploadStream({
        path: compressed.path,
        contentType: compressed.contentType,
        stream: compressed.stream,
      });

      if (!result.path) {
        throw new Error("PATH_NOT_RETURNED");
      }

      return {
        url: result.path,
        originalSize: compressed.originalSize,
        compressedSize: compressed.compressedSize,
        compressionRatio: ((1 - compressed.compressedSize / compressed.originalSize) * 100).toFixed(2),
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`[UploadImageUseCase] Erro ao fazer upload: ${validatedInput.name}`, errorMessage);
      throw new Error(`UPLOAD_FAILED: ${errorMessage}`);
    }
  }
}
