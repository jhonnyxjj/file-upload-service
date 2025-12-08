import type { FastifyInstance } from "fastify";
import { UploadImageController } from "../controller";
import { makeUploadImageUseCase } from "../controller/di-container";

export async function uploadImageRoute(app: FastifyInstance) {
  const useCase = makeUploadImageUseCase();        // cria o use case com R2StorageAdapter
  const controller = new UploadImageController(useCase); // injeta no controller

  app.post("/uploads", controller.uploadImage.bind(controller));
}
