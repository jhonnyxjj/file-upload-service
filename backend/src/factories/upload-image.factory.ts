import { UploadImageUseCase } from "../usecase";
import { UploadImageController } from "../http/controller/upload-image.controller";
import { makeR2StorageAdapter } from "./create-r2-storage-adapter.factory";

export function makeUploadImageUseCase() {
    const storage = makeR2StorageAdapter();
    return new UploadImageUseCase(storage);
}

export function makeUploadImageController() {
    const useCase = makeUploadImageUseCase();
    return new UploadImageController(useCase);
}