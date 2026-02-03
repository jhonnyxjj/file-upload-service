import { GetImageInputDTO, GetImageOutputDTO, GetImageInputSchema } from "./get-image.request";
import { IStorageAdapter } from "../storage/contracts";
import { validateRequestInput } from "@/utils";

export class GetImageUseCase {
  constructor(private readonly storage: IStorageAdapter) {}

  async execute(input: GetImageInputDTO): Promise<GetImageOutputDTO> {
    const validatedInput = validateRequestInput(
      GetImageInputSchema,
      input,
    );

    try {
      const result = await this.storage.downloadStream(validatedInput.path);
      
      if (!result || !result.stream) {
        throw new Error("STREAM_NOT_FOUND");
      }

      if (!result.contentType) {
        throw new Error("CONTENT_TYPE_NOT_FOUND");
      }

      return {
        stream: result.stream,
        contentType: result.contentType,
      };
    } catch (err) {
      console.error(`[GetImageUseCase] Erro ao buscar: ${validatedInput.path}`, err);
      throw new Error(`FILE_NOT_FOUND: O arquivo no caminho ${validatedInput.path} não existe.`);
    }
  }
}
