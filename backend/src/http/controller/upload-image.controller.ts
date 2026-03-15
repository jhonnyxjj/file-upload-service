import type { FastifyRequest, FastifyReply } from "fastify";
import { UploadImageUseCase } from "../../usecase";
import { makeUploadImageUseCase } from "../../factories/upload-image.factory";
import { BadRequestError } from "../../errors";

const MAXIMUM_FILE_SIZE_IN_BYTES = 1024 * 1024 * 50; // 50MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export class UploadImageController {

    constructor(private readonly usecase: UploadImageUseCase = makeUploadImageUseCase()) { }

    async uploadImage(request: FastifyRequest, reply: FastifyReply) {
        if (!request.isMultipart()) {
            throw new BadRequestError('Request must be multipart/form-data');
        }

        const uploadedFile = await request.file({
            limits: { fileSize: MAXIMUM_FILE_SIZE_IN_BYTES },
        });

        if (!uploadedFile) {
            throw new BadRequestError("Nenhum arquivo enviado");
        }

        if (uploadedFile.file.truncated) {
            throw new BadRequestError("Arquivo muito grande");
        }

        if (!ALLOWED_MIME_TYPES.includes(uploadedFile.mimetype)) {
            throw new BadRequestError("Tipo de arquivo inválido");
        }

        // Read file to buffer first
        const fileBuffer = await uploadedFile.toBuffer();
        
        const fields = uploadedFile.fields;
        const compressionLevelField = fields?.compressionLevel as { value: string } | undefined;
        const compressionLevel = compressionLevelField?.value as 'low' | 'medium' | 'high' | undefined;

        const result = await this.usecase.execute({
            name: uploadedFile.filename,
            contentType: uploadedFile.mimetype,
            fileBuffer,
            compressionLevel: compressionLevel || 'medium',
        });

        return reply.status(201).send({
            url: result.url,
            originalSize: result.originalSize,
            compressedSize: result.compressedSize,
            compressionRatio: result.compressionRatio,
        });
    }
}
