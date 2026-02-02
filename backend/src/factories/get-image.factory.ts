import { GetImageUseCase } from "../usecase/get-image.usecase";
import { makeR2StorageAdapter } from "./create-r2-storage-adapter.factory";

export function makeGetImageUseCase() {
  const storage = makeR2StorageAdapter();
  return new GetImageUseCase(storage);
}