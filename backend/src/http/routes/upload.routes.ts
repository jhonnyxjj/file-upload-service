import type { FastifyInstance } from "fastify";
import { UploadImageController } from "../controller";
import { makeUploadImageUseCase } from "../controller/di-container";
import { uploadRateLimit } from "../../utils/upload-rate-limit";

export async function uploadImageRoute(app: FastifyInstance) {
  const useCase = makeUploadImageUseCase();        // cria o use case com R2StorageAdapter
  const controller = new UploadImageController(useCase); // injeta no controller
  const rateLimitOptions = uploadRateLimit();

  app.post("/uploads", {
    config: {
      rateLimit: rateLimitOptions,
    },
  }, controller.uploadImage.bind(controller));
}
