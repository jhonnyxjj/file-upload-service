import type { FastifyInstance } from "fastify";
import { UploadImageController } from "../controller";
import { makeUploadImageUseCase } from "../../factories/upload-image.factory";
import { uploadRateLimit } from "../../utils/upload-rate-limit";
import { GetImageController } from "../controller";
import { makeGetImageUseCase } from "../../factories/get-image.factory";

export async function uploadImageRoute(app: FastifyInstance) {
  const uploadUseCase = makeUploadImageUseCase();
  const uploadController = new UploadImageController(uploadUseCase);
  const rateLimitOptions = uploadRateLimit();

  const getImageUseCase = makeGetImageUseCase();
  const getImageController = new GetImageController(getImageUseCase);

  app.post("/uploads", {
    config: {
      rateLimit: rateLimitOptions,
    },
  }, uploadController.uploadImage.bind(uploadController));

  app.get("/images/:filename", getImageController.getImage.bind(getImageController));
}
