import { UploadImageInputDTO, UploadImageOutputDTO, UploadImageSchema } from "./upload-image.request";
import type { IStorageAdapter } from "../storage/contracts";
import { validateRequestInput } from "../utils";

export class UploadImageUseCase {
  constructor(private readonly storage: IStorageAdapter) { }

  async execute(input: UploadImageInputDTO): Promise<UploadImageOutputDTO> {
    const { name, contentType, contentStream } = validateRequestInput(
      UploadImageSchema,
      input,
    );

    const { url } = await this.storage.uploadStream({
      path: `images/${name}`,
      contentType,
      stream: contentStream,
    });

    return { url };
  }
}