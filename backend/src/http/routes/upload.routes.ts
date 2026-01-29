import type { FastifyInstance } from "fastify";
import { makeUploadImageController } from "../../factories/upload-image.factory";

export async function uploadImageRoute(app: FastifyInstance) {
  const controller = makeUploadImageController();

  app.post("/uploads", controller.uploadImage.bind(controller));
}
