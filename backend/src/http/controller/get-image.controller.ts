import type { FastifyRequest, FastifyReply } from "fastify";
import { GetImageUseCase } from "../../usecase/get-image.usecase";
import { makeGetImageUseCase } from "../../factories/get-image.factory";

export class GetImageController {
  constructor(private readonly useCase: GetImageUseCase = makeGetImageUseCase()) {}

  async getImage(request: FastifyRequest, reply: FastifyReply) {
    const { filename } = request.params as { filename: string };
    const filePath = `images/${filename}`; 

    try {
      const { stream, contentType } = await this.useCase.execute({ path: filePath });

      reply.header('Content-Type', contentType);
      return reply.send(stream);
    } catch (error) {
      if (error instanceof Error && error.message.includes('File not found')) {
        return reply.status(404).send({ message: 'File not found' });
      }
      console.error('Error serving file:', error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  }
}
