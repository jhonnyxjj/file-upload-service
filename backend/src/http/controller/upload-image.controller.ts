import type { FastifyRequest, FastifyReply } from "fastify";
import { UploadImageUseCase } from "../../usecase";
import { makeUploadImageUseCase } from "./di-container";
import { ZodError } from "zod";
import { zodErrorToString } from "../../utils";

const MAXIMUM_FILE_SIZE_IN_BYTES = 1024 * 1024 * 8; // 8MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Controller para upload de imagens.
 * Valida o arquivo, delega para o use case e trata erros.
 */

export class UploadImageController {

    constructor(private readonly uploadImageUseCase: UploadImageUseCase) { }

    async uploadImage(request: FastifyRequest, reply: FastifyReply) {
        if (!request.isMultipart()) {
            return reply.status(400).send({
                message: 'Request must be multipart/form-data',
            });
        }
        try {

            const uploadedFile = await request.file({
                limits: { fileSize: MAXIMUM_FILE_SIZE_IN_BYTES },
            });

            if (!uploadedFile) {
                return reply.status(400).send({ error: "Nenhum arquivo enviado" });
            }

            if (uploadedFile.file.truncated) {
                return reply.status(400).send({ error: "Arquivo muito grande" });
            }

            const { filename, file: contentStream, mimetype } = uploadedFile;

            if (!ALLOWED_MIME_TYPES.includes(uploadedFile.mimetype)) {
                return reply.status(400).send({ error: "Tipo de arquivo inválido" });
            }

            const { url } = await this.uploadImageUseCase.execute({
                name: filename,
                contentType: mimetype,
                contentStream,
            });

            return reply.status(201).send({ url });
        } catch (error) {
            return reply.status(500).send({
                message: 'Erro ao processar upload de imagem',
                details: error instanceof ZodError ? zodErrorToString(error) : (error as Error).message,
            });
        }
    }
}