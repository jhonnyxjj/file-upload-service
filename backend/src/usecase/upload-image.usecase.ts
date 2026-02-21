import { UploadImageInputDTO, UploadImageOutputDTO, UploadImageSchema } from "./upload-image.request";
import type { IStorageR2 } from "../infra/r2/contracts";
import { validateRequestInput } from "../utils";

export class UploadImageUseCase {
  constructor(private readonly storage: IStorageR2) { }

  async execute(input: UploadImageInputDTO): Promise<UploadImageOutputDTO> {
    const validatedInput = validateRequestInput(
      UploadImageSchema,
      input,
    );

    try {
      const result = await this.storage.uploadStream({
        path: validatedInput.name,
        contentType: validatedInput.contentType,
        stream: validatedInput.contentStream,
      });

      if (!result.path) {
        throw new Error("PATH_NOT_RETURNED");
      }

      return {
        path: result.path,
      };
    } catch (err) {
      console.error(`[UploadImageUseCase] Erro ao fazer upload: ${validatedInput.name}`, err);
      throw new Error(`UPLOAD_FAILED: Falha ao fazer upload da imagem ${validatedInput.name}. Tente novamente.`);
    }
  }
}