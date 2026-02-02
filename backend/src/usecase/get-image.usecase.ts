import type { IStorageAdapter } from "../storage/contracts";

export interface GetImageInputDTO {
  path: string;
}

export interface GetImageOutputDTO {
  stream: NodeJS.ReadableStream;
  contentType: string; // Add content type to the output
}

export class GetImageUseCase {
  constructor(private readonly storage: IStorageAdapter) {}

  async execute(input: GetImageInputDTO): Promise<GetImageOutputDTO> {
    const { stream, contentType } = await this.storage.downloadStream(input.path);
    return { stream, contentType };
  }
}
