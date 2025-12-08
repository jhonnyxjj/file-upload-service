import { R2StorageAdapter } from "../../storage/adapter";
import { createR2Client } from "../../storage/adapter/ client";
import { UploadImageUseCase } from "../../usecase/";

export function makeUploadImageUseCase() {
    const storage = new R2StorageAdapter(createR2Client());
    return new UploadImageUseCase(storage);
}