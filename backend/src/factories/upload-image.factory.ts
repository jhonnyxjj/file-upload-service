import { UploadImageUseCase } from "../usecase";
import { UploadImageController } from "../http/controller/upload-image.controller";
import { makeR2StorageAdapter } from "./create-r2-storage.factory";
import { makeImageCompressor } from "./create-image-compressor.factory";

export function makeUploadImageUseCase() {
    const storage = makeR2StorageAdapter();
    const compressor = makeImageCompressor();
    return new UploadImageUseCase(storage, compressor);
}

export function makeUploadImageController() {
    const useCase = makeUploadImageUseCase();
    return new UploadImageController(useCase);
}
